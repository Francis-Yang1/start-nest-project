import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

//接口需要登录
export function RequireAuth() {
  //ApiBearerAuth()返回访问令牌、刷新令牌
  return applyDecorators(UseGuards(AuthGuard('jwt')), ApiBearerAuth());
}
