<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix" style="text-align: center">
            <span>我的通知</span>
          </div>
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop="n_id" sortable label="序列号" />
            <el-table-column prop="title" label="主题" />
            <el-table-column prop="readState" label="状态" />
            <el-table-column label="发布时间">
              <template slot-scope="scope">
                {{ scope.row.createtime | date }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="padding: 3px 0"
                  type="text"
                  :disabled="ifDisabled"
                  @click="goUnread(scope.$index, scope.row)"
                >
                  未读
                </el-button>
                <el-button
                  ref="button2"
                  style="padding: 3px 0"
                  type="text"
                  :disabled="ifDisabled"
                  @click="goReaded(scope.$index, scope.row)"
                >
                  已读
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: center; margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 25]"
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
import { getMyNotice, goUnread, goRead, getNoticeRead } from '@/api/student'
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
    }
  },
  state(int) {
    if (int === 0) { return '未审批' }
    if (int === 1) { return '审批不通过' }
    if (int === 2) { return '审批通过' }
  },
  data() {
    return {
      // show: true,
      noticeSize: 0,
      currentPage: 1,
      tableData: [],
      pageSize: 10,
      ifDisabled: false
    }
  },
  created() {
    this.getMyNotice()
  },
  methods: {
    successOpen(v) {
      this.$message({
        message: v,
        type: 'success'
      })
    },
    // /**
    //  * 已读与未读转换
    //  * @param index
    //  * @param row
    //  */
    goUnread(index, row) {
      goUnread({
        n_id: row.n_id
      }).then((response) => {
        this.successOpen(response.msg)
        // 未读的话 就是获取全部通知
        this.getMyNotice()
      })
    },
    goReaded(index, row) {
      goRead({
        n_id: row.n_id
      }).then((response) => {
        this.successOpen(response.msg)
        // 未读转已读 就是获取全部已读通知
        this.getNoticeRead()
      })
    },
    /**
     * 我的通知分页获取数据与数量
     * */
    getMyNotice() {
      getMyNotice({
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.successOpen(response.msg)
        console.log(response.data)
        this.noticeSize = response.data.noticeTotal
        // console.log(response.data.noticeData)
        response.data.noticeData.forEach(item => {
          item.readState = '未读'
        })
        this.tableData = response.data.noticeData
        this.getNoticeRead()
      })
    },
    /**
     * 获取的我通知已读列表(供已读未读状态渲染)
     */
    getNoticeRead() {
      getNoticeRead().then((response) => {
        console.log(response.data)
        response.data.forEach(item => {
          const val = item.n_id
          this.tableData.forEach(value => {
            if (val === value.n_id) {
              value.readState = '已读'
            }
          })
        })
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getMyNotice()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMyNotice()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
