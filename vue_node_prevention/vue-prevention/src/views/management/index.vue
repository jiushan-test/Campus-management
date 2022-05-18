<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-select
            v-model="role"
            style="width: 10%; margin-right: 10px"
            @change="changeUserType"
          >
            <el-option label="学生" value="student" />
            <el-option label="教师" value="teacher" />
          </el-select>
          <el-select
            v-model="selectValue"
            style="width: 10%; margin-right: 10px"
            @change="changeSearchValue"
          >
            <el-option label="学号" value="id" />
            <el-option label="姓名" value="username" />
            <el-option label="籍贯" value="address" />
            <el-option label="班级" value="classes" />
          </el-select>
          <el-autocomplete
            v-model="inputValue"
            :placeholder="placeholderValue"
            clearable
            prefix-icon="el-icon-search"
            style="width: 20%"
            :fetch-suggestions="querySearch"
            @input="changeFlag"
            @clear="getUsersData"
          />
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="searchData"
          >
            搜索
          </el-button>
          <el-button type="primary" @click="clearValue"> 重置 </el-button>
          <el-button
            v-show="!showAdd"
            type="primary"
            style="float: right"
            color="#F56C6C"
            @click="showAdd = !showAdd"
          >
            <i class="el-icon-upload" />
            添加用户
          </el-button>
        </el-card>
        <transition name="el-zoom-in-top">
          <el-card v-show="showAdd" class="box-card" style="margin-top: 10px">
            <div slot="header" class="clearfix" style="text-align: center">
              <span>上传excel表格（.xlsx）</span>
            </div>
            <div class="transition-box" style="display: flex; margin-top: 40px">
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :action="filePath"
                multiple
                style="margin: auto"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="text-align: center"
                >
                  文件上传速度跟当前环境有关，请耐心等待
                  <el-row :gutter="20" style="margin-top: 10px">
                    <el-col :span="12">
                      <el-button
                        size="small"
                        style="width: 100%"
                        @click="showAdd = !showAdd"
                      >
                        关闭
                      </el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button
                        size="small"
                        type="primary"
                        style="width: 100%"
                        @click="importXlsx"
                      >
                        导入
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-upload>
            </div>
          </el-card>
        </transition>
        <el-card
          v-if="!showDetail"
          style="margin-top: 20px; margin-bottom: 5rem"
        >
          <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="id" sortable label="学号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="sex" label="性别" />
            <el-table-column prop="address" label="生源地" />
            <el-table-column prop="classes" label="班级" />
            <el-table-column label="类型">{{ getType() }}</el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="padding: 3px 0;"
                  type="text"
                  @click="deleteRow(scope.$index, scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  style="padding: 3px 0;"
                  type="text"
                  @click="editRow(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: center; margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="usersTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
        <el-card v-else-if="showDetail" style="margin-top: 20px">
          <el-page-header content="详情页面" @back="goBack" />
          <!-- <br /> -->
          <el-form
            ref="form"
            v-model="form"
            label-width="80px"
            style="width: 50%; margin-top: 10px"
          >
            <el-form-item label="姓名">
              <el-input
                v-model="form.name"
                style="width: 40%"
                :placeholder="user.username"
                clearable
              />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio label="男" />
                <el-radio label="女" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="籍贯">
              <el-input
                v-model="form.address"
                style="width: 40%"
                :placeholder="user.address"
                clearable
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="form.type">
                <el-radio label="教师" />
                <el-radio label="学生" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editUserData">提交修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUsersData, removeUserData, setXlsxData, editUserData } from '@/api/user'
