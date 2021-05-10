'use strict';
// 前台部分
const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 首页接口
  async getArticleList() {
    const { ctx, app } = this;
    const { page, size } = ctx.query;
    let sql = 'SELECT article.id as id,' +
              'article.title as title,' +
              'article.introduce as introduce,' +
              "article.addDate as addDate," +
              'article.view_count as view_count,' +
              'image as image,' +
              'type.typeName as typeName ' +
              'FROM article LEFT JOIN type ON article.type_id = type.id '

    const res = await app.mysql.query(sql);
    res.sort((a, b) => b.id-a.id)
    const result = res.slice((page-1)*size, size*page);
    ctx.body = { 
      data: result,
      total: res.length
    };
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

    let listSql = 'SELECT article.id as id,' +
                  'article.title as title,' +
                  'type.typeName as typeName ' +
                  'FROM article LEFT JOIN type ON article.type_id = type.id';
    
    const res = await app.mysql.query(sql);
    const list = await app.mysql.query(listSql);
    list.sort((a, b) => b.id-a.id);
    if(list.length >= 2) {  // 长度大于2
      for(let i=0; i<list.length; i++) {
        if(list[i].id === res[0].id) {
          if(i === 0) { // 如果为第一篇
            res[0].nextTitle = list[1].title;
            res[0].nextId = list[1].id;
            res[0].nextType = list[1].typeName;
          }else if(i === list.length-1){  // 如果为最后一篇
            res[0].lastTitle = list[list.length-2].title;
            res[0].lastId = list[list.length-2].id;
            res[0].lastType = list[list.length-2].typeName;
          }else {
            res[0].lastTitle = list[i-1].title;
            res[0].lastId = list[i-1].id;
            res[0].lastType = list[i-1].typeName;
            res[0].nextTitle = list[i+1].title;
            res[0].nextId = list[i+1].id;
            res[0].nextType = list[i+1].typeName;
          }
        }
      }
    }

    ctx.body = { 
      data: res,
      list
    };
  }

  // 得到类别名称和编号
  async getTypeInfo() {
    const { ctx, app } = this;
    const res = await app.mysql.select("type");
    ctx.body = { data: res };
  }

  // 获取头部和头像信息
  async getLogoAvatar() {
    const { ctx, app } = this;
    const sql = 'SELECT logo, slogan, avatar, introduce, github, qq, wechat, notice FROM admin_user';

    const res = await app.mysql.query(sql);
    ctx.body = { data: res };
  }

  // 根据类别id获取文章列表
  async getListById() {
    const { ctx, app } = this;
    const { id, page, size } = ctx.query;
    // let id = ctx.params.id;
    let sql = 'SELECT article.id as id,' +
              'article.title as title,' +
              'article.introduce as introduce,' +
              "article.addDate as addDate," +
              'article.view_count as view_count,' +
              'image as image,' +
              'type.typeName as typeName ' +
              'FROM article LEFT JOIN type ON article.type_id = type.id ' +
              'WHERE type.id=' + id
    const res = await app.mysql.query(sql);
    res.sort((a, b) => b.id-a.id);
    const result = res.slice((page-1)*size, size*page);
    ctx.body = { 
      data: result,
      total: res.length,
      id,
      page,
      size
    };
  }

  // 添加评论
  async addComment() {
    const { ctx, app } = this;
    let comment = ctx.request.body;
    let { article_id, comment_content, comment_userName, comment_date } = comment;
    comment_content = enstr(comment_content);
    const sql = `INSERT INTO comment
                 (article_id, comment_content, comment_userName, comment_date)
                 VALUES ("${article_id}", "${comment_content}", "${comment_userName}", "${comment_date}" )`
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
  // 添加回复
  async addReply() {
    const { ctx, app } = this;
    let reply = ctx.request.body;
    let { article_id, comment_id, reply_content, reply_userName, reply_date, from_name } = reply;
    reply_content = enstr(reply_content);
    const sql = `INSERT INTO reply
                 (article_id, comment_id, reply_content, reply_userName, reply_date, from_name)
                 VALUES ("${article_id}", "${comment_id}", "${reply_content}", "${reply_userName}", "${reply_date}", "${from_name}" )`
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

  // 根据文章id获取评论
  async getCommentsById() {
    const {app, ctx} = this;
    const id = ctx.query.id;

    const comment_sql = 'SELECT comment.comment_content as comment_content,' +
                'comment.id as id,' +
                'comment.comment_userName as comment_userName,' +
                'comment.comment_likes as comment_likes,'+
                'comment.comment_state as comment_state,'+
                "DATE_FORMAT(comment.comment_date,'%Y-%m-%d %H:%i:%S') as comment_date "+
                'FROM comment WHERE article_id = '+id;

    const reply_sql = 'SELECT reply.reply_content as reply_content,' +
                'reply.id as id,' +
                'reply.comment_id as comment_id,' +
                'reply.reply_userName as reply_userName,' +
                'reply.reply_likes as reply_likes,'+
                'reply.reply_state as reply_state,'+
                'reply.from_name as from_name,'+
                "DATE_FORMAT(reply.reply_date,'%Y-%m-%d %H:%i:%S') as reply_date "+
                'FROM reply WHERE article_id = '+id;

    const comments = await app.mysql.query(comment_sql);
    const reply = await app.mysql.query(reply_sql);
    // 添加评论框隐藏字段
    comments.forEach(item => item.showReply = "none");
    reply.forEach(item => item.showReply = "none");
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
    })
    ctx.body = {
      data: comments,
      reply: reply,
      success: true
    }
  }

  // 根据评论id点赞
  async addCommentLikes() {
    const {app, ctx} = this;
    let comment = ctx.request.body;

    const { id, comment_likes } = comment;
    const sql = `UPDATE comment SET 
                comment_likes="${comment_likes+1} "
                where id="${id}"`
    const result = await app.mysql.query(sql);
    
    const success = result.affectedRows === 1;
    ctx.body = {
      success
    }
  }
  // 根据评论id点赞
  async addReplyLikes() {
    const {app, ctx} = this;
    let reply = ctx.request.body;

    const { id, reply_likes } = reply;
    const sql = `UPDATE reply SET 
                reply_likes="${reply_likes+1} "
                where id="${id}"`
    const result = await app.mysql.query(sql);
    
    const success = result.affectedRows === 1;
    ctx.body = {
      success
    }
  }

  // 根据文章id增加浏览量
  async addViewCount() {
    const {app, ctx} = this;
    const { id, view_count } = ctx.query;

    const sql = `UPDATE article SET 
                view_count="${view_count*1+1} "
                where id="${id}"`
    const result = await app.mysql.query(sql);
    
    // 使用插件
    // const result = await app.mysql.update("article", temArticle);
    const success = result.affectedRows === 1;

    ctx.body = {
      success
    }
  }
}

// 字符串转义方法
function enstr(str) {
  let newstr = str.replace(/\"/g,"\'");
  return newstr;
}

module.exports = HomeController;
