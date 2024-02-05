<template>
  <div class="notify-container flex justify-start">
    <div class="flex justify-center align-center icon-wrapper">
      <i class="el-icon-star-on"></i>
    </div>
    <div class="flex-sub margin-left-xs">
      <div class="title text-cut">交换机发生数据异或常网管不上，请检查设备状态</div>
      <div class="time">1小时前</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem'
}
</script>

<style lang="scss" scoped>
.notify-container {
  padding: 10px;
  .icon-wrapper {
    width: 30px;
    min-width: 30px;
    max-width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    background-color: #ffce3d;
    font-size: 18px;
  }
  .title {
    font-size: 14px;
    color: #333;
  }
  .time {
    margin-top: 10px;
    font-size: 12px;
    color: #888;
  }
}
</style>
