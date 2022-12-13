

const Controller = require('egg').Controller;


class UserController extends Controller {
  // 注册
  async register() {
    const { ctx, service } = this;
    const res = await service.user.register();
    // 设置响应内容和响应状态码
    ctx.body = res;
    ctx.status = 200;
    this.logger.info(res);

  }

}
module.exports = UserController;
