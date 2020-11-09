import { BadRequestException, HttpException, HttpService, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectConfig } from 'nestjs-config';
import { EncryptTool } from 'src/core/common/encrypt';
import { ApiResponse } from 'src/core/dto/api.response';
import { TmploginEntity } from 'src/entity/tmplogin.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

import { LoginRequestArgs, WeappLoginRequestArgs } from './dto/login.request';
import { LoginResponse, WeappLoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //yarn add @nestjs/jwt
    //用来获取src/config下配置文件的变量  如：this.config.get('weapp.appid');weapp文件名，appid文件中的变量
    @InjectConfig() private readonly config, //yarn add nestjs-config
    @Inject(HttpService)
    private httpService: HttpService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TmploginEntity)
    private readonly tmploginRepository: Repository<TmploginEntity>,
  ) {}

  //构造token
  async sign(payload: any): Promise<string> {
    const token = 'Bearer ' + this.jwtService.sign(payload);
    return token;
  }

  //验证账号+密码，判断是否登录成功
  async loginResult(loginReq: any): Promise<ApiResponse<any>> {
    //根据账号（手机号）查找用户
    const userInfo = await this.userRepository.findOne({
      where: {
        mobile: loginReq.mobile,
        status: 1,
      },
    });

    if (!userInfo) {
      throw ApiResponse.error(10001, '账号不存在！');
    }

    //获取加密后的密码
    const encryptPwd = await EncryptTool.encryptUser(
      loginReq.password,
      userInfo.salt,
    );

    if (EncryptTool.checkEncryptPwd(userInfo.password, encryptPwd)) {
      //password、salt不返回，返回userEitity中除此字段外的信息
      const { password, salt, ...result } = userInfo;
      return ApiResponse.success<any>(result);
    } else {
      return ApiResponse.error(10001, '密码错误！');
    }
  }

  //用户登录：账号+密码
  async login(loginReq: LoginRequestArgs): Promise<ApiResponse<LoginResponse>> {
    //检查账号+密码是否正确
    const loginResult = await this.loginResult({
      mobile: loginReq.mobile,
      password: loginReq.password,
    });

    if (loginResult.getErrorCode() !== 0) {
      throw new UnauthorizedException();
    }

    //获取用户id
    const payload = { userId: loginResult.getData().id };
    //获取token
    const token = await this.sign(payload);
    const result = { token: token, ...loginResult.getData() };
    return ApiResponse.success<LoginResponse>(result);
  }

  //获取tmplogin
  async getTmpLogin(openid: any) {
    if (!openid) {
      return false;
    }
    return await this.tmploginRepository.findOne({
      where: {
        appcode: 'SNP', //本系统应用编码，自定义，这里取项目名称首字母：start-nest-project
        openid: openid,
      },
    });
  }

  //微信小程序登录凭证校验
  async weappCode2Session(code: any) {
    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.config.get(
        'weapp.appid',
      )}&secret=${this.config.get(
        'weapp.secret',
      )}&js_code=${code}&grant_type=authorization_code`;

      const res = await this.httpService.get(url).toPromise();

      if (!res.data.errcode) {
        //如果通过微信，取到该用户的相关信息，则存到tmplogin表
        const result = await this.saveTmpLogin(res.data);
        return result;
      } else {
        throw new HttpException(
          `获取session_key失败：${res.data.errmsg}`,
          res.data.errcode,
        );
      }
    } catch (error) {
      throw new HttpException(error, 200);
    }
  }

  //将通过微信获取的用户相关信息，存到tmplogin表
  async saveTmpLogin(sessionData: any) {
    if (!sessionData) {
      return false;
    }

    //通过openid查询是否有相关记录
    const record = await this.getTmpLogin(sessionData.openid);

    if (!record) {
      const saveData = {
        appcode: 'SNP', //应用编码，这里取项目名称首字母：start-nest-project
        openid: sessionData.openid,
        sessionKey: sessionData.session_key,
      };

      sessionData.unionid && (saveData['unionid'] = sessionData.unionid);

      return await this.tmploginRepository.save(saveData);
    } else {
      record.sessionKey = sessionData.session_key;
      await record.save();
      return record;
    }
  }

  //小程序登录验证,判断是否登录成功
  async weappLoginResult(loginReq: any): Promise<any> {
    const tmplogin = await this.getTmpLogin(loginReq.openid);

    let sessionKey: string;
    if (tmplogin) {
      sessionKey = tmplogin.sessionKey;
    } else {
      throw new BadRequestException('获取session_key失败，请重新获取！');
    }

    //获取微信解密数据
    const decryptData = await EncryptTool.wxdecrypt(
      sessionKey,
      loginReq.encryptedData,
      loginReq.iv,
    );

    if (!decryptData) {
      throw new BadRequestException('获取用户信息失败，请重新获取！');
    }

    //将微信解密后的用户信息，解析成json格式
    const wxUserInfo = JSON.parse(decryptData);
    //将解密后的微信用户信息更新到tmplogin表
    await this.updateTmpLogin(wxUserInfo, loginReq);
    return await this.weappRegister(wxUserInfo);
  }

  //通过openid获取用户信息
  async getUserByOpenid(openid: any) {
    if (!openid) {
      return false;
    }
    return await this.userRepository.findOne({
      where: {
        openid: openid,
      },
    });
  }

  //微信小程序用户注册
  async weappRegister(wxUserInfo: any) {
    if (!wxUserInfo) {
      return false;
    }

    //根据传回来的wxUserInfo中的openid，获取用户信息
    const userInfo = await this.getUserByOpenid(wxUserInfo.openid);

    if (!userInfo) {
      // 首次注册的用户生成一个默认密码
      const salt = Math.round(Math.random() * 999999999).toString(16); //生成加密需要的盐，toString(16)，变成16进制字符串
      //获取加密后的密码，初始默认为‘snp2020’----start-nest-project2020
      const encryptPwd = await EncryptTool.encryptUser('snp2020', salt);

      //存入用户表的信息
      const addUserInfo = {
        nickname: wxUserInfo.nickname,
        avatar: wxUserInfo.avatarUrl,
        gender: wxUserInfo.gender,
        openid: wxUserInfo.openid,
        unionid: wxUserInfo.unionid,
        password: encryptPwd,
        salt: salt,
      };

      return await this.userRepository.save(addUserInfo);
      // 或 await this.userRepository.create(addUserInfo).save();
    } else {
      //存在用户信息，则更新
      userInfo.avatar = wxUserInfo.avatarUrl;
      userInfo.nickname = wxUserInfo.nickname;
      userInfo.gender = wxUserInfo.gender;
      userInfo.unionid = wxUserInfo.unionid;

      await userInfo.save();
      return userInfo;
    }
  }

  //将解密后的微信用户信息更新到tmplogin表
  async updateTmpLogin(wxUserInfo: any, loginData: any) {
    if (!wxUserInfo) {
      return false;
    }

    //根据传回来的微信用户信息中的openid，查找tmpLogin信息
    const tmpLoginInfo = await this.getTmpLogin(wxUserInfo.openid);

    if (!tmpLoginInfo) {
      return false;
    } else {
      tmpLoginInfo.nickname = wxUserInfo.nickname;
      tmpLoginInfo.avatarUrl = wxUserInfo.avatarUrl;
      tmpLoginInfo.country = wxUserInfo.country;
      tmpLoginInfo.province = wxUserInfo.province;
      tmpLoginInfo.city = wxUserInfo.city;
      tmpLoginInfo.language = wxUserInfo.language;
      tmpLoginInfo.iv = loginData.iv;
      tmpLoginInfo.signature = loginData.signature;
      tmpLoginInfo.encryptedData = loginData.encryptedData;
      //如果wxUserInfo中存在unionId，则执行&&后边的语句
      wxUserInfo.unionId && (tmpLoginInfo.unionid = wxUserInfo.unionId);

      //更新数据
      await tmpLoginInfo.save();

      return tmpLoginInfo;
    }
  }

  //小程序用户登录
  async weappLogin(
    loginReq: WeappLoginRequestArgs,
  ): Promise<WeappLoginResponse> {
    //获取小程序登录验证结果
    const weappLoginResult = await this.weappLoginResult(loginReq);

    //获取用户id
    const payload = {
      userId: weappLoginResult.id,
    };
    //获取token
    const token = await this.sign(payload);
    //将weappLoginResult结果中的password，salt除外，赋值给userInfo
    const { password, salt, ...userInfo } = weappLoginResult;
    const result = { token: token, ...userInfo };
    return result;
  }

  //验证用户，构造user到req
  async validateUser(payload: any) {
    const result = await this.userRepository.findOne({
      where: {
        id: payload.userId,
      },
    });

    if (!result) {
      throw new BadRequestException('用户不存在！');
    }

    const { password, salt, ...userInfo } = result;
    return userInfo;
  }
}
