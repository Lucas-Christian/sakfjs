import { isBuffer } from "../../../../../zod/isBuffer";

export async function loadUsingXHR(imageURL: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", imageURL, true);
    xhr.responseType = "arraybuffer";
    xhr.addEventListener("load", () => {
      if(xhr.status < 400) {
        try {
          const data = Buffer.from(this.response);
          if(isBuffer(data)) {
            return resolve(data);
          }
        } catch (error: any) {
          return reject(error);
        }
      } else {
        return reject(new Error("bufferNotLoadedFromURL"));
      }
    });
    xhr.addEventListener("error", (error: any) => {
      return reject(error);
    });
    xhr.send();
  });
}