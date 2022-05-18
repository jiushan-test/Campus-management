// var createError = require('http-errors');
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const router = require('./routes/index')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// 使用cors处理跨域
app.use(cors())
app.use(logger('dev'))
// 用用中间件来获取req的body中的参数
// app.use(bodyParser.json()) app.use(bodyParser.urlencoded({ extended: false })) bodyParser2019年就被弃用了
// 直接用express调用bodyParser的方法就可以了，
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// cookie解析
app.use(cookieParser())
// 静态的中间件用来存放静态文件 如图片和文件等
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router)

module.exports = app
