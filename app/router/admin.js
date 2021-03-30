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
}