const BaseSystemConstant = require('../core/base_system_constant');
const crypto = require('crypto');
module.exports = {
  createToken: options => {
    return this.app.jwt.sign(options, BaseSystemConstant.TOKEN_SECRET, { expiresIn: BaseSystemConstant.TOKEN_EXPIRE_TIME });
  },
  // encryptedData敏感数据的加密数据   iv加密算法的初始向量
  decryptData: (appId, sessionKey, encryptedData, iv) => {
    // base64 decode
    sessionKey = Buffer.from(sessionKey, 'base64');
    encryptedData = Buffer.from(encryptedData, 'base64');
    iv = Buffer.from(iv, 'base64');
    let decoded = null;
    try {
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = decipher.update(encryptedData, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      decoded = JSON.parse(decoded);
    } catch (err) {
      throw new Error('Illegal Buffer');
    }
    if (decoded.watermark.appid !== appId) {
      throw new Error('Illegal Buffer');
    }
    return decoded;
  },
};
