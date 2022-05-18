var express = require('express');
var router = express.Router();
const admin = require('../dao/admin_dao')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('admin进入路由根目录');
})
// 根据选择类型获取数据
router.get('/getUsersByTypeAndChar', function(req, res, next) {
  admin.getUsersByTypeAndChar(req, res, next)
})
/**
 * 发布公告
 */
router.post('/announce', function(req, res, next) {
  admin.announce(req, res, next)
})
/**
 * 分页获取所有通知与数量
 */
router.get('/getAllNotices', function(req, res, next) {
  admin.getAllNotices(req, res, next)
})
// 获取公告详情
router.get("/getNoticeDetail", function(req, res, next) {
  admin.getNoticeDetail(req, res, next)
})
// 删除公告
router.get("/delNotice", function(req, res, next) {
  admin.delNotice(req, res, next)
})
/**
 * 获取该老师所属班级的全部请假单与数量(分页查询)
 */
router.get('/getApplication', function(req, res, next) {
  admin.getApplication(req, res, next)
})
/**
 *  获取该用户请假审批与数量(分页)
 */
// router.get('/getuserLeave', function(req, res, next) {
//   admin.getuserLeave(req, res, next)
// })
/**
 *  当前请假单审批(修改审批状态)
 */
router.get('/upLeaveState', function(req, res, next) {
  admin.upLeaveState(req, res, next)
})

// 获取老师所在班级的学生今日健康表填报情况
router.get('/getHealthByClass', function(req, res, next) {
  admin.getHealthByClass(req,res,next)
})
// 获取该班级学生数量
router.get('/getStudentNum', function(req, res, next) {
  admin.getStudentNum(req, res, next)
})
/**
 * ************************增值功能:班级添加******************************
 */
router.post("/addClass", function(req, res, next) {
  admin.addClass(req, res, next)
})
router.get("/getClasses", function(req, res, next) {
  admin.getClasses(req, res, next)
})

router.get("/getClassesByPage", function(req, res, next) {
  admin.getClassesByPage(req, res, next)
})

router.get("/searchClass", function(req, res, next) {
  admin.searchClass(req, res, next)
})

router.get("/removeClass", function(req, res, next) {
  admin.removeClass(req, res, next)
})

module.exports = router
