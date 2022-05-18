<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix" style="text-align: center">
            <span>个人信息</span>
          </div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="classes" label="班级" />
            <el-table-column prop="sex" label="性别" />
            <el-table-column prop="address" label="籍贯" />
            <el-table-column label="入网时间">
              <template slot-scope="scope">
                {{ scope.row.createtime | date }}
              </template>
            </el-table-column>
            <el-table-column label="身份">
              <template slot-scope="scope">
                {{ scope.row.role | role }}
              </template>
            </el-table-column>
          </el-table>
          <el-divider />
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card
                style="
                  width: 80%;
                  position: relative;
                  left: 50%;
                  transform: translateX(-50%);
                "
              >
                <div slot="header" class="clearfix" style="text-align: center">
                  <span>修改头像</span>
                </div>
                <el-upload
                  class="avatar-uploader"
                  :action="iconUrl"
                  :show-file-list="true"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card
                style="
                  width: 80%;
                  position: relative;
                  left: 50%;
                  transform: translateX(-50%);
                "
              >
                <div slot="header" class="clearfix" style="text-align: center">
                  <span>修改密码</span>
                </div>
                <div style="text-align: center">
                  <el-input
                    v-model="old_pwd"
                    prefix-icon="el-icon-lock"
                    placeholder="请输入旧密码"
                    show-password
                    style="margin-top: 10px"
                  />
                  <el-input
                    v-model="new_pwd1"
                    prefix-icon="el-icon-lock"
                    placeholder="请输入新密码"
                    show-password
                    style="margin-top: 10px"
                  />
                  <el-input
                    v-model="new_pwd2"
                    prefix-icon="el-icon-lock"
                    placeholder="请再输入密码"
                    show-password
                    style="margin-top: 10px"
                  />
                  <el-button
                    type="primary"
                    style="margin-top: 10px"
                    @click="submit"
                  >
                    提交修改
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAvatar, updatePsw } from '@/api/user'
export default {
  filters: {
    date(time) {
      const date = new Date(time)
      // yyyy-mm-dd
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second
    },
    role(identify) {
      if (identify === 'admin') {
        return '管理员'
      }
      if (identify === 'student') {
        return '学生'
      }
      if (identify === 'teacher') {
        return '教师'
      }
    }
  },
  data() {
    return {
      old_pwd: '',
      new_pwd1: '',
      new_pwd2: '',
      tableData: [],
      imageUrl: '',
      imgPath: this.basePath + '/file/',
      // 发送上传头像请求，在后端将图片放入public的file中
      iconUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'className',
      'sex',
      'address',
      'name',
      'createTime',
      'roles'
    ])
  },
  created() {
    this.tableData = [{
      username: this.name,
      classes: this.className,
      address: this.address,
      sex: this.sex,
      createtime: this.createTime,
      role: this.roles[0]
    }]
    /**
     * 框架中的属性,修改头像并上传图片
     * @type {string}
     */
    this.iconUrl = process.env.VUE_APP_BASE_API + `/user/upicon?u_id=${this.id}`
  },
  methods: {
    open(message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    // /**'
    //  * 修改密码调用(需要补充格式验证)
    //  */
    submit() {
      const reg = /^(?=.*?[0-9])(?=.*?[a-z])[0-9a-z]{8,}$/
      if (this.new_pwd1 === this.new_pwd2) {
        if (reg.test(this.new_pwd1)) {
          this.$confirm('提交本次修改, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePsw()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        } else {
          this.warningOpen('密码至少8位数,并且需要字母与数字混合')
        }
      } else {
        this.warningOpen('输入的两次密码不一致')
      }
    },
    /**
     * 修改密码函数
     */
    updatePsw() {
      updatePsw({
        oldpassword: this.old_pwd,
        newpassword: this.new_pwd1
      }).then((response) => {
        this.successOpen(response.msg)
      })
    },
    getAvatar() {
      getAvatar({
      }).then((response) => {
        const avatar = process.env.VUE_APP_BASE_API + '/file/' + response.data[0].head
        this.$store.dispatch('user/setAvatar', avatar)
      })
    },
    // element-ui固定写法
    handleAvatarSuccess(res, file) {
      // 图片的显示
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.successOpen('上传成功')
      // 获取新头像
      this.getAvatar()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    successOpen(v) {
      this.$message({
        message: v,
        type: 'success'
      })
    },
    warningOpen(v) {
      this.$message({
        message: v,
        type: 'warning'
      })
    },
    errorOpen(v) {
      this.$message.error(v)
    }
  }
}
</script>

<style scoped lang="scss">
// element-ui修改头像固定样式
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
