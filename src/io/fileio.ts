import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

//0 not exist 1 file 2 dir
export const fileState: (path: string) => Promise<number> = async function (
  path: string
) {
  const exist = fs.existsSync(path);
  if (!exist) {
    return 0;
  }
  const statu = await fs.promises.stat(path).catch(console.log);
  if (!statu) {
    return 0;
  }
  return statu.isFile() ? 1 : 2;
};

const CACHE_DIR = "./cache";
export const getCachePath: (
  fileName: string,
  parent: string
) => Promise<string> = async function (fileName, parent) {
  let localPath = CACHE_DIR;
  if (parent) {
    localPath = path.join(localPath, parent);
    const stat = await fileState(localPath).catch(console.log);
    if (stat !== 2) {
      await fs.promises
        .mkdir(localPath, { recursive: true })
        .catch(console.log);
    }
  }
  return `${localPath}/${fileName}`;
};

export const readFile: (
  file: string
) => Promise<Buffer | void> = async function (file: string) {
  const state = await fileState(file).catch(console.log);
  if (state === 1) {
    const buf = await fs.promises.readFile(file).catch(console.log);
    if (buf) {
      return buf;
    }
  }
};

export const writeFileString: (
  path: string,
  data: string
) => Promise<void> = async function (path: string, data: string) {
  return fs.promises.writeFile(path, data).catch(console.log);
};

export const deleteFile: (path: string) => void = async function (
  path: string
) {
  await fileState(path)
    .then((_) => fs.promises.unlink(path))
    .catch(console.log);
};

// : (
//     config: string,
//     url: string
//   ) => Promise<void>
export const writeFavoPageConfig = async function (
  config: string,
  url: string
) {
  const hash = md5(url);
  return getCachePath(hash + ".json", "favos").then((cachePath) => {
    writeFileString(cachePath, config);
  });
};

export const readFavoPageConfig = async function (url: string) {
  const hash = md5(url);
  return getCachePath(hash + ".json", "favos")
    .then(readFile)
    .catch(console.log);
};

const md5 = (str: string) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

export const getExistImageIf: (
  cacheDir: string,
  imageName: string
) => Promise<string | void> = async function (
  cacheDir: string,
  imageName: string
) {
  const stat = await fileState(cacheDir).catch(console.log);
  if (stat === 2) {
    const files = await fs.promises.readdir(cacheDir, { withFileTypes: true });
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        if (item.isFile()) {
          if (imageName.indexOf(".") >= 0 && imageName == item.name) {
            return cacheDir + "/" + item.name;
          } else if (imageName + path.extname(item.name) == item.name) {
            return cacheDir + "/" + item.name;
          }
        }
      }
    }
  }
};
