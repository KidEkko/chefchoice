import { ApiError } from "@util/classes/response";
import { RoleIntMap, RoleMap, RoleString } from "@/serverConfig";

class ChefResponse {
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
    this.setData({ details: err.details });
    this.status = err.code || 500;
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

// handler functions fine as it is now, but ideally we remove implicit any typing
export async function GenericHandler(req: Request, handler, process: string) {
  console.time(`${process}`);
  const Resp = new ChefResponse();

  try {
    checkActive();
    await handler(req, Resp);
  } catch (err) {
    Resp.setError(err as ApiError);
  }

  console.timeEnd(`${process}`);
  return await Resp.DataResponse();
}

// TODO: find a simple way to fix this
export function confirmRoleLevel(role: number) {
  return RoleIntMap.get(role);
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
    throw new ApiError("Server is currently down.", 500, "");
}
