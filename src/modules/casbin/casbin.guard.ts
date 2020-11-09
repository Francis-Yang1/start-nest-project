import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CasbinService } from './casbin.service';

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(private readonly casbinService: CasbinService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 不是graphql请求
    await this.casbinService.reloadPolicy();
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const obj = request.route?.path;
    const act = request.method;
    const sub = `user_${user.id}`;
    console.log(sub, obj, act);
    return await this.casbinService.checkPermission(sub, obj, act);
  }
}
