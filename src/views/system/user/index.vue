<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">数据检索条件:</span>
            <el-input v-model="query.userName" clearable size="mini" placeholder="请输入设备名称" style="width: 150px;margin:0 5px" />
            <el-input v-model="query.nickName" clearable size="mini" placeholder="请输入设备IP" style="width: 150px;margin:0 5px" />
            <el-cascader v-model="depts" :options="deptList" :show-all-levels="false" :props="{value:'departmentId',label:'departmentName',children:'childDepartments',checkStrictly:true }" size="mini" placeholder="请选择部门" style="width: 150px;margin:0 5px" />
            <el-select v-model="roles" multiple collapse-tags placeholder="请选择角色" size="mini" style="width: 200px;margin:0 5px">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.name"/>
            </el-select>
          </div>
          <div class="flex-sub">
            <el-button type="primary" size="mini" icon="el-icon-magic-stick" @click="toSearch">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh-left" @click="clearLimit">重置</el-button>
          </div>
          <div class="right-wrapper">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="toAdd">新增设备</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" style="overflow: hidden">
        <el-table v-loading="loading" :data="tableList" size="mini" stripe tooltip-effect="dark" height="calc(70vh - 42px)">
          <el-table-column type="index" width="60" label="序号" align="center" :index="indexMethod" />
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column prop="nickName" label="姓名" align="center" />
          <el-table-column prop="email" label="电子邮箱" align="center" />
          <el-table-column label="部门" align="center">
            <template slot-scope="scope">
              <el-cascader v-model="scope.row.depts" :options="deptList" :show-all-levels="false" disabled :props="{value:'departmentId',label:'departmentName',children:'childDepartments',checkStrictly:true }" size="mini" placeholder="无" />
            </template>
          </el-table-column>
          <el-table-column label="角色组" align="center" width="200">
            <template slot-scope="scope">
              <el-tag v-for="(item, i) in scope.row.roles" :key="scope.row.userId+'_'+i" class="tag-label" size="mini">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="wX_OPENID" label="微信绑定" align="center" width="80">
            <template slot-scope="scope">
              {{ scope.row.wX_OPENID?'有':'无' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="无效/有效" width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" :active-value="'有效'" :inactive-value="'无效'" @change="changeState(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-tooltip content="重置密码"><el-button round plain type="warning" size="mini" icon="el-icon-refresh-left" @click="toReset(scope.row)" /></el-tooltip>
              <el-tooltip content="编辑"><el-button round plain type="primary" size="mini" icon="el-icon-edit-outline" @click="toEdit(scope.row)" /></el-tooltip>
              <el-tooltip content="删除"><el-button round plain type="danger" size="mini" icon="el-icon-delete" @click="toDelete(scope.row)" /></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination :total="total" :current-page="page" :page-size="pageSize" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange" />
      </div>
    </el-card>
    <edit-page ref="editPage" />
    <reset-page ref="resetPage" />
  </div>
</template>

<script>
import editPage from './edit'
import resetPage from './reset'

export default {
  components: { editPage, resetPage },
  data() {
    return {
      waterMark: '',
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      query: {
        userName: '',
        nickName: '',
        roles: '',
        departmentId: ''
      },
      roles: [],
      depts: [],
      roleList: [],
      deptList: [],
      tableData: [],
      tableList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$httpGet({
        url: this.$urlPath.GetRoles
      }).then((res) => {
        this.roleList = res || []
      })
      this.$httpGet({
        url: this.$urlPath.GetDepartmentAndChilds
      }).then((res) => {
        this.deptList = res || []
        this.loadData()
      })
    })
  },
  methods: {
    indexMethod(index) {
      return 1 + index + this.page * this.pageSize - this.pageSize
    },
    changeState(item) {
      item.departmentId = item.depts[item.depts.length - 1]
      this.$httpPost({
        url: this.$urlPath.UpdateUser,
        data: item
      }).then((res) => {
        this.$successMsg(res.msg)
        this.loadData()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    toAdd() {
      this.$refs.editPage.loadData()
    },
    toReset(item) {
      this.$refs.resetPage.loadData(item)
    },
    toEdit(item) {
      this.$refs.editPage.loadData(item)
    },
    toDelete(item) {
      this.$confirm(`确认删除“${item.userName}”吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpPost({
          url: this.$urlPath.DeleteUser,
          data: {
            userId: item.userId
          }
        }).then((res) => {
          this.$successMsg(res.msg)
          this.loadData()
        }).catch((error) => {
          this.$errorMsg(error || '接口调用失败，未知异常')
        })
      })
    },
    toSearch() {
      this.page = 1
      this.loadData()
    },
    clearLimit() {
      this.query = {}
      this.loadData()
    },
    pageChange(e) {
      this.page = e
      this.loadData()
    },
    sizeChange(e) {
      this.page = 1
      this.pageSize = e
      this.loadData()
    },
    dataFilter() {
      this.total = this.tableData.length
      this.tableList = this.tableData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    },
    loadData() {
      this.query.roles = this.roles.join(',')
      this.query.departmentId = this.depts.length ? this.depts[this.depts.length - 1] : ''
      this.tableList = []
      this.$httpGet({
        url: this.$urlPath.GetUsers,
        data: {
          page: this.page,
          pageSize: this.pageSize,
          ...this.query
        }
      }).then((res) => {
        this.tableData = res || []
        this.dataFilter()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid rgba(100, 100, 100, 0.4);
  background: white;
  cursor: text;
}
::v-deep .el-input.is-disabled .el-input__icon {
  cursor: text;
}
::v-deep .el-icon-arrow-down:before {
  content: '';
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
}
</style>
