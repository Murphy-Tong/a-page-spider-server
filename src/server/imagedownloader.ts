import * as request from "./utils/request";
import * as FileIO from "./io/fileio";
import * as http from "http";
import * as fs from "fs";

function resolveFileType(headers: http.IncomingHttpHeaders) {
  if (headers) {
    const contentTypeStr = headers["content-type"];
    if (contentTypeStr) {
      const matches = contentTypeStr.match(/\w*\/[(\w)(\\*)]*/);
      if (matches && matches.length > 0) {
        const contentType = matches[0];
        if (contentType) {
          const splts = contentType.split("/");
          if (splts && splts.length == 2) {
            const typeInServer = splts[1];
            if (typeInServer != "*") {
              return typeInServer;
            }
          }
        }
      }
    }
  }
}

export const downloadImage = async function (
  cacheDir: string,
  imageName: string,
  imageUrl: string,
  clientRes: http.ServerResponse
) {
  const response = await request.get(imageUrl).catch(console.log);
  if (response) {
    const contentType = response.headers["content-type"];
    if (contentType && contentType.indexOf("image") >= 0) {
      const imageType = resolveFileType(response.headers);
      let dotIndex = imageName.indexOf(".");
      dotIndex = dotIndex > 0 ? dotIndex : imageName.length;
      const name = imageName.substring(0, dotIndex) + "." + imageType;
      const stat = await FileIO.fileState(cacheDir).catch(console.log);
      if (stat !== 2) {
        await fs.promises.mkdir(cacheDir, { recursive: true });
      }
      const imageCachePath = cacheDir + "/" + name;
      const writeStream = fs.createWriteStream(imageCachePath, {
        encoding: "binary",
      });

      if (clientRes) {
        clientRes.writeHead(
          response.statusCode,
          response.statusMessage,
          response.headers
        );
        response.on("data", (buf) => clientRes.write(buf));
      }
      console.log("write image", imageCachePath);
      response.pipe(writeStream);
    }
  } else {
    clientRes.writeHead(500);
    clientRes.end();
  }
};
