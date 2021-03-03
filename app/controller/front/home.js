'use strict';
// 前台部分
const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 首页接口
  async getArticleList() {
    const { ctx, app } = this;
    let sql = 'SELECT article.id as id,' +
              'article.title as title,' +
              'article.introduce as introduce,' +
              "article.addDate as addDate," +
              'article.view_count as view_count,' +
              'type.typeName as typeName ' +
              'FROM article LEFT JOIN type ON article.type_id = type.id';
    
    const res = await app.mysql.query(sql);
    ctx.body = { data: res };
  }
  
  // 详情页接口
  async getArticleById() {
    const { ctx, app } = this;
    let id = ctx.params.id;
    let sql = 'SELECT article.id as id,'+
        'article.title as title,'+
        'article.introduce as introduce,'+
        'article.article_content as article_content,'+
        "article.addDate as addDate,"+
        'article.view_count as view_count ,'+
        'type.typeName as typeName ,'+
        'type.id as typeId '+
        'FROM article LEFT JOIN type ON article.type_id = type.Id '+
        'WHERE article.id='+id
    const res = await app.mysql.query(sql);
    ctx.body = { data: res };
  }

  // 得到类别名称和编号
  async getTypeInfo() {
    const { ctx, app } = this;
    const res = await app.mysql.select("type");
    ctx.body = { data: res };
  }

  // 根据类别id获取文章列表
  async getListById() {
    const { ctx, app } = this;
    let id = ctx.params.id;
    let sql = 'SELECT article.id as id,' +
              'article.title as title,' +
              'article.introduce as introduce,' +
              "article.addDate as addDate," +
              'article.view_count as view_count,' +
              'type.typeName as typeName ' +
              'FROM article LEFT JOIN type ON article.type_id = type.id ' +
              'WHERE type.id=' + id
    const res = await app.mysql.query(sql);
    ctx.body = { data: res };
  }

}

module.exports = HomeController;
