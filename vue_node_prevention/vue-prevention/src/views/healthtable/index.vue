<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix" style="text-align: center">
            <span>健康信息上报</span>
          </div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="classes" label="班级" />
            <el-table-column prop="address" label="生源地" />
          </el-table>
        </el-card>
        <el-divider />
        <el-card v-if="!show">
          <div slot="header" style="text-align: center">
            <span>今日检测情况</span>
          </div>
          <el-alert
            title="今日申请表提交成功"
            type="success"
            center
            show-icon
          />
          <el-table :data="healthTableData" border style="width: 100%">
            <el-table-column prop="temperature" label="当前体温" />
            <el-table-column prop="hot" label="是否发热、咳嗽" />
            <el-table-column prop="fever" label="是否有去就诊" />
            <el-table-column prop="gohubei" label="是否去过高风险地区" />
            <el-table-column prop="hubeiren" label="是否为高风险地区人员" />
            <el-table-column prop="mask" label="是否接触过高风险地区人员" />
            <el-table-column prop="leaveout" label="是否离开过学校" />
            <el-table-column prop="hesuan" label="是否做过核酸检测" />
            <el-table-column prop="masknum" label="口罩数量" />
            <el-table-column prop="kills" label="杀毒用品是否充足" />
          </el-table>
        </el-card>
        <el-card v-else>
          <el-form ref="form" :model="form" label-width="200px">
            <el-form-item label="当前体温">
              <el-input v-model="form.temp" style="width: 130px" />
            </el-form-item>
            <el-form-item label="是否发热、咳嗽">
              <el-radio-group v-model="form.radio1">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有去就诊">
              <el-radio-group v-model="form.radio2">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否去过高危地区">
              <el-radio-group v-model="form.radio3">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否为高风险地区人员">
              <el-radio-group v-model="form.radio4">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否接触过高风险地区人员">
              <el-radio-group v-model="form.radio5">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否离开过学校">
              <el-radio-group v-model="form.radio6">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否做过核酸检测">
              <el-radio-group v-model="form.radio7">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="口罩数量"
              prop="maskNumber"
              :rules="[
                { required: true, message: '口罩数量不能为空' },
                { type: 'number', message: '口罩数量必须为数字值' },
              ]"
            >
              <el-input v-model.number="form.maskNumber" style="width: 130px" />
            </el-form-item>
            <el-form-item label="杀毒用品是否充足">
              <el-radio-group v-model="form.radio8">
                <el-radio label="否" />
                <el-radio label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { submitHealthList, getMyHealthListToday } from '@/api/student'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      show: true,
      tableData: [],
      healthTableData: [],
      form: {
        temp: '',
        maskNumber: '',
        radio1: '',
        radio2: '',
        radio3: '',
        radio4: '',
        radio5: '',
        radio6: '',
        radio7: '',
        radio8: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'className',
      'address'
    ])
  },
  created() {
    this.tableData = [{
      username: this.name,
      classes: this.className,
      address: this.address
    }]
    // 调用获取当天某用户报表并且决定是否允许填写
    this.getMyHealthListToday()
  },
  methods: {
    // 获取当天某用户报表并且决定是否允许填写
    getMyHealthListToday() {
      getMyHealthListToday({
      }).then((response) => {
        // console.log(response)
        if (response.data.healthData.length === 0) {
          this.show = true
          this.$message(response.msg)
        } else {
          this.show = false
          this.healthTableData = response.data.healthData
          this.successOpen(response.msg)
        }
      })
    },
    // 健康表提交
    onSubmit() {
      submitHealthList({
        temperature: this.form.temp,
        hot: this.form.radio1,
        fever: this.form.radio2,
        gohubei: this.form.radio3,
        hubeiren: this.form.radio4,
        leave: this.form.radio5,
        chat: this.form.radio6,
        hesuan: this.form.radio7,
        masknum: this.form.maskNumber,
        kill: this.form.radio8
      }).then((response) => {
        this.successOpen(response.msg)
        this.show = false
        this.getMyHealthListToday()
      })
    },
    // 提交弹窗
    submit() {
      if (!this.form.temp || !this.form.radio1 || !this.form.radio2 || !this.form.radio3 || !this.form.radio4 || !this.form.radio5 || !this.form.radio6 || !this.form.maskNumber || !this.form.radio7 || !this.form.radio8) {
        this.warningOpen('填报表不可留空')
      } else {
        // let reg = /^\d+(\.\d+)?$/
        const reg1 = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
        const tempBool = reg1.test(this.form.temp)
        // let mskBool = reg.test(this.form.number)
        if (!tempBool) {
          this.warningOpen('体温请输入数字')
        } else {
          this.$confirm('即将提交健康报表, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.onSubmit()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        }
      }
    },
    warningOpen(v) {
      this.$message({
        message: v,
        type: 'warning'
      })
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
<style scoped lang="scss">
</style>
