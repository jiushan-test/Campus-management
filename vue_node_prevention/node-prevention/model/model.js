const { debug } = require('../utils/constant')
// 用来输出日志的
// 连接数据库
const mysql = require('mysql')
// 数据库连接池方式
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '19951212',
  port: '3306',
  database: 'vue_store'

})
/**
 * 封装一个数据库模型基类
 * @type {module.Model}
 */
module.exports = class Model {
  /**
   * 通用的查询方法
   * @param sql 要执行的sql语句
   * @param params  给sql语句的占位符进行赋值的参数数组
   */
  // 静态方法 查询返回的是一个对象数组
  static query(sql, params) {
    debug && console.log(sql)
    return new Promise((resolve, reject) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.error(err)
          //连接错误，返回到连接池
          connection.release()
        } else {
          try {
            //query执行sql语句
            // throw new err('error')
            connection.query(sql, params, (err, results) => {
              if (err) {
                debug && console.error('查询失败, 原因：' + JSON.stringify(err))
                reject(err)
              } else {
                debug && console.log('查询成功：' + JSON.stringify(results))
                resolve(results)
              }
            })
          } catch (e) {
            reject(e)
          } finally {
            //结束会话,释放连接
            connection.release()
          }
        }
      })
    })
  }

  // 查询单个用户数据
  static queryOne(sql) {
    return new Promise((resolve, reject) => {
      this.query(sql).then(results => {
        if (results && results.length > 0) {
          resolve(results[0])
        } else {
          resolve(null)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  static formatParams() {
    let array = []
    for (let i = 0, l = arguments.length; i < l; i++) {
      array.push(arguments[i]);
    }
    return array
  }

  // 获取当前和明天的时间
  static getNowAndNextDate() {
    let date = new Date()
    // console.log(date);
    let year = date.getFullYear()
    // console.log('年', year)
    let thisMonth = '""'
    let month = date.getMonth() + 1
    // console.log('月', month);
    let today = date.getDate()
    // console.log('日', today)
    let nextDay = today
    if (month < 10) {
      thisMonth = '0' + String(month)
    }
    else {
      thisMonth = (month) + ''
    }
    // console.log('这个月', thisMonth)
    let monthNum = 0
    let nextMonth
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        if (today < 31) {
          nextDay = today + 1
          nextMonth = thisMonth
          // console.log('明日月份和日期', nextMonth, nextDay);
        } else {
          nextDay = '1'
          nextMonth = thisMonth
          nextMonth++
          // console.log('明日月份和日期', nextMonth, nextDay);
        }
        monthNum = 31
        break
      case 2:
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
          //如果是闰年29天且小于28,年份是整百的话，除以400判断 是不是整除 是整除就是闰年
          if (today < 29) {
            nextDay = today + 1
            nextMonth = thisMonth
            // console.log('闰年小于29天', nextMonth, nextDay);
          } else {
            nextDay = '1'
            nextMonth = thisMonth
            nextMonth++
            // console.log('闰年等于29天', nextMonth, nextDay);
          }
          monthNum = 29
        } else {
          if (today < 28) {
            // 不是闰年 28天
            nextDay = today + 1
            nextMonth = thisMonth
            // console.log('不是闰年小于28天', nextMonth, nextDay);
          } else {
            nextDay = '1'
            nextMonth = thisMonth
            nextMonth++
            // console.log('不是闰年等于28天', nextMonth, nextDay);
          }
          monthNum = 28
        }
        break
      case 4:
      case 6:
      case 9:
      case 11:
        if (today < 30) {
          nextDay = today + 1
          nextMonth = thisMonth
          // console.log('明日月份和日期', nextMonth, nextDay);
        }
        else {
          nextDay = '1'
          nextMonth = thisMonth
          nextMonth++
          // console.log('明日月份和日期', nextMonth, nextDay);
        }
        monthNum = 30
        break
    }
    if (today < 10) {
      today = '0' + today
      // console.log('今日', today);
    }
    if (nextDay < 10) {
      nextDay = '0' + nextDay
      // console.log('明日', nextDay)
    }
    let nowDate = '' + year + thisMonth + today
    let nextDate = '' + year + nextMonth + nextDay
    let startMonth = '' + year + thisMonth + '01'
    let endMonth = '' + year + thisMonth + monthNum
    return { nowDate, nextDate, startMonth, endMonth }
  }
}
