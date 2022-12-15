const Service = require('egg').Service;
const sha1 = require('sha1');

const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code';
const BaseSystemConstant = require('../core/base_system_constant');
const BaseResponse = require('../core/base_response');

class UserService extends Service {

  // 微信登录
  async login(code) {
    const requestUrl = loginUrl.replace('APPID', BaseSystemConstant.APP_ID).replace('SECRET', BaseSystemConstant.APP_SECRET.replaceAll('#@#', '')).replace('JSCODE', code);
    const { data } = await this.ctx.curl(requestUrl, {
      dataType: 'json',
    });
    this.logger.info('微信登陆凭证数据', data);
    try {
      const openId = data.openid;
      const sessionKey = data.session_key;
      // 查询用户信息
      const user = await this.app.mysql.get(
        'wechat_user', {
          open_id: openId,
        }
      );
      this.logger.info('微信登陆用户数据', openId, user);
      if (user?.sid) {
        // 生成token
        const token = await this.ctx.helper.createToken({ sid: user.sid, openId, sessionKey });
        return BaseResponse.success({
          token,
          userInfo: {
            nickName: user.nickName,
            avatarUrl: user.avatarUrl,
            isRegistered: user.isRegistered,
          },
        });
      }
      // 存储默认用户信息到数据库
      const result = await this.app.mysql.insert('wechat_user', {
        nick_name: BaseSystemConstant.NICK_NAME,
        avatar_url: BaseSystemConstant.AVATAR_URL,
        open_id: openId,
        is_registered: 0, // 未注册
        del_flag: 0, // 未删除
      });
      // 生成token
      const token = await this.ctx.helper.createToken({ sid: result.insertId, openId, sessionKey });
      return BaseResponse.success({
        token,
        userInfo: {
          nickName: BaseSystemConstant.NICK_NAME,
          avatarUrl: BaseSystemConstant.AVATAR_URL,
          isRegistered: 0,
        },
      });
    } catch (err) {
      this.logger.error('微信登录异常', err);
      return BaseResponse.error();
    }
  }

  // 微信注册   rawData非敏感信息字符串   signature使用sha1(rawData + sessionKey)得到字符串用于校验
  async register(rawData, signature, encryptedData, iv, userInfo) {
    try {
      const token = this.ctx.request.header.authorization;
      const tokenInfo = await this.ctx.helper.decodeToken(token);
      this.logger.info('微信注册解析的token数据', tokenInfo);
      const sessionKey = tokenInfo.sessionKey;
      // 校验signature
      if (sha1(rawData + sessionKey) === signature) {
        // 解密信息(watermark)
        await this.ctx.helper.decryptData(BaseSystemConstant.APP_ID, sessionKey, encryptedData, iv);
        this.logger.info('微信注册敏感数据已解析');
        // 更新用户信息到数据库
        await this.app.mysql.update('wechat_user', {
          nick_name: userInfo.nickName,
          avatar_url: userInfo.avatarUrl,
          gender: userInfo.gender,
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city,
          language: userInfo.language,
          is_registered: 1, // 更新为已注册
        }, {
          where: {
            sid: tokenInfo.sid,
          },
        });
        return BaseResponse.success({
          token,
          userInfo: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            isRegistered: 1,
          },
        });
      }
      this.logger.error('微信签名校验不通过');
      return BaseResponse.error();
    } catch (err) {
      this.logger.error('微信注册异常', err);
      return BaseResponse.error();
    }
  }

  // 校验token
  async checkToken() {
    try {
      const token = this.ctx.request.header.authorization;
      const tokenInfo = await this.ctx.helper.decodeToken(token);
      this.logger.info('微信鉴权解析的token数据', tokenInfo);
      // 查询用户信息
      const user = await this.app.mysql.get(
        'wechat_user', {
          open_id: tokenInfo.openId,
        }
      );
      this.logger.info('微信鉴权用户数据', user);
      return BaseResponse.success({
        isValid: user?.sid === tokenInfo.sid,
      });
    } catch (err) {
      this.logger.error('微信校验token异常', err);
      return BaseResponse.error();
    }

  }

}
module.exports = UserService;
