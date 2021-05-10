module.exports = (app) => {
  const { router, controller } = app;
  const jwtToken = app.middleware.jwtToken(app.config.jwt);
  // 登录路由
  router.post('/admin/login', controller.admin.main.login);
  // 获取账户信息
  router.get('/admin/getLogoAvatar', jwtToken, controller.admin.main.getLogoAvatar);
  // 获取类型信息
  router.get('/admin/getTypeInfo', jwtToken, controller.admin.main.getTypeInfo);
  // 添加文章
  router.post('/admin/addArticle', jwtToken, controller.admin.main.addArticle);
  // 更新文章
  router.post('/admin/updateArticle', jwtToken, controller.admin.main.updateArticle);
  // 文章列表
  router.get('/admin/getArticleList', jwtToken, controller.admin.main.getArticleList);
  // 删除文章
  router.get('/admin/delArticle', jwtToken, controller.admin.main.delArticle);
  // 根据id查询文章
  router.get('/admin/getArticleById', jwtToken, controller.admin.main.getArticleById);
  // 添加类型
  router.post('/admin/addType', jwtToken, controller.admin.main.addType);
  // 添加类型
  router.get('/admin/delType', jwtToken, controller.admin.main.delType);
  // 更新类型
  router.post('/admin/updateType', jwtToken, controller.admin.main.updateType);
  // 保存头像/封面
  router.post('/admin/saveAvatar', controller.admin.main.saveAvatar);
  // 更新个人信息
  router.post('/admin/updateInfo', jwtToken, controller.admin.main.updateInfo);
  // 获取评论信息
  router.get('/admin/getCommentsList', jwtToken, controller.admin.main.getCommentsList);
  // 更改评论状态
  router.post('/admin/changeCommentState', jwtToken, controller.admin.main.changeCommentState);
  // 更改回复状态
  router.post('/admin/changeReplyState', jwtToken, controller.admin.main.changeReplyState);
  // 删除评论
  router.get('/admin/delComment', jwtToken, controller.admin.main.delComment);
  // 删除回复
  router.get('/admin/delReply', jwtToken, controller.admin.main.delReply);
}