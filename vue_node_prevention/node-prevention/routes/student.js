var express = require('express')
var router = express.Router()
const student = require('../dao/student_dao')

router.get('/', function(req, res) {
  res.send("students进入根目录")
})
/**
 * 我的通知分页获取数据
 */
router.get('/getMyNotices', function(req, res, next) {
  student.getMyNotices(req, res, next)
})
/**
 * 获取的我通知已读列表(供已读未读状态渲染)
 */
router.get('/getNoticeRead', function(req, res, next) {
  student.getNoticeRead(req, res, next)
})
/**
 * 已读转未读
 */
router.get('/goUnread', function(req, res, next) {
  student.goUnread(req, res, next)
})
/**
 * 未读转已读
 */
router.get('/goRead', function(req, res, next) {
  student.goRead(req, res, next)
})
/**
 * ******************************填报表部分*********************************/
/**
 *  健康填报表提交
 */
router.post('/submitHealthList', function(req, res, next) {
  student.submitHealthList(req, res, next)
})

/**
 * 分页获取当天填报表与总数量
 */
router.get('/gethealthNowDayPage', function(req, res, next) {
  student.gethealthNowDayPage(req, res, next)
})
/**
 * 获取当天某用户报表
 */
router.get('/getMyHealthListToday', function(req, res, next) {
  student.getMyHealthListToday(req, res, next)
})
/**
 * 获取当天所有填报表
 */
router.get('/gethealthNowDay', function(req, res, next) {
  student.gethealthNowDay(req, res, next)
})
/**
 * 获取当月所有填报表
 */
router.get('/gethealthNowMonth', function(req, res, next) {
  student.gethealthNowMonth(req, res, next)
})
/**
 * 获取所有填报表
 */
router.get('/getAllHealth', function(req, res, next) {
  student.getAllHealth(req, res, next)
})
/**
 * 请假条提交
 */
router.post('/submitApplication', function(req, res, next) {
  student.submitApplication(req, res, next)
})
// 分页获取用户所有请假条
router.get('/getMyApplication', function(req, res, next) {
  student.getMyApplication(req, res, next)
})







module.exports = router;