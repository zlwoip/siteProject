<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="540px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="200px">
      <el-form-item label="姓名：" class="form-cell" prop="name">
        <div class="cell-box">
          <el-input v-model="formData.name" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="电子签名url：" class="form-cell" prop="imagePath">
        <div class="cell-box">
          <el-input v-model="formData.imagePath" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="组别：" class="form-cell" prop="sex">
        <div class="cell-box">
          <el-select v-model="formData.type" size="mini" placeholder="请选择" class="cell-select">
            <el-option v-for="item in tp_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="性别：" class="form-cell" prop="sex">
        <div class="cell-box">
          <el-select v-model="formData.sex" size="mini" placeholder="请选择" class="cell-select">
            <el-option v-for="item in xb_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="联系电话：" class="form-cell" prop="telephone">
        <div class="cell-box">
          <el-input v-model="formData.telephone" size="mini" placeholder="单行文本输入" class="cell-input" />
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
      xb_type: [
        { label: '男', value: '0' },
        { label: '女', value: '1' }
      ],
      tp_type: [
        { label: '值机', value: '值机' },
        { label: '技术', value: '技术' }
      ],
      title: '',
      formData: {
        name: '',
        imagePath: '',
        type: '值机',
        sex: '0',
        telephone: '',
        state: '1'
      },
      rules: {
        name: { required: true, message: '请填写电源名称', trigger: 'blur' }
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
      this.formData = {
        name: '',
        imagePath: '',
        type: '值机',
        sex: '0',
        telephone: '',
        state: '1'
      }
    },
    cancelView() {
      this.hideView()
    },
    submitForm() {
      this.$refs.formViewRef.validate((valid, obj) => {
        if (valid) {
          this.$post({
            url: this.formData.id ? this.$urlPath.updateInspectionPerson : this.$urlPath.addInspectionPerson,
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
        this.title = '值机员信息编辑'
      } else {
        this.formData = {
          name: '',
          imagePath: '',
          type: '值机',
          sex: '0',
          telephone: '',
          state: '1'
        }
        this.title = '值机员信息录入'
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
