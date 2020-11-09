import { ApiProperty } from '@nestjs/swagger';

//用登录成功后返回的信息： 账号+密码
export class LoginResponse {
  @ApiProperty({ description: '主键' })
  id: number;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @ApiProperty({ description: '真实姓名' })
  truename: string;

  @ApiProperty({ description: '手机号' })
  mobile: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '性别 0未知 1男性 2女性' })
  gender: number;

  @ApiProperty({ description: 'openid' })
  openid?: string;

  @ApiProperty({ description: '登录认证令牌' })
  token: string;

  @ApiProperty({ description: '创建时间' })
  crtime: number;

  @ApiProperty({ description: '更新时间' })
  uptime: number;

  @ApiProperty({ description: '状态：0停用 1启用 -1 删除' })
  status: number;
}

//用户登录后返回的信息： 小程序登录
export class WeappLoginResponse {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @ApiProperty({ description: '手机号' })
  mobile: string;

  @ApiProperty({ description: '邮箱' })
  mail: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '性别' })
  gender: number;

  @ApiProperty({ description: '登录时间' })
  logintime: number;

  @ApiProperty({ description: '登录认证令牌' })
  token: string;
}
