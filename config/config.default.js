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
  // mysql 数据库插件
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'blog',    
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.jwt = {  //jwt配置项
    secret: "123456"
  }

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  };
  // cors 跨域插件
  config.cors = {
    origin: 'http://localhost:3000',
    credentials: true,  // 允许cookie跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  }

  return {
    ...config,
    ...userConfig,
  };
};
