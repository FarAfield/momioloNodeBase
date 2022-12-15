

const Controller = require('egg').Controller;


class UserController extends Controller {

  // 登录
  async login() {
    const { ctx, service } = this;
    const { code } = ctx.request.body;
    const res = await service.user.login(code);
    ctx.body = res;
    ctx.status = 200;
  }
  // 注册
  async register() {
    const { ctx, service } = this;
    const { rawData, signature, encryptedData, iv, userInfo } = ctx.request.body;
    const res = await service.user.register(rawData, signature, encryptedData, iv, userInfo);
    ctx.body = res;
    ctx.status = 200;
  }

  async checkToken() {
    const { ctx, service } = this;
    const res = await service.user.checkToken();
    ctx.body = res;
    ctx.status = 200;
  }

}
module.exports = UserController;
