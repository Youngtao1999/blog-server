module.exports = (option) => {
  return async function jwtToken(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode = "";
    if(token) {
      try {
        decode = ctx.app.jwt.verify(token, option.secret);
        console.log('decode======>',decode);
        await next();
      } catch(err) {
        ctx.status = 401;
        ctx.body = {
          message: err.message,
          success: false
        }
        return;
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: "用户未登录",
        success: false
      }
      return;
    }
  }
}