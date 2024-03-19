<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="540px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="200px">
      <el-form-item label="部门名称：" class="form-cell" prop="departmentName">
        <div class="cell-box">
          <el-input v-model="formData.departmentName" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="上级部门：" class="form-cell" prop="parentDepartmentId">
        <div class="cell-box">
          <el-cascader v-model="pids" :options="deptList" :show-all-levels="false" :props="{value:'departmentId',label:'departmentName',children:'childDepartments',checkStrictly:true }" size="mini" placeholder="无" class="cell-input" />
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
      title: '部门信息',
      deptList: [],
      pids: [],
      formData: {
        departmentName: '',
        parentDepartmentId: ''
      },
      rules: {
        departmentName: { required: true, message: '请填写部门名称', trigger: 'blur' }
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
          if (this.pids.length) {
            this.formData.parentDepartmentId = this.pids[this.pids.length - 1]
          }
          this.$httpPost({
            url: this.formData.departmentId ? this.$urlPath.UpdateDepartment : this.$urlPath.Department,
            data: {
              ...this.formData
            }
          }).then((res) => {
            this.$successMsg(res || '操作成功')
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
      this.deptList = this.$parent.tableData
      if (item) {
        this.pids = item.pids || []
        this.formData = item
      } else {
        this.pids = []
        this.formData = {
          departmentName: '',
          parentDepartmentId: ''
        }
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
