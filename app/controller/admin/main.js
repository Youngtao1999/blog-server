'use strict'

const Controller = require("egg").Controller;

class MainController extends Controller {
  // 登录接口
  async login() {
    const {ctx, app} = this;
    let userName = ctx.request.body.userName;
    let password = ctx.request.body.password;
    const sql = `SELECT userName FROM admin_user WHERE userName = '${userName}' AND password = '${password}'`
    const res = await app.mysql.query(sql);
    if(res.length > 0) {
      // 设置token
      const token = app.jwt.sign({
        'userName': userName,
        'password': password,
      }, app.config.jwt.secret);
      console.log("token", token)
      // ctx.set({'authorization':token})//设置headers

      ctx.body = {
        success: true,
        token: token,
      };
    }else {
      ctx.body = { 
        success: false
      }
    }
  }
  // 获取类型信息
  async getTypeInfo() {
    const type = await this.app.mysql.select("type");
    this.ctx.body = {
      success: true,
      data: type
    }
  }

}

module.exports = MainController;