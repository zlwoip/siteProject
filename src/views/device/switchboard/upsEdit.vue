<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="580px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="220px">
      <el-form-item label="交换机：" class="form-cell" prop="switchName">
        <div class="cell-box">
          <el-input v-model="formData.switchName" size="mini" disabled class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="交换机IP：" class="form-cell" prop="switchIP">
        <div class="cell-box">
          <el-input v-model="formData.switchIP" size="mini" disabled class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="电源名称：" class="form-cell" prop="power">
        <div class="cell-box">
          <el-input v-model="formData.power" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="设备OID：" class="form-cell" prop="powerOid">
        <div class="cell-box">
          <el-input v-model="formData.powerOid" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" @click="cancelView">取消</el-button>
      <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      title: '',
      formData: {
        switchName: '',
        power: '',
        powerOid: '',
        switchIP: ''
      },
      rules: {
        power: { required: true, message: '请填写电源名称', trigger: 'blur' },
        powerOid: { required: true, message: '请填写电源名称', trigger: 'blur' }
      }
    }
  },
  mounted() {
  },
  methods: {
    showView() {
      this.visible = true
    },
    hideView() {
      this.$refs.formViewRef.resetFields()
      this.visible = false
    },
    cancelView() {
      this.hideView()
    },
    updataSwitchAndCancelView() {
      this.$post({
        url: this.$urlPath.ShowSwitchDeviceList
      }).then((res) => {
        const tempList = res.switchDeviceList || []
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].switchId === this.switchObj.switchId) {
            this.switchObj.switchPowerList = tempList[i].switchPowerList
            this.cancelView()
            break
          }
        }
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    submitForm(isRelease) {
      this.$refs.formViewRef.validate((valid, obj) => {
        if (valid) {
          this.$post({
            url: this.formData.powerId ? this.$urlPath.updateSwitchPower : this.$urlPath.addSwitchPower,
            data: {
              ...this.formData
            }
          }).then((res) => {
            this.$successMsg(res.msg)
            this.updataSwitchAndCancelView()
          }).catch((error) => {
            this.$errorMsg(error || '接口调用失败，未知异常')
          })
        } else {
          this.$message({
            message: '表单信息有误，请核对无误后提交！',
            type: 'error'
          })
        }
      })
    },
    loadData(item, switchObj) {
      if (item) {
        this.formData = item
        this.title = '编辑电源'
      } else {
        this.formData = {
          id: '',
          power: '',
          powerOid: ''
        }
        this.title = '新增电源'
      }
      this.switchObj = switchObj
      this.formData.switchName = switchObj.switchName
      this.formData.switchIP = switchObj.switchIP
      this.showView()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep.el-input__inner {
  border: 1px solid rgba(100, 100, 100, 0.1);
  border-bottom: 1px solid rgba(100, 100, 100, 0.2);
  border-radius: 5px;
}
::v-deep.el-input.is-disabled .el-input__inner {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid rgba(100, 100, 100, 0.4);
  background: white;
  color: #a3a3a3;
  font-style: oblique;
  font-size: 14px;
  cursor: text;
}
::v-deep.el-input.is-disabled .el-input__icon {
  cursor: text;
}
::v-deep.el-icon-circle-check {
  color: #13ce66;
}
::v-deep.el-icon-arrow-up:before {
  content: '';
}
.cell-box {
  min-width: 120px;
  .cell-input {
    width: 220px;
  }
  .cell-select {
    width: 220px;
  }
}
</style>
