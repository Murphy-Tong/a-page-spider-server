import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

//0 not exist 1 file 2 dir
export const fileState: (path: string) => Promise<number> = async function (
  path: string
) {
  const exist = fs.existsSync(path);
  if (!exist) {
    throw new Error("文件不存在:" + path);
  }
  const statu = await fs.promises.stat(path).catch(console.log);
  if (!statu) {
    throw new Error("文件不存在:" + path);
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

export const readFile: (file: string) => Promise<Buffer> = async function (
  file: string
) {
  const state = await fileState(file).catch(console.log);
  if (state === 1) {
    const buf = await fs.promises.readFile(file).catch(console.log);
    if (buf) {
      return buf;
    }
  }
  throw new Error("文件不存在:" + file);
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
