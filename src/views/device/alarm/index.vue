<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">检索时间范围:</span>
            <el-date-picker
              v-model="timeList"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              size="mini"
            />
          </div>
          <div class="flex-sub">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="toSearch">查询</el-button>
          </div>
          <div class="right-wrapper">
            <el-button type="success" size="mini" icon="el-icon-close-notification" @click="toRemove()">批量解除</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" style="overflow: hidden">
        <el-table v-loading="loading" :data="tableList" size="mini" stripe tooltip-effect="dark" height="calc(70vh - 42px)" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="60" label="序号" :index="indexMethod" />
          <el-table-column label="设备IP" prop="machine" width="150" />
          <el-table-column label="报警信息描述" prop="description" />
          <el-table-column align="center" label="报警类型" prop="type" width="100" />
          <el-table-column align="center" label="报警时间" prop="datetime" width="220" />
          <el-table-column align="center" label="状态" prop="handle" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.handle === 1" style="color: #00CD66">已解除</span>
              <span v-else style="color: #a3a3a3">未解除</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-tooltip content="解除"><el-button round plain type="success" size="mini" icon="el-icon-close-notification" :disabled="scope.row.handle === 1" @click="toRemove(scope.row)" /></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination :total="total" :current-page="page" :page-size="pageSize" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange" />
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      waterMark: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近24小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近72小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近7天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      multipleSelection: [],
      query: {},
      timeList: [],
      tableData: [],
      tableList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      start.setTime(start.getTime() - 3600 * 1000 * 48)
      this.timeList = [start, end]
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    indexMethod(index) {
      return 1 + index + this.page * this.pageSize - this.pageSize
    },
    toEdit(item) {
      this.$refs.editPage.loadData(item)
    },
    toRemove(item) {
      if (!item && !this.multipleSelection.length) {
        return this.$message({
          message: '未选取数据',
          type: 'info'
        })
      }
      let ids
      if (item) {
        ids = [item.alarmId]
      } else {
        ids = this.multipleSelection.map(obj => {
          return obj.alarmId
        })
      }
      this.$confirm(`确认解除报警吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.updateAlarm,
          data: {
            alarmIds: ids.join('&'),
            handle: 1
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
      this.tableList = []
      this.$post({
        url: this.$urlPath.showAlarm,
        data: {
          startDate: this.getDateTime(this.timeList[0]),
          endDate: this.getDateTime(this.timeList[1])
        }
      }).then((res) => {
        this.tableData = res.alarmInfoList || []
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
.avatar-container {
  position: relative;
  width: 80px;
  height: 50px;
  margin: 0 auto;
  vertical-align: middle;
  .avatar {
    width: 76px;
    height: 42px;
    border-radius: 5%;
  }
  .avatar-vip {
    border: 2px solid #cece1e;
  }
  .vip {
    position: absolute;
    top: 0;
    right: -9px;
    width: 15px;
    transform: rotate(60deg);
  }
}
.gender-container {
  .gender-icon {
    width: 20px;
  }
}
</style>
