module.exports = app => {
  const { router, controller } = app;
  router.get('/front/index', controller.front.home.index);
}