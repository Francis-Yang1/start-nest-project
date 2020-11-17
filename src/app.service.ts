import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(argsInfo: string): string {
    return 'Hello World! Hello ' + argsInfo;
  }
}
