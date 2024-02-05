<template>
  <!-- 表单渲染 -->
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancelView"
    :visible="visible"
    :title="title"
    top="20vh"
    width="960px"
  >
    <div v-if="upsList[0].length" class="table-card-box">
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
        <tr v-for="(n0, i0) in upsList[0]" :key="'n_'+'_'+i0" class="tr">
          <td class="td">{{ n0.name }}</td>
          <td class="td" :style="{'color':n0.vh?'#f00':''}" :title="n0.vh||''">{{ n0.heat }}</td>
          <td class="td" :style="{'color':n0.via?'#f00':''}" :title="n0.via||''">{{ n0.inputA }}</td>
          <td class="td" :style="{'color':n0.vib?'#f00':''}" :title="n0.vib||''">{{ n0.inputB }}</td>
          <td class="td" :style="{'color':n0.vic?'#f00':''}" :title="n0.vic||''">{{ n0.inputC }}</td>
          <td class="td" :style="{'color':n0.voa?'#f00':''}" :title="n0.voa||''">{{ n0.outputA }}</td>
          <td class="td" :style="{'color':n0.vob?'#f00':''}" :title="n0.vob||''">{{ n0.outputB }}</td>
          <td class="td" :style="{'color':n0.voc?'#f00':''}" :title="n0.voc||''">{{ n0.outputC }}</td>
          <td class="td" :style="{'color':n0.vla?'#f00':''}" :title="n0.vla||''">{{ n0.loadA }}</td>
          <td class="td" :style="{'color':n0.vlb?'#f00':''}" :title="n0.vlb||''">{{ n0.loadB }}</td>
          <td class="td" :style="{'color':n0.vlc?'#f00':''}" :title="n0.vlc||''">{{ n0.loadC }}</td>
        </tr>
      </table>
    </div>
    <div v-if="upsList[1].length" class="table-card-box">
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
        <tr v-for="(n1, i1) in upsList[1]" :key="'n_'+'_'+i1" class="tr">
          <td class="td">{{ n1.org }}</td>
          <td class="td">{{ n1.name }}</td>
          <td class="td" :style="{'color':n1.vh?'#f00':''}" :title="n1.vh||''">{{ n1.heat }}</td>
          <td class="td" :style="{'color':n1.vi?'#f00':''}" :title="n1.vi||''">{{ n1.input }}</td>
          <td class="td" :style="{'color':n1.vo?'#f00':''}" :title="n1.vo||''">{{ n1.output }}</td>
          <td class="td" :style="{'color':n1.vl?'#f00':''}" :title="n1.vl||''">{{ n1.load }}</td>
        </tr>
      </table>
    </div>
    <div v-if="upsList[2].length" class="table-card-box">
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
        <tr v-for="(n2, i2) in upsList[2]" :key="'n_'+'_'+i2" class="tr">
          <td class="td">{{ n2.org }}</td>
          <td class="td">{{ n2.name }}</td>
          <td class="td" :style="{'color':n2.vh?'#f00':''}" :title="n2.vh||''">{{ n2.heat }}</td>
          <td class="td" :style="{'color':n2.vi?'#f00':''}" :title="n2.vi||''">{{ n2.input }}</td>
          <td class="td" :style="{'color':n2.vo?'#f00':''}" :title="n2.vo||''">{{ n2.output }}</td>
          <td class="td" :style="{'color':n2.vl?'#f00':''}" :title="n2.vl||''">{{ n2.load }}</td>
        </tr>
      </table>
    </div>
    <div class="signArea">
      <span>巡检员签字：</span>
      <img v-if="dataObj.signImg" class="signImg" :src="require(`@/assets/signImg/${dataObj.signImg}.png`)" />
      <img v-show="dataObj.dispose" class="signImg" :src="require('@/assets/dispose.png')" height="80px" style="left:440px;transform:rotate(-30deg)" />
    </div>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" icon="el-icon-circle-close" @click="cancelView">关闭</el-button>
      <el-button v-if="!dataObj.dispose" type="danger" size="mini" icon="el-icon-s-check" @click="submit()">我已处理</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      title: '',
      dataObj: {},
      upsList: [[], [], []]
    }
  },
  mounted() {
  },
  methods: {
    showView() {
      this.visible = true
    },
    hideView() {
      this.visible = false
    },
    cancelView() {
      this.hideView()
    },
    submit() {
      const cloneObj = JSON.parse(JSON.stringify(this.dataObj))
      cloneObj.dispose = true
      this.$post({
        url: this.$urlPath.UpdateHistoryData,
        data: {
          id: cloneObj.id,
          dataJson: JSON.stringify(cloneObj),
          handle: null
        }
      }).then((res) => {
        if (res.code === 200) {
          this.$successMsg(res.msg)
          this.dataObj.dispose = true
        } else {
          this.$errorMsg(res.msg)
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    loadData(obj) {
      this.dataObj = obj
      this.title = `UPS异常巡检日志 - ${obj.dateTime}`
      this.upsList = [
        obj.upsList[0].filter(ups => { return ups.vh || ups.vla || ups.vlb || ups.vlc || ups.via || ups.vib || ups.vic || ups.voa || ups.vob || ups.voc }),
        obj.upsList[1].filter(ups => { return ups.vh || ups.vl || ups.vi || ups.vo }),
        obj.upsList[2].filter(ups => { return ups.vh || ups.vl || ups.vi || ups.vo })
      ]
      this.showView()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.warn {
  color: red;
}
.signArea {
  margin-top: -20px;
  padding: 0 80px;
  font-size: 16px;
  font-weight: bold;
  .signImg {
    position: relative;
    top: 30px;
    left: 10px;
    height: 75px;
  }
}
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
.cell-box {
  min-width: 120px;

  .cell-input {
    width: 220px;
  }

  .cell-select {
    width: 220px;
  }

  >>> .el-input__inner {
    border: 1px solid rgba(100, 100, 100, 0.1);
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 5px;
  }

  >>> .el-input.is-disabled .el-input__inner {
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid rgba(100, 100, 100, 0.4);
    background: white;
    cursor: text;
  }

  >>> .el-input.is-disabled .el-input__icon {
    cursor: text;
  }

  >>> .el-icon-circle-check {
    color: #13ce66;
  }

  >>> .el-icon-arrow-up:before {
    content: '';
  }
}
</style>
