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
- [instanceOfString](#instanceofstring)
- [instanceOfNumber](#instanceofnumber)
- [instanceOfArray](#instanceofarray)
- [instanceOfBuffer](#instanceofbuffer)

#### getExtensions
```JS
  let extensions = getExtensions("image/jpeg");
  console.log(extensions); // [".jpeg", ".jpg", ".jpe"]
```

#### getMIMEType
```JS
  let mimeType = getMIMEType("arquivo.js");
  console.log(mimeType); // "application/javascript"

  mimeType = getMIMEType("C:\\Users\\User\\Pictures\\image.jpg");
  console.log(mimeType); // "image/jpeg"
```

#### getStat
```JS
  let imageStat = await stat("C:\\Users\\User\\Pictures\\image.jpg");
  console.log(imageStat); // fs.Stats -> https://nodejs.org/api/fs.html#class-fsstats
```

#### changeExtension
```JS
  const image = await changeExtension("C:\\Users\\User\\Pictures\\image.jpg", "png"); 
  // Look in the folder where your image is and you will see that the path has changed! 
  // "C:\\Users\\User\\Pictures\\image.jpg" -> "C:\\Users\\User\\Pictures\\image.png"

  // changeExtension also returns the Buffer of the already changed image in case you need it!
  console.log(image); // Buffer
```

#### changeQuality
```JS 
  const image = await changeQuality("C:\\Users\\User\\Pictures\\image.jpg", 60); 
  // Open the image and you will notice the difference in image quality.

  // changeQuality also returns the Buffer of the already changed image in case you need it!
  console.log(image); // Buffer
```

#### getSupportedImages
```JS
  import { readFileSync } from "fs";

  const images = getSupportedImages("C:\\Users\\User\\Pictures");

  console.log(images); 
  /* All supported images will be returned in the array like this
    [
      {          
        name: image.jpg, 
        size: 3000, 
        path: "C:\\Users\\User\\Pictures\\image.jpg",
        ext: "jpg",
        mime: "image/jpeg"
      },
      {         
        name: image2.png,
        size: 5000,
        path: "C:\\Users\\User\\Pictures\\image2.png",
        ext: "png",
        mime: image/png
      }
    ]
  */
```

#### isASupportedImage
```JS
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
  const image = await resizeImage("C:\\Users\\User\\Pictures\\image.jpg", 600, 400); // 1200x800 -> 600x400
  // Open the image and you will notice the difference in image size

  // resizeImage also returns the Buffer of the already changed image in case you need it!
  console.log(image); // Buffer
```

#### isUndefined
```JS
  console.log(isUndefined(undefined); // true
  console.log(isUndefined("hello")); // false
```

#### instanceOfString
```JS
  console.log(instanceOfString("hello")); // true
  console.log(instanceOfString(321)); // false
```

#### instanceOfNumber
```JS
  console.log(instanceOfNumber(321)); // true
  console.log(instanceOfNumber("hello")); // false
```

#### instanceOfArray
```JS
  console.log(instanceOfArray(["hello", "world"])); // true
  console.log(instanceOfArray({hello: "world"})); // false
```

#### instanceOfBuffer
```JS
  import { readFileSync } from "fs";

  let buffer = readFileSync("C:\\Users\\User\\Pictures\\image.jpg");

  console.log(instanceOfBuffer(buffer); // true
  console.log(instanceOfBuffer({hello: "world"})); // false
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