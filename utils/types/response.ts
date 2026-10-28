import { ErrorMessages } from "@/serverConfig";
import { User } from "./user";
import { Recipe } from "./recipe";

/**
 * Things to do now
 * this file is in a comfortable spot now
 * 
 * what else do I need to do?
 *    move functions out of this file that don't need to be here. this was useful in my own personal website, but figuring out a standard practice would be good
 *    Add remainign planned routes
 *    create the endpoints
 *    create hooks and/or providers that can be used in the front end
 *    figure out how to get environment variables for group members. I could just share the file with them, but I want to look into the ideal way to handle this
 *    look into linting so that I stop getting annoyed by the random decision between space and tab
 *    confirm that the return types for "add something" POSTs are correct and whether I need them at all for somethig like recipe
 *   
 * Once I finish these, I believe that I can start giving thought to other features and how they would look
 * I can consider things like nextauth and how they would look
 * linting is one of those things
 * 
 */

// TODO: examine these objects and confirm everything looks good to go.
export interface ApiErrorBody {
  message: string;
  code?: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly fields?: Record<string, string>;

  constructor(
    message: string,
    opts: { status?: number; code?: string; fields?: Record<string, string> } = {}
  ) {
    super(message);
    Object.assign(this, opts);
  }

  toBody(): ApiErrorBody {
    return { message: this.message, code: this.code, fields: this.fields };
  }
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
async function request<T>(path: string, fallback: string = ErrorMessages.GENERIC_ERROR, init?: RequestInit, params?: QueryParams): Promise<ApiResult<T>> {
  let resp: Response;
  try {
    if (!!params) {
      resp = await genericFetchWithQueries(path, params, init);
    } else  {
      resp = await genericFetch(path, init);
    }
  } catch {
    return fail(new ApiError(fallback));
  }

  let body = await resp.json();

  if (!resp.ok) {
    const err = body as Partial<ApiErrorBody> | null;
    return fail(
      new ApiError(err?.message ?? fallback, {
        status: resp.status,
        code: err?.code,
        fields: err?.fields,
      })
    );
  }

  if (body === null) return fail(new ApiError(fallback));
  return ok(body as T);
}

export async function GetUserWithToken(): Promise<ApiResult<User>> {
  return request<User>(PubRequests.Username, ErrorMessages.DEFAULT_LOGIN_ERROR);
}

export function CreateNewUser(user: User): Promise<ApiResult<User>> {
  return request<User>(PubRequests.AddUser, ErrorMessages.DEFAULT_LOGIN_ERROR, post(user));
}

export async function SubmitLogin(user: User): Promise<ApiResult<User>> {
  return request<User>(PubRequests.LogUser, ErrorMessages.DEFAULT_LOGIN_ERROR, post(user));
}

// TODO: Add message strings for all below functions
export async function UpdateUser(user: User): Promise<ApiResult<User>> {
  return request<User>(PubRequests.UpdateUser, ErrorMessages.DEFAULT_UPDATE_USER_ERROR, post(user));
}

export async function GetRecipe(recipeId: number): Promise<ApiResult<Recipe>> {
  return request<Recipe>(PubRequests.GetRecipe, ErrorMessages.GENERIC_ERROR, post(recipeId));
}

export async function AddRecipe(recipe: Recipe): Promise<ApiResult<Recipe>> {
  return request<Recipe>(PubRequests.AddRecipe, ErrorMessages.GENERIC_ERROR, post(recipe));
}
