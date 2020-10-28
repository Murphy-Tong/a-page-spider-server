const  https =require("https");
const ProxySocket = require("node-https-socks5-proxy");

const HOST = "fdddesj.poxbwchyczhc.hath.network";
const PORT = 9527;
const PATH = "/h/3a3b457fbf2fc44dc823a0fcb5c67e79c137c165-71634-1003-800-jpg/keystamp=1603891200-968667a0e1;fileindex=59645702;xres=2400/knana0010.jpg";
//转发到本地的ssr客户端
const PROXY_HOST = "127.0.0.1";
const PROXY_PORT = 1080;

const req = https.request(
  {
    host: HOST,
    path: PATH,
    port: PORT,
    createConnection: (opt, oncreate) => {
      ProxySocket.createConnection(
        {
          proxyHost: PROXY_HOST,
          proxyPort: PROXY_PORT,
          port: PORT,
          host: HOST,
          https:true
        },
        oncreate
      );
      return null;
    },
  },
  (res) => {
    console.log(res.headers);
    console.log(res.statusCode);
    console.log(res.statusMessage);
    res.on("data", (buf) => {
      console.log(buf.toString("utf-8"));
    });
  }
);
req.end();