import * as cheerio from "cheerio";

type ImageItem = {
  title: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  detailPageSrc: string;
  imgNum: number;
};

const parseIamgeStyle = (imgStyle: string) => {
  const styles = imgStyle.split(";");
  const size: Array<number> = [];
  if (styles && styles.length >= 2) {
    for (const index in styles) {
      const str = styles[index].trim();
      if (str.startsWith("width")) {
        size[0] = parseInt(str.replace("width:", "").replace("px", ""));
      } else if (str.startsWith("height")) {
        size[1] = parseInt(str.replace("height:", "").replace("px", ""));
      }
      if (size[0] && size[1]) {
        break;
      }
    }
  }
  return size;
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
    console.log(config);
  }
  return config;
};

const parseGalleryPage = (html: string) => {
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

export { parseGalleryPage };
