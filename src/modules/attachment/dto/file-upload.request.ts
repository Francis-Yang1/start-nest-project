import { ApiProperty } from '@nestjs/swagger';

//文件上传接口请求参数
export class FileUploadRequestArgs {
  @ApiProperty({ description: '上传文件', type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ description: '备注', type: 'string' })
  note: string;
}
