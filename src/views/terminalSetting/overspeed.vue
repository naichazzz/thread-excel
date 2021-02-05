<template>
  <div>
    <div class="pageMain">
      <el-form :model="form" style="text-align: left;margin-top: 20px;" label-width="4em" size="small">
        <el-col :span="6">
           <el-form-item label="限速">
            <el-input v-model.number="form.speed" placeholder="" clearable>
              <template slot="append">公里/小时</template>
            </el-input>
          </el-form-item>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <common-table :totalData="vehicleArr"></common-table>
      <div class="button-box">
        <el-button
            class="right-button"
            type="primary"
            @click="handleSelectVehicleClick"
            v-if="flag_per.indexOf('选择车辆') > -1"
            icon="el-icon-search"
          >选择车辆
          </el-button>
        <el-button
          class="right-button"
          @click="handleSettingClick"
          type="primary"
          plain
          v-if="flag_per.indexOf('设置') > -1"
        >
          设置
        </el-button>
      </div>
      <Dialog
        :QualityDialogFlag.sync="QualityDialogFlag"
        @select-item-list="updateData"
      ></Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from "@/components/map/dialog.vue";
import commonTable from "@/components/commonTable.vue";
import { TERMINAL_PARAMETER_ID_MAX_SPEED_SETTING } from "@/utils/config.js";
import { setMaxSpeed } from "@/api/system/terminalSetting/overspeed";
import CommonTable from "../../components/commonTable.vue";
export default {
  data() {
    return {
      /**
       * 选择车辆数组
       */
      vehicleArr: [],
      /**
       * 表单
       */
      form: {
        /**
         * 限速
         */
        speed: "",
      },
      QualityDialogFlag: false,
      flag_per: [],
    };
  },
  components: {
    Dialog,
    CommonTable,
  },
  methods: {
    /**
     * 输出应答
     */
    verifyRespond(res) {
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: "成功",
          type: "success",
        });
      } else {
        this.$message({
          message: res.message,
          type: "failed",
        });
      }
    },

    /**
     * 更新所有车辆所有数据
     */
    updateData(data) {
      console.log(data);
      this.vehicleArr = data;
    },

    /**
     * 表单验证
     */
    formVerification() {
      if (this.vehicleArr.length <= 0) {
        this.$message({
          message: "请选择车辆",
          type: "error",
        });
        return false;
      }
      if (!Number.isInteger(this.form.speed)) {
        this.$message({
          message: "请输入数值",
          type: "error",
        });
        return false;
      }
      if (this.form.speed < 50 || this.form.speed > 120) {
        this.$message({
          message: "车速范围在50-120",
          type: "error",
        });
        return false;
      }
      return true;
    },

    /**
     * 点击设置按钮
     */
    handleSettingClick() {
      if (!this.formVerification()) {
        return;
      }
      let par = {
        id: TERMINAL_PARAMETER_ID_MAX_SPEED_SETTING,
        value: "",
        deviceIdList: [],
      };
      this.vehicleArr.forEach((element) => {
        par.deviceIdList.push(element.deviceId);
      });
      par.value = this.form.speed;

      setMaxSpeed(par).then((res) => {
        this.verifyRespond(res);
      });
    },
    /**
     * 点击选择车辆按钮
     */
    handleSelectVehicleClick() {
      this.QualityDialogFlag = true;
    },

    /**
     * 查看权限
     */
    checkPro(data) {
      this.checkPromis(data).then((res) => {
        if (res) {
          this.flag_per.push(data[2]);
        }
      });
    },
  },
  /**
   * 生命周期方法：创建
   */
  created() {
    this.checkPro(["终端设置", "超速设置", "选择车辆"]);
    this.checkPro(["终端设置", "超速设置", "设置"]);
  },
};
</script>

<style scoped>
.root-box {
  text-align: left;
  padding: 15px;
}
.button-box {
  width: 100%;
  overflow: hidden;
  text-align: center;
}
.button-box .right-button {
  float: left;
}

</style>
