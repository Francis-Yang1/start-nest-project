//yarn add crypto-js
import * as crypto from 'crypto';
import * as cryptoJs from 'crypto-js';
import { Base64 } from 'js-base64';

//yarn add js-base64
export class EncryptTool {
  //用户密码加密
  static async encryptUser(passWord: string, salt: string): Promise<string> {
    return crypto
      .createHmac('md5', salt)
      .update(passWord)
      .digest('hex');
  }

  //检查密码是否正确
  static checkEncryptPwd(truePwd: string, inputPwd: string): boolean {
    if (truePwd === inputPwd) {
      return true;
    } else {
      return false;
    }
  }

  //微信数据解码
  static async wxdecrypt(
    sessionKey: any,
    encryptedData: any,
    ivv: any,
  ): Promise<string> {
    //将参数解析为解码需要的格式
    const key = cryptoJs.enc.Base64.parse(sessionKey);
    const iv = cryptoJs.enc.Base64.parse(ivv);

    //解密数据：crypto
    const deCrypto = cryptoJs.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });

    //解密数据：Base64
    return Base64.decode(cryptoJs.enc.Base64.stringify(deCrypto).trim());
  }
}
