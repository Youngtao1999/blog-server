/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1614590491937_3309';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // mysql 数据库配置
  config.mysql = {
    client: {
      host: 'localhost',  // host
      port: '3306', // 端口号
      user: 'root', // 用户名
      password: '123456', // 密码
      database: 'blog', // 数据库名
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {  //jwt配置项
    secret: "123456"
  };

  config.uploadDir = 'app/public/uploadImg';

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  };
  // cors 跨域插件
  config.cors = {
    origin: '*',
    // credentials: true,  // 允许cookie跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  }

  return {
    ...config,
    ...userConfig,
  };
};
