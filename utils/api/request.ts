import { ErrorMessages } from "@/serverConfig"; 
import { ApiError, ApiErrorBody } from "../types/api";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

// Params for GET requests built into a query string
export type QueryParams = Record<string, string | number | boolean>;

function getAPICall(endpoint: string): string {
  return `${window.location.origin}/api/${endpoint}`;
}

function attachQueryParams(endpoint: string, params: QueryParams): string {
    const queries: string[] = Object.entries(params).map((key) => `${key[0]}=${key[1]}`)
    return `${endpoint}?${queries.join("&")}`
}

async function genericFetch(endpoint: string, params?: QueryParams, headers?: RequestInit): Promise<Response> {
    if (!!params) endpoint = attachQueryParams(endpoint, params)
    return await fetch(getAPICall(endpoint), headers);
}

// frontend request helpers
// Used to apply generic shapes to success and failure.
const ok = <T>(data: T): ApiResult<T> => ({ ok: true, data });
const fail = (error: ApiError): ApiResult<never> => ({ ok: false, error });

export async function request<T>(path: string, fallback: string = ErrorMessages.GENERIC_ERROR, init?: RequestInit, params?: QueryParams): Promise<ApiResult<T>> {
    let resp: Response;
    try {
        resp = await genericFetch(path, params, init);
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

    if (body === null) return fail(new ApiError(fallback, {status: resp.status}));
    return ok(body as T);
}
