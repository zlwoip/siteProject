<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="580px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="220px">
      <el-form-item label="交换机名称：" class="form-cell" prop="switchName">
        <div class="cell-box">
          <el-input v-model="formData.switchName" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="IP地址：" class="form-cell" prop="switchIP">
        <div class="cell-box">
          <el-input v-model="formData.switchIP" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="所属分管单位：" class="form-cell" prop="branch">
        <div class="cell-box">
          <el-select v-model="formData.branch" size="mini" placeholder="请选择所属分管单位" class="cell-select">
            <el-option v-for="item in dw_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="通信编码：" class="form-cell" prop="comm">
        <div class="cell-box">
          <el-input v-model="formData.comm" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="协议版本：" class="form-cell" prop="version">
        <div class="cell-box">
          <el-select v-model="formData.version" size="mini" placeholder="请选择所属分管单位" class="cell-select">
            <el-option v-for="item in ver_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      dw_type: [
        { label: '市公司', value: '市公司' },
        { label: '环翠区', value: '环翠区' },
        { label: '高区', value: '高区' },
        { label: '经区', value: '经区' },
        { label: '文登', value: '文登' },
        { label: '荣成', value: '荣成' },
        { label: '乳山', value: '乳山' }
      ],
     ver_type: [
        { label: 'Ver1', value: 'Ver1' },
        { label: 'Ver2', value: 'Ver2' }
      ],
      title: '',
      formData: {
        switchName: '',
        switchIP: '',
        branch: '',
        comm: 'whgdcatv2013',
        version: 'Ver1'
      },
      rules: {
        switchName: { required: true, message: '请填写交换机名称', trigger: 'blur' },
        switchIP: { required: true, message: '请填写交换机IP', trigger: 'blur' },
        branch: { required: true, message: '请选择所属分管单位', trigger: 'blur' },
        comm: { required: true, message: '请选择交换机通信编码', trigger: 'blur' }
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
      this.visible = false
    },
    cancelView() {
      this.hideView()
    },
    submitForm(isRelease) {
      this.$refs.formViewRef.validate((valid, obj) => {
        if (valid) {
          this.$post({
            url: this.formData.switchId ? this.$urlPath.updateSwitchDevice : this.$urlPath.addSwitchDevice,
            data: {
              ...this.formData
            }
          }).then((res) => {
            this.$successMsg(res.msg)
            this.cancelView()
            this.$parent.loadData()
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
    loadData(item) {
      if (item) {
        this.formData = item
        this.title = '交换机信息编辑'
      } else {
        this.formData = {
          switchName: '',
          switchIP: '',
          branch: '',
          comm: 'whgdcatv2013',
          version: 'Ver1'
        }
        this.title = '交换机信息录入'
      }
      this.showView()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
