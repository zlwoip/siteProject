<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">数据检索条件:</span>
            <el-input v-model="query.upsName" clearable size="mini" placeholder="请输入设备名称" style="width: 150px;margin:0 5px" />
            <el-input v-model="query.upsIP" clearable size="mini" placeholder="请输入设备IP" style="width: 150px;margin:0 5px" />
            <el-select v-model="query.branch" clearable size="mini" placeholder="请选择所属分管单位" style="width: 160px;margin:0 5px">
              <el-option v-for="item in dw_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="query.upsLevel" clearable size="mini" placeholder="请选择电源等级" style="width: 180px;margin:0 5px">
              <el-option v-for="item in dj_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="query.upsType" clearable size="mini" placeholder="请选择电源类型" style="width: 130px;margin:0 5px">
              <el-option v-for="item in dy_type" :key="item.value" :label="item.label" :value="item.value" />
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
          <el-table-column prop="upsName" label="电源名称" align="center" sortable />
          <el-table-column prop="upsIP" label="IP地址" align="center" sortable />
          <el-table-column prop="branch" label="所属分管单位" align="center" sortable />
          <el-table-column prop="upsLevel" label="电源等级" align="center" width="220" sortable />
          <el-table-column prop="upsType" label="电源类型" align="center" sortable />
          <el-table-column prop="maintenanceTime" label="最后维护日期" align="center" width="150" sortable />
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
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      query: {
        upsName: '',
        upsIP: '',
        branch: '',
        upsLevel: '',
        upsType: ''
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
      this.$confirm(`确认删除“${item.upsName}”电源设备吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.deleteUps,
          data: {
            id: item.id
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
      if (this.query.upsName) {
        this.tableData = this.tableData.filter(item => {
          return item.upsName.indexOf(this.query.upsName) >= 0
        })
      }
      if (this.query.upsIP) {
        this.tableData = this.tableData.filter(item => {
          return item.upsIP.indexOf(this.query.upsIP) >= 0
        })
      }
      if (this.query.branch) {
        this.tableData = this.tableData.filter(item => {
          return item.branch.indexOf(this.query.branch) >= 0
        })
      }
      if (this.query.upsLevel) {
        this.tableData = this.tableData.filter(item => {
          return item.upsLevel.indexOf(this.query.upsLevel) >= 0
        })
      }
      if (this.query.upsType) {
        this.tableData = this.tableData.filter(item => {
          return item.upsType.indexOf(this.query.upsType) >= 0
        })
      }
      this.total = this.tableData.length
      this.tableList = this.tableData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    },
    loadData() {
      this.tableList = []
      this.$post({
        url: this.$urlPath.ShowUpsList,
        data: {
          page: this.page,
          pageSize: this.pageSize,
          ...this.query
        }
      }).then((res) => {
        this.tableData = res.ShowUps || []
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
