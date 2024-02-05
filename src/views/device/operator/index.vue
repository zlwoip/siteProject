<template>
  <div class="main-container">
    <div class="table-header-container">
      <el-card :body-style="{padding: '0'}" shadow="never">
        <div class="wrapper">
          <div class="left-wrapper">
            <span class="label">基本操作:</span>
          </div>
          <div class="flex-sub"></div>
          <div class="right-wrapper">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="toAdd">新增</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-card :body-style="{padding: 0}" class="table-container" shadow="never">
      <div class="wrapper" style="overflow: hidden">
        <el-table v-loading="loading" :data="tableList" size="mini" stripe tooltip-effect="dark" height="calc(70vh - 42px)">
          <el-table-column type="index" width="60" label="序号" :index="indexMethod" />
          <el-table-column align="center" label="姓名" prop="name" />
          <el-table-column align="center" label="电子签名">
            <template slot-scope="scope">
              <div class="avatar-container">
                <el-image :src="require(`@/assets/signImg/${scope.row.imagePath || 'signTemp'}.png`)" class="avatar avatar-vip" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="组别" prop="type" />
          <el-table-column align="center" label="性别" prop="sex">
            <template slot-scope="scope">
              <div class="gender-container flex justify-center align-center">
                <img class="gender-icon" :src="scope.row.sex === '0' ? require('@/assets/icon_sex_man.png') : require('@/assets/icon_sex_woman.png')" />
                <span>{{ scope.row.sex === '0' ? '男' : '女' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系电话" prop="telephone" />
          <el-table-column align="center" label="禁用/启用">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" :active-value="'1'" :inactive-value="'0'" @change="changeState(scope.row)" />
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
      query: {},
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
    changeState(item) {
      this.$post({
        url: this.$urlPath.updateInspectionPerson,
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
    toEdit(item) {
      this.$refs.editPage.loadData(item)
    },
    toDelete(item) {
      this.$confirm(`确认删除“${item.name}”值机员吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post({
          url: this.$urlPath.deleteInspectionPerson,
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
      this.total = this.tableData.length
      this.tableList = this.tableData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    },
    loadData() {
      this.tableList = []
      this.$post({
        url: this.$urlPath.ShowInspectionPersonList,
        data: {
          page: this.page,
          pageSize: this.pageSize,
          ...this.query
        }
      }).then((res) => {
        this.tableData = res.inspectionPersonList || []
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
