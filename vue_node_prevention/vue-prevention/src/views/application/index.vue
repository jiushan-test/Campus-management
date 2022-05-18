<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>填写假条</span>
          </div>
          <el-select v-model="value" placeholder="请选择请假类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            style="margin-left: 20px"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-input
            v-model="textarea"
            type="textarea"
            placeholder="请输入请假内容"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
            style="margin-top: 20px"
          />
          <div style="float: left; margin-top: 20px">
            <el-button type="primary" @click="submitApplication">
              提交
            </el-button>
            <div style="height: 20px" />
          </div>
        </el-card>
        <el-card style="margin-top: 20px; margin-bottom: 5rem">
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column label="申请时间" sortable>
              <template slot-scope="scope">
                {{ scope.row.createtime | date }}
              </template>
            </el-table-column>
            <el-table-column prop="leavetype" label="类型" />
            <el-table-column prop="reason" label="请假内容" />
            <el-table-column label="请假时间">
              <template slot-scope="scope">
                {{ scope.row.starttime | date2 }} ~ {{ scope.row.endtime | date2 }}
              </template>
            </el-table-column>
            <el-table-column label="审核结果">
              <template slot-scope="scope">{{
                scope.row.state | state
              }}</template>
            </el-table-column>
          </el-table>
          <div class="block" style="text-align: center; margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[ 10, 15, 20, 25]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="noteSize"
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
import { getMyApplication, submitApplication } from '@/api/student'
export default {
  filters: {
    date(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      // yyyy-mm-dd
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
    state(type) {
      if (type === 0) {
        return '未审批'
      }
      if (type === 1) {
        return '审批不通过'
      }
      if (type === 2) {
        return '审批通过'
      }
    }
  },
  data() {
    return {
      noteSize: 0,
      currentPage: 1,
      tableData: [],
      pageSize: 10,
      text: '',
      textarea: '',
      options: [{
        value: '请假',
        label: '请假'
      }, {
        value: '外出',
        label: '外出'
      }],
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value2: ''
    }
  },
  created() {
    this.getMyApplication()
  },
  methods: {
    // 分页获取我的请假单
    getMyApplication() {
      getMyApplication({
        currPage: this.currentPage - 1,
        pageSize: this.pageSize
      }).then((response) => {
        this.tableData = response.data.applicationData
        this.noteSize = response.data.applicationTotal
        if (this.noteSize === 0) {
          this.messageOpen(response.msg)
        } else {
          this.successOpen(response.msg)
        }
      })
    },
    /**
     * 请假
     *
     reason:this.textarea,
     leavetype:this.value,
     starttime:starttime,
     endtime:endtime
     this.value2[0]请假起始时间
     this.value2[1]请假结束时间
     */
    submitApplication() {
      if (!this.textarea || !this.value || !this.value2) {
        this.warningOpen('请假信息不可以留空')
      } else {
        const dtstart = new Date(this.value2[0])
        const dtend = new Date(this.value2[1])
        let starttime = ''
        let endtime = ''
        if ((dtstart.getMonth() + 1) < 10) {
          starttime = dtstart.getFullYear() + '-0' + (dtstart.getMonth() + 1) + '-' + dtstart.getDate()
        } else {
          starttime = dtstart.getFullYear() + '-' + (dtstart.getMonth() + 1) + '-' + dtstart.getDate()
        }
        if ((dtend.getMonth() + 1) < 10) {
          endtime = dtend.getFullYear() + '-0' + (dtend.getMonth() + 1) + '-' + dtend.getDate()
        } else {
          endtime = dtend.getFullYear() + '-' + (dtend.getMonth() + 1) + '-' + dtend.getDate()
        }
        // console.log(starttime, endtime)
        submitApplication({
          reason: this.textarea,
          leaveType: this.value,
          starttime: starttime,
          endtime: endtime
        }).then((response) => {
          this.successOpen(response.msg)
          this.getMyApplication()
        })
      }
    },
    messageOpen(v) {
      this.$message(v)
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
    errOpen(v) {
      this.$message.error(v)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getMyApplication()
    },
    handleCurrentChange(val) {
      // console.log(`当前页${val} `)
      this.currentPage = val
      this.getMyApplication()
    }
  }
}
</script>
