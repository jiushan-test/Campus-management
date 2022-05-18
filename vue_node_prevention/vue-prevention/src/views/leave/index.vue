<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix" style="text-align: center">
            <span>请假管理</span>
          </div>
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column label="申请时间">
              <template slot-scope="scope">{{
                scope.row.createtime | date
              }}</template>
            </el-table-column>
            <el-table-column prop="u_id" label="学号" />
            <el-table-column prop="username" label="申请人" />
            <el-table-column prop="leavetype" label="类型" />
            <el-table-column prop="reason" label="请假内容" />
            <el-table-column label="请假时间">
              <template slot-scope="scope">
                {{ scope.row.starttime | date2 }} ~
                {{ scope.row.endtime | date2 }}
              </template>
            </el-table-column>
            <el-table-column prop="state" label="审核结果">
              <template slot-scope="scope">{{
                scope.row.state | state
              }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="padding: 3px 0"
                  type="text"
                  :disabled="ifAgreeDisabled"
                  @click="view(scope.$index, scope.row, 2)"
                >
                  同意
                </el-button>
                <el-button
                  style="padding: 3px 0"
                  type="text"
                  :disabled="ifRejectDisabled"
                  @click="view(scope.$index, scope.row, 1)"
                >
                  拒绝
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: center; margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="UserSize"
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
import { getApplication, upLeaveState } from '@/api/admin'
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
    date2(time) {
      const date = new Date(time)
      // yyyy-mm-dd
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '-' + month + '-' + day
    },
    state(int) {
      if (int === 0) { return '未审批' }
      if (int === 1) { return '审批不通过' }
      if (int === 2) { return '审批通过' }
    }
  },
  data() {
    return {
      UserSize: 0,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      ifAgreeDisabled: false,
      ifRejectDisabled: false
    }
  },
  created() {
    this.getApplication()
  },
  methods: {
    view(index, row, upState) {
      console.log(index, row)
      upLeaveState({
        l_id: row.l_id,
        upState
      }).then((response) => {
        row.state = response.data[0].state
        // console.log(row)
        // if (upState === 2) {
        //   // 同意
        //   this.ifAgreeDisabled = true
        //   this.ifRejectDisabled = false
        // } else {
        //   // 拒绝
        //   this.ifAgreeDisabled = false
        //   this.ifRejectDisabled = true
        // }
      })
    },
    // 分页获取所在班级的请假单请假单
    getApplication() {
      getApplication({
        currPage: this.currentPage - 1,
        pageSize: this.pageSize
      }).then((response) => {
        this.tableData = response.data.application
        this.UserSize = response.data.total
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getApplication()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getApplication()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
