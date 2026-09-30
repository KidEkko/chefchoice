import { ApiError } from "@generic/classes/errors.js";
import { RoleIntMap, RoleMap, RoleString } from "serverConfig";

class ChefResponse {
  constructor() {
    this.response = new Response();
    this.data = {};
    this.status = 200;
  }

  setData(data) {
    this.data = data;
  }

  setHeader(name, value) {
    this.response.headers.set(name, value);
  }

  setError(err) {
    this.setData({ details: err.details });
    this.status = err.code || 500;
  }

  cacheResponse(age) {
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

export async function GenericHandler(req, handler, process) {
  console.time(`${process}`);
  const Resp = new ChefResponse();

  try {
    checkActive();
    await handler(req, Resp);
  } catch (err) {
    Resp.setError(err);
  }

  console.timeEnd(`${process}`);
  return await Resp.DataResponse();
}

// 
export function confirmRoleLevel(role) {
  return RoleIntMap.get(role);
}

export function cacheResponse(resp, age) {
  resp.headers.set("Vercel-CDN-Cache-Control", `max-age=${age}`);
  resp.headers.set("CDN-Cache-Control", `max-age=${age}`);
  resp.headers.set("Cache-Control", "max-age=10");
  // TODO MAYBE: maybe add other caching?

  return resp;
}

// In case I need to quickly shut things off in prod
export function checkActive() {
  if (process.env.ACTIVE !== "true")
    throw new ApiError("Server is currently down.");
}
