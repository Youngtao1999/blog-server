'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   static: {
//     enable: true,
//   }
// };

// mysql插件 
exports.mysql = {
  enable: true,
  package: 'egg-mysql'
}
// cors插件
exports.cors = {
  enable: true,
  package: 'egg-cors'
}
// jwttoken插件
exports.jwt = {
  enable: true,
  package: 'egg-jwt'
}
