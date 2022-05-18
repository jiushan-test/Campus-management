// 安全拦截器
const jwt = require("jsonwebtoken")
const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

// /**
//  * 验证权限
//  * @param token
//  * @param secretkey 秘钥
//  * @param success
//  * @param error
//  */
// function verify(token, secretkey, success, error) {
//   jwt.verify(token, secretkey, function(err, decode) {
//     if (err) {
//       if (error) {
//         error(err)
//       }
//     } else {
//       if (success) {
//         success(decode)
//       }
//     }
//   })
// }

/**
 * 生成token
 * @param load 载荷 json对象 存储存在
 * @param secretkey 秘钥
 * @param expiresIn 过期时间 秒
 * @returns {number | PromiseLike<ArrayBuffer>}
 */
function sign(load, secretkey, expiresIn) {
  var token = jwt.sign(load, secretkey, { expiresIn: expiresIn })
  return token
}

// token验证中间件 每次前端发送网络请求 都会先验证token是否过期 过期的话传递给错误处理中间件返回给前端
const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问
}).unless({
  // 不需要验证的接口
  path: [
    '/',
    '/user/login',
  ]
})

// 解析token获取用户数据
function decoded(req) {
  // 请求头中获取token
  const authorization = req.get('Authorization')
  let token = ''
  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '') // 去掉'Bearer'
  } else {
    token = authorization
  }
  return jwt.verify(token, PRIVATE_KEY) // 使用私钥解析token
}


// /**异步转同步
//  * 这个再app.js路由调用中已经转换过一次,所以不用重复转换
//  * @param token
//  * @param secretkey
//  * @returns {Promise<any>}
//  */
// function verifysync(token, secretkey) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, secretkey, function(err, decode) {
//       if (err) {
//         console.log(err.message)
//         resolve({ err: 'error', msg: '会话已过期' })
//       } else {
//         console.log("解密成功")
//         resolve(decode)
//       }
//     })
//   })
// }

// module.exports = { verify, sign, jwtAuth, decoded, verifysync }
module.exports = { sign, jwtAuth, decoded }
