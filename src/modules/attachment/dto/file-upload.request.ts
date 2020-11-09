import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//文件上传接口请求参数
export class FileUploadRequestArgs {
  @IsNotEmpty({ message: '上传文件不能为空' })
  @ApiProperty({
    description: '上传文件',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: any;

  @IsNotEmpty({ message: '文件备注不能为空' })
  @ApiProperty({ description: '备注', type: 'string', required: true })
  note: string;
}
