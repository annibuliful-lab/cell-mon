export class GraphqlError extends Error {
  extensions: object;
  statusCode: number;

  constructor(message: string, extensions?: object, statusCode?: number) {
    super(message);
    this.extensions = extensions as object;
    this.statusCode = statusCode || 200;
  }
}
