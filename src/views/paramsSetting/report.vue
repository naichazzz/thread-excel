<template>
  <div class="root-box">
    <!-- <el-form :inline="true" :model="form">
      <el-form-item label="车牌号">
        <el-input
          v-model="form.numberPlate"
          placeholder=""
          clearable
          size="mini"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="form.simNumber" placeholder="" clearable size="mini">
        </el-input>
      </el-form-item>
      <el-form-item label="VIN码">
        <el-input v-model="form.vinNumber" placeholder="" clearable size="mini">
        </el-input>
      </el-form-item>
      <el-form-item label="终端号码">
        <el-input
          v-model="form.terminalNumber"
          placeholder=""
          clearable
          size="mini"
        >
        </el-input>
      </el-form-item>
    </el-form> -->
    <div class="button-box">
      <el-button
        class="right-button"
        type="primary"
        @click="handleSelectVehicleClick"
        >选择车辆</el-button
      >
    </div>
    <common-table :totalData="vehicleArr"></common-table>
    <div style="clear: both"></div>
    <div>
      <span>设置类型</span>
      <el-select v-model="value1" placeholder="请选择" clearable size="mini">
        <el-option
          v-for="item in options1"
          :key="item.dictLabel"
          :label="item.dictLabel"
          :value="item.dictValue"
        >
        </el-option>
      </el-select>
      <!-- <el-select v-model="value2" placeholder="请选择">
        <el-option
          v-for="item in options2"
          :key="item.dictLabel"
          :label="item.dictLabel"
          :value="item.dictValue"
        >
        </el-option>
      </el-select> -->
      <div>
        <el-form
          ref="formContainer"
          :inline="true"
          :model="formContainer"
          label-width="180px"
        >
          <el-form-item
            v-for="(item, index) in options2"
            :key="index"
            :label="item.dictLabel"
          >
            <el-input
              v-model="options2[index][index]"
              clearable
              size="mini"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="button-box">
      <el-button
        class="bottom-button"
        @click="handleSettingClick"
        type="primary"
        >设置</el-button
      >
    </div>
    <div>
      <span>下发指令</span>
      <json-viewer
        :value="oldContent"
        :expand-depth="2"
        copyable
        sort
      ></json-viewer>
      <span>应答结果</span>
      <json-viewer
        :value="content"
        :expand-depth="2"
        copyable
        sort
      ></json-viewer>
    </div>
    <!-- <p v-if="optId != ''"><span>optId:</span> {{ optId }}</p> -->
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      @select-item-list="updateData"
      :isPlayback="playback"
    ></Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/map/dialog.vue";
import CommonTable from "@/components/commonTable.vue";
import { setTerminalParam } from "@/api/paramsSetting/settings";
import { TERMINAL_PARAMETER_ID_CALL_FORWARDING } from "@/utils/config.js";
// import io from "socket.io-client";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      vehicleArr: [],
      form: {
        numberPlate: "",
        simNumber: "",
        vinNumber: "",
        terminalNumber: "",
      },
      QualityDialogFlag: false,
      ipList: [],
      flag_per: [],
      value1: "field_sallocation_style",
      value2: "",
      options1: [],
      options2: [],
      formContainer: {},
      params: {
        deviceId: "",
        terminalParamItems: [],
        clientId: "",
      },
      // content: {},
      playback: "playback",
      optId: "",
      // oldContent: {},
    };
  },
  components: {
    Dialog,
    CommonTable,
    JsonViewer,
  },
  props: {
    clientId: {
      default: "",
      type: String,
    },
    content: {
      default: {},
    },
    oldContent: {
      default: {},
    },
  },
  watch: {
    value1(val) {
      this.value2 = "";
      // console.log(this.value1);
      this.getDicts(this.value1).then((response) => {
        this.options2 = response.data;
      });
    },
    content(oldVal, newVal) {
      // if((JSON.stringify(oldVal) == "{}")){
      // this.oldContent = oldVal;
      // }
      // console.log(oldVal, newVal);
      // this.content = newVal;
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
    clientId(newVal) {
      this.params.clientId = newVal;
      // console.log(newVal)
      return newVal;
    },
  },
  methods: {
    updateData(data) {
      this.vehicleArr = data;
      this.params.deviceId = "";
      this.params.deviceId = data[0].simNumber;
    },

    formVerification() {
      if (this.vehicleArr.length <= 0) {
        this.$message({
          message: "请选择车辆",
          type: "error",
        });
        return false;
      }
      return true;
    },
    handleSettingClick() {
      this.params.terminalParamItems = [];
      let terminalParamItem = [];
      _.map(this.options2, (item, index) => {
        if (this.options2[index][index] != undefined) {
          if (this.options2[index][index] != "") {
            let aa = {
              id: item.dictValue,
              value: this.options2[index][index],
            };
            terminalParamItem.push(aa);
          }
        } else {
          // this.$message({
          //   type: "error",
          //   message: "您还未输入内容",
          // });
        }
      });

      this.params.terminalParamItems = terminalParamItem;

      setTerminalParam(this.params).then((res) => {
        let type = "";
        if (res.code == 200) {
          type = "success";
        } else {
          type = "error";
        }
        this.$message({
          type: type,
          message: res.message,
        });
        this.optId = res.data.optId;
      });
      // console.log(this.params);
    },
    handleSelectVehicleClick() {
      this.QualityDialogFlag = true;
    },
    // updateSocket(newVal) {
    //   this.content = newVal;
    // },
  },
  mounted() {
    this.getDicts("sys_system_setting").then((response) => {
      this.options1 = response.data;
    });
    this.getDicts(this.value1).then((response) => {
      this.options2 = response.data;
    });
    this.params.clientId = this.clientId;
    if (this.$store.state.carInfo.carInfo != "") {
      this.params.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
    }
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
  float: right;
  width: 150px;
}
.button-box .bottom-button {
  margin-top: 10px;
  width: 150px;
}
</style>
