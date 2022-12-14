

const BaseResponseEnum = {
  SUCCESS: [ '0', '成功' ],
  // 系统
  SERVICE_ERROR: [ '10001', '服务器忙，请稍后再试！' ],
  TOKEN_INVALID_ERROR: [ '10002', 'Token校验失败！' ],
  UNAUTHORIZED_ERROR: [ '10003', '抱歉，您无权访问！' ],
  // 数据
  PARAMS_VALID_ERROR: [ '20001', '参数有误，请检查！' ],
  DATA_NOT_EXIST: [ '20002', '数据不存在！' ],
  // 微信
  UNREGISTERED_ERROR: [ '30001', '微信用户未注册！' ],
};

module.exports = BaseResponseEnum;
