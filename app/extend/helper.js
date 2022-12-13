const BaseSystemConstant = require('../core/base_system_constant');
module.exports = {
  createToken: options => {
    return this.app.jwt.sign(options, BaseSystemConstant.TOKEN_SECRET, { expiresIn: 1800 });
  },
};
