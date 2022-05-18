const jwtUtil = require('../utils/jwtUtils')
const Result = require('./Result')
const boom = require('boom')
module.exports = class student_dao extends require('../model/student_mod') {
  /**
   * 分页获取我的通知与数量
   * @param req
   * @param resp
   * @returns {Promise<void>}
   */
  static async getMyNotices(req, res, next) {
    try {
      const { pageSize, currPage } = req.query
      // 根据token 获取用户数据
      const decoded = jwtUtil.decoded(req)
      console.log(decoded)
      if (decoded && decoded.classes) {
        const u_classes = decoded.classes
        const noticeData = await this.getMyNoticesMod(u_classes, pageSize, currPage)
        const noticeTotal = await this.getMyNoticesTotal(u_classes)
        new Result({ noticeData, noticeTotal: noticeTotal[0].count }, '分页获取我的公告成功').success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 获取的我通知已读列表(供已读未读状态渲染
   * @param req
   * @param resp
   * @returns {Promise<void>}
   */
  static async getNoticeRead(req, res, next) {
    try {
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const u_id = decoded.id
        const readData = await this.getNoticeReadMod(u_id)
        new Result(readData, '获取已读通知成功').success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 已读转未读
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async goUnread(req, res, next) {
    try {
      const { n_id } = req.query
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const u_id = decoded.id
        let msg = await this.goUnreadMod(u_id, n_id)
        new Result(msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 未读转已读
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async goRead(req, res, next) {
    try {
      const { n_id } = req.query
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const u_id = decoded.id
        let msg = await this.goReadMod(u_id, n_id)
        new Result(msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * *************************健康填报表**************************************
   */
  /**
   * 健康填报表提交
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async submitHealthList(req, res, next) {
    // console.log(req.body)
    try {
      const { temperature, hot, fever, gohubei, hubeiren, leave, chat, hesuan, masknum, kill } = req.body
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id && decoded.classes && decoded.username) {
        console.log(decoded);
        const {id, classes,username} = decoded
        const msg = await this.submitHealthListMod(id, classes, username, temperature, hot, gohubei, hubeiren, fever, leave, hesuan, chat, masknum, kill)
        new Result(msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**\
   * 获取当天某用户报表
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async getMyHealthListToday(req, res, next) {
    try {
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const u_id = decoded.id
        const nowDate = this.getNowAndNextDate().nowDate
        const nextDate = this.getNowAndNextDate().nextDate
        // console.log(nowDate, nextDate, u_id)
        const healthData = await this.getMyHealthListTodayMod(u_id, nowDate, nextDate)
        let msg = ''
        if (healthData.length === 0) {
          msg = '当天未填报健康表'
        } else {
          msg = '获取当天健康表数据成功'
        }
        new Result({ healthData }, msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 分页获取当天填报表与总数量
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async gethealthNowDayPage(req, res, next) {
    try {
      const nowDate = this.getNowAndNextDate().nowDate
      console.log(nowDate)
      const nextDate = this.getNowAndNextDate().nextDate
      console.log(nextDate)
      const { currPage, pageSize } = req.query
      const data = await this.gethealthNowDayPageMod(nowDate, nextDate, currPage, pageSize)
      const total = await this.gethealthNowDayPageTotal(nowDate, nextDate)
      new Result({ data, total: total[0].count }).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 获取当天所有填报表
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async gethealthNowDay(req, res, next) {
    try {
      const nowDate = this.getNowAndNextDate().nowDate
      console.log(nowDate)
      const nextDate = this.getNowAndNextDate().nextDate
      console.log(nextDate)
      const data = await this.gethealthNowDayMod(nowDate, nextDate)
      let temSize = 0, highSize = 0
      data.forEach((item, index) => {
        if (item.temperature <= 35 || item.temperature >= 38) {
          temSize++
        }
        if (item.gohubei === '是') {
          highSize++
        }
      })
      // 返回今日填报表情况
      new Result({ total: data.length, temSize, highSize }, '获取当天填报表情况成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
  /**
   * 获取当月所有填报表
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async gethealthNowMonth(req, res, next) {
    try {
      let startMonth = this.getNowAndNextDate().startMonth
      console.log(startMonth)
      let endMonth = this.getNowAndNextDate().endMonth
      console.log(endMonth)
      let data = await this.gethealthNowMonthMod(endMonth, startMonth)
      new Result(data).success(res)
    } catch {
      next(boom.badImplementation(err))
    }
  }
  /**
   * 获取所有填报表
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async getAllHealth(req, res, next) {
    try {
      let data = await this.getAllHealthMod()
      new Result(data).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 学生请假表申请
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async submitApplication(req, res, next) {
    try {
      const { reason, leaveType, starttime, endtime } = req.body
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const { id, username, classes } = decoded
        let msg = await this.submitApplicationMod(id, username, classes, reason, leaveType, starttime, endtime)
        new Result(msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 获取学生请假审批与数量(分页
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async getMyApplication(req, res, next) {
    try {
      const { pageSize, currPage } = req.query
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.id) {
        const u_id = decoded.id
        const applicationData = await this.getMyApplicationMod(u_id, currPage, pageSize)
        const applicationTotal = await this.getMyApplicationTotal(u_id)
        let msg = ''
        if (applicationTotal[0].count === 0) {
          msg = '你还没有请假记录'
        } else {
          msg = '分页获取所有请假记录成功'
        }
        new Result({ applicationData, applicationTotal: applicationTotal[0].count }, msg).success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
}
