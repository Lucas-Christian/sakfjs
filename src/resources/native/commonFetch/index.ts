import { isObject } from "../../typeChecking/isObject";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function commonFetch(url: string, method: Method, data?: { headers: any, body: any }): Promise<any> {
  let req = {
    method: method,
  } as any;

  if(!isObject(data!)) {
    throw new Error("invalidData");
  }

  let { headers, body } = data!;

  if(headers) {
    req.headers = headers;
  }
  if(body) {
    req.body = body;
  }
  
  return await fetch(url, req);
}