import { searchData } from '@/api/admin'
export default {
  data() {
    return {
      /**
       * 1.绑定element-ui的action属性中,上传文件使用: 即excel上传路径通过
       * 2.上传到后端的upload的文件中，之后通过importXlsx方法将文件从redis数据库导入到mysql数据库中
       * */
      filePath: process.env.VUE_APP_BASE_API + '/upload/upload',
      form: {
        name: '',
        sex: '',
        address: '',
        type: ''
      },
      role: 'student',
      selectValue: 'username',
      showDetail: false,
      showAdd: false,
      inputValue: '',
      userType: 2,
      usersTotal: 0,
      currentPage: 1,
      tableData: [],
      pageSize: 10,
      // pageNo: 1,
      user: '',
      searchFlag: false,
      searchValue: [],
      placeholderValue: '请输入姓名'
    }
  },
  created() {
    this.getUsersData()
    this.searchValue = this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      var searchValue = this.searchValue
      var results = queryString ? searchValue.filter(this.createFilter(queryString)) : searchValue
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (searchValue) => {
        return (searchValue.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': 'student' },
        { 'value': 'teacher' }
      ]
    },
    // 返回
    goBack() {
      this.showDetail = false
    },
    // 改变搜索标志位
    changeFlag() {
      this.searchFlag = false
      console.log(this.searchFlag)
    },
    // 重置
    clearValue() {
      this.currentPage = 1
      this.selectValue = 'username'
      this.getUsersData()
      this.inputValue = ''
      this.searchFlag = false
    },
    getType() {
      if (this.userType === 2) {
        return '学生'
      } else if (this.userType === 3) {
        return '教师'
      }
    },
    // 改变人员角色，获取用户数据表格
    changeUserType() {
      if (this.role === 'student') {
        this.userType = 2
        this.getUsersData()
        // console.log(this.userType)
      } else {
        this.userType = 3
        this.getUsersData()
        // console.log(this.userType)
      }
    },
    changeSearchValue() {
      if (this.selectValue === 'id') {
        this.placeholderValue = '请输入学号'
      } else if (this.selectValue === 'username') {
        this.placeholderValue = '请输入姓名'
      } else if (this.selectValue === 'address') {
        this.placeholderValue = '请输入籍贯'
      } else {
        this.placeholderValue = '请输入班级'
      }
    },
    // 显示修改页面
    editRow(index, row) {
      console.log(row)
      // console.log(row.username)
      this.showDetail = true
      this.user = row
      this.form.sex = row.sex
      this.form.name = row.username
      this.form.address = row.address
      if (row.type === 2) {
        this.form.type = '学生'
      }
      if (row.type === 3) {
        this.form.type = '教师'
      }
    },
    /**
     * 管理员更改用户信息
     * u_id:this.user.id,
     username:this.form.name,
     sex:this.form.sex,
     address:this.form.address,
     type:this.userType
     this.showDetail--隐藏页面
     * */
    editUserData() {
      let type = 2
      if (this.form.type === '教师') {
        type = 3
      }
      editUserData({
        u_id: this.user.id,
        username: this.form.name,
        sex: this.form.sex,
        address: this.form.address,
        type: type
      }).then((response) => {
        this.open2(response.msg)
        this.showDetail = false
        this.getUsersData()
      }).catch(() => {
        console.log('编辑失败')
      })
    },
    /**
     * 分页搜索用户信息
     * this.input输入内容
     * this.selectValue搜素类型
     * this.pageSize页码大小
     * this.currentPage当前页数
     * this.tableData列表数据
     * this.usersTotal列表数量
     * */
    searchData() {
      searchData({
        type: this.userType,
        inputText: this.inputValue,
        charType: this.selectValue,
        pageSize: this.pageSize,
        currPage: 0
      }).then((response) => {
        this.searchFlag = true
        this.open2(response.msg)
        this.tableData = response.data.usersData
        this.usersTotal = response.data.usersTotal
        this.currentPage = 1
      }).catch(() => {
        this.input = ''
      })
    },
    searchData2(event, msg) {
      searchData({
        type: this.userType,
        inputText: this.inputValue,
        charType: this.selectValue,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.open2(msg)
        this.tableData = response.data.usersData
        this.usersTotal = response.data.usersTotal
        this.currentPage = 1
      }).catch(() => {
        this.inputValue = ''
      })
    },
    /**
     * 分页获取用户信息
     * @param pageSize
     * @param currPage
     *  this.tableData列表数据
     *  this.UserSize列表数量
     */
    // 用于重置
    getUsersData() {
      getUsersData({
        type: this.userType,
        pageSize: this.pageSize,
        currPage: 0
      }).then((response) => {
        this.open2(response.msg)
        this.tableData = response.data.usersData
        this.usersTotal = response.data.usersTotal
      }).catch(() => {
        console.log('获取数据失败')
      })
    },
    getUsersData2() {
      getUsersData({
        type: this.userType,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.open2(response.msg)
        this.tableData = response.data.usersData
        this.usersTotal = response.data.usersTotal
      }).catch(() => {
        console.log('获取数据失败')
      })
    },
    // 删除用户
    removeUserData(index, row) {
      removeUserData({
        u_id: row.id,
        type: this.userType,
        inputText: this.inputValue,
        searchFlag: this.searchFlag,
        charType: this.selectValue,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.open2(response.msg.userMsg)
        this.tableData = response.data.usersData
        this.usersTotal = response.data.usersTotal
        if (this.usersTotal % 10 === 0) {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            if (this.inputValue && this.searchFlag) {
              this.searchData2(null, '分页获取查找数据成功')
            } else {
              this.getUsersData2()
            }
          }
        }
      }).catch(() => {
        console.log('删除用户失败')
      })
    },
    deleteRow(index, row) {
      this.$confirm('此数据将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeUserData(index, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 导入文件操作
     */
    importXlsx() {
      // 没有上传文件的话弹出警告
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.open3('请选择要导入的用户数据')
      } else {
        // 框架写法
        this.$confirm('将文件导入,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setXlsxData()
          // this.$axiosjwt({
          //   url: "/users/setXlsxData",
          //   method: 'post',
          //   data: {},
          //   success: (result) => {
          //     this.$message({
          //       type: 'success',
          //       message: result
          //     })
          //   }
          // })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '文件导入已经取消'
          })
        })
      }
    },
    setXlsxData() {
      setXlsxData().then((response) => {
        this.open2(response.msg)
        // 上传结束就再次获取用户数据
        if (this.inputValue && this.searchFlag) {
          this.searchData2(null, '分页获取查找数据成功')
        } else {
          this.getUsersData2()
        }
      }).catch(() => {
        console.log('导入失败')
      })
    },
    /**
     * 当每页数量或者当前页数改变时重新获取数字
     * @param val
     */
    // 每页显示数量
    handleSizeChange(val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
      // 有输入则搜索分页 否则所有数据分页
      if (this.inputValue && this.searchFlag) {
        this.searchData2(null, '分页获取查找数据成功')
      } else {
        this.getUsersData2()
      }
    },
    // 当前页码
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
      // 分页
      if (this.input && this.searchFlag) {
        this.searchData2(null, '分页获取查找数据成功')
      } else {
        this.getUsersData2()
      }
    },
    // 成功提示
    open2(v) {
      this.$message({
        message: v,
        type: 'success'
      })
    },
    // 警告提示
    open3(v) {
      this.$message({
        message: v,
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
