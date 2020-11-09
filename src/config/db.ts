export default {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  charset: process.env.DB_CHARSET,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: 'all', // query, error, schema, warn, info, log, all
  logger: 'simple-console',
  maxQueryExecutionTime: 500, // 单位毫秒
};
