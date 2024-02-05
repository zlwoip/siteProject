<template>
  <div class="main-container" style="height:100%;overflow-y: auto">
    <el-row :gutter="5">
      <el-col v-for="(item, index) of dataList" :key="index" :xs="24" :sm="12" :md="6" class="item-wrapper">
        <DataItem :data-model="item">
          <template v-if="index === 0" #extra="{ extra }">
            <div class="margin-top" style="height: 54px">
              <div class="text-gray">
                巡检端口数:
                <span class="d-value-text">{{ extra.sum }}</span>
                <div class="d-value-line">
                  <i class="el-icon-caret-top d-up" :style="{color:extra.sdv>0?'#6739b6':''}"></i>
                  <i class="el-icon-caret-bottom d-down" :style="{color:extra.sdv<0?'#0081ff':''}"></i>
                  <span :style="{color:extra.sdv>0?'#6739b6':extra.sdv<0?'#0081ff':''}">
                    {{ extra.sdv>=0?`+${extra.sdv}`:`${extra.sdv}` }}
                  </span>
                </div>
              </div>
              <div class="text-gray margin-top-sm">
                异常端口数:
                <span class="d-value-text">{{ extra.error }}</span>
                <div class="d-value-line">
                  <i class="el-icon-caret-top d-up" :style="{color:extra.edv>0?'#e54d42':''}"></i>
                  <i class="el-icon-caret-bottom d-down" :style="{color:extra.edv<0?'#39b54a':''}"></i>
                  <span :style="{color:extra.edv>0?'#e54d42':extra.edv<0?'#39b54a':''}">
                    {{ extra.edv>=0?`+${extra.edv}`:`${extra.edv}` }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="index === 1" #extra="{ extra }">
            <div class="margin-top" style="position: relative;height: 54px">
              <div class="text-gray">
                巡检ups数:
                <span class="d-value-text">{{ extra.sum }}</span>
                <div class="d-value-line">
                  <i class="el-icon-caret-top d-up" :style="{color:extra.sdv>0?'#6739b6':''}"></i>
                  <i class="el-icon-caret-bottom d-down" :style="{color:extra.sdv<0?'#0081ff':''}"></i>
                  <span :style="{color:extra.sdv>0?'#6739b6':extra.sdv<0?'#0081ff':''}">
                    {{ extra.sdv>=0?`+${extra.sdv}`:`${extra.sdv}` }}
                  </span>
                </div>
              </div>
              <div class="text-gray margin-top-sm">
                异常ups数:
                <span class="d-value-text">{{ extra.error }}</span>
                <div class="d-value-line">
                  <i class="el-icon-caret-top d-up" :style="{color:extra.edv>0?'#e54d42':''}"></i>
                  <i class="el-icon-caret-bottom d-down" :style="{color:extra.edv<0?'#39b54a':''}"></i>
                  <span :style="{color:extra.edv>0?'#e54d42':extra.edv<0?'#39b54a':''}">
                    {{ extra.edv>=0?`+${extra.edv}`:`${extra.edv}` }}
                  </span>
                </div>
              </div>
              <div class="stack-avatar-wrapper">
                <img :src="require(`@/assets/signImg/${extra.sign}.png`)" title="巡检员电子签名" style="height: 36px;margin-right: 30px" />
              </div>
            </div>
          </template>
          <template v-else-if="index === 2" #extra>
            <div id="operatorChart" style="width: 100%;height: 100px"></div>
          </template>
          <template v-else-if="index === 3" #extra>
            <div id="alarmChart" style="width: 100%;height: 69px"></div>
          </template>
        </DataItem>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataItem from './components/DataItem'

export default {
  name: 'Main',
  components: {
    DataItem
  },
  data() {
    return {
      dataList: [
        {
          title: '最近一次交换机巡检',
          data: '00:00:00',
          bottomTitle: '已累计巡检',
          totalSum: '0次',
          extra: {
            sum: 0,
            error: 0,
            sdv: 0,
            edv: 0
          }
        },
        {
          title: '最近一次ups巡检',
          data: '00:00:00',
          bottomTitle: '已累计巡检',
          totalSum: '0次',
          extra: {
            sum: 0,
            error: 0,
            sdv: 0,
            edv: 0,
            sign: 'signTemp'
          }
        },
        {
          title: '值机轮班时刻表',
          data: '',
          bottomTitle: '当前坐班人',
          totalSum: ''
        },
        {
          title: '光功率周报警统计',
          data: '189次',
          bottomTitle: '今日发生报警',
          totalSum: '0次'
        }
      ],
      operatorChart: null,
      alarmChart: null,
      dataTimer: null
    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  destroyed() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.d-value-text {
  color: #737373;
  font-weight: bolder;
}
.d-value-line {
  margin-left: 5px;
  position: relative;
  display: inline-block;
  .d-up {
    position: absolute;
    top: -4px;
    left: 0;
  }
  .d-down {
    position: absolute;
    top: 3px;
    left: 0;
  }
  span {
    padding-left: 20px;
    font-size: 12px;
    transform: scale(0.5);
    opacity: 0.5;
    span {
      font-weight: bold;
    }
  }
}
.chart-item {
  background-color: #fff;
}
.stack-avatar-wrapper {
  position: absolute;
  right: -2%;
  top: 10%;
}
.avatar {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #f5f5f5;
}
</style>
