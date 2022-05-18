<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" style="text-align: center">
            <span>填写通知</span>
          </div>
          <div
            style="display: flex; justify-content: center; margin-right: 10px"
          >
            <!--<span style="margin: auto 0">主题</span>-->
            <div style="margin: auto 0; margin-right: 10px">
              <el-input v-model="inputTitle" placeholder="主题" clearable />
            </div>
            <!--<span style="margin: auto 0">班级</span>-->
            <div style="margin: auto 0">
              <el-select
                v-model="inputClasses"
                multiple
                collapse-tags
                placeholder="班级（多选）"
              >
                <el-option
                  v-for="item in options"
                  :key="item.c_id"
                  :label="item.classes"
                  :value="item.classes"
                />
              </el-select>
            </div>
            <div style="margin: auto 0">
              <el-button
                type="primary"
                style="margin-left: 10px"
                @click="noticeSend"
              >
                发布
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card v-if="detailShow" shadow="hover">
          <div slot="header" class="clearfix" style="text-align: center">
            <span>通知详情</span>
            <el-button
              style="float: left; padding: 3px 0"
              type="text"
              @click="close"
            >
              关闭
            </el-button>
          </div>
          <el-table :data="tableDetailData" border style="width: 100%">
            <el-table-column prop="n_id" label="序列号" />
            <el-table-column prop="title" label="主题" />
            <el-table-column prop="class" label="通知的班级" />
            <el-table-column label="发布时间">
              <template slot-scope="scope">
                {{ scope.row.createtime | date }}
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :xs="24" :sm="24" :lg="8">
              <el-card shadow="hover">

                <div class="chart-wrapper">
                  <pie-chart :read-num="readNum" :unread-num="unreadNum" />
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="16">
              <el-card shadow="hover">
                <div slot="header" class="clearfix" style="text-align: center">
                  <span>访问的用户</span>
                </div>
                <el-row
                  :gutter="20"
                  style="overflow-y: scroll; height: 15.2rem"
                >
                  <el-col
                    v-for="(item, index) in users"
                    :key="index"
                    :span="4"
                    class="ca"
                    style="margin-bottom: 0.7rem; margin-top: 0.7rem"
                  >
                    <el-tooltip placement="top">
                      <div slot="content">
                        阅读时间：{{ item.readtime | date }}
                      </div>
                      <el-card
                        shadow="hover"
                        :body-style="{ padding: '0px' }"
                        style="min-height: 14rem"
                        class="imgcar"
                      >
                        <div style="width: 100%; height: 10rem">
                          <img
                            :src="imgPath + item.head"
                            style="width: 100%; height: 100%; object-fit: cover"
                          >
                        </div>
                        <div
                          style="
                            margin-top: 0.8rem;
                            padding-left: 0.8rem;
                            padding-right: 0.8rem;
                            margin-bottom: 1rem;
                            height: 3rem;
                            margin-bottom: 5px;
                            overflow-y: scroll;
                          "
                        >
                          <div style="text-align: center">
                            {{ item.username }}
                          </div>
                          <div
                            class="bottom clearfix"
                            style="height: 1rem; overflow: hidden"
                          >
                            <time class="time">{{ item.classes }}</time>
                          </div>
                        </div>
                      </el-card>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
        <el-card v-else shadow="hover">
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop="n_id" sortable label="序列号" />
            <el-table-column prop="title" label="主题" />
            <el-table-column prop="class" label="通知的班级" />
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createtime | date }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="padding: 3px 0; outline: none"
                  type="text"
                  @click="deleteRow(scope.$index, scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  style="padding: 3px 0; outline: none"
                  type="text"
                  @click="getNoticeDetail(scope.$index, scope.row)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: center; margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="noticeSize"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './PieChart'
import { getAllNotices, getClasses, announce, getNoticeDetail, delNotice } from '@/api/admin'
export default {
  // 自定义本地的过滤器
  // 用处是将时间格式化为自己需要的时间格式
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
    }
  },
  components: {
    PieChart
  },
  data() {
    return {
      // 后端存放照片的路径
      imgPath: process.env.VUE_APP_BASE_API + '/file/',
      detailShow: false,
      inputTitle: '',
      noticeSize: 0,
      currentPage: 1,
      tableData: [],
      tableDetailData: [],
      pageSize: 10,
      // pageNo: 1,
      inputClasses: [],
      options: [],
      users: [],
      readtime: [],
      readNum: Number,
      unreadNum: Number
    }
  },
  mounted() {
    this.getAllNotices()
    getClasses().then((response) => {
      this.options = response.data.classData
    })
  },
  methods: {
    deleteRow(index, row) {
      this.$confirm('此公告将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delNotice(index, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看通知详情
    getNoticeDetail(index, row) {
      console.log(row)
      getNoticeDetail({
        n_id: row.n_id
      }).then((response) => {
        console.log(response)
        this.tableDetailData = response.data.detail
        this.users = response.data.users
        this.readNum = response.data.readNum
        this.unreadNum = response.data.total - response.data.readNum
        this.detailShow = true
      })
    },
    // 删除通知
    delNotice(index, row) {
      delNotice({
        n_id: row.n_id,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.successOpen(response.msg.noticeMsg)
        this.tableData = response.data.noticeData
        this.noticeSize = response.data.noticeTotal
        if (this.noticeSize % 10 === 0) {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.getAllNotices()
          }
        }
      })
    },
    /**
     * 分页获取所有通知
     * @param pageSize
     * @param currPage
     */
    getAllNotices() {
      getAllNotices({
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.successOpen(response.msg)
        // console.log(response.data)
        this.tableData = response.data.noticeData
        this.noticeSize = response.data.noticeTotal
      })
    },
    // 发布通知
    noticeSend() {
      // inputClasses是班级 inputTitle是主题
      if (this.inputClasses.length === 0 || !this.inputTitle) {
        this.open3('公告主题和班级不能为空,请输入')
      } else {
        // console.log(this.inputClasses)
        const classes = this.inputClasses.join(';')
        announce({
          title: this.inputTitle,
          classes: classes,
          pageSize: this.pageSize,
          currPage: this.currentPage - 1
        }).then((response) => {
          this.successOpen(response.msg)
          this.tableData = response.data.noticeData
          this.noticeSize = response.data.noticeTotal
        }).catch(() => {
          this.inputTitle = ''
          this.inputClasses = ''
        })
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllNotices()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getAllNotices()
    },
    // 关闭
    close() {
      this.detailShow = false
    },
    successOpen(message) {
      this.$message({
        message: message || '恭喜你，这是一条成功消息',
        type: 'success'
      })
    },
    warningOpen(v) {
      this.$message({
        message: v,
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}
/* .ca{
         height:15rem ;
     }*/
.imgcar {
  min-height: 11rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  /*margin-top: 2rem;*/
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  text-align: center;
  margin-top: 7px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 40px;
  height: 40px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.chart-wrapper {
  background: #fff;
}
</style>
