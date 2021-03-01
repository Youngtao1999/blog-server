'use strict';
// 前台部分
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    
    const res = await app.mysql.get("blog_content", {});
    console.log(res);
    ctx.body = res;
  }
}

module.exports = HomeController;
