export function removeQuery(url: string) {
  if (!url) {
    return url;
  }
  const queryIndex = url.indexOf("?");
  if (queryIndex > 0) {
    return url.substring(0, url.indexOf("?"));
  }
  return url;
}

// export function setQuery(url:string,key: string, value: string) {
//     URL.parse(url).query
// }

export const parseIamgeStyle = (imgStyle: string) => {
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
