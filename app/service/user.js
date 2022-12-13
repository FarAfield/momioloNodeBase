const Service = require('egg').Service;

const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code';
const BaseSystemConstant = require('../core/base_system_constant');
const BaseResponse = require('../core/base_response');
class UserService extends Service {
  // 微信注册
  async register(code) {
    const requestUrl = loginUrl.replace('APPID', BaseSystemConstant.APP_ID).replace('SECRET', BaseSystemConstant.APP_SECRET).replace('JSCODE', code);
    const res = this.app.curl(requestUrl);
    try {
      const openId = res.openid;
      const sessionKey = res.session_key;
      // 查询是否已注册
      const user = await this.app.mysql.select(
        'bus_wechat_user', {
          where: {
            open_id: openId,
          },
        }
      );
      if (user.sid) {
        // 生成token
        const token = this.ctx.helper.createToken({ sid: user.sid, openId, sessionKey });
        // todo 缓存用户登录态到redis
        return BaseResponse.success({
          isRegistered: true,
          token,
        });
      }
      return BaseResponse.success({
        isRegistered: false,
        token: null,
      });
    } catch (err) {
      return BaseResponse.error();
    }
  }
}
module.exports = UserService;
