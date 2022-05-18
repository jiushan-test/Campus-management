//响应结果封装
const {
  CODE_ERROR, // -1
  CODE_SUCCESS, // 0
  CODE_TOKEN_EXPIRED,
  debug
} = require('../utils/constant')

// data 向前端返回的数据 msg信息 options一些辅助信息
class Result {
  constructor(data, msg = '操作成功', options) {
    this.data = null
    if (arguments.length === 0) {
      this.msg = '操作成功'
    } else if (arguments.length === 1) {
      this.msg = data
    } else {
      this.data = data
      this.msg = msg
      if (options) {
        this.options = options
      }
    }
  }

  createResult() {
    if (!this.code) {
      this.code = CODE_SUCCESS
    }
    let base = {
      code: this.code,
      msg: this.msg
    }
    if (this.data) {
      base.data = this.data
    }
    // options是一个对象
    if (this.options) {
      base = { ...base, ...this.options }
    }
    debug && console.log('response中的data:' + JSON.stringify(base))
    return base
  }

  json(res) {
    // 返回的base就是response中的data数据对象
    // 返回给前端{code, data, msg, options可选}
    res.json(this.createResult())
  }

  success(res) {
    // throw new Error('error....')
    this.code = CODE_SUCCESS
    this.json(res)
  }

  fail(res) {
    // throw new Error('error.....')
    this.code = CODE_ERROR
    this.json(res)
  }
  
  jwtError(res) {
    this.code = CODE_TOKEN_EXPIRED
    this.json(res)
  }
}

module.exports = Result
