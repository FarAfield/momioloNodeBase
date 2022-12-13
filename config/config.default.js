
module.exports = appInfo => {

  const config = exports = {};

  // 签名的 cookie 密钥
  config.keys = appInfo.name + '_1670833810714_7653';

  // 中间件
  config.middleware = [];

  // mysql配置信息
  const mysql = {
    client: {
      host: '119.45.119.55',
      port: '3309',
      user: 'root',
      password: '123456',
      database: 'momiolo',
    },
    app: true,
    agent: false,
  };
  config.mysql = mysql;

  // redis配置信息
  const redis = {
    client: {
      host: '119.45.119.55',
      port: 6379,
      password: 'zxcvbnm',
      db: 0,
    },
  };
  config.redis = redis;

  // jwt配置信息
  const jwt = {
    // secret: '',  秘钥
    enable: true, // 默认是关闭，如果开启，这会对所有请求进行自动校验；限定请求，请设置match做路径匹配
    match: /^\/api/, // 匹配的请求，会走jwt校验，否则忽略；例如登录接口需要被忽略
    sign: {
      expiresIn: 1000,
    },
  };
  config.jwt = jwt;

  // 自定义项目配置信息
  const userConfig = {
    myAppName: 'momiolo',
  };

  return {
    ...config,
    ...userConfig,
  };
};
