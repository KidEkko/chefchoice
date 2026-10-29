import "server-only"

import { ApiError } from "@/utils/types/api";
import { neon } from "@neondatabase/serverless";

export const sql = neon(`${process.env.DATABASE_URL}`);

export class ChefResponse {
  response: Response;
  data: any;
  status: number;

  constructor() {
    this.response = new Response();
    this.data = {};
    this.status = 200;
  }

  setData(data: any) {
    this.data = data;
  }

  setHeader(name: string, value: string) {
    this.response.headers.set(name, value);
  }

  setError(err: ApiError) {
    this.setData(err);
    this.status = err.status || 500;
  }

  cacheResponse(age: number) {
    this.setHeader("Vercel-CDN-Cache-Control", `max-age=${age}`);
    this.setHeader("CDN-Cache-Control", `max-age=${age}`);
    this.setHeader("Cache-Control", "max-age=10");
  }

  DataResponse() {
    !!this.data && this.setHeader("Content-Type", "application/json");

    return new Response(JSON.stringify(this.data), {
      status: this.status,
      headers: this.response.headers,
    });
  }
}

type Handler = (req: Request, resp: ChefResponse) => void | Promise<void>;

export async function GenericHandler(req: Request, handler: Handler, process: string) {
  console.time(`${process}`);
  const Resp = new ChefResponse();

  try {
    // checkActive();
    await handler(req, Resp);
  } catch (err) {
    console.log(err)
    // TODO: not even sure if I need this
    if (err instanceof ApiError)
      Resp.setError(err);
  }

  console.timeEnd(`${process}`);
  return await Resp.DataResponse();
}

export function cacheResponse(resp: Response, age: number) {
  resp.headers.set("Vercel-CDN-Cache-Control", `max-age=${age}`);
  resp.headers.set("CDN-Cache-Control", `max-age=${age}`);
  resp.headers.set("Cache-Control", "max-age=10");
  // TODO MAYBE: maybe add other caching?

  return resp;
}

// In case I need to quickly shut things off in prod
export function checkActive() {
  if (process.env.ACTIVE !== "true")
    throw new ApiError("Server is currently down.", {status: 500});
}
