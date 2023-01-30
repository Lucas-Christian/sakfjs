import { 
  getSupportedImages,
  isASupportedImage,
  changeExtension,
  changeQuality,
  resizeImage 
} from "./functions/images/exports";

import {
  getExtensions,
  getMIMEType
} from "./functions/files/exports";

import {
  isArray,
  isBuffer,
  isNumber,
  isObject,
  isString,
  isUndefined
} from "./functions/zod/exports";

import {
  getStat
} from "./functions/fs/exports";

export default {
  getExtensions,
  getMIMEType,
  getStat,
  getSupportedImages,
  isASupportedImage,
  changeExtension,
  changeQuality,
  resizeImage,
  isArray,
  isBuffer,
  isNumber,
  isObject,
  isString,
  isUndefined
}