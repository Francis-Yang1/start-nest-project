import { ApiProperty } from '@nestjs/swagger';

//分页请求参数
export abstract class IpageRequest {
  @ApiProperty({
    description: '当前页码',
    required: false,
    default: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    required: false,
    default: 10,
    minimum: 0,
  })
  pageSize: number;
}
