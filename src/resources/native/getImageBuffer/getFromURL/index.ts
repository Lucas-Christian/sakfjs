import { getUsingFetch } from "./getUsingFetch";
import { getUsingXHR } from "./getUsingXHR";

export async function getFromURL(imageURL: string): Promise<Buffer> {
  if(process.env.ENVIRONMENT === "BROWSER" || typeof process.versions.electron !== "undefined") {
    return await getUsingXHR(imageURL);
  } else {
    return await getUsingFetch(imageURL);
  }
}