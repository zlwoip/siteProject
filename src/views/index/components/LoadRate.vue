<template>
  <el-card class="flex-sub chart-item-container" :body-style="{padding: 0}" shadow="never">
    <template #header>
      <div class="text-bold">
        巡检电源负载率TOP一览
      </div>
    </template>
    <div id="loadRateChart" class="chart-item"></div>
  </el-card>

</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LoadRate',
  data() {
    return {
      myChart: null,
      dataTimer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(document.getElementById('loadRateChart'))
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      let dataArr = []
      const lastUPSDataList = localStorage.getItem('lastUPSDataList')
      if (lastUPSDataList) {
        const lastUPSDataListArr = JSON.parse(lastUPSDataList)
        dataArr = lastUPSDataListArr.sort((a, b) => {
          return (Number(b.load) || 0) - (Number(a.load) || 0)
        })
      }
      this.init(dataArr.slice(0, 8))
    })
  },
  beforeDestroy() {
    this.myChart.dispose()
  },
  methods: {
    init(dataArr) {
      const option = {
        grid: {
          containLabel: false,
          show: false,
          right: 10,
          left: 0,
          bottom: 0,
          top: 0
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            if (params[0].data) {
              return `<div style="color:#909399;font-size:12px"><span style="color:#e54d42"> ${params[0].axisValue} </span> 设备当前负载 <span style="color:#e54d42">${params[0].data}%</span></div>`
            }
            return ''
          },
          confine: true,
          axisPointer: {
            type: 'shadow'
          },
          borderColor: '#6739b6'
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: dataArr.map(item => {
            return item.name
          }),
          axisLabel: {
            inside: true,
            color: '#fff'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: dataArr.map(item => {
              return Number(item.load) || 0
            }),
            type: 'bar',
            smooth: true,
            showSymbol: false,
            showBackground: true,
            barWidth: 'auto',
            itemStyle: {
              borderRadius: [0, 15, 15, 0],
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(12, 124, 182)'
                },
                {
                  offset: 1,
                  color: 'rgba(244, 187, 236)'
                }
              ])
            },
            label: {
              show: true,
              position: 'right',
              fontSize: 9,
              formatter: '{c}%'
            }
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
