<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">数据检索条件:</span>
            <el-input v-model="query.switchName" clearable size="mini" placeholder="请输入交换机名称" style="width: 150px;margin:0 5px" />
            <el-input v-model="query.switchIP" clearable size="mini" placeholder="请输入IP地址" style="width: 150px;margin:0 5px" />
            <el-select v-model="query.branch" clearable size="mini" placeholder="请选择所属分管单位" style="width: 160px;margin:0 5px">
              <el-option v-for="item in dw_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-model="query.comm" clearable size="mini" placeholder="请输入通信编码" style="width: 150px;margin:0 5px" />
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
          <el-table-column align="center" type="expand">
            <template slot-scope="scope">
              <div class="table-card-box">
                <div class="table-card-title">
                  <span><i class="el-icon-plus touch" title="点击添加端口" @click="toPortEdit(null, scope.row)"></i> 端口巡检列表</span>
                </div>
                <table v-if="scope.row.switchPortList.length" class="table">
                  <tr class="tr">
                    <th class="th" width="20%">端口名称</th>
                    <th class="th" width="20%">端口描述</th>
                    <th class="th" width="20%">接收端OID</th>
                    <th class="th" width="20%">发射端OID</th>
                    <th class="th" width="10%">报警值下限</th>
                    <th class="th" width="10%">报警值上限</th>
                  </tr>
                  <tr v-for="(port, ii) in scope.row.switchPortList" :key="'p_'+ii" class="tr">
                    <td>
                      <img :src="require('@/assets/port.png')" style="transform: scaleX(0.8) scaleY(0.8)" />
                      <i class="el-icon-edit-outline touch" title="编辑" @click="toPortEdit(port, scope.row)"></i>
                      <i class="el-icon-delete touch" title="删除" style="left: 45px" @click="toPortDelete(scope.row, ii)"></i>
                      <span class="touch link-text" title="编辑" @click="toPortEdit(port, scope.row)">
                        {{ port.portName }}
                      </span>
                    </td>
                    <td>{{ port.portDescription }}</td>
                    <td>{{ port.receiveOpticalOid }}</td>
                    <td>{{ port.outputOpticalOid }}</td>
                    <td>{{ port.lowerAlarmValue || `-` }}</td>
                    <td>{{ port.upperAlarmValue || `-` }}</td>
                  </tr>
                </table>
                <div v-else class="table-card-noData">暂无数据</div>
                <div class="table-card-title" style="margin-top: 4px">
                  <span><i class="el-icon-plus touch" title="点击添加电源" @click="toUpsEdit(null, scope.row)"></i> 电源设备列表</span>
                </div>
                <table v-if="scope.row.switchPowerList.length" class="table">
                  <tr class="tr">
                    <th class="th" width="20%">电源名称</th>
                    <th class="th" width="20%">电源型号</th>
                    <th class="th" width="60%">设备OID</th>
                  </tr>
                  <tr v-for="(ups, ii) in scope.row.switchPowerList" :key="'u_'+ii" class="tr">
                    <td>
                      <img :src="require('@/assets/ups.png')" />
                      <i class="el-icon-edit-outline touch" title="编辑" @click="toUpsEdit(ups, scope.row)"></i>
                      <i class="el-icon-delete touch" title="删除" style="left: 45px" @click="toUpsDelete(scope.row, ii)"></i>
                      <span class="touch link-text" title="编辑" @click="toUpsEdit(ups, scope.row)">
                        {{ ups.power }}
                      </span>
                    </td>
                    <td>220V交变电源</td>
                    <td>{{ ups.powerOid }}</td>
                  </tr>
                </table>
                <div v-else class="table-card-noData">暂无数据</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="switchName" label="交换机名称" sortable width="220" />
          <el-table-column prop="switchIP" label="IP地址" align="center" sortable />
          <el-table-column prop="branch" label="所属分管单位" align="center" sortable />
          <el-table-column prop="comm" label="通信编码" align="center" sortable />
          <el-table-column prop="version" label="通信编码" align="center" sortable />
          <el-table-column label="端口数量" align="center" width="100" sortable>
            <template slot-scope="scope">
              {{ scope.row.switchPortList.length || '暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="电源数量" align="center" width="100" sortable>
            <template slot-scope="scope">
              {{ scope.row.switchPowerList.length || '暂无' }}
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
    <port-edit ref="portEdit" />
    <ups-edit ref="upsEdit" />
  </div>
</template>

<script>
import editPage from './edit'
import portEdit from './portEdit'
import upsEdit from './upsEdit'

export default {
  components: { editPage, portEdit, upsEdit },
  data() {
    return {
      waterMark: '',
      dw_type: [
        { label: '市公司', value: '市公司' },
        { label: '环翠区', value: '环翠区' },
        { label: '高区', value: '高区' },
        { label: '经区', value: '经区' },
        { label: '文登', value: '文登' },
        { label: '荣成', value: '荣成' },
        { label: '乳山', value: '乳山' }
      ],
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      query: {
        switchName: '',
        switchIP: '',
        branch: '',
        comm: ''
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
    toPortEdit(item, switchObj) {
      this.$refs.portEdit.loadData(item, switchObj)
    },
    toUpsEdit(ups, switchObj) {
      this.$refs.upsEdit.loadData(ups, switchObj)
    },
    toDelete(item) {
      this.$confirm(`确认删除”${item.switchName}“交换机吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.deleteSwitchDevice,
          data: {
            switchId: item.switchId
          }
        }).then((res) => {
          this.$successMsg(res.msg)
          this.loadData()
        }).catch((error) => {
          this.$errorMsg(error || '接口调用失败，未知异常')
        })
      })
    },
    toPortDelete(item, index) {
      this.$confirm(`确认删除“${item.switchName}”交换机“${item.switchPortList[index].portName}”端口吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.deleteSwitchPort,
          data: {
            portId: item.switchPortList[index].portId
          }
        }).then((res) => {
          this.$successMsg(res.msg)
          item.switchPortList.splice(index, 1)
        }).catch((error) => {
          this.$errorMsg(error || '接口调用失败，未知异常')
        })
      })
    },
    toUpsDelete(item, index) {
      this.$confirm(`确认删除”${item.switchName}”交换机“${item.switchPowerList[index].power}”电源吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.deleteSwitchPower,
          data: {
            powerId: item.switchPowerList[index].powerId
          }
        }).then((res) => {
          this.$successMsg(res.msg)
          item.switchPowerList.splice(index, 1)
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
      if (this.query.switchName) {
        this.tableData = this.tableData.filter(item => {
          return item.switchName.indexOf(this.query.switchName) >= 0
        })
      }
      if (this.query.switchIP) {
        this.tableData = this.tableData.filter(item => {
          return item.switchIP.indexOf(this.query.switchIP) >= 0
        })
      }
      if (this.query.branch) {
        this.tableData = this.tableData.filter(item => {
          return item.branch.indexOf(this.query.branch) >= 0
        })
      }
      if (this.query.comm) {
        this.tableData = this.tableData.filter(item => {
          return item.comm.indexOf(this.query.comm) >= 0
        })
      }
      this.total = this.tableData.length
      this.tableList = this.tableData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    },
    loadData() {
      this.tableList = []
      this.$post({
        url: this.$urlPath.ShowSwitchDeviceList,
        data: {
          page: this.page,
          pageSize: this.pageSize,
          ...this.query
        }
      }).then((res) => {
        this.tableData = res.switchDeviceList || []
        this.dataFilter()
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-card-box {
  .table-card-title {
    width: 100%;
    padding: 2px 10px;
    color: #333333;
    font-weight: bold;
    font-size: 14px;
    background-color: rgba(0,0,0,0.15);
    text-align: center;
    span {
      font-size: 15px;
      padding-left: 4px;
    }
    i {
      float: left;
    }
    i:hover {
      color: #3a8ee6;
    }
  }
  .table-card-noData {
    width: 100%;
    text-align: center;
    color: #4e4e4e;
    border: 1px dashed #ddd;
  }
  table {
    margin-top: 1px;
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    border-radius: 5px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 4px;
    border-radius: 5px;
    text-align: center;
    img {
      position: absolute;
      top: 4px;
      left: 10px;
    }
    i {
      position: absolute;
      top: 6px;
      left: 30px;
    }
    i:hover {
      color: #3a8ee6;
    }
  }
  th {
    background-color: #e2e2e2;
    font-weight: bold;
  }
  .bk {
    background-color: #f2f2f2;
  }
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
