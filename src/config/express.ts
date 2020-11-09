export default {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  version: '1.0.0',
  // helper函数，判断当前是不是生产环境
  isProduction() {
    return this.get('express.environment') === 'production';
  },
};
