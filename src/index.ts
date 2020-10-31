import * as express from "express";
import * as fs from "fs";
import { downloadImage } from "./imagedownloader";
import * as FileIO from "./io/fileio";
import { getExistImageIf } from "./io/fileio";
import * as FavoParser from "./favoParser";
import siteConfig from "./siteConfig";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
console.log(process.env["UserConfig"]);
app.get("/turningImage", async function (req, res) {
  const { galleryName, imageUrl, imageName } = req.query;
  const cacheDir = await FileIO.getCachePath(
    galleryName.toString(),
    "images"
  ).catch(console.log);
  if (!cacheDir) {
    console.log("无法生成缓存路径");
    res.writeHead(500);
    res.end();
    return;
  }
  const localPath = await getExistImageIf(cacheDir, imageName.toString()).catch(
    console.log
  );
  if (localPath) {
    const readable = fs.createReadStream(localPath);
    res.writeHead(200);
    readable.pipe(res);
  } else {
    await downloadImage(
      cacheDir,
      imageName.toString(),
      imageUrl.toString(),
      res
    );
  }
});

// app.get("/downloadGallery");
app.get("/getMyFavos", async (req, res) => {
  const favoConfig = await FavoParser.parseFavo(siteConfig.favo).catch(
    (e: any) => {
      console.log(e);
      res.writeHead(500);
      res.end();
    }
  );
  res.writeHead(200);
  res.write(JSON.stringify(favoConfig));
  res.end();
});

app.listen(3001);
