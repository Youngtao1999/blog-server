module.exports = app => {
  const { router, controller } = app;
  router.get('/front/getArticleList', controller.front.home.getArticleList);  // 获取文章列表
  router.get('/front/getArticleById/:id', controller.front.home.getArticleById);  // 根据id获取文章
  router.get('/front/getTypeInfo', controller.front.home.getTypeInfo);  // 获取类型信息
  router.get('/front/getLogoAvatar', controller.front.home.getLogoAvatar);  // 获取头部和头像信息
  router.get('/front/getListById', controller.front.home.getListById);  // 根据类型id获取文章列表
  router.post('/front/addComment', controller.front.home.addComment); // 添加评论
  router.post('/front/addReply', controller.front.home.addReply); // 添加回复
  router.get('/front/getCommentsById', controller.front.home.getCommentsById);  // 通过文章id获取评论
  router.post('/front/addCommentLikes', controller.front.home.addCommentLikes);  // 评论点赞
  router.post('/front/addReplyLikes', controller.front.home.addReplyLikes);  // 回复点赞
  router.post('/front/addViewCount', controller.front.home.addViewCount);  // 浏览量
}