<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>所在班级健康表填报情况</span>
      </div>
      <el-row :gutter="24">
        <el-col :span="5">
          <div>
            <el-select
              v-model="selectClass"
              collapse-tags
              placeholder="选择班级"
              @change="changeClass"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="19">
          <div>
            <p>已填报人数：{{ fillNum }} | 未填报人数：{{ unFillNum }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-divider />
    <el-card class="box-card" shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>今日填报情况</span>
      </div>
      <div class="filter-container">
        <el-checkbox-group v-model="checkboxVal">
          <el-checkbox label="发热、咳嗽"> 发热、咳嗽 </el-checkbox>
          <el-checkbox label="就诊"> 就诊 </el-checkbox>
          <el-checkbox label="离校"> 离校 </el-checkbox>
          <el-checkbox label="核酸检测"> 核酸检测 </el-checkbox>
          <el-checkbox label="去过高风险地区"> 去过高风险地区 </el-checkbox>
          <el-checkbox label="接触高风险地区人员">
            接触高风险地区人员
          </el-checkbox>
          <el-checkbox label="高风险地区人员"> 高风险地区人员 </el-checkbox>
        </el-checkbox-group>
      </div>
      <el-table
        ref="dragTable"
        :key="key"
        :data="tableData"
        border
        stripe
        fit
        highlight-current-row
        :default-sort="{ prop: 'u_id', order: 'ascending' }"
        style="width: 100%"
      >
        <el-table-column prop="u_id" sortable label="学号" width="80" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="classes" label="班级" />
        <el-table-column label="填报时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.createtime | date }}
          </template>
        </el-table-column>
        <el-table-column prop="temperature" label="当前体温" />
        <el-table-column
          v-for="value in formThead"
          :key="value.prop"
          :label="value"
        >
          <template slot-scope="scope">
            {{ showprop(value, scope.row) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="hot" label="是否发热、咳嗽" />
        <el-table-column prop="fever" label="是否有去就诊" />
        <el-table-column prop="gohubei" label="是否去过高风险地区" />
        <el-table-column prop="hubeiren" label="是否为高风险地区人员" />
        <el-table-column prop="mask" label="是否接触过高风险地区人员" />
        <el-table-column prop="leaveout" label="是否离开过学校" />
        <el-table-column prop="hesuan" label="是否做过核酸检测" /> -->
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 2rem; text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getHealthByClass, getStudentNum } from '@/api/admin'
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
const defaultFormThead = ['发热、咳嗽', '就诊', '离校', '核酸检测']

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
  data() {
    return {
      total: 0,
      currentPage: 1,
      selectClass: '',
      pageSize: 10,
      tableData: [],
      options: [],
      fillNum: 0,
      unFillNum: 0,
      formTheadOptions: ['发热、咳嗽', '就诊', '离校', '核酸检测', '去过高风险地区', '接触高风险地区人员', '高风险地区人员'],
      checkboxVal: defaultFormThead,
      formThead: defaultFormThead, // 默认表头 Default header,
      key: 1
    }
  },
  computed: {
    ...mapGetters([
      'className'
    ])
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  mounted() {
    this.options = this.className.split(';')
    this.$message('请选择班级')
  },
  methods: {
    showprop(value, rows) {
      if (value === '就诊') {
        return rows.fever
      } else if (value === '发热、咳嗽') {
        return rows.temperature
      } else if (value === '离校') {
        return rows.leaveout
      } else if (value === '核酸检测') {
        return rows.hesuan
      } else if (value === '去过高风险地区') {
        return rows.gohubei
      } else if (value === '接触高风险地区人员') {
        return rows.mask
      } else if (value === '高风险地区人员') {
        return rows.hubeiren
      }
    },
    changeClass() {
      if (this.selectClass) {
        this.getHealthByClass()
      }
    },
    getHealthByClass() {
      getHealthByClass({
        classes: this.selectClass,
        currPage: this.currentPage - 1,
        pageSize: this.pageSize
      }).then((response) => {
        this.$message(response.msg)
        this.tableData = response.data.tableData
        this.total = response.data.total
        this.fillNum = this.total
        this.getStudentNum()
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    getStudentNum() {
      getStudentNum({
        classes: this.selectClass
      }).then((response) => {
        console.log(response.data.total)
        console.log(this.fillNum)
        this.unFillNum = response.data.total - this.fillNum
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          // const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          // this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    // 每页显示数量
    handleSizeChange(size) {
      this.pageSize = size
      console.log(`每页 ${size} 条`)
    },
    // 当前页码
    handleCurrentChange(currPage) {
      this.currentPage = currPage
      console.log(`当前页: ${currPage}`)
    },
    successOpen(v) {
      this.$message({
        message: v,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
</style>
