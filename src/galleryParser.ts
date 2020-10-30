import * as Request from "./utils/request";
import * as cherrio from "cheerio";
import * as stringUtil from "./utils/stringUtil";
import { parseIamgeStyle } from "./utils/stringUtil";
import * as FileIO from "./io/fileio";
import * as ImageDownload from "./imagedownloader";

type BigImage = {
  url: string;
  width: number;
  height: number;
  name: string; //a.jpg
};

export const downloadImageInGallery = async (
  originUrl: string,
  galleryName: string
) => {
  const images = await parserGallery(originUrl).catch(console.log);
  if (!images) {
    return;
  }
  const imageDownloadTask = [];
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    if (item && item.url) {
      const cachePath = await FileIO.getCachePath(
        galleryName || "default",
        "images"
      ).catch(console.log);
      if (cachePath) {
        const exist = await FileIO.getExistImageIf(cachePath, item.name).catch(
          console.log
        );
        if (exist) {
          console.log(item.url, "EXISTED", exist);
          continue;
        }
        imageDownloadTask.push(
          ImageDownload.downloadImage(
            cachePath,
            item.name,
            item.url,
            null
          ).then(() => console.log("DOWNLOAD", item.url, item.name))
        );
      }
    }
  }
  return await Promise.all(imageDownloadTask);
};

export const parserGallery = async (originUrl: string) => {
  const urlNoQuery = stringUtil.removeQuery(originUrl);
  const local = await FileIO.readFavoPageConfig(urlNoQuery).catch(console.log);
  if (local) {
    try {
      console.log("load from cache", urlNoQuery);
      return JSON.parse(local.toString()) as Array<BigImage>;
    } catch (e) {
      console.log(e);
    }
  }
  console.log("load from net", urlNoQuery);
  const html = await Request.openHtml(urlNoQuery).catch(console.log);
  if (!html) {
    return [];
  }
  const $ = cherrio.load(html);
  const pageTds = $("body > div:nth-child(9) > table > tbody > tr > td");
  let pageNum = 1;
  if (pageTds && pageTds.length > 2) {
    pageNum = parseInt(
      pageTds[pageTds.length - 2].childNodes[0].children[0].data
    );
  }
  const pageTask = [parserGallery2(urlNoQuery + "?p=" + 0, 0, html)];
  for (let i = 1; i < pageNum; i++) {
    pageTask.push(parserGallery2(urlNoQuery + "?p=" + i, i));
  }
  return await Promise.all(pageTask).then((res) => {
    if (res && res.length > 0) {
      const ress = res.reduce((p, val) => (p || []).concat(val || []), []);
      FileIO.writeFavoPageConfig(JSON.stringify(ress), urlNoQuery);
      return ress;
    }
    return [];
  });
};

const parserGallery2: (
  url: string,
  pageIndex: number,
  html?: any
) => Promise<BigImage[] | void> = async (
  url: string,
  pageIndex: number,
  html?: any
) => {
  const local = await FileIO.readFavoPageConfig(url).catch(console.log);
  if (local) {
    try {
      console.log("load from cache", url);
      return JSON.parse(local.toString()) as Array<BigImage>;
    } catch (e) {
      console.log(e);
    }
  }
  console.log("load from net", url);
  html = html || (await Request.openHtml(url).catch(console.log));
  if (!html) {
    return;
  }
  const $ = cherrio.load(html);
  const aHrefs = $("#gdt > div > a");
  if (!aHrefs) {
    return;
  }
  const detailPagePromise = [];
  for (let i = 0; i < aHrefs.length; i++) {
    detailPagePromise.push(
      parseDetail(aHrefs[i].attribs["href"], i + 1 + pageIndex * 20 + "")
    );
  }
  return await Promise.all(detailPagePromise)
    .then((res) => {
      if (res) {
        if (res && res.length > 0) {
          FileIO.writeFavoPageConfig(JSON.stringify(res), url);
        }
        console.log(res.length);
      }
      return res;
    })
    .catch(console.log);
};

const parseDetail = async (url: string, name: string) => {
  const html = await Request.openHtml(url).catch(console.log);
  if (!html) {
    return;
  }
  const imageConfig = {} as BigImage;
  const imageTag = cherrio.load(html)("#img")[0];
  const style = imageTag.attribs["style"];
  imageConfig.url = imageTag.attribs["src"];
  const size = parseIamgeStyle(style);
  if (size && size.length == 2) {
    imageConfig.height = size[1];
    imageConfig.width = size[0];
  }
  imageConfig.name = name;
  return imageConfig;
};
