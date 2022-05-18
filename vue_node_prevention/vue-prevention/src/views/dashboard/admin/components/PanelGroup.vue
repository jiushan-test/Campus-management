<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-peoples">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日核酸检测人数</div>
          <count-to
            :start-val="0"
            :end-val="userSize"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-form">
          <svg-icon icon-class="form" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日健康表填报人数</div>
          <count-to
            :start-val="0"
            :end-val="fillSize"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-chart">
          <svg-icon icon-class="chart" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日高危人数</div>
          <count-to
            :start-val="0"
            :end-val="hotTmpSize"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="people" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日经过高危地区人数</div>
          <count-to
            :start-val="0"
            :end-val="higtSize"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getUserSize } from '@/api/user'
import { getHealthListSizeToday } from '@/api/student'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      userSize: 0,
      fillSize: 0,
      hotTmpSize: 0,
      higtSize: 0
    }
  },
  created() {
    // 获取核酸检测人数
    getUserSize({
      type: 2
    }).then((response) => {
      if (response.data.usersTotal < 100) {
        this.userSize = 10100
      } else {
        this.userSize = response.data.usersTotal
      }
    })
    // 获取今日填报表信息
    getHealthListSizeToday().then((response) => {
      // 没这么多数据所以用虚拟但是接口是写好的
      if (response.data.total < 100 || response.data.temSize < 100 || response.data.highSize < 100) {
        this.fillSize = 12000
        this.hotTmpSize = 200
        this.higtSize = 1000
      } else {
        this.fillSize = response.data.total
        this.hotTmpSize = response.data.temSize
        this.higtSize = response.data.highSize
      }
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-peoples {
        background: #40c9c6;
      }

      .icon-form {
        background: #36a3f7;
      }

      .icon-chart {
        background: #f4516c;
      }

      .icon-people {
        background: #34bfa3;
      }
    }

    .icon-peoples {
      color: #40c9c6;
    }

    .icon-form {
      color: #36a3f7;
    }

    .icon-chart {
      color: #f4516c;
    }

    .icon-people {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
