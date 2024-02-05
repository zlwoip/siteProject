<template>
  <div class="notify-container">
    <div class="icon-wrapper">
      <i class="el-icon-star-on"></i>
    </div>
    <div class="flex-sub margin-left-xs">
      <div class="title text-cut" title="交换机发生异或常网管不上，请检查...">交换机发生异或常网管不上，请检查...</div>
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
  display: flex;
  justify-content: flex-start;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    min-width: 30px;
    max-width: 30px;
    height: 30px;
    border-radius: 50%;
    color: currentColor;
    background-color: #ffce3d;
    font-size: 18px;
  }
  .title {
    font-size: 14px;
  }
  .time {
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>
