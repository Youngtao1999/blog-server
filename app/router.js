'use strict';

/**
 * @param {Egg.Application} app - egg application
 * 前台路由
 */
module.exports = app => {
  require("./router/front")(app);
};
