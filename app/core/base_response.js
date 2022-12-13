
const BaseResponseEnum = require('./base_response_enum');
class BaseResponse {
  static success(data) {
    return {
      statusCode: BaseResponseEnum.SUCCESS[0],
      statusMessage: BaseResponseEnum.SUCCESS[1],
      data: data || null,
    };
  }
  static error() {
    if (arguments.length === 1) {
      return {
        statusCode: BaseResponseEnum[arguments[0]][0],
        statusMessage: BaseResponseEnum[arguments[0]][1],
        data: null,
      };
    } else if (arguments.length === 2) {
      return {
        statusCode: arguments[0],
        statusMessage: arguments[1],
        data: null,
      };
    }
    return {
      statusCode: BaseResponseEnum.SERVICE_ERROR[0],
      statusMessage: BaseResponseEnum.SERVICE_ERROR[1],
      data: null,
    };
  }
}
module.exports = BaseResponse;
