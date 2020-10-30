import * as cheerio from "cheerio";
import { parseIamgeStyle } from "./utils/stringUtil";

export type ImageItem = {
  title: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  detailPageSrc: string;
  imgNum: number;
};

const parseItemGallery = (ele: cheerio.Element) => {
  const config = {} as ImageItem;
  if (ele) {
    const $ = cheerio.load(ele);
    const titleA = ele.childNodes[0].childNodes[0].childNodes[0];
    config.detailPageSrc = titleA.attribs["href"];
    config.title = titleA.childNodes[0].children[0].data;
    const imgTag = $("div > div.gl3t > a > img")[0];
    const style = imgTag.attribs["style"];
    const size = parseIamgeStyle(style);
    config.thumbnailWidth = size[0];
    config.thumbnailHeight = size[1];
    config.thumbnail = imgTag.attribs["src"];
    const numTag = $("div.gl5t > div:nth-child(2) > div:nth-child(2)");
    config.imgNum = parseInt(numTag[0].children[0].data.match(/\d*/)[0]);
  }
  return config;
};

const parseFavoPage: (
  html: string
) => Promise<Array<ImageItem>> = async function (html: string) {
  const $ = cheerio.load(html);
  const imageContainers = $("body > div.ido > form > div.itg.gld > div");
  const imageConfigs: Array<ImageItem> = [];
  if (imageContainers && imageContainers.length > 0) {
    imageContainers.each((index, ele) => {
      imageConfigs.push(parseItemGallery(ele));
    });
  }
  return imageConfigs;
};

const parsePagesInFavo: (html: string) => number = function (html) {
  const $ = cheerio.load(html);
  const tr = $("body > div.ido > form > table.ptt > tbody > tr");
  if (tr && tr.length > 0) {
    const childs = tr[0].childNodes;
    if (childs && childs.length > 0) {
      if (childs.length < 2) {
        return 1;
      }
      return parseInt(childs[childs.length - 2].childNodes[0].children[0].data);
    }
  }
  return 0;
};

export { parseFavoPage, parsePagesInFavo };
