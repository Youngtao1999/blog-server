module.exports = (app) => {
  const { router, controller } = app;
  const jwtToken = app.middleware.jwtToken(app.config.jwt);
  // 登录路由
  router.post('/admin/login', controller.admin.main.login);
  // 获取类型信息路由
  router.get('/admin/getTypeInfo', jwtToken, controller.admin.main.getTypeInfo);
}