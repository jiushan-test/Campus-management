const express = require('express')
const router = express.Router()
const user = require('../dao/user_dao')
const fileUp = require('../utils/fileUtils')
const jwtUtil = require('../utils/jwtUtils')
const boom = require('boom')
const Result = require('../dao/Result')
// 判断是否为图片
String.prototype.IsPicture = function() {
  let strFilter = ".jpeg|.gif|.jpg|.png|.svg|.pic|.bmp|"
  // 存在点
  if (this.indexOf('.') > -1) {
    let p = this.lastIndexOf(".")
    let strPostfix = this.substring(p, this.length) + "|"
    strPostfix = strPostfix.toLowerCase()
    if (strFilter.indexOf(strPostfix) > -1) {
      return true
    }
  }
  return false;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users进入路由根目录');
});
// 登录接口
router.post('/login', function(req, res, next) {
  // 请求主体 密码用户名和用户类型放在body中
  // console.log(req.body)
  // console.log(req.query)
  user.login(req, res, next)
});

// 每次登录携带token接口
router.get('/getUserDataByToken', function(req, res, next) {
  user.getUserDataByToken(req, res, next)
})
// 根据类型获取用户数据接口
router.get('/getUsersByTypePage', function(req, res, next) {
  user.getUsersByTypePage(req, res, next)
})
// 获取核酸检测总数
router.get('/getUserSize', function(req, res, next) {
  user.getUserSize(req, res, next)
})
// 删除用户数据接口
router.get('/removeUserData', function(req, res, next) {
  user.removeUserData(req, res, next)
})
// 编辑用户数据接口
router.post('/editUserData', function(req, res,next) {
  user.editUserData(req, res,next)
})
// 添加excel用户数据
router.post('/setXlsxData', function(req, res,next) {
  user.setXlsxData(req, res,next)
})
/**
 * ******************修改个人信息************************
 */
// 修改密码  这里可以添加一个表单验证 表示密码只能数字或者字母
router.post('/updatePsw', function(req, res, next) {
  user.upPwd(req, res, next)
})
// 修改头像
router.post('/upicon', async function(req, res,next) {
  try {
    // 图片上传到public下的file中
    let head_imgUrl = await fileUp.upload(req)
    req.head_imgUrl = head_imgUrl
    let isPicture = head_imgUrl.IsPicture()
    if (!isPicture) {
      res.send("没有选择图片或者选择的不是图片")
    }
    else {
      user.upUserHead(req, res,next)
    }
  } catch (err) {
    next(boom.badImplementation(err))
  }
})

router.get('/getAvatar', function(req, res, next) {
  user.getAvatar(req, res, next)
})

module.exports = router
