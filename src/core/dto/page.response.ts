import { ApiProperty } from '@nestjs/swagger';

export abstract class IpageResponse<T> {
  @ApiProperty({ description: '总数' })
  count: number;
  abstract rows: T[];
}
