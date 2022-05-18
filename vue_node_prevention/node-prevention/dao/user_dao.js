const jwtUtil = require('../utils/jwtUtils')
const redisUtils = require('../utils/redisUtils')
const boom = require('boom')
const Result = require('./Result')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

module.exports = class users_dao extends require('../model/user_mod') {
  /**
   * 登录
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @constructor
   */
  // static login(req, res,next) {
  //   const { username, password, type } = req.body
  //   this.loginUser(username, password, type).then(user => {
  //     // user对象数组
  //     if (!user || user.length === 0) {
  //       // user查询为空
  //       new Result('用户或者密码输入错误').fail(res)
  //     } else {
  //       new Result({token}, '登录成功').success(res)
  //     }
  //   }).catch(err => {
  //     next(boom.badImplementation(err))
  //   })
  // }

  static async login(req, res, next) {
    try {
      const { username, password, type } = req.body
      // console.log(req.body);
      // 只有reslove 的值才会返回,也就是查询成功才会有user
      let user = await this.loginUser(username, password, type)
      // user对象数组
      if (!user || user.length === 0) {
        // user查询为空,不匹配
        // new Result('用户名或者密码错误').fail(res) 状态码400
        next(boom.badRequest(new Error('用户名或者密码错误')))
      } else {
        // userData对象
        const [userData] = user
        const token = jwtUtil.sign({
          id: userData.id,
          username: userData.username,
          // head: userData.head,
          type: userData.type,
          classes: userData.classes,
          // address: userData.address,
          // createtime: userData.createtime,
          // sex: userData.sex
        }, PRIVATE_KEY, JWT_EXPIRED)
        new Result({ token }, '登录成功').success(res)
      }
    } catch (err) {
      // 查询出错 返回状态码500
      next(boom.badImplementation(err))
    }
  }

  /**
   * 根据token解析获取用户信息
   * @param req
   * @param res
   */

  // 根据token 获取用户信息
  static async getUserDataByToken(req, res, next) {
    try {
      const decoded = jwtUtil.decoded(req)
      // console.log(decoded.id)
      if (decoded && decoded.type) {
        let userData = await this.findUser(decoded.type, decoded.id)
        // userData 对象
        // console.log(userData)
        if (userData) {
          delete userData.password
          if (userData.type === 1) {
            userData.roles = ['admin']
            userData.introduction = '我是学校的管理员'
          } else if (userData.type === 2) {
            userData.roles = ['student']
            userData.introduction = `我是该校一名${userData.classes}专业的学生`
          } else {
            userData.roles = ['teacher']
            userData.introduction = `我是该校一名${userData.classes}专业的教师`
          }
          new Result(userData, '获取用户信息成功').success(res)
        } else {
          new Result('获取用户信息失败').fail(res)
        }
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 根据用户类型进行用户信息获取(分页获取总数量与数据)
   * @param req
   * @param res
   */
  static async getUsersByTypePage(req, res, next) {
    try {
      const { type, pageSize, currPage } = req.query
      // 字符串形式
      // console.log(type)
      // console.log(typeof type)
      // console.log(typeof pageSize)
      // console.log(typeof currPage)
      let usersData = await this.getUsersByTypePageMod(type, pageSize, currPage)
      // 不显示密码
      usersData = usersData.map(value => {
        delete value.password
        return value
      })
      const usersTotal = await this.getUsersByTypePageTotal(type)
      new Result({ usersData, usersTotal: usersTotal[0].count }, '分页获取用户数据成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  static async getUserSize(req, res, next) {
    try {
      const { type } = req.query
      const usersTotal = await this.getUsersByTypePageTotal(type)
      new Result({ usersTotal: usersTotal[0].count }, '获取核酸总数成功').success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 用户删除(同时清空该用户阅读记录
   * @param req
   * @param res
   */
  static async removeUserData(req, res, next) {
    try {
      const { u_id, type, inputText, searchFlag, charType, pageSize, currPage } = req.query
      if (u_id === 0) {
        new Result('不能删除管理员').fail(res)
      } else if (inputText && JSON.parse(searchFlag)) {
        // 分页获取符合搜索关键字的用户数据
        const userMsg = await this.removeUserDataMod(u_id)
        const readMsg = await this.delRead(u_id)
        const usersData = await this.getUsersByTypeAndCharMod(type, inputText, charType, currPage, pageSize)
        const usersTotal = await this.getUsersByTypeAndCharTotal(type, inputText, charType)
        new Result({ usersData, usersTotal: usersTotal[0].count }, { userMsg, readMsg }).success(res)
      } else {
        // 分页获取所有类型的用户数据
        const userMsg = await this.removeUserDataMod(u_id)
        const readMsg = await this.delRead(u_id)
        let usersData = await this.getUsersByTypePageMod(type, pageSize, currPage)
        usersData = usersData.map(value => {
          delete value.password
          return value
        })
        const usersTotal = await this.getUsersByTypePageTotal(type)
        new Result({ usersData, usersTotal: usersTotal[0].count }, { userMsg, readMsg }).success(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 更改用户信息
   * @param req
   * @param resp
   */
  static async editUserData(req, res, next) {
    try {
      const { u_id, username, sex, address, type } = req.body
      if (!username || !address) {
        new Result('姓名或者地址不能为空').fail(res)
      } else {
        let msg = await this.editUserDataMod(u_id, username, sex, address, type)
        new Result(msg).success(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 将redis的xlsx数据写入数据库
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async setXlsxData(req, res, next) {
    try {
      // console.log("点击导入")
      // 获取上传的excel文件 通过上传upload的时候已经写入到redis中，现在直接从这里获取excel数据
      let xlsxData = await redisUtils.get("xlsxData")
      console.log(xlsxData)
      // 获取现有的所有用户数据，判断是否重复
      let AllUsers = await this.getAllUsersData()
      if (xlsxData === 'err') {
        new Result('导入失败，不是标准的文件格式').fail(res)
        return
      }
      // 老的xlsxData是json数组，里面有一个对象，对象有属性name 和data二维数组 通过parse 转换为数组形式 
      xlsxData = JSON.parse(xlsxData)[0].data
      // console.log(xlsxData)
      // 新xlsxData 是二维数组，每一个数组就是一个用户数据
      let inXlsxArr = []
      let inflag = true
      // console.log(xlsxData[0].length)
      // 索引0是存储的表格数据格式，之后才是用户数据
      if (xlsxData[0].length != 8) {
        new Result('导入的用户数据格式错误').fail(res)
        return
      }
      // 判断新添加的用户id 是否有重复
      for (let i = 1; i < xlsxData.length; i++) {
        let userId = xlsxData[i][0]
        for (let j = i + 1; j < xlsxData.length; j++) {
          if (xlsxData[j][0] === userId) {
            new Result(`导入的用户id 第${i}行和第${j}行重复,请修改`).fail(res)
            return
          }
        }
      }
      // 判断新添加的用户id 和 现有的用户id是否重复
      for (let i = 1; i < xlsxData.length; i++) {
        // 不是管理员的话
        if (xlsxData[i][0] != 0) {
          let flag = true
          let xlsxObj = {}
          // 有用户数据部分为空 直接跳出报错
          if (xlsxData[i][0] == null || xlsxData[i][1] == null || xlsxData[i][2] == null || xlsxData[i][4] == null || xlsxData[i][5] == null || xlsxData[i][6] == null || xlsxData[i][7] == null) {
            inflag = false
            break
          }
          xlsxObj.id = xlsxData[i][0]
          xlsxObj.username = xlsxData[i][1]
          xlsxObj.password = xlsxData[i][2]
          // 照片为空的话 直接赋值默认头像
          xlsxObj.head = xlsxData[i][3] || '1.jpg'
          xlsxObj.address = xlsxData[i][4]
          xlsxObj.sex = xlsxData[i][5]
          xlsxObj.classes = xlsxData[i][6]
          xlsxObj.type = xlsxData[i][7]
          for (let j = 0; j < AllUsers.length; j++) {
            if (xlsxObj.id === AllUsers[j].id) {
              flag = false
            }
          }
          // 有重复的id的话说明是同一个人 就不能推入
          if (flag) {
            // 数组中推入用户对象，对象数组
            inXlsxArr.push(xlsxObj)
          }
        }
      }
      if (inflag) {
        // 数据都存在并且有不重复 则可以插入
        if (inXlsxArr.length !== 0) {
          this.inXlsxData(inXlsxArr)
        }
        new Result('导入用户数据成功').success(res)
      } else {
        new Result('导入的用户数据部分为空,导入失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * **************************************修改个人信息**************************************
   */
  /**
   * 修改个人密码
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async upPwd(req, res, next) {
    try {
      const { oldpassword, newpassword } = req.body
      const decoded = jwtUtil.decoded(req)
      // console.log(decoded.id)
      if (decoded && decoded.id) {
        const { u_id } = decoded.id
        let results = await this.upPwdMod(u_id, oldpassword, newpassword)
        if (results.changedRows == 0) {
          new Result('修改失败').fail(res)
        } else {
          new Result('密码修改成功,下次登录请使用新密码').success(res)
        }
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }

  /**
   * 修改个人头像
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async upUserHead(req, res) {
    try {
      let msg = await this.upUserHeadMod(req.head_imgUrl, req.query.u_id)
      new Result(msg).success(res)
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
  // 获取新头像
  static async getAvatar(req, res, next) {
    try {
      const decoded = jwtUtil.decoded(req)
      // console.log(decoded.id)
      if (decoded && decoded.id) {
        const { u_id } = decoded.id
        let avatar = await this.getAvatarMod(u_id)
        new Result(avatar, '获取新头像成功').success(res)
      } else {
        new Result('用户信息解析失败').fail(res)
      }
    } catch (err) {
      next(boom.badImplementation(err))
    }
  }
}
