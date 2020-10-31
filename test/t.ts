// import * as FileUtils from "../src/io/fileio";
// // FileUtils.getCachePath("a.txt", "b").then((path) => {
// //   //   FileUtils.writeFileString(path, "aaaaa").then(console.log).catch(console.log);
// // });

// // FileUtils.writeFavoPageConfig("asdad", "asd").then(console.log);
// // FileUtils.readFavoPageConfig("asd").then(console.log);

// import * as Favo from "../src/favoParser";
// Favo.parseFavo("http://e-hentai.org/favorites.php?favcat=0").then((arrs) => {
//   if (arrs) {
//     console.log(arrs);
//   }
// });

// import * as ID from "../src/imagedownloader";

// ID.downloadImage(
//   "./cache/images",
//   "1.png",
//   "https://dohftmm.mkmxuuexwzxd.hath.network/h/4eb89155cf6b4477186c402556ebb2a9ca8277d8-210044-1280-1862-jpg/keystamp=1603983600-fdfb5067e7;fileindex=84453419;xres=1280/dan000_41b.jpg",
//   null
// );

// import * as path from "path";
// console.log(path.extname("img.png"));
import * as Parser from "../src/galleryParser";
// Parser.parserGallery("https://e-hentai.org/g/1766579/fd1a3a3676/")
//   .then((res) => {
//     if (res) {
//       console.log(res.length);
//     }
//   })
//   .catch(console.log);

// Parser.downloadImageInGallery(
//   "https://e-hentai.org/g/1766579/fd1a3a3676/",
//   "aa"
// ).then(() => console.log("ssss"));

// import * as dotenv from "dotenv";
// dotenv.config();
console.log("aaa");
import * as Types from "../src/types/index";
// eslint-disable-next-line no-var
var S_CONFIG: Types.S_CONFIG = S_CONFIG || null;
console.log("aaa");
console.log(S_CONFIG);
console.log("aaa");
