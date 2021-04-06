'use strict'

const Controller = require("egg").Controller;

class MainController extends Controller {
  // 登录接口
  async login() {
    const {ctx, app} = this;
    let userName = ctx.request.body.userName;
    let password = ctx.request.body.password;
    const sql = `SELECT userName FROM admin_user
                 WHERE userName = '${userName}'
                 AND password = '${password}'`
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
  // 添加文章
  async addArticle() {
    const { ctx, app } = this;
    let temArticle = ctx.request.body;
    // 使用插件
    // const result = await app.mysql.insert("article", temArticle);
    const {type_id, title, article_content, introduce, addDate, view_count} = temArticle;

    const sql = `INSERT INTO article
                 (type_id, title, article_content, introduce, addDate, view_count)
                 VALUES ("${type_id}", "${title}", "${article_content}", "${introduce}", "${addDate}", "${view_count}" )`
    
    
    const result = await app.mysql.query(sql);
    const success = result.affectedRows === 1;
    const insertId = result.insertId;

    ctx.body = {
      success,
      insertId,
    }
  }
  // 修改文章
  async updateArticle() {
    const {app, ctx} = this;
    const temArticle = ctx.request.body;
    // 使用插件
    // const result = await app.mysql.update("article", temArticle);
    const {type_id, title, article_content, introduce, addDate, id} = temArticle;

    const sql = `UPDATE article SET 
                type_id="${type_id}", 
                title="${title}", 
                article_content="${article_content}", 
                introduce="${introduce}", 
                addDate="${addDate}" 
                where id="${id}"`

    const result = await app.mysql.query(sql);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }
  // 获取文章列表
  async getArticleList() {
    const {app, ctx} = this;
    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                "DATE_FORMAT(article.addDate,'%Y-%m-%d') as addDate,"+
                // "article.addDate as addDate," +
                'article.view_count as view_count,' +
                'type.typeName as typeName ' +
                'FROM article LEFT JOIN type ON article.type_id = type.id';

    const result = await app.mysql.query(sql);
    ctx.body = {
      list: result
    }
  }
  // 删除文章
  async delArticle() {
    const {app, ctx} = this;
    const id = ctx.query.id;
    // 使用插件
    // const result = await app.mysql.delete("article", {"id": id});

    const sql = `DELETE FROM article where id = '${id}'`;
    const result = await app.mysql.query(sql);
    ctx.body = {
      data: result,
      success: true
    }
  }
  // 根据id获得文章内容
  async getArticleById() {
    const {app, ctx} = this;
    const id = ctx.query.id;

    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                'article.article_content as article_content,'+
                "DATE_FORMAT(article.addDate,'%Y-%m-%d') as addDate,"+
                // "article.addDate as addDate," +
                'article.view_count as view_count,' +
                'type.typeName as typeName, ' +
                'type.id as typeId ' +
                'FROM article LEFT JOIN type ON article.type_id = type.id ' +
                'WHERE article.id = '+id;

    const result = await app.mysql.query(sql);
    ctx.body = {
      data: result,
      success: true
    }
  }

}

module.exports = MainController;