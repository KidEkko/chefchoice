import { ApiError } from "@/utils/types";

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
