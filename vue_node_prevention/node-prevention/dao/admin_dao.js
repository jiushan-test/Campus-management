const jwtUtil = require('../utils/jwtUtils')
const Result = require('./Result')
const boom = require('boom')
module.exports = class admin_dao extends require('../model/admin_mod') {
  /**
   * 根据用户类型与查询字段模糊查询
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async getUsersByTypeAndChar(req, res, next) {
    try {
      const { type, inputText, charType, pageSize, currPage } = req.query
      if (!inputText) {
        new Result('请输入要查找的关键字').fail(res)
      } else if (!charType) {
        new Result('请选择搜索类型').fail(res)
      } else {
        const usersData = await this.getUsersByTypeAndCharMod(type, inputText, charType, currPage, pageSize)
        const usersTotal = await this.getUsersByTypeAndCharTotal(type, inputText, charType)
        if (usersTotal[0].count === 0) {
          new Result('搜索的内容不存在').fail(res)
        } else {
          new Result({ usersData, usersTotal: usersTotal[0].count }, '搜索成功').success(res)
        }
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 发布公告
   * @param req
   * @param resp
   * @returns {Promise<void>}
   */
  static async announce(req, res, next) {
    try {
      const { title, classes, pageSize, currPage } = req.body
      const msg = await this.announceMod(title, classes)
      const noticeData = await this.getAllNoticesMod(pageSize, currPage)
      const noticeTotal = await this.getAllNoticesTotal()
      new Result({ noticeData, noticeTotal: noticeTotal[0].count }, msg).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 分页获取所有通知与数量
   * @param req
   * @param resp
   * @returns {Promise<void>}
   */
  static async getAllNotices(req, res, next) {
    try {
      const { pageSize, currPage } = req.query
      const noticeData = await this.getAllNoticesMod(pageSize, currPage)
      const noticeTotal = await this.getAllNoticesTotal()
      new Result({ noticeData, noticeTotal: noticeTotal[0].count }, '分页获取公告成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  // 获取公告详情
  static async getNoticeDetail(req, res, next) {
    try {
      const n_id = req.query.n_id
      let users = null
      //1. 获取当前公告已读人的人数
      let readNum = await this.getReadNum(n_id)
      readNum = readNum[0].count
      //2. 获取当前公告已读的人的id对象数组,再通过id去查询用户数据
      let readIdArr = await this.getReadId(n_id)
      if (readIdArr.length !== 0) {
        users = await this.getReadByidArr(readIdArr)
      }
      //3. 获取当前通知的详情信息
      let detail = await this.getNoticeDetailMod(n_id)
      //4. 获取当前公告通知的总人数
      let total = await this.getNoticeDetailTotal(detail[0].class)
      total = total[0].count
      //5. 获取已读人的阅读时间与u_id
      let idAndTime = await this.getReadTime(n_id)
      //将阅读时间附加到users中
      for (let i = 0; i < idAndTime.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (users[j].id == idAndTime[i].u_id)
            users[j].readtime = idAndTime[i].readtime
        }
      }
      new Result({ detail, readNum, total, users }, '获取公告详情成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 当前公告删除功能(同时清空该公告的被阅读记录)
   * @param req
   * @param resp
   * @returns {Promise<void>}
   */
  static async delNotice(req, res, next) {
    try {
      const { n_id, pageSize, currPage } = req.query
      const noticeMsg = await this.delNoticeMod(n_id)
      const readMsg = await this.delReadMod(n_id)
      const noticeData = await this.getAllNoticesMod(pageSize, currPage)
      const noticeTotal = await this.getAllNoticesTotal()
      new Result({ noticeData, noticeTotal: noticeTotal[0].count }, { noticeMsg, readMsg }).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 取该老师所属班级的全部请假单与数量(分页查询)
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async getApplication(req, res, next) {
    try {
      const { currPage, pageSize } = req.query
      const decoded = jwtUtil.decoded(req)
      if (decoded && decoded.classes) {
        const classes = decoded.classes
        console.log(decoded)
        let classArr = classes.split(';')
        const application = await this.getApplicationMod(classArr, currPage, pageSize)
        const total = await this.getApplicationTotal(classArr)
        if (total[0].count === 0) {
          new Result('您的学生没有请假记录').fail(res)
        } else {
          new Result({ application, total: total[0].count }, '获取请假记录成功').success(res)
        }
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  // /**
  //  * 获取该用户请假审批与数量(分页
  //  * @param req
  //  * @param resp
  //  * @returns {Promise<void>}
  //  */
  // static async getuserLeave(req, resp) {
  //   let verify = await jwtUtil.verifysync(req.query.token, globalKey)
  //   let u_id = verify.id
  //   let data = await this.getuserLeaveMod(u_id, req.query.currPage, req.query.pageNum)
  //   let total = await this.getuserLeaveTotal(u_id)
  //   resp.send({ data, total: total[0].count })
  // }

  /**
   * 当前请假单审批(修改审批状态)
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async upLeaveState(req, res, next) {
    try {
      const { l_id, upState } = req.query
      const msg = await this.upLeaveStateMod(l_id, upState)
      const state = await this.getLeaveStateMod(l_id)
      new Result(state, msg).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
  // 分页获取今日班级填报表情况
  static async getHealthByClass(req, res, next) {
    try {
      const nowDate = this.getNowAndNextDate().nowDate
      const nextDate = this.getNowAndNextDate().nextDate
      const { classes, currPage, pageSize } = req.query
      console.log(nowDate, nextDate, currPage, pageSize, classes)
      const tableData = await this.getHealthByClassMod(nowDate, nextDate, currPage, pageSize, classes)
      const total = await this.getHealthByClassTotal(nowDate, nextDate, classes)
      let msg = ''
      if (total[0].count === 0) {
        msg = `${classes}今日未有人填报`
      } else {
        msg = `${classes}今日已有人填报`
      }
      new Result({ tableData, total: total[0].count }, msg).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  static async getStudentNum(req, res, next) {
    try {
      const { classes } = req.query
      const total = await this.getStudentNumMod(classes)
      new Result({total: total[0].count }, '获取该班级总人数成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * ************************增值功能:班级添加******************************
   */

  static async addClass(req, res, next) {
    try {
      const { classes, searchClass, searchFlag, pageSize, currPage } = req.body
      // console.log(typeof searchClass, typeof searchFlag)
      // console.log(searchClass&&searchFlag)
      // console.log(classes);
      if (!classes) {
        new Result('添加班级不可为空').fail(res)
      } else {
        // 判断添加的班级是否重复
        let classAll = await this.getClassMod()
        let flag = false
        for (let i = 0; i < classAll.length; i++) {
          if (classAll[i].classes == classes) {
            flag = true
          }
        }
        if (flag) {
          new Result('班级已存在').fail(res)
        } else if (searchClass && searchFlag) {
          console.log('执行查找')
          // 是搜索 只要有搜索班级 和按下查找按钮 就是按查找的分页
          const msg = await this.addClassesMod(classes)
          const classData = await this.getClassesSearMod(searchClass, pageSize, currPage)
          const classTotal = await this.getClassesSearTotal(searchClass)
          new Result({ classData, classTotal: classTotal[0].count }, msg).success(res)
        } else {
          // 不是搜索，分页显示所有数据
          console.log('执行所有')
          const msg = await this.addClassesMod(classes)
          const classData = await this.getClassesByPageMod(pageSize, currPage)
          const classTotal = await this.getClassesByPageModTotal()
          new Result({ classData, classTotal: classTotal[0].count }, msg).success(res)
        }
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  // 获取所有班级
  static async getClasses(req, res, next) {
    try {
      let classData = await this.getClassMod()
      new Result({ classData }, '获取所有班级成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
  // 分页获取班级
  static async getClassesByPage(req, res, next) {
    try {
      const { pageSize, currPage } = req.query
      const classData = await this.getClassesByPageMod(pageSize, currPage)
      const classTotal = await this.getClassesByPageModTotal()
      new Result({ classData, classTotal: classTotal[0].count }, '分页获取班级成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  // 班级搜索
  static async searchClass(req, res, next) {
    try {
      // console.log(req.query);
      let { classes, currPage, pageSize } = req.query
      if (!classes) {
        new Result('请输入要查找的班级').fail(res)
      } else {
        let classData = await this.getClassesSearMod(classes, pageSize, currPage)
        let classTotal = await this.getClassesSearTotal(classes)
        if (classTotal[0].count === 0) {
          new Result('班级不存在').fail(res)
        } else {
          new Result({ classData, classTotal: classTotal[0].count }, '班级搜索成功').success(res)
        }
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  // 删除班级
  static async removeClass(req, res, next) {
    try {
      let { c_id, searchClass, searchFlag, pageSize, currPage } = req.query
      // 这里的searchFlag是字符串类型的布尔值 所有一直执行查找  
      // 所有需要转为boolen类型 通过JSON.parse
      // console.log(JSON.parse(searchFlag))
      // console.log(JSON.parse(searchFlag))
      if (searchClass && JSON.parse(searchFlag)) {
        // 只要有搜索班级 和 按下按钮 就是分页查找内容
        // console.log('执行查找')
        const msg = await this.removeClassMod(c_id)
        const classTotal = await this.getClassesSearTotal(searchClass)
        const classData = await this.getClassesSearMod(searchClass, pageSize, currPage)
        new Result({ classData, classTotal: classTotal[0].count }, msg).success(res)
      } else {
        // 否则 就是分页所有班级
        // console.log('执行所有')
        const msg = await this.removeClassMod(c_id)
        const classTotal = await this.getClassesByPageModTotal()
        const classData = await this.getClassesByPageMod(pageSize, currPage)
        new Result({ classData, classTotal: classTotal[0].count }, msg).success(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
}