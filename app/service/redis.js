const Service = require('egg').Service;
const BaseSystemConstant = require('../core/base_system_constant');
class RedisService extends Service {
  // 设置
  async set(key, value, seconds) {
    const { redis } = this.app;
    await redis.set(key, JSON.stringify(value), 'EX', seconds || BaseSystemConstant.REDIS_EXPIRE_TIME);
    return;
  }
  // 获取
  async get(key) {
    const { redis } = this.app;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  // 清空redis
  async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
}
module.exports = RedisService;
