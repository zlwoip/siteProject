<template>
  <el-card class="flex-sub chart-item-container" :body-style="{padding: 0}" shadow="never">
    <template #header>
      <div class="text-bold">交换机部署情况</div>
    </template>
    <div id="sbiScatterChart" class="chart-item"></div>
  </el-card>

</template>

<script>

import * as echarts from 'echarts'

export default {
  name: 'SbiScatterChart',
  data() {
    return {
      myChart: null,
      dataTimer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(document.getElementById('sbiScatterChart'))
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      this.$post({
        url: this.$urlPath.ShowSwitchDeviceList
      }).then((res) => {
        const tempArr = res.switchDeviceList || []
        const dataArr = [
          { name: '市公司', value: 0 },
          { name: '环翠区', value: 0 },
          { name: '高区', value: 0 },
          { name: '经区', value: 0 },
          { name: '文登', value: 0 },
          { name: '荣成', value: 0 },
          { name: '乳山', value: 0 }
        ]
        dataArr.forEach(dObj => {
          tempArr.forEach(tObj => {
            if (dObj.name === tObj.branch) {
              dObj.value++
            }
          })
        })
        this.init(dataArr)
      })
    })
  },
  beforeDestroy() {
    this.myChart.dispose()
  },
  methods: {
    init(dataArr) {
      const option = {
        grid: {
          left: '12%',
          right: '5%',
          top: '5%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter(params) {
            if (params.data) {
              return `<div style="color:#909399;font-size:12px"><span style="color:#e54d42"> ${params.name} </span> 部署交换机 <span style="color:#e54d42">${params.value}</span> 台</div>`
            }
            return ''
          },
          confine: true,
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            name: '交换机部署情况',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 5,
              smooth: true
            },
            data: dataArr.filter(item => {
              return item.value
            })
          }
        ]
      }
      this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-item-container {
  width: 100%;
  height: 215px;
  .chart-item {
    height: 180px;
  }
}
</style>
