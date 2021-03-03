module.exports = app => {
  const { router, controller } = app;
  router.get('/front/getArticleList', controller.front.home.getArticleList);
  router.get('/front/getArticleById/:id', controller.front.home.getArticleById);
  router.get('/front/getTypeInfo', controller.front.home.getTypeInfo);
  router.get('/front/getListById/:id', controller.front.home.getListById);
}