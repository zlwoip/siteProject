<template>
  <div class="notify-container">
    <div class="title text-cut" title="交换机发生异或常网管不上，请检查...">交换机发生异或常网管不上，请检查...</div>
    <div class="status">
      <el-tag
        type="primary"
        size="mini"
      >进行中</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoItem'
}
</script>

<style lang="scss" scoped>
.notify-container {
  padding: 10px;
  .title {
    font-size: 14px;
  }
  .status {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
