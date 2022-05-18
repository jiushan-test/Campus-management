// 此路由的作用是前端上传excel文件，这里就会上传到指定的路径并存入到redis中
// 使用formidable模块实现nodeJs传输文件到指定文件夹中
const express = require('express')
const router = express.Router()
// 该模块主要执行文件操作
const fs = require('fs')
// formidable是一个用于处理文件、图片、视频等数据上传的模块，
// 支持GB级上传数据处理，支持多种客户端数据提交
const formidable = require('formidable')
// 解析excel包
const xlsx = require('node-xlsx')
const redisUtils = require('../utils/redisUtils')

router.post('/upload', function(req, res) {
  console.log("############# POST / UPLOAD   ##############")
  let fileTypeError = false
  let target_path = ".\\public\\upload"
  // 创建一个实例
  let form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  // 使用文件的原扩展名
  form.keepExtensions = true
  // 限制文件大小
  form.maxFieldsSize = 10 * 1024 * 1024
  // 上传文件的临时路径
  form.uploadDir = target_path
  let files = []
  let fields = []
  // 获取参数信息,field为参数的键, value为参数的值
  form.on('field', function(field, value) {
    fields.push([field, value])
  })
  form.on('file', function(field, file) {
    // console.log("fileName:"+ file.name)
    let filext = file.name.substring(file.name.lastIndexOf("."), file.name.length)
    if (filext != '.xlsx') {
      // 写入 错误
      redisUtils.set('xlsxData', 'err', 3600)
      fileTypeError = true
    } else {
      fileTypeError = false
      return
    }
    files.push([field, file])
  })
  form.on('end', async function() {
    //遍历上传的文件
    let fileName = ''
    let obj = ''
    let exflag = true
    let folder_exists = await fs.existsSync(target_path)
    if (folder_exists) {
      let dirList = await fs.readdirSync(target_path)
      // console.log("dirList:",dirList)
      dirList.forEach(item => {
        if (!fs.statSync(target_path + '\\' + item).isDirectory()) {
          fileName = target_path + '\\' + item
          if (!fileTypeError) {
            // 解析excel数据 然后存入redis中 有效期1小时，重复存入会更新
            obj = xlsx.parse(fileName)
            console.log(obj)
            redisUtils.set("xlsxData", JSON.stringify(obj), 3600)
            res.send({ "rtnCode": "1", "rtnInfo": "成功导入数据", "data": obj })
          } else {
            //  文件格式不为.xlsx时候
            res.send({ "rtnCode": "1", "rtnInfo": "文件格式不对" })
            exflag = false
          }
          // 上传完excel文件之后 从upload文件夹中删除
          fs.unlinkSync(fileName)
        } else {
          res.send({ "rtnCode": "1", "rtnInfo": "系统错误" })
          return
        }
      })
    }
  })
  form.on('error', function(err) {
    res.send({ "rtnCode": "1", "rtnInfo": "上传出错" })
  })
  form.on('aborted', function() {
    res.send({ "rtnCode": "1", "rtnInfo": "放弃上传" })
  })
  form.parse(req)
})
module.exports = router
