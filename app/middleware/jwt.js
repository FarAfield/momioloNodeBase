
const BaseResponse = require('../core/base_response');
const BaseSystemConstant = require('../core/base_system_constant');
const BaseSystemEnum = require('../core/base_response_enum');
module.exports = () => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.authorization;
    if (token) {
      try {
        // 解码token
        const decode = ctx.app.jwt.verify(token, BaseSystemConstant.TOKEN_SECRET);
        await next();
        console.log(decode);
      } catch (error) {
        ctx.status = 401;
        ctx.body = BaseResponse.error(BaseSystemEnum.TOKEN_INVALID_ERROR);
        return;
      }
    } else {
      ctx.status = 401;
      ctx.body = BaseResponse.error(BaseSystemEnum.TOKEN_INVALID_ERROR);
      return;
    }
  };
};
