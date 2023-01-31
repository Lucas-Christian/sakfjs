import { commonFetch } from "../../../../../fetch/commonFetch";
import { loadFromURL } from "../loadFromURL";
import { isBuffer } from "../../../../../zod/isBuffer";

export async function loadUsingFetch(imageURL: string): Promise<Buffer> {
  let response = await commonFetch(imageURL, "GET");

  if("headers" in response && "location" in response.headers) {
    imageURL = response.headers.location;
    return await loadFromURL(imageURL);
  } else if(isBuffer(response.body)) {
    return response.body;
  }

  throw new Error("bufferNotLoadedFromURL");
}