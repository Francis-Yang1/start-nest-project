import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //post用@Body(),get用@Query();get请求，参数可以直接定为指定类型，也可以引dto，但post要用dto
  //一般get也用dto，因为dto可以让用户传参，直接指定类型的方式，参数一般是内部定死的
  getHello(@Query() argsInfo: string): string {
    argsInfo = 'MoMo';
    return this.appService.getHello(argsInfo);
  }
}
