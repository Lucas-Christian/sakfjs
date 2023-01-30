ATENÇÃO: Os metódos do Jimp estão muito pesados, então estou tentando refazer eles na npm

# sakf

O sakf é uma lib feita por Lucas Christian, essa lib foi feita para
ser como um canivete suíço, diversas funções úteis, e eficientes.

## Sumário
- [Instalação](#instalação);
- [Tipos de Imagem Suportadas](#tipos-de-imagem-suportadas);
- [Funções](#funções);
- [Colaborar](#colaborar);
- [Erros no sakf](#erros-no-sakf);
- [Autores](#autores).


## Instalação
Instalação: `npm i --save sakf`

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

  // changeExtension retorna o Buffer da imagem!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
  writeFile("C:/Users/User/Pictures/image.png", image);
  // "C:/Users/User/Pictures/image.jpg" -> "C:/Users/User/Pictures/imagem.png"
```

#### changeQuality
```JS 
  import { changeQuality } from "sakf";
  import { writeFile } from "fs";

  const image = await changeQuality("C:/Users/User/Pictures/image.jpg", 60); 

  // changeQuality retorna o Buffer da imagem já alterada!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
  writeFile("C:/Users/User/Pictures/image.jpg", image);
```

#### getSupportedImages
```JS
  import { getSupportedImages } from "sakf";
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
  
  // resizeImage retorna o Buffer da imagem!
  console.log(image); // Buffer

  // Combine com o writeFile do fs para que consiga ver a mudança!
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

## Colaborar

Sempre que pensar em funções que podem ser úteis, e que seriam úteis em uma lib,
faça ela e a mande com um pull request, com testes já implementados na nova função.

## Erros no sakf?

Caso tenha identificado algum erro, basta abrir uma issues, e caso já tenha
resolvido esse erro, por favor faça um pull request, assim você colabora com 
o projeto Sz!

## Autores

- [Lucas Christian](https://github.com/Lucas-Christian)
- [LordLuch (Minha conta secundária)](https://www.github.com/LordLuch)