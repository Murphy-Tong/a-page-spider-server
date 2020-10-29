import { url } from "inspector";
import * as URL from "url";

export function removeQuery(url: string) {
  if (!url) {
    return url;
  }
  return url.substring(0, url.indexOf("?"));
}

// export function setQuery(url:string,key: string, value: string) {
//     URL.parse(url).query
// }
