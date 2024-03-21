<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">数据检索条件:</span>
            <el-input v-model="query.departmentName" clearable size="mini" placeholder="请输入部门名称" style="width: 150px;margin:0 5px" />
          </div>
          <div class="flex-sub">
            <el-button type="primary" size="mini" icon="el-icon-magic-stick" @click="toSearch">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh-left" @click="clearLimit">重置</el-button>
          </div>
          <div class="right-wrapper">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="toAdd">新增</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" style="overflow: hidden">
        <el-table v-loading="loading" :data="tableList" row-key="departmentId" :tree-props="{children: 'childDepartments', hasChildren: 'hasChildren'}" size="mini" stripe tooltip-effect="dark" height="calc(70vh - 42px)">
<!--          <el-table-column prop="departmentId" label="部门ID" width="160" />-->
          <el-table-column prop="departmentName" label="部门名称" />
          <el-table-column label="最后维护日期" width="180">
            <template slot-scope="scope">
              <span class="text-grey">{{ scope.row.cTime || getDateTime() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
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
  </div>
</template>

<script>
import editPage from './edit'

export default {
  components: { editPage },
  data() {
    return {
      waterMark: '',
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      query: {
        departmentName: ''
      },
      tableData: [],
      tableList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    getDateTime(now) {
      if (!now) {
        now = new Date()
      }
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    indexMethod(index) {
      return 1 + index + this.page * this.pageSize - this.pageSize
    },
    toAdd() {
      this.$refs.editPage.loadData()
    },
    toEdit(item) {
      this.$refs.editPage.loadData(item)
    },
    toDelete(item) {
      this.$confirm(`确认删除“${item.departmentName}”吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpPost({
          url: this.$urlPath.DeleteDepartment + '?departmentId=' + item.departmentId,
          data: {
            departmentId: item.departmentId
          }
        }).then((res) => {
          if (res.code !== 200) {
            this.$errorMsg(res.msg || '接口调用失败，未知异常')
          } else {
            this.$successMsg(res.msg || '操作成功')
          }
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
      this.query = {
        departmentName: ''
      }
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
      this.tableList = []
      this.$httpGet({
        url: this.$urlPath.GetDepartmentAndChilds,
        data: {
          page: this.page,
          pageSize: this.pageSize,
          ...this.query
        }
      }).then((res) => {
        if (res.code !== 200) {
          this.$errorMsg(res.msg || '接口调用失败，未知异常')
        }
        this.tableData = res.data || []
        this.dataFilter()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header-container {
  .wrapper {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .left-wrapper {
      margin-left: 15px;
      min-width: 780px;
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
