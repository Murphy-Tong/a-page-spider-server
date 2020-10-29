import * as FileUtils from "../src/io/fileio";
// FileUtils.getCachePath("a.txt", "b").then((path) => {
//   //   FileUtils.writeFileString(path, "aaaaa").then(console.log).catch(console.log);
// });

// FileUtils.writeFavoPageConfig("asdad", "asd").then(console.log);
// FileUtils.readFavoPageConfig("asd").then(console.log);

import * as Favo from "../src/favoParser";
Favo.parseFavo("http://e-hentai.org/favorites.php?favcat=0").then((arrs) => {
  if (arrs) {
    console.log(arrs);
  }
});
