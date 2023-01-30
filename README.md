ATTENTION: Jimp's methods are very heavy, so I'm trying to redo them in npm

# sakf

sakf is a lib made by Lucas Christian, this lib was made for
be like a swiss army knife, many useful functions, and efficient.

## Sumário
- [Installation](#installation);
- [Supported Image Types](#supported-image-types);
- [Functions](#functions);
- [Collaborate](#collaborate);
- [Errors in sakf](#errors-in-sakf);
- [Authors](#authors).


## Installation
Installation: `npm i --save sakf`

## Supported Image Types
- jpeg;
- png.

## Functions

### Files
- [getExtensions](#getextensions)
- [getMIMEType](#getmimetype)

### Fs
- [getStat](#getstat)

### Images
- [changeExtension](#changeextension)
- [changeQuality](#changequality)
- [getSupportedImages](#getsupportedimages)
- [isASupportedImage](#isasupportedimage)
- [resizeImage](#resizeimage)

### Zod
- [isUndefined](#isundefined)
- [isString](#isstring)
- [isNumber](#isnumber)
- [isArray](#isarray)
- [isBuffer](#isbuffer)

#### getExtensions
```JS
  import { getExtensions } from "sakf";

  let extensions = getExtensions("image/jpeg");
  console.log(extensions); // [".jpeg", ".jpg", ".jpe"]
```

#### getMIMEType
```JS
  import { getMIMEType } from "sakf";

  let mimeType = getMIMEType("arquivo.js");
  console.log(mimeType); // "application/javascript"

  mimeType = getMIMEType("C:/Users/User/Pictures/image.jpg");
  console.log(mimeType); // "image/jpeg"
```

#### getStat
```JS
  import { stat } from "sakf";

  let imageStat = await stat("C:/Users/User/Pictures/image.jpg");
  console.log(imageStat); // fs.Stats -> https://nodejs.org/api/fs.html#class-fsstats
```

#### changeExtension
```JS
  import { changeExtension } from "sakf";
  import { writeFile } from "fs";

  const image = await changeExtension("C:/Users/User/Pictures/image.jpg", "png"); 

  // changeExtension returns the Image Buffer!
  console.log(image); // Buffer

  // Combine with writeFile from fs so you can see the change!
  writeFile("C:/Users/User/Pictures/image.png", image);
  // "C:/Users/User/Pictures/image.jpg" -> "C:/Users/User/Pictures/imagem.png"
```

#### changeQuality
```JS 
  import { changeQuality } from "sakf";
  import { writeFile } from "fs";

  const image = await changeQuality("C:/Users/User/Pictures/image.jpg", 60); 

  // changeQuality returns the Image Buffer!
  console.log(image); // Buffer

  // Combine with writeFile from fs so you can see the change!
  writeFile("C:/Users/User/Pictures/image.jpg", image);
```

#### getSupportedImages
```JS
  import { getSupportedImages } from "sakf";
  import { readFileSync } from "fs";

  const images = getSupportedImages("C:/Users/User/Pictures");

  console.log(images); 
  /* All supported images will be returned in the array like this
    [
      {          
        name: image.jpg, 
        size: 3000, 
        path: "C:/Users/User/Pictures/image.jpg",
        ext: "jpg",
        mime: "image/jpeg"
      },
      {         
        name: image2.png,
        size: 5000,
        path: "C:/Users/User/Pictures/image2.png",
        ext: "png",
        mime: image/png
      }
    ]
  */
```

#### isASupportedImage
```JS
  import { isASupportedImage } from "sakf";

  let supportedImageByExt = isASupportedImage("jpg"),
  supportedImageByMIME = isASupportedImage("image/jpeg");

  let unsupportedImageByExt = isASupportedImage("gif"),
  unsupportedImageByMIME = isASupportedImage("image/gif");

  console.log(supportedImageByExt); // true
  console.log(supportedImageByMIME); // true

  console.log(unsupportedImageByExt); // false
  console.log(unsupportedImageByMIME); // false

```

#### resizeImage
```JS
  import { resizeImage } from "sakf";
  import { writeFile } from "fs";

  const image = await resizeImage("C:/Users/User/Pictures/image.jpg", {width: 600, height: 400}); // 1200x800 -> 600x400

  // resizeImage returns the Image Buffer!
  console.log(image); // Buffer

  // Combine with writeFile from fs so you can see the change!
  writeFile("C:/Users/User/Pictures/image.jpg", image);
```

#### isUndefined
```JS
  import { isUndefined } from "sakf";

  console.log(isUndefined(undefined); // true
  console.log(isUndefined("hello")); // false
```

#### isString
```JS
  import { isString } from "sakf";

  console.log(isString("hello")); // true
  console.log(isString(321)); // false
```

#### isNumber
```JS
  import { isNumber } from "sakf";

  console.log(isNumber(321)); // true
  console.log(isNumber("hello")); // false
```

#### isArray
```JS
  import { isArray } from "sakf";

  console.log(isArray(["hello", "world"])); // true
  console.log(isArray({hello: "world"})); // false
```

#### isBuffer
```JS
  import { readFileSync } from "fs";
  import { isBuffer } from "sakf";

  let buffer = readFileSync("C:/Users/User/Pictures/image.jpg");

  console.log(isBuffer(buffer); // true
  console.log(isBuffer({hello: "world"})); // false
```

#### isObject
```JS
  import { isObject } from "sakf";

  console.log(isObject({hello: "world"}); // true
  console.log(isObject("hello")); // false
```

## Collaborate

Whenever you think of functions that might be useful, and that would be useful in a lib,
make it and send it with a pull request, with tests already implemented in the new function.

## Errors in sakf

If you have identified an error, just open an issue, and if you have already
resolved this error, please make a pull request, so you collaborate with
the project!

## Authors

- [Lucas Christian](https://github.com/Lucas-Christian)
- [LordLuch (My secondary account)](https://www.github.com/LordLuch)