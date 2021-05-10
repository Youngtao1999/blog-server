'use strict'

const Controller = require("egg").Controller;
const fs = require('fs');
const pump = require('pump');

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
  // 获取头部和头像信息
  async getLogoAvatar() {
    const { ctx, app } = this;
    const sql = 'SELECT logo, slogan, avatar, introduce, github, qq, wechat, notice FROM admin_user';

    const res = await app.mysql.query(sql);
    ctx.body = { data: res };
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
    let {type_id, title, article_content, introduce, addDate, view_count, image} = temArticle;
    article_content = enstr(article_content);
    const sql = `INSERT INTO article
                 (type_id, title, article_content, introduce, addDate, view_count, image)
                 VALUES ("${type_id}", "${title}", "${article_content}", "${introduce}", "${addDate}", "${view_count}", "${image}" )`
    const result = await app.mysql.query(sql);

    // 使用插件
    // const result = await app.mysql.insert("article", temArticle);
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

    let {type_id, title, article_content, introduce, addDate, id, image} = temArticle;
    article_content = enstr(article_content)
    const sql = `UPDATE article SET 
                type_id="${type_id}", 
                title="${title}", 
                article_content="${article_content}", 
                introduce="${introduce}", 
                image="${image}", 
                addDate="${addDate}" 
                where id="${id}"`
    const result = await app.mysql.query(sql);
    
    // 使用插件
    // const result = await app.mysql.update("article", temArticle);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }
  // 获取文章列表
  async getArticleList() {
    const {app, ctx} = this;
    let { title } = ctx.request.query;
    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                "DATE_FORMAT(article.addDate,'%Y-%m-%d') as addDate,"+
                // "article.addDate as addDate," +
                'article.view_count as view_count,' +
                "article.image as image,"+
                'type.typeName as typeName ' +
                'FROM article LEFT JOIN type ON article.type_id = type.id ' +
                'WHERE title like "%'+ title +'%"';

    const result = await app.mysql.query(sql);
    result.sort((a, b) => b.id - a.id); // 根据id排序
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
                'article.image as image,'+
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
  // 添加类型
  async addType() {
    const { ctx, app } = this;
    let type = ctx.request.body;

    let {id, typeName, icon} = type;
    icon = enstr(icon);
    const sql = `INSERT INTO type
                 (id, typeName, icon)
                 VALUES ("${id}", "${typeName}", "${icon}")`
    const result = await app.mysql.query(sql);

    // 使用插件
    // const result = await app.mysql.insert("type", type);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }
  // 删除类型
  async delType() {
    const {app, ctx} = this;
    const id = ctx.query.id;
    // 使用插件
    // const result = await app.mysql.delete("article", {"id": id});

    const sql = `DELETE FROM type where id = '${id}'`;
    const result = await app.mysql.query(sql);
    ctx.body = {
      data: result,
      success: true
    }
  }
  // 更新类型
  async updateType() {
    const {app, ctx} = this;
    const type = ctx.request.body;

    let {id, typeName, icon} = type;
    const sql = `UPDATE type SET 
                id="${id}", 
                typeName="${typeName}", 
                icon="${icon}" 
                where id="${id}"`
    const result = await app.mysql.query(sql);
    
    // 使用插件
    // const result = await app.mysql.update("article", temArticle);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }

  // 保存头像/封面
  async saveAvatar() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if(!stream.filename){
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字
      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
  
      await pump(stream, writeStream);
  
      files = Object.assign(files, {
        [fieldname]: dir.saveDir
      });
    }
  
    if(Object.keys(files).length > 0){
      ctx.body = {
        code: 200,
        message: '图片上传成功',
        data: files
      }
    }else{
      ctx.body = {
        code: 500,
        message: '图片上传失败',
        data: {}
      }
    }
  }

  // 更新基本信息
  async updateInfo() {
    const {app, ctx} = this;
    const info = ctx.request.body;

    let {logo, slogan, avatar, introduce, github, qq, wechat, notice} = info;
    const sql = `UPDATE admin_user SET 
                logo="${logo}", 
                slogan="${slogan}", 
                avatar="${avatar}", 
                introduce="${introduce}", 
                github="${github}", 
                qq="${qq}", 
                wechat="${wechat}", 
                notice="${notice}"`
    const result = await app.mysql.query(sql);
    
    // 使用插件
    // const result = await app.mysql.update("article", temArticle);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }

  // 获取评论列表
  async getCommentsList() {
    const {app, ctx} = this;

    const comment_sql = 'SELECT comment.comment_content as comment_content,' +
                'comment.id as id,' +
                'comment.comment_userName as comment_userName,' +
                'comment.article_id as article_id,' +
                'comment.comment_likes as comment_likes,'+
                'comment.comment_state as comment_state,'+
                "DATE_FORMAT(comment.comment_date,'%Y-%m-%d %H:%i:%S') as comment_date "+
                'FROM comment';
    const reply_sql = 'SELECT reply.reply_content as reply_content,' +
                'reply.id as id,' +
                'reply.comment_id as comment_id,' +
                'reply.reply_userName as reply_userName,' +
                'reply.reply_likes as reply_likes,'+
                'reply.reply_state as reply_state,'+
                'reply.from_name as from_name,'+
                "DATE_FORMAT(reply.reply_date,'%Y-%m-%d %H:%i:%S') as reply_date "+
                'FROM reply';
    const article_sql = 'SELECT title as title,' +
                'id as id FROM article'
    const comments = await app.mysql.query(comment_sql);
    const reply = await app.mysql.query(reply_sql);
    const article = await app.mysql.query(article_sql);
    // 根据id排序
    comments.sort((a, b) => b.id - a.id);
    reply.sort((a, b) => a.id - b.id);
    // 将回复放入对应的评论
    comments.forEach(citem => {
      citem.reply = [];
      reply.forEach(ritem => {
        if(citem.id === ritem.comment_id) {
          citem.reply.push(ritem);
        }
      })
      article.forEach(aitem => {
        if(citem.article_id === aitem.id) {
          citem.article_title = aitem.title;
        }
      })
    })
    ctx.body = {
      data: comments,
      success: true,
      // reply,
      // article
    }
  }

  // 更改评论状态
  async changeCommentState() {
    const {app, ctx} = this;
    const data = ctx.request.body;

    let {id, state, date} = data;

    const sql = `UPDATE comment SET 
                comment_state="${state}", comment_date="${date}"
                where id="${id}"`
    const result = await app.mysql.query(sql);
    const success = result.affectedRows === 1;
    ctx.body = {
      success
    }
  }
  // 更改回复状态
  async changeReplyState() {
    const {app, ctx} = this;
    const data = ctx.request.body;

    let {id, state, date} = data;

    const sql = `UPDATE reply SET 
                reply_state="${state}", reply_date="${date}"
                where id="${id}"`
    const result = await app.mysql.query(sql);
    const success = result.affectedRows === 1;
    ctx.body = {
      success
    }
  }
  // 删除评论
  async delComment() {
    const {app, ctx} = this;
    const id = ctx.query.id;

    const reply_sql = `DELETE FROM reply where comment_id = '${id}'`;
    const comment_sql = `DELETE FROM comment where id = '${id}'`;
    const reply = await app.mysql.query(reply_sql);
    const comment = await app.mysql.query(comment_sql);
    ctx.body = {
      success: true
    }
  }
  // 删除回复
  async delReply() {
    const {app, ctx} = this;
    const id = ctx.query.id;

    const reply_sql = `DELETE FROM reply where id = '${id}'`;
    await app.mysql.query(reply_sql);
    ctx.body = {
      success: true
    }
  }

}

// 字符串转义方法
function enstr(str) {
  let newstr = str.replace(/\"/g,"\'");
  return newstr;
}

module.exports = MainController;