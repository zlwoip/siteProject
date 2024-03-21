<template>
  <!-- 表单渲染 -->
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelView" :visible="visible" :title="title" width="600px">
    <el-form ref="formViewRef" :model="formData" :rules="rules" :status-icon="true" label-width="200px">
      <el-form-item label="用户名：" class="form-cell" prop="userName">
        <div class="cell-box">
          <el-input v-model="formData.userName" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item v-if="!formData.userId" label="密码：" class="form-cell" prop="password">
        <div class="cell-box">
          <el-input v-model="formData.password" size="mini" placeholder="请输入密码" type="password" prefix-icon="el-icon-lock" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="姓名：" class="form-cell" prop="nickName">
        <div class="cell-box">
          <el-input v-model="formData.nickName" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="电子邮箱：" class="form-cell" prop="email">
        <div class="cell-box">
          <el-input v-model="formData.email" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
      <el-form-item label="部门：" class="form-cell" prop="depts">
        <div class="cell-box">
          <el-cascader v-model="formData.depts" :options="deptList" :show-all-levels="false" :props="{value:'departmentId',label:'departmentName',children:'childDepartments',checkStrictly:true }" size="mini" placeholder="无" />
        </div>
      </el-form-item>
      <el-form-item label="角色组：" class="form-cell" prop="roles">
        <div class="cell-box">
          <el-tag v-for="(item, i) in formData.roles" :key="'ui_'+i" class="tag-label" closable @close="arrSplice(item, formData.roles)" size="mini">{{ item }}</el-tag>
          <i class="el-icon-circle-plus-outline touch add-btn tag-label" title="添加角色" @click="initRoles"></i>
        </div>
      </el-form-item>
      <el-form-item label="微信绑定：" class="form-cell" prop="wX_OPENID">
        <div class="cell-box">
          <el-input v-model="formData.wX_OPENID" size="mini" placeholder="单行文本输入" class="cell-input" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" @click="cancelView">取消</el-button>
      <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
    </div>

    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelNameListView" :visible="viewVisible" width="300px">
      <div v-for="(item, index) in roleList" :key="'uc_'+index" class="name-list">
        <el-button size="mini" style="width: 200px;margin: 1px" @click="insertRoll(item)">
          <i class="el-icon-user" style="float: left"></i>
          {{ item }}
        </el-button>
      </div>
    </el-dialog>

  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      title: '用户信息',
      roleList: [],
      deptList: [],
      viewVisible: false,
      formData: {
        userName: '',
        password: '',
        nickName: '',
        email: '',
        state: '有效',
        depts: [],
        roles: [],
        wX_OPENID: ''
      },
      rules: {
        userName: { required: true, message: '请填写用户名', trigger: 'blur' },
        nickName: { required: true, message: '请填写姓名', trigger: 'blur' }
      }
    }
  },
  mounted() {
  },
  methods: {
    initRoles() {
      this.viewVisible = true
      const tempArr = this.$parent.roleList.map(item => {
        return item.name
      })
      this.roleList = tempArr.filter(item => {
        let flag = true
        this.formData.roles.forEach((role) => {
          if (item === role) {
            flag = false
          }
        })
        return flag
      })
    },
    arrSplice(item, arr) {
      arr.splice(arr.indexOf(item), 1)
    },
    cancelNameListView() {
      this.viewVisible = false
      this.roleList = []
    },
    insertRoll(item) {
      this.cancelNameListView()
      this.formData.roles.push(item)
    },
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
          this.formData.password = this.formData.userId ? undefined : this.formData.password
          this.$httpPost({
            url: this.formData.userId ? this.$urlPath.UpdateUser : this.$urlPath.AdministratorAddUser,
            data: {
              ...this.formData
            }
          }).then((res) => {
            if (res.code !== 200) {
              this.$errorMsg(res.msg || '接口调用失败，未知异常')
            } else {
              this.$successMsg(res.msg || '操作成功')
              this.cancelView()
              this.$parent.loadData()
            }
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
      this.deptList = this.$parent.deptList
      if (item) {
        this.formData = item
        this.formData.password = '123456'
      } else {
        this.formData = {
          userName: '',
          nickName: '',
          password: '',
          email: '',
          state: '有效',
          depts: [],
          roles: [],
          wX_OPENID: ''
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
