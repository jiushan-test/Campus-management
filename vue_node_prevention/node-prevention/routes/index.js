const express = require('express')
const boom = require('boom')
const Result = require('../dao/Result')
const { jwtAuth } = require('../utils/jwtUtils')

const usersRouter = require('./user')
const adminRouter = require('./admin')
const uploadRouter = require('./upload')
const studentRouter = require('./student')

// 注册路由
const router = express.Router()

// 在路由之前使用token验证中间件，每次网络请求 会先验证token是否失效
// token失效会传递错误给下面的错误处理函数
router.use(jwtAuth)


/* GET home page. */
// 监听/路径的get请求
router.get('/', function(req, res) {
  // throw new Error('error')
  res.render('index', { title: 'Express' })
});

// 通过 usersRouter 来处理 /users 路由，对路由处理进行解耦
router.use('/user', usersRouter)
router.use('/admin', adminRouter)
router.use('/upload', uploadRouter)
router.use('/student', studentRouter)

/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
//  */
router.use((err, req, res, next) => {
  console.log(err)
  // token 失效的错误提示
  if (err.name && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err
    new Result(null, 'Token验证失败', {
      error: status,
      errMsg: message
    }).jwtError(res.status(status)) // 动态改变返回的状态码
  } else {
    console.log(err)
    // message就是自己写的
    const msg = (err && err.message) || '系统错误'
    const statusCode = (err.output && err.output.statusCode) || 500
    const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
  }
})

module.exports = router
