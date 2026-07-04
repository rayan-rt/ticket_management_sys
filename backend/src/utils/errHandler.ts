export class ErrorHandler extends Error {
  message: string;
  data: any;
  success: boolean;
  status: number;

  constructor(message: string, data: any, success: boolean, status: number) {
    super(message);

    this.message = message;
    this.data = data;
    this.success = success;
    this.status = status;
  }
}
