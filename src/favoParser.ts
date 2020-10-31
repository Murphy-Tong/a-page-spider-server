import { ImageItem, parseFavoPage, parsePagesInFavo } from "./pageParser";
import { openHtml } from "./utils/request";
import * as FileIO from "./io/FileIO";

type FavoPage = {
  url: string;
  imgs: ImageItem[];
};

let cachedFavo: Array<FavoPage> | null = null;
export const parseFavo: (
  originUrl: string
) => Promise<void | Array<FavoPage>> = async function (originUrl) {
  if (cachedFavo) {
    console.log("LOAD FROM MEM", originUrl);
    return cachedFavo;
  }
  const url = originUrl;
  const favoPage = await openHtml(url).catch(console.log);
  if (favoPage) {
    const totalPage = parsePagesInFavo(favoPage);
    if (!totalPage) {
      console.log("NOTHING DOWNLOAD", originUrl);
      return;
    }
    const parserTask: Array<Promise<FavoPage>> = [];
    parserTask.push(getPageConfig(url, favoPage));
    for (let i = 1; i < totalPage; i++) {
      const pageUrl = `${url}?page=${i}`;
      parserTask.push(getPageConfig(pageUrl, null));
    }
    return Promise.all(parserTask)
      .then((res) => {
        if (res) {
          cachedFavo = res;
        }
        return res;
      })
      .catch(console.log);
  }
};

const getPageConfig: (
  url: string,
  page: string | null
) => Promise<FavoPage> = async function (url: string, page: string | null) {
  const localCache = await FileIO.readFavoPageConfig(url);
  if (localCache) {
    try {
      console.log("read from cache ", url);
      return JSON.parse(localCache.toString("utf-8")) as FavoPage;
    } catch (e) {
      console.log(e);
    }
  }
  console.log("download ", url);
  if (page) {
    return parseFavoPage(page).then((arr) => {
      const favoPage: FavoPage = { url, imgs: arr };
      arr &&
        arr.length > 0 &&
        FileIO.writeFavoPageConfig(JSON.stringify(favoPage), url);
      return favoPage;
    });
  } else {
    return openHtml(url)
      .then((page) => parseFavoPage(page))
      .then((arr) => {
        const favoPage: FavoPage = { url, imgs: arr };
        arr &&
          arr.length > 0 &&
          FileIO.writeFavoPageConfig(JSON.stringify(favoPage), url);
        return favoPage;
      });
  }
};

// const parseFavoItemPage: (url: string) => void = async function (url) {
//   const favoPage = await openHtml(url).catch(console.log);
//   if (favoPage) {
//     return parseFavoPage(favoPage);
//   }
// };
