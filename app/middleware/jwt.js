
const BaseResponse = require('../core/base_response');
const BaseSystemEnum = require('../core/base_response_enum');
module.exports = () => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.authorization;
    if (token) {
      try {
        // 解码token
        const decode = ctx.helper.decodeToken(token);
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
