<template>
  <el-card class="flex-sub chart-item-container" :body-style="{padding: 0}" shadow="never">
    <template #header>
      <div class="text-bold">总前端周巡检情况</div>
    </template>
    <div id="upsScatterChart" class="chart-item"></div>
  </el-card>
</template>

<script>

import * as echarts from 'echarts'

export default {
  name: 'UpsScatterChart',
  data() {
    return {
      timeList: [],
      myChart: null,
      dataTimer: null
    }
  },
  mounted() {
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.timeList = [start, end]
    this.$nextTick(() => {
      this.myChart = echarts.init(document.getElementById('upsScatterChart'))
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      this.$post({
        url: this.$urlPath.ShowInspectionPersonList
      }).then((res) => {
        let labels = (res.inspectionPersonList || []).filter(item => {
          return item.state !== '0' && item.type === '值机'
        })
        labels = labels.map(item => {
          return { name: item.name, val: 0 }
        })
        this.init(labels)
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    })
  },
  beforeDestroy() {
    this.myChart.dispose()
  },
  methods: {
    getDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    init(indicatorArr) {
      this.$post({
        url: this.$urlPath.ReadHistoryData,
        data: {
          startDate: this.getDateTime(this.timeList[0]),
          endDate: this.getDateTime(this.timeList[1])
        }
      }).then((res) => {
        if (res.code === 200) {
          const tempArr = []
          res.UpsHistoryData.forEach(obj => {
            const tempObj = JSON.parse(obj.dataJson)
            tempObj.id = obj.id
            tempArr.push(tempObj)
          })
          indicatorArr.forEach(iObj => {
            tempArr.forEach(tObj => {
              if (iObj.name === tObj.name) {
                iObj.val++
              }
            })
          })
          const option = {
            tooltip: {
              trigger: 'item',
              confine: true
            },
            radar: {
              name: {
                textStyle: {
                  color: '#333',
                  fontSize: 10,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 3,
                  padding: [3, 5]
                }
              },
              indicator: indicatorArr,
              radius: 60,
              nameGap: 8
            },
            series: [{
              name: '总前端周巡检情况',
              type: 'radar',
              data: [
                {
                  value: indicatorArr.map(item => {
                    return item.val
                  }),
                  itemStyle: {
                    color: '#a8efeb'
                  },
                  areaStyle: {
                    opacity: 0.8,
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(234, 214, 238, 1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(168, 239, 235, 1)'
                      }
                    ])
                  }
                }
              ]
            }]
          }
          this.myChart.setOption(option)
        } else {
          this.$errorMsg(res.msg)
        }
      })
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
