<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper" :style="{background:waterMark?`url(${waterMark.toDataURL('image/png')}) left top repeat`:``}">
          <div class="left-wrapper">
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
            />
          </div>
          <div class="flex-sub">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="toSearch">查询</el-button>
          </div>
          <div class="right-wrapper">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="toAdd">新增巡检</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="toSetting">监听设置</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" :style="{background:waterMark?`url(${waterMark.toDataURL('image/png')}) left top repeat`:``}">
        <el-timeline>
          <el-timeline-item v-for="(item,index) in tableList" :key="'tm_'+index" :timestamp="item.dateTime" :type="item.completed?(item.errorNum?(!item.dispose?'danger':'success'):'success'):(item.status===3?'primary':(item.status===2?'info':''))" placement="top">
            <el-card v-if="item.completed">
              <div style="font-size: 16px;color: #999999">
                <span style="font-size: 20px;font-weight: bold;color: black">{{ item.name }}</span>
                完成巡检
                <i v-if="item.errorNum>0 && !item.dispose" class="el-icon-warning" style="color:#FF8C00"></i>
                <i v-else class="el-icon-success" style="color:#00CD66"></i>
              </div>
              <div class="expand-btn touch" @click="expandTable(item)">
                <span v-if="item.expand" title="收起">收起 <i class="el-icon-d-arrow-right" style="transform: rotate(90deg)"></i></span>
                <span v-else title="点击查看巡检报告">展开 <i class="el-icon-d-arrow-right"></i></span>
              </div>
              <img class="signImg" :src="require(`@/assets/signImg/${item.signImg}.png`)" />
              <img v-show="item.dispose" class="signImg" :src="require('@/assets/dispose.png')" height="80px" style="left:170px;transform:rotate(-30deg)" />
              <img class="signImg" :src="require(`@/assets/completed_${item.errorNum&&!item.dispose?'r':'g'}.png`)" height="40px" style="left:630px;top:60px;transform:rotate(-30deg)" />
              <p style="margin-bottom: 0">本次巡检共发现
                <span
                  :class="item.errorNum?'underline touch':'underline'"
                  :title="item.errorNum?'点击查看异常清单':''"
                  :style="{fontSize:'22px',fontWeight:'bold',color: item.errorNum?'red':'#00CD66'}"
                  @click="openErrorLog(item)"
                >
                  {{ item.errorNum }}
                </span>
                个设备异常
              </p>
              <div v-show="item.expand" style="margin-top:12px">
                <div class="table-card-box">
                  <div class="table-card-title">总前端120KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">电源</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压A (V)</th>
                      <th class="th">输入电压B (V)</th>
                      <th class="th">输入电压C (V)</th>
                      <th class="th">输出电压A (V)</th>
                      <th class="th">输出电压B (V)</th>
                      <th class="th">输出电压C (V)</th>
                      <th class="th">负载A (%)</th>
                      <th class="th">负载B (%)</th>
                      <th class="th">负载C (%)</th>
                    </tr>
                    <tr v-for="(n0, i0) in item.upsList[0]" :key="'n_'+index+'_'+i0" class="tr">
                      <td :class="'td '+ (n0.bkc||'')">{{ n0.name }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vh?'#f00':''}" :title="n0.vh||''">{{ n0.heat }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.via?'#f00':''}" :title="n0.via||''">{{ n0.inputA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vib?'#f00':''}" :title="n0.vib||''">{{ n0.inputB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vic?'#f00':''}" :title="n0.vic||''">{{ n0.inputC }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.voa?'#f00':''}" :title="n0.voa||''">{{ n0.outputA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vob?'#f00':''}" :title="n0.vob||''">{{ n0.outputB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.voc?'#f00':''}" :title="n0.voc||''">{{ n0.outputC }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vla?'#f00':''}" :title="n0.vla||''">{{ n0.loadA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vlb?'#f00':''}" :title="n0.vlb||''">{{ n0.loadB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vlc?'#f00':''}" :title="n0.vlc||''">{{ n0.loadC }}</td>
                    </tr>
                  </table>
                </div>
                <div class="table-card-box">
                  <div class="table-card-title">一级分前端10KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">分公司</th>
                      <th class="th">分前端</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压 (V)</th>
                      <th class="th">输出电压 (V)</th>
                      <th class="th">负载 (%)</th>
                    </tr>
                    <tr v-for="(n1, i1) in item.upsList[1]" :key="'n_'+index+'_'+i1" class="tr">
                      <td v-if="n1.rowspan" :class="'td '+ (n1.bkc||'')" :rowspan="n1.rowspan">{{ n1.org }}</td>
                      <td :class="'td '+ (n1.bkc||'')">{{ n1.name }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vh?'#f00':''}" :title="n1.vh||''">{{ n1.heat }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vi?'#f00':''}" :title="n1.vi||''">{{ n1.input }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vo?'#f00':''}" :title="n1.vo||''">{{ n1.output }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vl?'#f00':''}" :title="n1.vl||''">{{ n1.load }}</td>
                    </tr>
                  </table>
                </div>
                <div class="table-card-box">
                  <div class="table-card-title">二级分前端及乡镇广播站10KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">分公司</th>
                      <th class="th">分前端</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压 (V)</th>
                      <th class="th">输出电压 (V)</th>
                      <th class="th">负载 (%)</th>
                    </tr>
                    <tr v-for="(n2, i2) in item.upsList[2]" :key="'n_'+index+'_'+i2" class="tr">
                      <td v-if="n2.rowspan" :class="'td '+ (n2.bkc||'')" :rowspan="n2.rowspan">{{ n2.org }}</td>
                      <td :class="'td '+ (n2.bkc||'')">{{ n2.name }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vh?'#f00':''}" :title="n2.vh||''">{{ n2.heat }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vi?'#f00':''}" :title="n2.vi||''">{{ n2.input }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vo?'#f00':''}" :title="n2.vo||''">{{ n2.output }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vl?'#f00':''}" :title="n2.vl||''">{{ n2.load }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </el-card>
            <el-card v-else>
              <div style="font-size: 16px;color: #999999">
                <span style="font-size: 20px;font-weight: bold;color: black">{{ item.name }}</span>
                <span v-if="item.status===1"> 等待巡检... </span>
                <span v-if="item.status===2"> 正在巡检中，请稍后 <i class="el-icon-loading"></i> </span>
                <span v-if="item.status===3"> 请<span style="font-weight:bold;color:#666">确认</span>后<span style="font-weight:bold;color:#666">提交</span>该报告！ </span>
                <el-button v-if="item.status===1" type="primary" size="mini" icon="el-icon-video-play" style="float:right;margin:0 20px" @click="beginInspection(item)">开始巡检</el-button>
                <el-button v-if="item.status===2" disabled size="mini" icon="el-icon-loading" style="float:right;margin:0 20px">巡检中...</el-button>
                <el-button v-if="item.status===3" type="success" size="mini" icon="el-icon-finished" style="float:right;margin:0 20px" @click="submitInspection(item)">确认提交</el-button>
              </div>
              <div v-show="item.expand" style="margin-top:12px">
                <div class="table-card-box">
                  <div class="table-card-title">总前端120KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">电源</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压A (V)</th>
                      <th class="th">输入电压B (V)</th>
                      <th class="th">输入电压C (V)</th>
                      <th class="th">输出电压A (V)</th>
                      <th class="th">输出电压B (V)</th>
                      <th class="th">输出电压C (V)</th>
                      <th class="th">负载A (%)</th>
                      <th class="th">负载B (%)</th>
                      <th class="th">负载C (%)</th>
                    </tr>
                    <tr v-for="(n0, i0) in item.upsList[0]" :key="'n_'+index+'_'+i0" class="tr">
                      <td :class="'td '+ (n0.bkc||'')">{{ n0.name }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vh?'#f00':''}" :title="n0.vh||''">{{ n0.heat }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.via?'#f00':''}" :title="n0.via||''">{{ n0.inputA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vib?'#f00':''}" :title="n0.vib||''">{{ n0.inputB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vic?'#f00':''}" :title="n0.vic||''">{{ n0.inputC }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.voa?'#f00':''}" :title="n0.voa||''">{{ n0.outputA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vob?'#f00':''}" :title="n0.vob||''">{{ n0.outputB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.voc?'#f00':''}" :title="n0.voc||''">{{ n0.outputC }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vla?'#f00':''}" :title="n0.vla||''">{{ n0.loadA }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vlb?'#f00':''}" :title="n0.vlb||''">{{ n0.loadB }}</td>
                      <td :class="'td '+ (n0.bkc||'')" :style="{'color':n0.vlc?'#f00':''}" :title="n0.vlc||''">{{ n0.loadC }}</td>
                    </tr>
                  </table>
                </div>
                <div class="table-card-box">
                  <div class="table-card-title">一级分前端10KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">分公司</th>
                      <th class="th">分前端</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压 (V)</th>
                      <th class="th">输出电压 (V)</th>
                      <th class="th">负载 (%)</th>
                    </tr>
                    <tr v-for="(n1, i1) in item.upsList[1]" :key="'n_'+index+'_'+i1" class="tr">
                      <td v-if="n1.rowspan" :class="'td '+ (n1.bkc||'')" :rowspan="n1.rowspan">{{ n1.org }}</td>
                      <td :class="'td '+ (n1.bkc||'')">{{ n1.name }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vh?'#f00':''}" :title="n1.vh||''">{{ n1.heat }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vi?'#f00':''}" :title="n1.vi||''">{{ n1.input }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vo?'#f00':''}" :title="n1.vo||''">{{ n1.output }}</td>
                      <td :class="'td '+ (n1.bkc||'')" :style="{'color':n1.vl?'#f00':''}" :title="n1.vl||''">{{ n1.load }}</td>
                    </tr>
                  </table>
                </div>
                <div class="table-card-box">
                  <div class="table-card-title">二级分前端及乡镇广播站10KVA-UPS系统</div>
                  <table class="table">
                    <tr class="tr">
                      <th class="th">分公司</th>
                      <th class="th">分前端</th>
                      <th class="th">温度 (℃)</th>
                      <th class="th">输入电压 (V)</th>
                      <th class="th">输出电压 (V)</th>
                      <th class="th">负载 (%)</th>
                    </tr>
                    <tr v-for="(n2, i2) in item.upsList[2]" :key="'n_'+index+'_'+i2" class="tr">
                      <td v-if="n2.rowspan" :class="'td '+ (n2.bkc||'')" :rowspan="n2.rowspan">{{ n2.org }}</td>
                      <td :class="'td '+ (n2.bkc||'')">{{ n2.name }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vh?'#f00':''}" :title="n2.vh||''">{{ n2.heat }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vi?'#f00':''}" :title="n2.vi||''">{{ n2.input }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vo?'#f00':''}" :title="n2.vo||''">{{ n2.output }}</td>
                      <td :class="'td '+ (n2.bkc||'')" :style="{'color':n2.vl?'#f00':''}" :title="n2.vl||''">{{ n2.load }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
    <edit-page ref="editPage" />
    <error-log ref="errorLogPage" />
    <setting-page ref="settingPage" />
  </div>
</template>

<script>
import editPage from './edit'
import errorLog from './errorLog'
import settingPage from './setting'
import { mapGetters } from 'vuex'
export default {
  components: { editPage, errorLog, settingPage },
  data() {
    return {
      waterMark: '',
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
      tableList: [],
      nodelist0: [],
      nodelist1: [],
      nodelist2: []
    }
  },
  computed: {
    ...mapGetters({
      upsConfig: 'config/getUpsConfig'
    })
  },
  mounted() {
    this.$nextTick(() => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      start.setTime(start.getTime() - 3600 * 1000 * 48)
      this.timeList = [start, end]
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
      this.loadData()
    })
  },
  methods: {
    getDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    expandTable(item) {
      item.expand = !item.expand
    },
    toAdd() {
      this.$refs.editPage.loadData()
    },
    openErrorLog(item) {
      if (item.errorNum) {
        this.$refs.errorLogPage.loadData(item)
      }
    },
    toSearch() {
      this.tableList = []
      this.$post({
        url: this.$urlPath.ReadHistoryData,
        data: {
          startDate: this.getDateTime(this.timeList[0]),
          endDate: this.getDateTime(this.timeList[1])
        }
      }).then((res) => {
        if (res.code === 200) {
          res.UpsHistoryData.forEach(obj => {
            const tempObj = JSON.parse(obj.dataJson)
            tempObj.id = obj.id
            this.tableList.push(tempObj)
          })
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    toSetting() {
      this.$refs.settingPage.loadData()
    },
    addInspection(formData) {
      this.tableList.unshift({
        dateTime: formData.dateTime,
        name: formData.inspector,
        signImg: formData.signImg,
        upsList: [JSON.parse(JSON.stringify(this.nodelist0)), JSON.parse(JSON.stringify(this.nodelist1)), JSON.parse(JSON.stringify(this.nodelist2))],
        completed: false,
        status: 1,
        expand: false,
        errorNum: 0,
        dispose: false
      })
    },
    beginInspection(item) {
      item.status = 2
      let f0, f1, f2
      // 获取总前端数据
      this.$post({
        url: this.$urlPath.readZqdUpsGroup,
        data: { string_ipGroup: item.upsList[0].map(node => { return node.ip }).join('&') }
      }).then((res) => {
        if (res.code === 200) {
          f0 = true
          const resDataList = res.ZqdUpsListResponse || []
          const nodeList = item.upsList[0]
          for (let i = 0; i < resDataList.length; i++) {
            nodeList[i].heat = resDataList[i].Temperature
            nodeList[i].inputA = resDataList[i].InputVoltageA
            nodeList[i].inputB = resDataList[i].InputVoltageB
            nodeList[i].inputC = resDataList[i].InputVoltageC
            nodeList[i].outputA = resDataList[i].OutputVoltageA
            nodeList[i].outputB = resDataList[i].OutputVoltageB
            nodeList[i].outputC = resDataList[i].OutputVoltageC
            nodeList[i].loadA = resDataList[i].LoadNameA
            nodeList[i].loadB = resDataList[i].LoadNameB
            nodeList[i].loadC = resDataList[i].LoadNameC
          }
          if (f1 && f2 && f0) {
            item.status = 3
            item.expand = true
            this.validateValue(item)
          }
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
      // 获取一级前端数据
      this.$post({
        url: this.$urlPath.readUpsList,
        data: { string_ipGroup: item.upsList[1].map(node => { return node.ip }).join('&') }
      }).then((res) => {
        if (res.code === 200) {
          f1 = true
          const resDataList = res.UpsList_Response || []
          const nodeList = item.upsList[1]
          for (let i = 0; i < resDataList.length; i++) {
            nodeList[i].heat = resDataList[i].Temperature
            nodeList[i].input = resDataList[i].InputVoltage
            nodeList[i].output = resDataList[i].OutputVoltage
            nodeList[i].load = resDataList[i].LoadName
          }
          if (f1 && f2 && f0) {
            item.status = 3
            item.expand = true
            this.validateValue(item)
          }
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
      // 获取二级前端数据
      this.$post({
        url: this.$urlPath.readUpsList,
        data: { string_ipGroup: item.upsList[2].map(node => { return node.ip }).join('&') }
      }).then((res) => {
        if (res.code === 200) {
          f2 = true
          const resDataList = res.UpsList_Response || []
          const nodeList = item.upsList[2]
          for (let i = 0; i < resDataList.length; i++) {
            nodeList[i].heat = resDataList[i].Temperature
            nodeList[i].input = resDataList[i].InputVoltage
            nodeList[i].output = resDataList[i].OutputVoltage
            nodeList[i].load = resDataList[i].LoadName
          }
          if (f1 && f2 && f0) {
            item.status = 3
            item.expand = true
            this.validateValue(item)
          }
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    validateValue(item) {
      let tempValue
      let errorNum = 0
      const upsList = item.upsList
      if (this.upsConfig.maxHeat) {
        tempValue = Number(this.upsConfig.maxHeat)
        upsList[0].forEach(ups => {
          if (tempValue < (Number(ups.heat) || Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
        upsList[1].forEach(ups => {
          if (tempValue < (Number(ups.heat) || Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue < (Number(ups.heat) || Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
      }
      if (this.upsConfig.maxLoad) {
        tempValue = Number(this.upsConfig.maxLoad)
        upsList[0].forEach(ups => {
          if (tempValue < (Number(ups.loadA) || Infinity)) {
            ups.vla = `设备负载异常`
          }
          if (tempValue < (Number(ups.loadB) || Infinity)) {
            ups.vlb = `设备负载异常`
          }
          if (tempValue < (Number(ups.loadC) || Infinity)) {
            ups.vlc = `设备负载异常`
          }
        })
        upsList[1].forEach(ups => {
          if (tempValue < (Number(ups.load) || Infinity)) {
            ups.vl = `设备负载异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue < (Number(ups.load) || Infinity)) {
            ups.vl = `设备负载异常`
          }
        })
      }
      if (this.upsConfig.maxInputPE) {
        tempValue = Number(this.upsConfig.maxInputPE)
        upsList[1].forEach(ups => {
          if (tempValue < (Number(ups.input) || Infinity)) {
            ups.vi = `输入电压异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue < (Number(ups.input) || Infinity)) {
            ups.vi = `输入电压异常`
          }
        })
      }
      if (this.upsConfig.maxOutputPE) {
        tempValue = Number(this.upsConfig.maxOutputPE)
        upsList[1].forEach(ups => {
          if (tempValue < (Number(ups.output) || Infinity)) {
            ups.vo = `输出电压异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue < (Number(ups.output) || Infinity)) {
            ups.vo = `输出电压异常`
          }
        })
      }
      if (this.upsConfig.maxInputTPE) {
        tempValue = Number(this.upsConfig.maxInputTPE)
        upsList[0].forEach(ups => {
          if (tempValue < (Number(ups.inputA) || Infinity)) {
            ups.via = `输入相电压异常`
          }
          if (tempValue < (Number(ups.inputB) || Infinity)) {
            ups.vib = `输入相电压异常`
          }
          if (tempValue < (Number(ups.inputC) || Infinity)) {
            ups.vic = `输入相电压异常`
          }
        })
      }
      if (this.upsConfig.maxOutputTPE) {
        tempValue = Number(this.upsConfig.maxOutputTPE)
        upsList[0].forEach(ups => {
          if (tempValue < (Number(ups.outputA) || Infinity)) {
            ups.voa = `输出相电压异常`
          }
          if (tempValue < (Number(ups.outputB) || Infinity)) {
            ups.vob = `输出相电压异常`
          }
          if (tempValue < (Number(ups.outputC) || Infinity)) {
            ups.voc = `输出相电压异常`
          }
        })
      }

      if (this.upsConfig.minHeat) {
        tempValue = Number(this.upsConfig.minHeat)
        upsList[0].forEach(ups => {
          if (tempValue > (Number(ups.heat) || -Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
        upsList[1].forEach(ups => {
          if (tempValue > (Number(ups.heat) || -Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue > (Number(ups.heat) || -Infinity)) {
            ups.vh = `设备温度异常`
          }
        })
      }
      if (this.upsConfig.minLoad) {
        tempValue = Number(this.upsConfig.minLoad)
        upsList[0].forEach(ups => {
          if (tempValue > (Number(ups.loadA) || -Infinity)) {
            ups.vla = `设备负载异常`
          }
          if (tempValue > (Number(ups.loadB) || -Infinity)) {
            ups.vlb = `设备负载异常`
          }
          if (tempValue > (Number(ups.loadC) || -Infinity)) {
            ups.vlc = `设备负载异常`
          }
        })
        upsList[1].forEach(ups => {
          if (tempValue > (Number(ups.load) || -Infinity)) {
            ups.vl = `设备负载异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue > (Number(ups.load) || -Infinity)) {
            ups.vl = `设备负载异常`
          }
        })
      }
      if (this.upsConfig.minInputPE) {
        tempValue = Number(this.upsConfig.minInputPE)
        upsList[1].forEach(ups => {
          if (tempValue > (Number(ups.input) || -Infinity)) {
            ups.vi = `输入电压异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue > (Number(ups.input) || -Infinity)) {
            ups.vi = `输入电压异常`
          }
        })
      }
      if (this.upsConfig.minOutputPE) {
        tempValue = Number(this.upsConfig.minOutputPE)
        upsList[1].forEach(ups => {
          if (tempValue > (Number(ups.output) || -Infinity)) {
            ups.vo = `输出电压异常`
          }
        })
        upsList[2].forEach(ups => {
          if (tempValue > (Number(ups.output) || -Infinity)) {
            ups.vo = `输出电压异常`
          }
        })
      }
      if (this.upsConfig.minInputTPE) {
        tempValue = Number(this.upsConfig.minInputTPE)
        upsList[0].forEach(ups => {
          if (tempValue > (Number(ups.inputA) || -Infinity)) {
            ups.via = `输入相电压异常`
          }
          if (tempValue > (Number(ups.inputB) || -Infinity)) {
            ups.vib = `输入相电压异常`
          }
          if (tempValue > (Number(ups.inputC) || -Infinity)) {
            ups.vic = `输入相电压异常`
          }
        })
      }
      if (this.upsConfig.minOutputTPE) {
        tempValue = Number(this.upsConfig.minOutputTPE)
        upsList[0].forEach(ups => {
          if (tempValue > (Number(ups.outputA) || -Infinity)) {
            ups.voa = `输出相电压异常`
          }
          if (tempValue > (Number(ups.outputB) || -Infinity)) {
            ups.vob = `输出相电压异常`
          }
          if (tempValue > (Number(ups.outputC) || -Infinity)) {
            ups.voc = `输出相电压异常`
          }
        })
      }

      upsList[0].forEach(ups => {
        if (ups.vh || ups.vla || ups.vlb || ups.vlc || ups.via || ups.vib || ups.vic || ups.voa || ups.vob || ups.voc) {
          errorNum++
        }
      })
      upsList[1].forEach(ups => {
        if (ups.vh || ups.vl || ups.vi || ups.vo) {
          errorNum++
        }
      })
      upsList[2].forEach(ups => {
        if (ups.vh || ups.vl || ups.vi || ups.vo) {
          errorNum++
        }
      })
      item.errorNum = errorNum
      // 保存ups巡检结果以显示首页指标数据
      const lastUPSResult = localStorage.getItem('lastUPSResult')
      if (lastUPSResult) {
        const lastUPSResultObj = JSON.parse(lastUPSResult)
        localStorage.setItem('lastUPSResult', JSON.stringify({
          dataNum: upsList[0].length + upsList[1].length + upsList[2].length,
          errorNum: item.errorNum,
          sdv: upsList[0].length + upsList[1].length + upsList[2].length - (Number(lastUPSResultObj.dataNum) || 0),
          edv: item.errorNum - (Number(lastUPSResultObj.errorNum) || 0),
          dateTime: item.dateTime,
          signImg: item.signImg,
          count: (Number(lastUPSResultObj.count) || 0) + 1
        }))
      } else {
        localStorage.setItem('lastUPSResult', JSON.stringify({
          dataNum: upsList[0].length + upsList[1].length + upsList[2].length,
          errorNum: item.errorNum,
          sdv: upsList[0].length + upsList[1].length + upsList[2].length,
          edv: item.errorNum,
          dateTime: item.dateTime,
          signImg: item.signImg,
          count: 1
        }))
      }
      localStorage.setItem('lastUPSDataList', JSON.stringify([...upsList[0], ...upsList[1], ...upsList[2]]))
    },
    submitInspection(item) {
      const cloneObj = JSON.parse(JSON.stringify(item))
      cloneObj.completed = true
      cloneObj.expand = false
      this.$post({
        url: this.$urlPath.SaveToDB,
        data: {
          datetime: cloneObj.dateTime,
          dataJson: JSON.stringify(cloneObj),
          handle: null
        }
      }).then((res) => {
        if (res.code === 200) {
          this.$successMsg(res.msg)
          item.id = res.data.id
          item.completed = true
          item.expand = false
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    clearData() {
      this.nodelist0 = []
      this.nodelist1 = []
      this.nodelist2 = []
    },
    loadData() {
      const mainNodes = []
      const oneClassNodesMap = {}
      const towClassNodesMap = {}
      this.$post({
        url: this.$urlPath.ShowUpsList
      }).then((res) => {
        const tableData = res.ShowUps || []
        tableData.forEach(item => {
          if (item.upsLevel === '总前端120KVA') {
            mainNodes.push(item)
          }
          if (item.upsLevel === '一级分前端10KVA') {
            if (!oneClassNodesMap[item.branch]) {
              oneClassNodesMap[item.branch] = []
            }
            oneClassNodesMap[item.branch].push(item)
          }
          if (item.upsLevel === '二级分前端及乡镇广播站10KVA') {
            if (!towClassNodesMap[item.branch]) {
              towClassNodesMap[item.branch] = []
            }
            towClassNodesMap[item.branch].push(item)
          }
        })
        this.clearData()
        mainNodes.forEach(node => {
          this.nodelist0.push({
            name: node.upsName,
            ip: node.upsIP,
            coords: node.position ? [Number(node.position.split(',')[0]) || 0, Number(node.position.split(',')[1]) || 0] : undefined,
            heat: '',
            inputA: '',
            inputB: '',
            inputC: '',
            outputA: '',
            outputB: '',
            outputC: '',
            loadA: '',
            loadB: '',
            loadC: ''
          })
        })
        const oneClassNodes = []
        for (const key in oneClassNodesMap) {
          oneClassNodes.push(oneClassNodesMap[key])
        }
        const towClassNodes = []
        for (const key in towClassNodesMap) {
          towClassNodes.push(towClassNodesMap[key])
        }
        oneClassNodes.forEach((list, i) => {
          list.forEach((node, ii) => {
            const tempObj = {
              name: node.upsName,
              ip: node.upsIP,
              coords: node.position ? [Number(node.position.split(',')[0]) || 0, Number(node.position.split(',')[1]) || 0] : undefined,
              org: node.branch,
              heat: '',
              input: '',
              output: '',
              load: ''
            }
            if (i % 2) {
              tempObj.bkc = 'bk'
            }
            if (ii === 0) {
              tempObj.rowspan = list.length
            }
            this.nodelist1.push(tempObj)
          })
        })
        towClassNodes.forEach((list, i) => {
          list.forEach((node, ii) => {
            const tempObj = {
              name: node.upsName,
              ip: node.upsIP,
              coords: node.position ? [Number(node.position.split(',')[0]) || 0, Number(node.position.split(',')[1]) || 0] : undefined,
              org: node.branch,
              heat: '',
              input: '',
              output: '',
              load: ''
            }
            if (i % 2) {
              tempObj.bkc = 'bk'
            }
            if (ii === 0) {
              tempObj.rowspan = list.length
            }
            this.nodelist2.push(tempObj)
          })
        })
        this.toSearch()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-card-box {
  .table-card-title {
    width: 100%;
    padding: 2px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    background-color: rgba(0,0,0,0.1);
  }
  .table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
    text-align: left;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .th, .td {
    border: 1px solid #ddd;
    padding: 4px;
    border-radius: 5px;
    text-align: center;
  }
  td {
    opacity: 0.8;
    cursor: default;
  }
  td:hover {
    opacity: 1;
  }
  .th {
    background-color: #e2e2e2;
    font-weight: bold;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
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
  .signImg {
    position: absolute;
    top: 34px;
    left: 520px;
  }
  .expand-btn {
    position: absolute;
    top: 48px;
    right: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #1961C5;
    opacity: 0.8;
  }

  .expand-btn:hover {
    opacity: 1;
  }
}
</style>
