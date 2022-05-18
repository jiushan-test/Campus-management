<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2021/6/15',
          title: 'Update Github node',
          content: 'AnyWay committed 2021/6/15 20:46'
        },
        {
          timestamp: '2021/6/30',
          title: 'Update Github vue',
          content: 'AnyWay committed 2021/6/30 20:46'
        },
        {
          timestamp: '2021/7/5',
          title: 'Build Template',
          content: 'AnyWay committed 2021/7/5 20:46'
        },
        {
          timestamp: '2021/7/5',
          title: 'Release New Version',
          content: 'AnyWay committed 2021/7/5 20:46'
        }
      ]
    }
  }
}
</script>
