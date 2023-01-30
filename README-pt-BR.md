ATENÇÃO: Os metódos do Jimp estão muito pesados, então estou tentando refazer eles na npm

# sakfjs

O sakfjs é uma lib feita por Lucas Christian, essa lib foi feita para
ser como um canivete suíço, diversas funções úteis, e eficientes.

## Sumário
- [Instalação](#instalação);
- [Tipos de Imagem Suportadas](#tipos-de-imagem-suportadas);
- [Funções](#funções);
- [Colaborar](#colaborar);
- [Erros no sakfjs](#erros-no-sakfjs);
- [Autores](#autores).


## Instalação
Instalação: `npm i --save sakfjs`

## Tipos de Imagem Suportadas
- jpeg;
- png.

## Funções

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
- [isString](#instanceofstring)
- [isNumber](#instanceofnumber)
- [isArray](#instanceofarray)
- [isBuffer](#instanceofbuffer)

#### getExtensions
```JS
  import { getExtensions } from "sakfjs";

  let extensions = getExtensions("image/jpeg");
  console.log(extensions); // [".jpeg", ".jpg", ".jpe"]
```

#### getMIMEType
```JS
  import { getMIMEType } from "sakfjs";

  let mimeType = getMIMEType("arquivo.js");
  console.log(mimeType); // "application/javascript"

  mimeType = getMIMEType("C:/Users/User/Pictures/image.jpg");
  console.log(mimeType); // "image/jpeg"
```

#### getStat
```JS
  import { stat } from "sakfjs";

  let imageStat = await stat("C:/Users/User/Pictures/image.jpg");
  console.log(imageStat); // fs.Stats -> https://nodejs.org/api/fs.html#class-fsstats
```

#### changeExtension
```JS
  import { changeExtension } from "sakfjs";
  import { writeFile } from "fs";

  const image = await changeExtension("C:/Users/User/Pictures/image.jpg", "png"); 

  // changeExtension retorna o Buffer da imagem!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
  writeFile("C:/Users/User/Pictures/image.png", image);
  // "C:/Users/User/Pictures/image.jpg" -> "C:/Users/User/Pictures/imagem.png"
```

#### changeQuality
```JS 
  import { changeQuality } from "sakfjs";
  import { writeFile } from "fs";

  const image = await changeQuality("C:/Users/User/Pictures/image.jpg", 60); 

  // changeQuality retorna o Buffer da imagem já alterada!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
  writeFile("C:/Users/User/Pictures/image.jpg", image);
```

#### getSupportedImages
```JS
  import { getSupportedImages } from "sakfjs";
  import { readFileSync } from "fs";

  const images = getSupportedImages("C:/Users/User/Pictures");

  console.log(images); 
  /* Todas as imagens suportadas serão retornadas no array dessa forma
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
  import { isASupportedImage } from "sakfjs";

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
  import { resizeImage } from "sakfjs";
  import { writeFile } from "fs";

  const image = await resizeImage("C:/Users/User/Pictures/image.jpg", {width: 600, height: 400}); // 1200x800 -> 600x400
  
  // resizeImage retorna o Buffer da imagem!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
  writeFile("C:/Users/User/Pictures/image.jpg", image);
```

#### isUndefined
```JS
  import { isUndefined } from "sakfjs";

  console.log(isUndefined(undefined); // true
  console.log(isUndefined("hello")); // false
```

#### isString
```JS
  import { isString } from "sakfjs";

  console.log(isString("hello")); // true
  console.log(isString(321)); // false
```

#### isNumber
```JS
  import { isNumber } from "sakfjs";

  console.log(isNumber(321)); // true
  console.log(isNumber("hello")); // false
```

#### isArray
```JS
  import { isArray } from "sakfjs";

  console.log(isArray(["hello", "world"])); // true
  console.log(isArray({hello: "world"})); // false
```

#### isBuffer
```JS
  import { readFileSync } from "fs";
  import { isBuffer } from "sakfjs";

  let buffer = readFileSync("C:/Users/User/Pictures/image.jpg");

  console.log(isBuffer(buffer); // true
  console.log(isBuffer({hello: "world"})); // false
```


#### isObject
```JS
  import { isObject } from "sakfjs";

  console.log(isObject({hello: "world"}); // true
  console.log(isObject("hello")); // false
```

## Colaborar

Sempre que pensar em funções que podem ser úteis, e que seriam úteis em uma lib,
faça ela e a mande com um pull request, com testes já implementados na nova função.

## Erros no sakfjs?

Caso tenha identificado algum erro, basta abrir uma issues, e caso já tenha
resolvido esse erro, por favor faça um pull request, assim você colabora com 
o projeto Sz!

## Autores

- [Lucas Christian](https://github.com/Lucas-Christian)
- [LordLuch (Minha conta secundária)](https://www.github.com/LordLuch)