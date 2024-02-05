<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper" :style="{background:waterMark?`url(${waterMark.toDataURL('image/png')}) left top repeat`:``}">
          <div class="left-wrapper">
            <span class="label">数据检索条件:</span>
            <el-input v-model="query.switchIP" clearable size="mini" placeholder="请输入交换机IP" style="width: 180px;margin:0 5px" />
            <el-input v-model="query.portName" clearable size="mini" placeholder="请输入交换机端口" style="width: 180px;margin:0 5px" />
            <el-input v-model="query.portDescription" clearable size="mini" placeholder="请输入端口描述" style="width: 180px;margin:0 5px" />
          </div>
          <div class="flex-sub">
            <el-button type="primary" size="mini" icon="el-icon-magic-stick" @click="search">过滤</el-button>
            <el-button size="mini" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
          </div>
          <div class="right-wrapper">
            <el-button type="primary" size="mini" icon="el-icon-download" @click="loadData">拉取数据</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" style="display:none" @click="toSetting">监听设置</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" :style="{background:waterMark?`url(${waterMark.toDataURL('image/png')}) left top repeat`:``}">
        <div class="table-card-box">
          <div class="table-card-title">
            <el-row>
              <el-col v-if="!loading" :span="20" style="padding-left: 18px">
                本次巡检共检测到<span style="color:#0000CD;"> {{ deviceNum }} </span>个交换机终端，监听到<span style="color:#008B00;"> {{ dataNum }} </span>个端口，异常端口<span :class="errorNum?'underline touch':'underline'" :title="errorNum?'点击查看异常清单':''" :style="{color: errorNum?'red':'#00CD66'}" @click="openErrorLog()"> {{ errorNum }} </span>个
              </el-col>
              <el-col v-if="!loading" :span="4" style="text-align: right">
                <span style="padding-right:18px; font-size: 16px;color: #666">{{ dateTime }}</span>
              </el-col>
              <el-col v-else :span="24" style="padding-left: 18px;text-align: center">
                <span v-if="dateTime"> <i class="el-icon-loading"></i> 正在巡检中，请稍后...</span>
                <span v-else> <i class="el-icon-info"></i> 请点击“拉取数据”按钮开始巡检</span>
              </el-col>
            </el-row>
          </div>
          <div v-for="(iptv, i) in tableList" :key="'iptv_'+i" class="box-card">
            <div class="line-title">
              <div class="title-point"><img :src="require('@/assets/Routers.png')" /></div>
              <span class="title-lable">{{ iptv.switchName }}</span>
              <span class="title-ip"><img :src="require('@/assets/IP.png')" /> {{ iptv.switchIP }} </span>
              <span class="title-ups" :style="{color:iptv.upsStu==='电源正常'?'#00CD66':(iptv.upsStu==='电源异常'?'#f00':'')}">
                <div v-if="iptv.upsStu==='电源正常'" class="link-loading"></div>
                <img :src="require('@/assets/ups.png')" />
                <el-popover placement="bottom" width="280" trigger="hover">
                  <el-table :data="iptv.switchPowerList||[]" size="mini" border stripe tooltip-effect="dark" width="100%">
                    <el-table-column width="180" property="power" label="电源名称" />
                    <el-table-column property="powerState" label="电源状态" align="center" :formatter="(row, col, val)=>{return val===1?`正常`:`异常`}" />
                  </el-table>
                  <span slot="reference"> {{ iptv.upsStu||'暂无' }} </span>
                </el-popover>
              </span>
              <div class="title-line"></div>
            </div>
            <div style="padding-top:10px">
              <table class="table">
                <tr class="tr">
                  <th class="th">端口<img :src="require('@/assets/port.png')" style="transform: scaleX(0.9) scaleY(0.9)" /></th>
                  <th class="th">描述<img :src="require('@/assets/locat.png')" /></th>
                  <th class="th">光接收功率<img :src="require('@/assets/wave.png')" /></th>
                  <th class="th">光发射功率<img :src="require('@/assets/wave.png')" /></th>
                </tr>
                <tr v-for="(port, ii) in iptv.switchPortList" :key="'p_'+i+'_'+ii" class="tr">
                  <td>
                    <span class="color-dot" :style="{backgroundColor:colorScheme[ii]}"></span>
                    <span class="touch link-text" title="点击查看历史曲线" @click="toHistory(iptv,port)">
                      {{ port.portName }}
                    </span>
                  </td>
                  <td>{{ port.portDescription }}</td>
                  <td><span :style="{color:port.vr?'#f00':''}" :title="port.vr?'光功率数据异常':''">{{ port.receiveOptical }}</span></td>
                  <td :style="{color:port.vo?'#f00':''}" :title="port.vo?'光功率数据异常':''">{{ port.outputOptical }}</td>
                </tr>
              </table>
            </div>
            <div style="width: 100%">
              <div style="width: 50%;display: inline-block;overflow: hidden;">
                <div :id="`chartPi${i}`" style="height: 180px;margin-top: -90px"></div>
              </div>
              <div style="width: 50%;display: inline-block;overflow: hidden;">
                <div :id="`chartPo${i}`" style="height: 180px;margin-top: -90px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <error-log ref="errorLogPage" />
    <setting-page ref="settingPage" />
    <history-page ref="historyPage" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import errorLog from './errorLog'
