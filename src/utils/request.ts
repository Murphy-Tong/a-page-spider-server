import * as http from "http";
import * as https from "https";
import * as NodeProxy from "node-https-socks5-proxy";
import * as URL from "url";
import * as Net from "net";
import axios from "axios";

import UserConfig from "../userConfig";

type SockMap = { [key: string]: Net.Socket };
const sockMap: SockMap = {};

const proxyHost = "localhost";
const proxyPort = 1080;

const getSocket: (arg: string) => Promise<Net.Socket> = async (url: string) => {
  const uri = URL.parse(url);
  const key = uri.hostname + uri.port;
  const oldSock = sockMap[key];
  if (oldSock && oldSock.connecting) {
    return Promise.resolve(oldSock);
  } else {
    const isHttps = uri.protocol === "https:";
    const port = uri.port ? parseInt(uri.port) : isHttps ? 443 : 80;
    return new Promise((res, rej) => {
      NodeProxy.createConnection(
        {
          proxyHost: proxyHost,
          proxyPort: proxyPort,
          https: isHttps,
          port: port,
          host: uri.hostname,
        },
        (err, socket) => {
          if (err) {
            rej(err);
          } else {
            socket.setKeepAlive(true);
            sockMap[key] = socket;
            res(socket);
          }
        }
      );
    });
  }
};

type GetRequest<T> = (url: string) => Promise<T>;

const get: GetRequest<http.IncomingMessage | Error> = async (url: string) => {
  if (!url) {
    console.log("url empty");
    return;
  }
  const socket = await getSocket(url).catch(console.log);
  if (!socket) {
    Promise.reject(new Error("无法创建socket"));
    return;
  }
  return new Promise((resolve, reject) => {
    const uri = URL.parse(url);
    const isHttps = uri.protocol === "https:";
    const port = uri.port ? parseInt(uri.port) : isHttps ? 443 : 80;
    const req = https.request(
      {
        host: uri.hostname,
        port: port,
        path: uri.path,
        headers: UserConfig.headers,
        createConnection: (opt, oncreate) => {
          return socket;
        },
      },
      (response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          console.log(response.headers);
          reject(new Error(response.statusCode + ":" + response.statusMessage));
        }
      }
    );
    req.end();
  });
};

const instance = axios.create({
  headers: UserConfig.headers,
});

const openHtml = async (url: string) => {
  const res = await instance
    .get(url, {
      proxy: {
        host: proxyHost,
        port: proxyPort,
      },
    })
    .catch(console.log);
  if (res && res.status == 200) {
    console.log(res.headers)
    return res.data;
  }
  return null;
};

export { get, openHtml };
