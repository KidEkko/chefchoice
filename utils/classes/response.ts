import { ErrorMessages } from "@/serverConfig";
import type { User } from "./user";

export class ApiError extends Error {
  code: number;

  public constructor(details: string, code: number, message: string | null) {
    super(message || "");
    this.details = details;
    this.code = code;
  }
}

export interface ApiError {
  details: string;
}

// TODO: Rework this
export class SqlResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;

  constructor(err?: ApiError | null) {
    this.data = null;
    this.error = err || null;
  }

  setResponseData(data: T): void {
    this.data = data;
  }

  setResponseError(err: ApiError): void {
    this.error = err;
  }

  goodResponse(): this is this & { data: T } {
    return !!this.data;
  }
}

// Params for GET requests built into a query string
export type QueryParams = Record<string, string | number | boolean>;

const PubRequests = Object.freeze({
  Username: "getUsername",
  AddUser: "signup",
  LogUser: "auth",
  UpdateUser: "userUpdate",
});

// TODO EVENTUALLY: I just can't figure out how to make catch work with throwing errors here
// I have a feeling that it's something that should be done, but for now I'd rather just push something I know works

function getAPICall(reqType: string): string {
  return `${window.location.origin}/api/${reqType}`;
}

export async function GenericFetch(type: string, headers?: RequestInit): Promise<Response> {
  return await fetch(getAPICall(type), headers);
}

export async function GenericFetchWithQueries(
  type: string,
  params: QueryParams,
  headers?: RequestInit
): Promise<Response> {
  const queries: string[] = [];
  for (const [key, val] of Object.entries(params)) queries.push(`${key}=${val}`);

  return await GenericFetch(`${type}?${queries.join("&")}`, headers);
}

function AssignUserResponse(resp: User | (ApiError & Record<string, unknown>) | null): SqlResponse<User> {
  const response = new SqlResponse<User>();
  if (resp && "details" in resp && resp.details) {
    response.setResponseError(resp as ApiError);
  } else {
    response.setResponseData(resp as User);
  }
  return response;
}

export async function GetUserWithToken(): Promise<SqlResponse<User> | undefined> {
  const response = await GenericFetch(PubRequests.Username)
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return AssignUserResponse(resp);
    })
    .catch(() => undefined);

  return response;
}

export async function CreateNewUser(user: User): Promise<SqlResponse<User>> {
  const response = await GenericFetch(PubRequests.AddUser, {
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
    });

  return response;
}

export async function SubmitLogin(user: User): Promise<SqlResponse<User>> {
  return await GenericFetch(PubRequests.LogUser, {
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
  const response = await GenericFetch(PubRequests.UpdateUser, {
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
