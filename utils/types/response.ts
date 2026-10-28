import { ErrorMessages } from "@/serverConfig";
import type { User } from "./user";

export class ApiError extends Error {
  code: number;

  public constructor(details: string, code: number) {
    super();
    this.details = details;
    this.code = code;
  }
}

export interface ApiError {
  details: string;                  
  code: number;                      
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };


// Params for GET requests built into a query string
export type QueryParams = Record<string, string | number | boolean>;

const PubRequests = Object.freeze({
  Username: "getUser",
  AddUser: "signup",
  LogUser: "auth",
  UpdateUser: "userUpdate",
  GetRecipe: "getRecipe",
  AddRecipe: "addRecipe",
  GetPrep: "getMealPrep",
});

function getAPICall(reqType: string): string {
  return `${window.location.origin}/api/${reqType}`;
}

async function genericFetch(type: string, headers?: RequestInit): Promise<Response> {
  return await fetch(getAPICall(type), headers);
}

async function genericFetchWithQueries(type: string, params: QueryParams, headers?: RequestInit): Promise<Response> {
  const queries: string[] = Object.entries(params).map((key) => `${key[0]}=${key[1]}`)
  return await genericFetch(`${type}?${queries.join("&")}`, headers);
}

// frontend request helpers
const ok = <T>(data: T): ApiResult<T> => ({ ok: true, data });
const fail = (error: ApiError): ApiResult<never> => ({ ok: false, error });

function post(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// TODO: really analyze this and decide on it. At the very least, learn from it.
async function request<T>(path: string, fallback: string = ErrorMessages.GENERIC_ERROR, init?: RequestInit): Promise<ApiResult<T>> {
  let resp: Response;
  try {
    resp = await genericFetch(path, init);
  } catch {
    return fail({ details: fallback }); // network failure: no response at all
  }

  let body = await resp.json();

  if (!resp.ok) {
    const err = body as Partial<ApiError> | null;
    return fail({
      details: err?.details ?? fallback,
      status: resp.status,
      code: err?.code,
    });
  }

  if (body === null) return fail({ details: fallback, status: resp.status });
  return ok(body as T);
}

export async function GetUserWithToken(): Promise<ApiResult<User>> {
  return request<User>(PubRequests.Username, ErrorMessages.DEFAULT_LOGIN_ERROR);
}

export function CreateNewUser(user: User): Promise<ApiResult<User>> {
  return request<User>(PubRequests.AddUser, ErrorMessages.DEFAULT_LOGIN_ERROR, post(user));
}

export async function SubmitLogin(user: User): Promise<SqlResponse<User>> {
  return await genericFetch(PubRequests.LogUser, {
    method: "POST",
    body: JSON.stringify(user),
  })
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return AssignUserResponse(resp);
    })
    .catch(() => {
      console.log("whoops");
      return new SqlResponse<User>({ details: ErrorMessages.DEFAULT_LOGIN_ERROR });
      // handle the error outside of this function
    });
}

export async function UpdateUser(user: User): Promise<SqlResponse<User>> {
  const response = await genericFetch(PubRequests.UpdateUser, {
    method: "POST",
    body: JSON.stringify(user),
  })
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return AssignUserResponse(resp);
    })
    .catch(() => {
      console.log("whoops");
      return new SqlResponse<User>({ details: ErrorMessages.DEFAULT_UPDATE_USER_ERROR });
    });

  return response;
}
