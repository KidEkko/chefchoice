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
