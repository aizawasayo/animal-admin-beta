<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎， {{ username }}</div>
    <!-- <div class="test-title">这是页面引入图片，图片小于url-loader的limit值</div>
    <img src="@/assets/denglun.jpg" class="test-image" />
    <div class="test-bg">这是引入背景图，css在组件内，图片大于url-loader的limit值</div>
    <div class="test-index-bg">这是引入背景图，css在index.scss，图片大于url-loader的limit值</div>
    <div class="test-limit-bg">这是引入背景图，css在index.scss，图片小于url-loader的limit值</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: { ...mapGetters(['username']) }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.test-bg {
  width: 600px;
  height: 150px;
  line-height: 100px;
  text-align: center;
  color: goldenrod;
  background-image: url('../../assets/denglun-bg.jpg');
  background-size: contain;
}
</style>
