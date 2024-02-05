<template>
  <!-- 表单渲染 -->
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancelView"
    :visible="visible"
    :title="title"
    top="25vh"
    width="590px"
  >
    <el-form ref="formViewRef" :model="formData" :rules="rules" size="mini" :status-icon="true" label-width="170px">
      <el-form-item label="三相输入电压：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minInputTPE">
            <el-input v-model.number="formData.minInputTPE" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限 V</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxInputTPE">
            <el-input v-model.number="formData.maxInputTPE" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限 V</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="三相输出电压：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minOutputTPE">
            <el-input v-model.number="formData.minOutputTPE" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限 V</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxOutputTPE">
            <el-input v-model.number="formData.maxOutputTPE" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限 V</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="设备温度：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minHeat">
            <el-input v-model.number="formData.minHeat" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限℃</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxHeat">
            <el-input v-model.number="formData.maxHeat" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限℃</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="标准输入电压：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minOutputPE">
            <el-input v-model.number="formData.minInputPE" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限 V</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxOutputPE">
            <el-input v-model.number="formData.maxInputPE" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限 V</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="标准输出电压：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minOutputPE">
            <el-input v-model.number="formData.minOutputPE" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限 V</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxOutputPE">
            <el-input v-model.number="formData.maxOutputPE" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限 V</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="设备负载：" class="form-cell" style="margin: 0;padding: 0">
        <div class="cell-box" style="display: flex">
          <el-form-item prop="minLoad">
            <el-input v-model.number="formData.minLoad" size="mini" placeholder="阈值下限" class="cell-input">
              <template slot="append">下限 %</template>
            </el-input>
          </el-form-item>
          <div style="width: 20px;text-align: center">~</div>
          <el-form-item prop="maxLoad">
            <el-input v-model.number="formData.maxLoad" size="mini" placeholder="阈值上限" class="cell-input">
              <template slot="append">上限 %</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" icon="el-icon-circle-close" @click="cancelView">关闭</el-button>
      <el-button type="primary" size="mini" icon="el-icon-upload2" @click="submitForm()">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      visible: false,
      title: '监听设置',
      formData: {
        minInputTPE: 380,
        maxInputTPE: 420,
        minOutputTPE: 380,
        maxOutputTPE: 420,
        minInputPE: 210,
        maxInputPE: 230,
        minOutputPE: 210,
        maxOutputPE: 230,
        minHeat: 0,
        maxHeat: 100,
        minLoad: 0,
        maxLoad: 100
      },
      rules: {

      }
    }
  },
  computed: {
    ...mapGetters({
      upsConfig: 'config/getUpsConfig'
    })
  },
  mounted() {
  },
  methods: {
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
          this.$store.dispatch('config/saveUpsConfig', this.formData).then(() => {
            this.$successMsg('ups监听设置已更新')
            this.cancelView()
            this.$router.go(0)
          })
        } else {
          this.$message({
            message: '表单信息有误，请核对无误后提交！',
            type: 'error'
          })
        }
      })
    },
    loadData() {
      this.formData = {
        minInputTPE: this.upsConfig.minInputTPE || '',
        maxInputTPE: this.upsConfig.maxInputTPE || '',
        minOutputTPE: this.upsConfig.minOutputTPE || '',
        maxOutputTPE: this.upsConfig.maxOutputTPE || '',
        minInputPE: this.upsConfig.minInputPE || '',
        maxInputPE: this.upsConfig.maxInputPE || '',
        minOutputPE: this.upsConfig.minOutputPE || '',
        maxOutputPE: this.upsConfig.maxOutputPE || '',
        minHeat: this.upsConfig.minHeat || '',
        maxHeat: this.upsConfig.maxHeat || '',
        minLoad: this.upsConfig.minLoad || '',
        maxLoad: this.upsConfig.maxLoad || ''
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
    width: 160px;
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
