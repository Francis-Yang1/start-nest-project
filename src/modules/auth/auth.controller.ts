import { Body, Controller, HttpException, Post, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalExceptionFilter } from 'src/core/filters/internal-exception.filter';

import { ApiResponse as ApiResult } from '../../core/dto/api.response';
import { AuthService } from './auth.service';
import { Code2SessionRequestArgs, LoginRequestArgs, WeappLoginRequestArgs } from './dto/login.request';
import { LoginResponse } from './dto/login.response';

//@ApiTags()给swaager文档分组
@ApiTags('用户登录相关')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登陆' })
  @ApiResponse({ type: LoginResponse })
  // @RequireAuth() //登录验证，引自编写的装饰器
  @Post('login')
  async login(
    @Body() payload: LoginRequestArgs,
  ): Promise<ApiResult<LoginResponse>> {
    const result = await this.authService.login(payload);
    //不用 ApiResult.success<LoginResponse>(result)的原因是：
    //result包含内容和LoginResponse的不匹配
    return result;
  }

  @ApiOperation({ summary: '微信小程序登录凭证校验' })
  @UseFilters(InternalExceptionFilter) //编写的过滤器，拦截异常信息
  @Post('code2Session')
  async code2Session(
    @Body() params: Code2SessionRequestArgs,
  ): Promise<ApiResult<any>> {
    try {
      const result = await this.authService.weappCode2Session(params.code);
      return ApiResult.success<any>(result);
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  @ApiOperation({ summary: '微信小程序登录' })
  @Post('weappLogin')
  async weappLogin(@Body() params: WeappLoginRequestArgs) {
    return this.authService.weappLogin(params);
  }
}
