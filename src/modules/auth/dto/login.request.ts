import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

//注册用户参数： 账号+密码
export class RegisterArgs {
  @IsNotEmpty({ message: '昵称不能为空！' })
  @IsString({ message: '昵称必须是String类型' })
  @ApiProperty({ description: '昵称', required: true })
  nickname: string;

  @ApiProperty({ description: '真实姓名', required: false })
  truename: string;

  @IsNotEmpty({ message: '手机号不能为空！' })
  @IsNumber()
  @ApiProperty({ description: '手机号', required: true })
  mobile: string;

  @IsNotEmpty({ message: '头像附件路径不能为空！' })
  @ApiProperty({ description: '头像附件路径', required: true })
  avatarUrl: string;

  @IsNotEmpty({ message: '密码不能为空！' })
  @ApiProperty({ description: '密码', required: true })
  password: string;

  @IsNotEmpty({ message: '再次密码不能为空！' })
  @ApiProperty({ description: '再次输入密码', required: true })
  repassword: string;

  @ApiProperty({
    description: '性别 0未知 1男性 2女性',
    required: false,
  })
  gender: number;
}

//登录参数: 账号+密码
export class LoginRequestArgs {
  @IsNotEmpty({ message: '手机号不能为空' })
  @ApiProperty({ description: '手机号', required: true })
  mobile: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ description: '密码', required: true })
  password: string;
}

//小程序登录参数
export class WeappLoginRequestArgs {
  @ApiProperty({ description: '保护敏感数据在内的完整用户信息 的加密数据' })
  encryptedData: string;

  @ApiProperty({ description: '错误信息' })
  errMessage: string;

  @ApiProperty({ description: '加密算法的初始向量' })
  iv: string;

  @ApiProperty({ description: '不包含敏感信息的原始数据，用于计算签名' })
  rawData: string;

  @ApiProperty({
    description: '使用 sha1(rawData + sessionkey) 得到字符串，用户校验用户信息',
  })
  signature: string;

  @ApiProperty({ description: 'code获取到的openid' })
  openid: string;
}

//微信小程序登录凭证校验参数
export class Code2SessionRequestArgs {
  @ApiProperty({ description: 'code' })
  code: string;
}
