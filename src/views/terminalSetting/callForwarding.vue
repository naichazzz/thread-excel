<template>
  <div>
    <div class="pageMain">
      <el-form
        :inline="true"
        :model="form"
        style="text-align: left;margin-top: 20px;"
        label-width="7em"
        size="small"
      >
        <el-form-item label="IP/URL地址">
          <el-select
            data-cy="cal-ip-select"
            ref="ip"
            v-model="fullIP"
            @change="ipChange"
            placeholder="请选择"
            filterable
            allow-create
            clearable
          >
            <el-option
              v-for="item in ipList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="TCP端口">
          <el-input v-model.number="form.port" placeholder="" clearable>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <common-table :totalData="vehicleArr"></common-table>
      <div class="button-box">
        <el-button
          data-cy="cal_select_car_button"
          class="right-button"
          type="primary"
          @click="handleSelectVehicleClick"
          v-if="flag_per.indexOf('选择车辆') > -1"
          icon="el-icon-search"
          >选择车辆</el-button
        >
        <el-button
          data-cy="cal_setting_button"
          class="right-button"
          @click="handleSettingClick"
          type="primary"
          plain
          v-if="flag_per.indexOf('设置') > -1"
          >设置</el-button
        >
      </div>
    </div>
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      @select-item-list="updateData"
    ></Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/map/dialog.vue";
import CommonTable from "@/components/commonTable.vue";
import { setCallForwarding } from "@/api/system/terminalSetting/callForwarding";
import { TERMINAL_PARAMETER_ID_CALL_FORWARDING } from "@/utils/config.js";
export default {
  data() {
    return {
      /**
       * 选择车辆数组
       */
      vehicleArr: [],
      /**
       * 全ip/url
       */
      fullIP: "",
      /**
       * 表单
       */
      form: {
        ip: "",
        port: ""
      },
      QualityDialogFlag: false,
      ipList: [],
      flag_per: []
    };
  },
  components: {
    Dialog,
    CommonTable
  },
  methods: {
    /**
     * IP/Url下拉选择变化时.
     */
    ipChange(newValue) {
      let ipPortArr = this.fullIP.split(":");
      if (ipPortArr.length < 2) {
        this.form.ip = newValue;
        this.form.port = "";
      } else {
        this.form.port = ipPortArr[ipPortArr.length - 1];
        this.form.ip = newValue.slice(
          0,
          newValue.length - this.form.port.length - 1
        );
      }
    },
    /**
     * 输出应答
     */
    verifyRespond(res) {
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: "成功",
          type: "success"
        });
      } else {
        this.$message({
          message: res.message,
          type: "failed"
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
          type: "error"
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
        id: TERMINAL_PARAMETER_ID_CALL_FORWARDING,
        value: "",
        deviceIdList: []
      };
      this.vehicleArr.forEach(element => {
        par.deviceIdList.push(element.deviceId);
      });

      par.value = `${this.form.ip != "" ? this.form.ip : ""}${
        this.form.port != "" ? ":" + this.form.port : ""
      }`;

      setCallForwarding(par).then(res => {
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
      this.checkPromis(data).then(res => {
        if (res) {
          this.flag_per.push(data[2]);
        }
      });
    }
  },
  /**
   * 生命周期方法：创建
   */
  created() {
    this.getDicts("sys_call_forwarding_ip").then(response => {
      this.ipList = response.data;
    });

    this.checkPro(["终端设置", "车辆呼转", "选择车辆"]);
    this.checkPro(["终端设置", "车辆呼转", "设置"]);
  }
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
