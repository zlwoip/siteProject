<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" width="580px">
    <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
      <el-tab-pane label="值机排班" name="zj">
        <el-descriptions class="margin-top" :column="1" size="small" border :label-style="{width:'160px'}" :content-style="{position:'relative',paddingRight:'22px'}">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-stopwatch" style="transform: rotate(-50deg)"></i>
              轮班（07:00~15:00）
            </template>
            <el-tag v-for="item in formData.lb1" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.lb1, zj_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.lb1.length<1 && formData.lb1.length<zj_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(zj_list, 'lb1')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-stopwatch" style="transform: rotate(180deg)"></i>
              轮班（15:00~23:00）
            </template>
            <el-tag v-for="item in formData.lb2" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.lb2, zj_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.lb2.length<1 && formData.lb2.length<zj_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(zj_list, 'lb2')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-stopwatch" style="transform: rotate(60deg)"></i>
              轮班（23:00~07:00）
            </template>
            <el-tag v-for="item in formData.lb3" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.lb3, zj_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.lb3.length<1 && formData.lb3.length<zj_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(zj_list, 'lb3')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-sunrise-1"></i>
              白班（08:30~17:00）
            </template>
            <el-tag v-for="item in formData.lb4" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.lb4, zj_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.lb4.length<1 && formData.lb4.length<zj_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(zj_list, 'lb4')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="技术排班" name="js">
        <el-descriptions class="margin-top" :column="1" size="small" border :label-style="{width:'120px'}" :content-style="{position:'relative',paddingRight:'22px'}">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-sunrise-1"></i>
              白班
            </template>
            <el-tag v-for="item in formData.bb" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.bb, js_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="js_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(js_list, 'bb')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-moon-night"></i>
              夜班
            </template>
            <el-tag v-for="item in formData.yb" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.yb, js_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.yb.length<1 && js_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(js_list, 'yb')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              备班（全天）
            </template>
            <el-tag v-for="item in formData.ex" :key="'lb'+item" size="mini" type="primary" class="tag-label" closable @close="handleClose(item, formData.ex, js_list)">
              {{ item }}
            </el-tag>
            <transition name="el-zoom-in-center">
              <i v-if="formData.ex.length<1 && js_list.length" class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加人员" @click="showNameList(js_list, 'ex')"></i>
              <i v-else class="el-icon-circle-check check-btn"></i>
            </transition>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" @click="cancelView">取消</el-button>
      <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelNameListView" :visible="viewVisible" width="300px">
      <el-tabs v-model="nameListActive">
        <el-tab-pane label="值机员" name="zj">
          <div v-for="(item, index) in zj_list" :key="'znl'+index" class="name-list">
            <el-button size="mini" style="width: 200px;margin: 1px" @click="insertRoll(item)">
              <i class="el-icon-user" style="float: left"></i>
              {{ item }}
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="技术员" name="js">
          <div v-for="(item, index) in js_list" :key="'jnl'+index" class="name-list">
            <el-button size="mini" style="width: 200px;margin: 1px" @click="insertRoll(item)">
              <i class="el-icon-user" style="float: left"></i>
              {{ item }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      viewVisible: false,
      visible: false,
      zj_list: [],
      js_list: [],
      title: '',
      activeName: 'zj',
      nameListActive: 'zj',
      nameList: [],
      indicator: '',
      formData: {
        id: null,
        datetime: '',
        lb1: [],
        lb2: [],
        lb3: [],
        lb4: [],
        bb: [],
        yb: [],
        ex: []
      },
      rules: {}
    }
  },
  mounted() {
  },
  methods: {
    tabsHandleClick(tab) {
      this.nameListActive = tab.name
    },
    showNameList(nameList, indicator) {
      this.nameList = nameList
      this.indicator = indicator
      this.viewVisible = true
    },
    cancelNameListView() {
      this.viewVisible = false
      this.nameList = []
      this.indicator = ''
    },
    insertRoll(item) {
      this.formData[this.indicator].push(item)
      // this.formData[this.indicator].forEach(item => {
      //   if (this.nameList.indexOf(item) >= 0) {
      //     this.nameList.splice(this.nameList.indexOf(item), 1)
      //   }
      // })
      this.cancelNameListView()
    },
    handleClose(item, dArr, aArr) {
      dArr.splice(dArr.indexOf(item), 1)
      // aArr.push(item)
      // aArr.sort()
    },
    showView() {
      this.visible = true
    },
    hideView() {
      this.visible = false
      this.formData = {
        id: null,
        datetime: '',
        lb1: [],
        lb2: [],
        lb3: [],
        lb4: [],
        bb: [],
        yb: [],
        ex: []
      }
    },
    cancelView() {
      this.hideView()
    },
    submitForm() {
      this.$post({
        url: this.formData.id ? this.$urlPath.updateClasses : this.$urlPath.addClasses,
        data: {
          operatorOne: this.formData.lb1.join(','),
          operatorTwo: this.formData.lb2.join(','),
          operatorThree: this.formData.lb3.join(','),
          operatorDay: this.formData.lb4.join(','),
          technicianDay: this.formData.bb.join(','),
          technicianNight: this.formData.yb.join(','),
          technicianReady: this.formData.ex.join(','),
          datetime: this.formData.datetime,
          id: this.formData.id
        }
      }).then((res) => {
        const d = new Date(this.formData.datetime.replace(/-/, '/'))
        this.$parent.updateWebPage(d.getFullYear(), d.getMonth() + 1)
        this.$successMsg(res.msg)
        this.cancelView()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    loadData(item) {
      this.$post({
        url: this.$urlPath.ShowInspectionPersonList
      }).then((res) => {
        this.zj_list = (res.inspectionPersonList || []).filter(item => {
          return item.state !== '0' && item.type === '值机'
        })
        this.zj_list = this.zj_list.map(item => {
          return item.name
        }).sort()
        this.js_list = (res.inspectionPersonList || []).filter(item => {
          return item.state !== '0' && item.type === '技术'
        })
        this.js_list = this.js_list.map(item => {
          return item.name
        }).sort()
        this.formData.datetime = item.dataTimeStr

        if (item.resData) {
          const resData = item.resData
          this.formData.id = resData.id
          resData.operatorOne.split(',').forEach(item => {
            if (item) {
              this.formData.lb1.push(item)
            }
          })
          resData.operatorTwo.split(',').forEach(item => {
            if (item) {
              this.formData.lb2.push(item)
            }
          })
          resData.operatorThree.split(',').forEach(item => {
            if (item) {
              this.formData.lb3.push(item)
            }
          })
          resData.operatorDay.split(',').forEach(item => {
            if (item) {
              this.formData.lb4.push(item)
            }
          })
          resData.technicianDay.split(',').forEach(item => {
            if (item) {
              this.formData.bb.push(item)
            }
          })
          resData.technicianNight.split(',').forEach(item => {
            if (item) {
              this.formData.yb.push(item)
            }
          })
          resData.technicianReady.split(',').forEach(item => {
            if (item) {
              this.formData.ex.push(item)
            }
          })
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
      this.showView()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.name-list {
  width: 100%;
  text-align: center;
}
.add-btn {
  color: #047fff;
  font-size: 14px;
  opacity: 0.6;
}
.check-btn {
  position: absolute;
  top: 50%;
  right: -2px;
  transform: translate(-50%, -50%);
  color: #00CD66;
  font-size: 16px;
  opacity: 0.7
}
.tag-label {
  margin: 2px 5px;
}
.add-btn:hover {
  opacity: 1;
}
.cell-box {
  min-width: 120px;
  .cell-input {
    width: 220px;
  }
  .cell-select {
    width: 220px;
  }
  >>>.el-input__inner {
    border: 1px solid rgba(100, 100, 100, 0.1);
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 5px;
  }
  >>>.el-input.is-disabled .el-input__inner {
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid rgba(100, 100, 100, 0.4);
    background: white;
    cursor: text;
  }
  >>>.el-input.is-disabled .el-input__icon {
    cursor: text;
  }
  >>>.el-icon-circle-check {
    color: #13ce66;
  }
  >>>.el-icon-arrow-up:before {
    content: '';
  }
}
</style>