import settingPage from './setting'
import historyPage from './history'
import { mapGetters } from 'vuex'

export default {
  components: { errorLog, settingPage, historyPage },
  data() {
    return {
      colorScheme: [
        '#ff7875',
        '#ff9c6e',
        '#ffc069',
        '#ffd666',
        '#b37feb',
        '#727bec',
        '#3eaf7c',
        '#4a657a',
        '#223273',
        '#6f6f6f',
        '#37a2da',
        '#67e0e3',
        '#9fe6b8',
        '#ffdb5c',
        '#ff9f7f',
        '#e062ae',
        '#e690d1',
        '#e7bcf3',
        '#9d96f5',
        '#8378EA'
      ],
      waterMark: '',
      loading: true,
      dateTime: '',
      deviceNum: 0,
      dataNum: 0,
      errorNum: 0,
      query: {
        switchIP: '',
        portName: '',
        portDescription: ''
      },
      dataList: [],
      tableList: [],
      portlist: [],
      powerList: [],
      chartsList: []
    }
  },
  computed: {
    ...mapGetters({
      sbConfig: 'config/getSwitchboardConfig'
    })
  },
  mounted() {
    this.$nextTick(() => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.height = 160
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalAlpha = 0.12
      ctx.font = '20px Microsoft Yahei'
      ctx.translate(80, 80)
      ctx.rotate(-Math.PI / 4)
      ctx.fillText(`威海广电网络`, 0, 0)
      this.waterMark = canvas
      // this.tableList = this.dataList
      // this.initCharts()
      const lastSBIRecord = localStorage.getItem('lastSBIRecord')
      if (lastSBIRecord) {
        const lastSBIRecordObj = JSON.parse(lastSBIRecord)
        this.dataList = lastSBIRecordObj.dataList
        this.dateTime = lastSBIRecordObj.dateTime
        this.search()
      }
    })
  },
  methods: {
    randNum(min, max, len, isRound) {
      var arr = []
      for (let i = 0; i < len; i++) {
        var num
        num = Math.random() * (max - min) + min
        if (isRound) {
          num = Math.round(num)
          arr.push(num)
        } else {
          arr.push(num.toFixed(2))
        }
      }
      return arr
    },
    getNowDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    openErrorLog() {
      if (this.errorNum) {
        this.$refs.errorLogPage.loadData({
          dateTime: this.dateTime,
          tableList: this.tableList.filter(iptv => {
            return iptv.vd
          })
        })
      }
    },
    search(isSaveLocalStorage) {
      if (isSaveLocalStorage) {
        localStorage.setItem('lastSBIRecord', JSON.stringify({
          dataList: this.dataList,
          dateTime: this.dateTime
        }))
      }
      this.tableList = JSON.parse(JSON.stringify(this.dataList))
      if (this.query.switchIP) {
        this.tableList = this.tableList.filter(item => {
          return item.switchIP.indexOf(this.query.switchIP) >= 0
        })
      }
      if (this.query.portName) {
        this.tableList.forEach(iptv => {
          iptv.switchPortList = iptv.switchPortList.filter(item => {
            return item.portName.indexOf(this.query.portName) >= 0
          })
        })
        this.tableList = this.tableList.filter(item => {
          return item.switchPortList.length
        })
      }
      if (this.query.portDescription) {
        this.tableList.forEach(iptv => {
          iptv.switchPortList = iptv.switchPortList.filter(item => {
            return item.portDescription.indexOf(this.query.portDescription) >= 0
          })
        })
        this.tableList = this.tableList.filter(item => {
          return item.switchPortList.length
        })
      }
      this.loading = false
      this.initCharts()
      this.validateValue()
      if (isSaveLocalStorage) {
        const lastSBIResult = localStorage.getItem('lastSBIResult')
        if (lastSBIResult) {
          const lastSBIResultObj = JSON.parse(lastSBIResult)
          localStorage.setItem('lastSBIResult', JSON.stringify({
            dataNum: this.dataNum,
            errorNum: this.errorNum,
            dateTime: this.dateTime,
            sdv: this.dataNum - (Number(lastSBIResultObj.dataNum) || 0),
            edv: this.errorNum - (Number(lastSBIResultObj.errorNum) || 0),
            count: (Number(lastSBIResultObj.count) || 0) + 1
          }))
        } else {
          localStorage.setItem('lastSBIResult', JSON.stringify({
            dataNum: this.dataNum,
            errorNum: this.errorNum,
            dateTime: this.dateTime,
            sdv: this.dataNum,
            edv: this.errorNum,
            count: 1
          }))
        }
      }
    },
    resetSearch() {
      this.query.switchIP = ''
      this.query.portName = ''
      this.query.portDescription = ''
      this.tableList = this.dataList
      this.search()
    },
    toSetting() {
      this.$refs.settingPage.loadData()
    },
    validateValue() {
      this.deviceNum = 0
      this.dataNum = 0
      this.errorNum = 0
      // 电源
      this.tableList.forEach(swObj => {
        let stu = 0
        swObj.switchPowerList.forEach(powerObj => {
          stu += powerObj.powerState
        })
        if (stu === swObj.switchPowerList.length) {
          swObj.upsStu = '电源正常'
        } else {
          swObj.upsStu = '电源异常'
        }
      })
      // 端口
      this.tableList.forEach(swObj => {
        swObj.switchPortList.forEach(pObj => {
          if (
            pObj.receiveOptical === '网管不上' ||
            (pObj.upperAlarmValue && Number(pObj.upperAlarmValue) < (Number(pObj.receiveOptical))) ||
            (pObj.lowerAlarmValue && Number(pObj.lowerAlarmValue) > (Number(pObj.receiveOptical)))
          ) {
            pObj.vr = true
            this.errorNum++
            swObj.vd = true
          }
          if (pObj.outputOptical === '网管不上') {
            pObj.vo = true
            if (!pObj.vr) {
              this.errorNum++
              swObj.vd = true
            }
          }
          this.dataNum++
        })
        this.deviceNum++
      })
    },
    toHistory(iptv, port) {
      this.$refs.historyPage.loadData(iptv, port)
    },
    initCharts() {
      this.$nextTick(() => {
        this.tableList.forEach((iptv, index) => {
          const dataList = []
          let sum = 0
          iptv.switchPortList.forEach(item => {
            const value = (Number(item.receiveOptical) || 0) + 30
            sum += value
            dataList.push({
              value: value,
              name: item.portName
            })
          })
          dataList.push({
            value: sum,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label: {
              show: false
            }
          })
          const chart = echarts.init(document.getElementById(`chartPi${index}`))
          const option = {
            title: {
              show: true,
              text: '光接收功率分布',
              left: 'center',
              bottom: '-6',
              textStyle: {
                color: '#999',
                fontSize: '12'
              }
            },
            color: this.colorScheme,
            tooltip: {
              trigger: 'item',
              valueFormatter: (value) => {
                return (value - 30).toFixed(2)
              },
              position: ['24%', '70%']
            },
            legend: {
              show: false
            },
            grid: {
              left: '0px',
              right: '0px',
              top: '0px',
              bottom: '0px',
              containLabel: false
            },
            series: [
              {
                type: 'pie',
                roseType: 'radius',
                radius: ['70%', '90%'],
                center: ['50%', '100%'],
                startAngle: 180,
                label: {
                  show: false
                },
                data: dataList
              }
            ]
          }
          chart.setOption(option)
        })
        this.tableList.forEach((iptv, index) => {
          const dataList = []
          let sum = 0
          iptv.switchPortList.forEach(item => {
            const value = (Number(item.outputOptical) || 0) + 30
            sum += value
            dataList.push({
              value: value,
              name: item.portName
            })
          })
          dataList.push({
            value: sum,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label: {
              show: false
            }
          })
          const chart = echarts.init(document.getElementById(`chartPo${index}`))
          const option = {
            title: {
              show: true,
              text: '光发射功率分布',
              left: 'center',
              bottom: '-6',
              textStyle: {
                color: '#999',
                fontSize: '12'
              }
            },
            color: this.colorScheme,
            tooltip: {
              trigger: 'item',
              valueFormatter: (value) => {
                return (value - 30).toFixed(2)
              },
              position: ['24%', '70%']
            },
            legend: {
              show: false
            },
            grid: {
              left: '0px',
              right: '0px',
              top: '0px',
              bottom: '0px',
              containLabel: false
            },
            series: [
              {
                type: 'pie',
                roseType: 'radius',
                radius: ['70%', '90%'],
                center: ['50%', '100%'],
                startAngle: 180,
                label: {
                  show: false
                },
                data: dataList
              }
            ]
          }
          chart.setOption(option)
        })
      })
    },
    readSwitchPort(parmObj) {
      return this.$post({
        url: this.$urlPath.readSwitchPort,
        data: {
          switchIP: parmObj.switchIP,
          receiveOpticalOid: parmObj.receiveOpticalOid,
          outputOpticalOid: parmObj.outputOpticalOid
        }
      }).then((res) => {
        parmObj.receiveOptical = res.SwitchOptical.OpticalData.receiveOptical
        parmObj.outputOptical = res.SwitchOptical.OpticalData.outputOptical
        parmObj.isComplete = true
      })
    },
    readSwitchPower(parmObj) {
      return this.$post({
        url: this.$urlPath.readSwitchPower,
        data: {
          switchIP: parmObj.switchIP,
          powerOid: parmObj.powerOid
        }
      }).then((res) => {
        parmObj.powerState = Number(res.power.powerState) || 0
        parmObj.isComplete = true
      })
    },
    pullData() {
      let flagPort = false
      let flagPower = false
      this.portlist.forEach(portObj => {
        this.readSwitchPort(portObj).then(() => {
          let i
          for (i = 0; i < this.portlist.length; i++) {
            if (!this.portlist[i].isComplete) {
              break
            }
          }
          if (i === this.portlist.length) {
            flagPort = true
            if (flagPort && flagPower) {
              this.search(true)
            }
          }
        })
      })
      this.powerList.forEach(portObj => {
        this.readSwitchPower(portObj).then(() => {
          let i
          for (i = 0; i < this.powerList.length; i++) {
            if (!this.powerList[i].isComplete) {
              break
            }
          }
          if (i === this.powerList.length) {
            flagPower = true
            if (flagPort && flagPower) {
              this.search(true)
            }
          }
        })
      })
    },
    clearData() {
      this.dateTime = ''
      this.deviceNum = 0
      this.dataNum = 0
      this.errorNum = 0
      this.dataList = []
      this.tableList = []
      this.portlist = []
      this.powerList = []
      this.chartsList = []
    },
    loadData() {
      this.clearData()
      this.dateTime = this.getNowDateTime()
      this.loading = true
      this.$post({
        url: this.$urlPath.ShowSwitchDeviceList
      }).then((res) => {
        this.dataList = res.switchDeviceList || []
        this.dataList.forEach(swObj => {
          swObj.switchPortList.forEach(tempObj => {
            tempObj.switchIP = swObj.switchIP
            tempObj.isComplete = false
            this.portlist.push(tempObj)
          })
          swObj.switchPowerList.forEach(tempObj => {
            tempObj.switchIP = swObj.switchIP
            tempObj.isComplete = false
            this.powerList.push(tempObj)
          })
        })
        this.pullData()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 6px 12px;
  padding: 10px 6px;
  width: 48%;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: 1px 2px 8px 0 rgba(0,0,0,0.12);
  border-radius: 10px;
  .line-title {
    padding: 0;
    position: relative;
    border-bottom: 3px solid #0457C7;
    font-size: 16px;
    color: #333333;
    .title-point {
      position: absolute;
      top: 1px;
    }
    .title-lable {
      padding-left: 26px;
      font-weight: bolder;
    }
    .title-ip {
      float: right;
      padding-right: 5px;
      color: #999999;
      font-size: 14px;
      img {
        position: relative;
        top: 3px;
      }
    }
    .title-ups {
      float: right;
      padding-right: 20px;
      color: #999999;
      font-size: 14px;
      .link-loading {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        left: 16px;
        top: 2px;
        border-radius: 50%;
        box-shadow: inset 1px -1px #999999;
        animation: spin 4s linear infinite;
        &::before,
        &::after {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: inherit;
          box-shadow: inherit;
        }
        &::before {
          filter: blur(5px);
        }
        &::after {
          filter: blur(50px);
        }
      }
      img {
        position: relative;
        top: 3px;
      }
    }
    .title-line{
      width: 100%;
      position: absolute;
      bottom: -7px;
      border-bottom: 2px solid #1961C5;
      opacity: 0.35
    }
  }
}
.table-card-box {
  .table-card-title {
    width: 100%;
    padding: 2px;
    margin-bottom: 10px;
    color: #4e4e4e;
    font-weight: bold;
    font-size: 14px;
    background-color: rgba(0,0,0,0.1);
    span {
      font-size: 18px;
    }
  }
  table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    border-radius: 5px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 4px;
    border-radius: 5px;
    text-align: center;
    img {
      position: absolute;
      padding: 0 4px;
    }
  }
  th {
    background-color: #e2e2e2;
    font-weight: bold;
  }
  .bk {
    background-color: #f2f2f2;
  }
}
.table-header-container {
  .wrapper {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .left-wrapper {
      margin-left: 15px;
    }

    .flex-sub {
      padding: 0 20px;
    }

    .right-wrapper {
      margin-right: 15px;
    }

    .label {
      padding: 0 10px;
    }
  }

  .search-content-wrapper {
    padding: 10px;

    .search-item-wrapper {
      justify-content: center;
      align-items: center;

      & > span {
        color: #606266;
        font-size: 14px;
        font-weight: 500;
        margin-right: 8px;
      }

      .form-item {
        flex: 1;
      }
    }
  }
}
.table-container {
  .wrapper {
    height: 70vh;
    padding: 4px 20px;
    overflow-y: auto;
  }
}
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
