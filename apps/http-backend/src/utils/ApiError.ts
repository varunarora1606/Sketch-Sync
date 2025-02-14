interface ApiErrorInterface {
  statusCode: number;
  errors: Error[];
  success: boolean;
}
class ApiError extends Error implements ApiErrorInterface {
  constructor(
    public statusCode: number,
    message: string = "Something went wrong",
    public errors: Error[] = [],
    public success: boolean = statusCode < 400,
    stack: string = ""
  ) {
    super(message)
    if(stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

}

export { ApiError };
