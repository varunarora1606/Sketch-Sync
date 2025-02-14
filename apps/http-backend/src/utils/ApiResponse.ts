interface ApiResponseInterface {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
}

class ApiResponse implements ApiResponseInterface {
  constructor(
    public statusCode: number,
    public data: any,
    public message: string = "success",
    public success: boolean = statusCode < 400
  ) {}
}

export { ApiResponse };
