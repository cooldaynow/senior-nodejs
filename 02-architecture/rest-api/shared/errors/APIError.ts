export class APIError extends Error {
  statusCode: number;
  constructor(params: { statusCode: number; message: string }) {
    super(params.message);
    this.statusCode = params.statusCode;
  }
}
