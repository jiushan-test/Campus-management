<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>添加班级</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-autocomplete
            v-model="inputClass"
            placeholder="请输入要添加的班级"
            clearable
            style="width: 15rem"
            :fetch-suggestions="querySearch2"
            @select="handleSelect2"
          />
          <el-button type="primary" style="margin-left: 10px" @click="addClass">
            添加
          </el-button>
        </el-col>
        <el-col :span="11">
          <el-autocomplete
            v-model="inputSearchClass"
            class="inline-input"
            placeholder="请输入查找的班级"
            clearable
            prefix-icon="el-icon-search"
            :fetch-suggestions="querySearch1"
            style="width: 15rem"
            @select="handleSelect1"
            @clear="getClasses"
            @input="changeFlag"
          />
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="searchClass"
          >
            查找
          </el-button>
          <el-button type="primary" @click="clearValue"> 重置 </el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- <el-divider /> -->
    <el-card class="box-card" shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>所有班级</span>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        :default-sort="{ prop: 'c_id', order: 'ascending' }"
        style="width: 100%"
      >
        <el-table-column prop="c_id" sortable label="班级编号" />
        <el-table-column prop="classes" label="班级名称" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, scope.row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
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
import { addClass, searchClass, removeClass, getClassesByPage } from '@/api/admin'
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      inputSearchClass: '',
      inputClass: '',
      searchClassArr: [],
      addClassArr: [],
      searchFlag: false
    }
  },
  // computed: {
  //   // 前端分页算法
  //   setTableData() {
  //     return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
  //   }
  // },
  mounted() {
    // 获取所有班级
    this.getClasses()
    this.searchClassArr = this.loadAll()
    this.addClassArr = this.loadAll()
  },
  methods: {
    querySearch1(queryString, cb) {
      var searchClassArr = this.searchClassArr
      var results = queryString ? searchClassArr.filter(this.createFilter1(queryString)) : searchClassArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearch2(queryString, cb) {
      var addClassArr = this.addClassArr
      var results = queryString ? addClassArr.filter(this.createFilter1(queryString)) : addClassArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter1(queryString) {
      return (searchClassArr) => {
        return (searchClassArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    createFilter2(queryString) {
      return (addClassArr) => {
        return (addClassArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '自动化' },
        { 'value': '控制工程' },
        { 'value': '计算机科学与技术' },
        { 'value': '软件工程' }
      ]
    },
    handleSelect1(item) {
      console.log(item)
    },
    handleSelect2(item) {
      console.log(item)
    },
    // 标志位searchFlag是为了防止没有点击查找，点击分页的时候进行查找
    changeFlag() {
      this.searchFlag = false
      // console.log(this.searchFlag)
    },
    clearValue() {
      this.currentPage = 1
      this.getClasses()
      this.inputClass = ''
      this.inputSearchClass = ''
      this.searchFlag = false
    },
    // 删除班级
    deleteRow(index, rows) {
      console.log(index, rows)
      removeClass({
        c_id: rows.c_id,
        searchClass: this.inputSearchClass,
        searchFlag: this.searchFlag,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.successOpen(response.msg)
        this.total = response.data.classTotal
        this.tableData = response.data.classData
        if (this.total % this.pageSize === 0) {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            if (this.inputSearchClass && this.searchFlag) {
              this.searchClass2(null, '分页获取查找班级成功')
            } else {
              this.getClasses2()
            }
          }
        }
      }).catch(() => {
        console.log('删除该班级失败')
      })
    },
    // 添加班级post
    addClass() {
      addClass({
        classes: this.inputClass,
        searchClass: this.inputSearchClass,
        searchFlag: this.searchFlag,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        this.successOpen(response.msg)
        this.tableData = response.data.classData
        this.total = response.data.classTotal
      }).catch(() => {
        // 有错误清空内容
        this.input = ''
      })
    },
    // 查找按钮班级分页模糊搜索，获取第一页的数据，搜索完自动跳到第一页
    searchClass() {
      searchClass({
        classes: this.inputSearchClass,
        pageSize: this.pageSize,
        currPage: 0
      }).then((response) => {
        this.successOpen(response.msg)
        this.searchFlag = true
        this.total = response.data.classTotal
        this.tableData = response.data.classData
        // 跳到第一页
        this.currentPage = 1
      }).catch(() => {
        this.inputClass = ''
      })
    },
    // 分页栏点击 获取查找班级的分页
    searchClass2(event, msg) {
      searchClass({
        classes: this.inputSearchClass,
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        // console.log(msg)
        this.successOpen(msg)
        this.tableData = response.data.classData
        this.total = response.data.classTotal
      }).catch(() => {
        this.inputClass = ''
      })
    },
    // 分页获取班级
    getClasses2() {
      getClassesByPage({
        pageSize: this.pageSize,
        currPage: this.currentPage - 1
      }).then((response) => {
        // console.log('getClass', response)
        this.successOpen(response.msg)
        this.tableData = response.data.classData
        this.total = response.data.classTotal
      })
    },
    // 分页获取班级 用于重置
    getClasses() {
      getClassesByPage({
        pageSize: this.pageSize,
        currPage: 0
      }).then((response) => {
        // console.log('getClass', response)
        this.successOpen(response.msg)
        this.tableData = response.data.classData
        this.total = response.data.classTotal
      })
    },
    // 每页显示数量
    handleSizeChange(size) {
      this.pageSize = size
      console.log(`每页 ${size} 条`)
      // 有输入则搜索分页 否则所有数据分页
      if (this.inputSearchClass && this.searchFlag) {
        this.searchClass2(null, '分页获取查找班级成功')
      } else {
        this.getClasses2()
      }
    },
    // 当前页码
    handleCurrentChange(currPage) {
      this.currentPage = currPage
      console.log(`当前页: ${currPage}`)
      // 分页
      if (this.inputSearchClass && this.searchFlag) {
        this.searchClass2(null, '分页获取查找班级成功')
      } else {
        this.getClasses2()
      }
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
