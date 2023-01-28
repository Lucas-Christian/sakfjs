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

  mimeType = getMIMEType("C:\\Users\\User\\Pictures\\imagem.jpg");
  console.log(mimeType); // "image/jpeg"
```

#### getStat
```JS
  let imageStat = await stat("C:\\Users\\User\\Pictures\\imagem.jpg");
  console.log(imageStat); // fs.Stats -> https://nodejs.org/api/fs.html#class-fsstats
```

#### changeExtension
```JS
  import { readFileSync } from "fs";

  const buffer = readFileSync("C:\\Users\\User\\Pictures\\imagem.jpg");
  
  const image = await changeExtension(buffer, "png"); 
  // Olhe na pasta onde está a sua imagem e você verá que o caminho mudou! C:\\Users\\User\\Pictures\\imagem.png
  // changeExtension também retorna o Buffer da imagem já alterada para caso você precise!

  console.log(image) // Buffer
```

#### changeQuality
```JS

```

#### getSupportedImages
```JS

```

#### isASupportedImage
```JS

```

#### resizeImage
```JS

```

#### isUndefined
```JS

```

#### instanceOfString
```JS

```

#### instanceOfNumber
```JS

```

#### instanceOfArray
```JS

```

#### instanceOfBuffer
```JS

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