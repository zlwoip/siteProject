<template>
  <!-- 表单渲染 -->
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancelView"
    :visible="visible"
    :title="title"
    top="25vh"
    width="680px"
  >
    <div style="padding-left: 20px">
      <span class="label">检索时间范围:</span>
      <el-date-picker
        v-model="timeList"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        size="mini"
        style="margin:0 10px"
      />
      <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
    </div>
    <div ref="chartCurve" style="width: 100%;height: 200px"></div>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" icon="el-icon-circle-close" @click="cancelView">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>

import * as echarts from 'echarts'

export default {
  data() {
    return {
      visible: false,
      title: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近24小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近72小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近7天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeList: [],
      iptv: {},
      port: {}
    }
  },
  mounted() {
  },
  methods: {
    getDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    showView() {
      this.visible = true
    },
    hideView() {
      this.visible = false
    },
    cancelView() {
      this.hideView()
    },
    initCharts(dataList) {
      this.$nextTick(() => {
        const chartCurve = echarts.init(this.$refs.chartCurve)
        const inputDataList = []
        const outputDataList = []
        dataList.forEach(item => {
          inputDataList.push([new Date(item.DateTime).getTime(), Number(item.receiveOptical) || 0])
          outputDataList.push([new Date(item.DateTime).getTime(), Number(item.outputOptical) || 0])
        })
        inputDataList.sort((a, b) => {
          return a[0] - b[0]
        })
        outputDataList.sort((a, b) => {
          return a[0] - b[0]
        })
        const option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%']
            }
          },
          color: ['#4D2BD5', '#E66B1A'],
          legend: {
            textStyle: {
              color: '#666'
            }
          },
          grid: {
            left: '8px',
            right: '8px',
            top: '28px',
            bottom: '8px',
            containLabel: true
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 2,
              color: '#333'
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#333'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [
            {
              name: '光接收功率',
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(55, 162, 255, 0.1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(116, 21, 219, 1)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: inputDataList
            },
            {
              name: '光发射功率',
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              label: {
                show: true,
                position: 'top'
              },
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 191, 0, 0.1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(224, 62, 76, 1)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: outputDataList
            }
          ]
        }
        chartCurve.setOption(option)
      })
    },
    search() {
      return this.$post({
        url: this.$urlPath.ReadSwitchHistoryData,
        data: {
          startDate: this.getDateTime(this.timeList[0]),
          endDate: this.getDateTime(this.timeList[1]),
          portId: this.port.portId
        }
      }).then((res) => {
        this.initCharts(res.SwitchHistoryData || [])
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    loadData(iptv, port) {
      this.iptv = iptv
      this.port = port
      this.title = `${iptv.switchName}-${port.portName} 历史曲线图`
      this.showView()
      this.$nextTick(() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        this.timeList = [start, end]
        this.search()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cell-box {
  min-width: 120px;

  .cell-input {
    width: 150px;
  }

  .cell-select {
    width: 220px;
  }

  > > > .el-input__inner {
    border: 1px solid rgba(100, 100, 100, 0.1);
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 5px;
  }

  > > > .el-input.is-disabled .el-input__inner {
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid rgba(100, 100, 100, 0.4);
    background: white;
    cursor: text;
  }

  > > > .el-input.is-disabled .el-input__icon {
    cursor: text;
  }

  > > > .el-icon-circle-check {
    color: #13ce66;
  }

  > > > .el-icon-arrow-up:before {
    content: '';
  }
}
</style>
