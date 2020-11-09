import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: '错误码' })
  private code: number;

  @ApiProperty({ description: '错误信息' })
  private message: string;

  @ApiProperty({ description: '请求时间戳' })
  private timestamp: number;

  @ApiProperty({ description: '响应数据' })
  private data: T;

  @ApiProperty({ description: '请求路径' })
  private path: string;

  constructor() {
    this.timestamp = new Date().getTime();
  }

  //设置错误码
  setErrorCode(code: number): ApiResponse<T> {
    this.code = code;
    return this;
  }

  //获取错误码
  getErrorCode(): number {
    return this.code;
  }

  //设置错误信息
  setErrorMessage(message: string): ApiResponse<T> {
    this.message = message;
    return this;
  }

  //获取错误信息
  getErrorMessage(): string {
    return this.message;
  }

  //设置请求时间戳
  setTimestamp(timestamp: number): ApiResponse<T> {
    this.timestamp = timestamp;
    return this;
  }

  //获取请求时间戳
  getTimestamp(): number {
    return this.timestamp;
  }

  //设置响应数据
  setData(data: T): ApiResponse<T> {
    this.data = data;
    return this;
  }

  //获取响应数据
  getData(): T {
    return this.data;
  }

  //设置请求路径
  setPath(path: string): ApiResponse<T> {
    this.path = path;
    return this;
  }

  //获取请求路径
  getPath(): string {
    return this.path;
  }

  //请求成功
  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>()
      .setData(data)
      .setErrorCode(0)
      .setErrorMessage('成功');
  }

  //请求失败
  static error(code: number, message: string) {
    return new ApiResponse<any>().setErrorCode(code).setErrorMessage(message);
  }
}
