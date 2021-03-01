'use strict';
// 前台部分
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'api 接口';
  }
}

module.exports = HomeController;
