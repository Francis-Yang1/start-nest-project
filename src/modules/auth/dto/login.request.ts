import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
