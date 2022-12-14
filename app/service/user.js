const Service = require('egg').Service;
const sha1 = require('sha1');

const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code';
const BaseSystemConstant = require('../core/base_system_constant');
const BaseResponseEnum = require('../core/base_response_enum');
const BaseResponse = require('../core/base_response');

class UserService extends Service {

  // 微信注册   rawData非敏感信息字符串   signature使用sha1(rawData + sessionKey)得到字符串用于校验
  async register(code, rawData, signature, encryptedData, iv) {
    const requestUrl = loginUrl.replace('APPID', BaseSystemConstant.APP_ID).replace('SECRET', BaseSystemConstant.APP_SECRET.replaceAll('#@#', '')).replace('JSCODE', code);
    const res = this.app.curl(requestUrl);
    try {
      const openId = res.openid;
      const sessionKey = res.session_key;
      // 校验signature
      if (sha1(rawData + sessionKey) === signature) {
        // 解密信息
        const userInfo = this.app.helper.encryptedData(BaseSystemConstant.APP_ID, sessionKey, encryptedData, iv);
        console.log(userInfo);
        // 存储用户信息到数据库
        const result = this.app.mysql.insert('wechat_user', {
          nick_name: '111',
          avatar_url: '111',
          gender: '',
          country: '',
          province: '',
          city: '',
          language: '',
          open_id: '',
          union_id: '',
        });
        console.log(result);
        // 生成token
        const token = this.ctx.helper.createToken({ openId, sessionKey });
        // 缓存用户登录态到redis
        this.service.redis.set(openId, token);
        return BaseResponse.success({ token });
      }
      this.logger.error('微信签名校验不通过');
      return BaseResponse.error();
    } catch (err) {
      this.logger.error('微信注册异常');
      return BaseResponse.error();
    }
  }

  // 微信登录
  async login(code) {
    const requestUrl = loginUrl.replace('APPID', BaseSystemConstant.APP_ID).replace('SECRET', BaseSystemConstant.APP_SECRET.replaceAll('#@#', '')).replace('JSCODE', code);
    const res = this.app.curl(requestUrl);
    try {
      const openId = res.openid;
      const sessionKey = res.session_key;
      // 查询用户信息
      const user = await this.app.mysql.select(
        'wechat_user', {
          where: {
            open_id: openId,
          },
        }
      );
      if (user.sid) {
        // 生成token
        const token = this.ctx.helper.createToken({ sid: user.sid, openId, sessionKey });
        // 缓存用户登录态到redis
        this.service.redis.set(openId, token);
        return BaseResponse.success({
          isRegistered: true,
          token,
        });
      }
      return BaseResponse.error(BaseResponseEnum.UNREGISTERED_ERROR);
    } catch (err) {
      this.logger.error('微信登录异常');
      return BaseResponse.error();
    }
  }
}
module.exports = UserService;
