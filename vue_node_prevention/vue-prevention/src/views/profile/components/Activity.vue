<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg' +
            avatarPrefix
          "
        >
        <span class="username text-muted">教育部</span>
        <span class="description">Shared publicly - 7:30 PM today</span>
      </div>
      <h3>日前，教育部印发通知，部署做好暑期教育系统疫情防控工作。</h3>
      通知要求，各地教育部门和高校要切实提升校园疫情防控风险意识。
      充分认识疫情形势的复杂性，时刻紧绷疫情防控这根弦，筑牢暑期教育系统疫情防线，确保教育系统安全稳定。
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg' +avatarPrefix
          "
        >
        <span class="username text-muted">华南理工大学</span>
        <span class="description">Sent you a message - yesterday</span>
      </div>
      <h3>校内各单位：</h3>
      广州市连续出现确诊病例和无症状感染者，防控工作须臾不可放松。鉴于当前
      疫情防控形势严峻，为严防疫情输入校园，防止爆发校园聚集性疫情，确保师生健康安全
      ，根据广东省、广州市新冠肺炎防控要求，需要进一步提高学校疫情防控级别。
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg' +
            avatarPrefix
          "
        >
        <span class="username">自动化科学与工程学院</span>
        <span class="description">Posted 4 photos - 2 days ago</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="220px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item + carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  data() {
    return {
      carouselImages: [
        'https://img.tukuppt.com//ad_preview/00/14/80/5e61e1ba6d0ea.jpg',
        'https://img.tukuppt.com//ad_preview/00/15/18/5e74cdca77f28.jpg',
        'https://img.tukuppt.com//ad_preview/00/14/41/5e4bca42a8951.jpg',
        'https://img.tukuppt.com//ad_preview/00/14/53/5e537291a5f58.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
