module.exports = (app) => {
  const { router, controller } = app;
  const jwtToken = app.middleware.jwtToken(app.config.jwt);
  // 登录路由
  router.post('/admin/login', controller.admin.main.login);
  // 获取类型信息路由
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
}