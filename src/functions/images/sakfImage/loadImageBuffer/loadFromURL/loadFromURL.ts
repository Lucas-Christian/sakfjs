import { loadUsingFetch } from "./loadUsingFetch/loadUsingFetch";
import { loadUsingXHR } from "./loadUsingXHR/loadUsingXHR";

export async function loadFromURL(imageURL: string): Promise<Buffer> {
  if(process.env.ENVIRONMENT === "BROWSER" || typeof process.versions.electron !== "undefined") {
    return await loadUsingXHR(imageURL);
  } else {
    return await loadUsingFetch(imageURL);
  }
}