<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="540px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="200px">
      <el-form-item label="电源名称：" class="form-cell" prop="upsName">
        <div class="cell-box">
          <el-input v-model="formData.upsName" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="IP地址：" class="form-cell" prop="upsIP">
        <div class="cell-box">
          <el-input v-model="formData.upsIP" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="所属分管单位：" class="form-cell" prop="branch">
        <div class="cell-box">
          <el-select v-model="formData.branch" size="mini" placeholder="请选择所属分管单位" class="cell-select">
            <el-option v-for="item in dw_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="电源等级：" class="form-cell" prop="upsLevel">
        <div class="cell-box">
          <el-select v-model="formData.upsLevel" size="mini" placeholder="请选择电源等级" class="cell-select">
            <el-option v-for="item in dj_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="电源类型：" class="form-cell" prop="upsType">
        <div class="cell-box">
          <el-select v-model="formData.upsType" size="mini" placeholder="请选择电压类型" class="cell-select">
            <el-option v-for="item in dy_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="位置坐标：" class="form-cell" prop="position">
        <div class="cell-box">
          <el-input v-model="formData.position" size="mini" placeholder="单行文本输入" class="cell-input" />
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
        { label: '环翠分公司', value: '环翠分公司' },
        { label: '高区分公司', value: '高区分公司' },
        { label: '经区分公司', value: '经区分公司' }
      ],
      dj_type: [
        { label: '总前端120KVA', value: '总前端120KVA' },
        { label: '一级分前端10KVA', value: '一级分前端10KVA' },
        { label: '二级分前端及乡镇广播站10KVA', value: '二级分前端及乡镇广播站10KVA' }
      ],
      dy_type: [
        { label: '三相电压', value: '三相电压' },
        { label: '标准电压', value: '标准电压' }
      ],
      title: 'ups设备信息录入',
      formData: {
        upsName: '',
        upsIP: '',
        branch: '',
        upsLevel: '',
        upsType: '',
        position: ''
      },
      rules: {
        upsName: { required: true, message: '请填写电源名称', trigger: 'blur' },
        upsIP: { required: true, message: '请填写电源IP', trigger: 'blur' },
        branch: { required: true, message: '请选择所属分管单位', trigger: 'blur' },
        upsLevel: { required: true, message: '请选择所属分管单位', trigger: 'blur' },
        upsType: { required: true, message: '请选择所属分管单位', trigger: 'blur' }
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
            url: this.formData.id ? this.$urlPath.updateUps : this.$urlPath.addUps,
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
        this.title = 'ups信息编辑'
      } else {
        this.formData = {
          upsName: '',
          upsIP: '',
          branch: '',
          upsLevel: '',
          upsType: '',
          position: ''
        }
        this.title = 'ups信息录入'
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
