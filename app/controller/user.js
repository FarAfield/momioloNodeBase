

const Controller = require('egg').Controller;


class UserController extends Controller {
  // 注册
  async register() {
    const { ctx, service } = this;
    const res = await service.user.register();
    ctx.body = res;
    ctx.status = 200;
  }

  // 登录
  async login() {
    const { ctx, service } = this;
    const res = await service.user.login();
    ctx.body = res;
    ctx.status = 200;
  }

}
module.exports = UserController;
