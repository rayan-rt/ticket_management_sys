export class ResHandler {
  status: number;
  message: string;
  success: boolean;
  data: any;

  constructor(message: string, status: number, data: any, success: boolean) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.success = success;
  }
}
