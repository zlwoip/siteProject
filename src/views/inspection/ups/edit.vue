<template>
  <!-- 表单渲染 -->
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancelView"
    :visible="visible"
    :title="title"
    top="25vh"
    width="500px"
  >
    <el-form ref="formViewRef" :model="formData" size="mini" :rules="rules" :status-icon="true" label-width="170px">
      <el-form-item label="巡检时间：" class="form-cell" prop="dateTime">
        <div class="cell-box">
          <el-date-picker v-model="formData.dateTime" size="mini" type="datetime" placeholder="选择日期时间" class="cell-select" />
        </div>
      </el-form-item>
      <el-form-item label="巡检员：" class="form-cell" prop="inspector">
        <div class="cell-box">
          <el-select v-model="formData.inspector" placeholder="请选择" size="mini" class="cell-select">
            <el-option v-for="item in inspectorList" :key="item.id" :label="item.name" :value="item.name" @click.native="formData.signImg=item.imagePath" />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" icon="el-icon-circle-close" @click="cancelView">关闭</el-button>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="submitForm()">添加</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      title: '新增巡检',
      inspectorList: [],
      formData: {
        dateTime: '',
        inspector: '',
        signImg: ''
      },
      rules: {
        dateTime: { required: true, message: '请选择巡巡检时间', trigger: 'blur' },
        inspector: { required: true, message: '请选择巡检人', trigger: 'blur' }
      }
    }
  },
  mounted() {
  },
  methods: {
    getNowDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
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
    submitForm() {
      this.$refs.formViewRef.validate((valid, obj) => {
        if (valid) {
          this.$parent.addInspection(this.formData)
          this.cancelView()
        } else {
          this.$message({
            message: '表单信息有误，请核对无误后提交！',
            type: 'error'
          })
        }
      })
    },
    loadData() {
      this.formData.dateTime = this.getNowDateTime()
      this.$post({
        url: this.$urlPath.ShowInspectionPersonList
      }).then((res) => {
        this.inspectorList = (res.inspectionPersonList || []).filter(item => {
          return item.state !== '0' && item.type === '值机'
        })
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
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
