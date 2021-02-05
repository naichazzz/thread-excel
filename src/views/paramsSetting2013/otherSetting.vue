<template>
  <div class="root-box">
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
    <div style="margin-top: 30px">
      <el-row :gutter="20">
        <el-col :span="6">位置信息查询</el-col>
        <el-col :span="6">
          <el-button
            size="mini"
            type="primary"
            @click="sendLocationInformationQuery"
            >发送</el-button
          >
        </el-col>
        <el-col :span="6">链路检测</el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="sendRequestToTerminal"
            >发送</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4">临时位置跟踪</el-col>
        <el-col :span="8">
          <el-col :span="8"> <span>时间间隔</span> </el-col>
          <el-col :span="16">
            <el-input
              size="mini"
              v-model="params2.tempLocationTraceControl.time_interval"
            ></el-input
          ></el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="8"> <span>跟踪有效期</span> </el-col>
          <el-col :span="16">
            <el-input
              size="mini"
              v-model="params2.tempLocationTraceControl.position_track_validity"
            ></el-input
          ></el-col>
        </el-col>
        <el-col :span="4">
          <el-button
            size="mini"
            type="primary"
            @click="sendPositionTrackingControl"
            >发送</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4">人工确认报警</el-col>
        <el-col :span="8">
          <el-col :span="8"> <span>报警流水号</span> </el-col>
          <el-col :span="16">
            <el-input
              size="mini"
              v-model="params4.confirmAlarm.alarm_msg_no"
            ></el-input
          ></el-col>
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_jinji"
            >紧急报警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_weixian"
            >危险预警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_jinchuarea"
            >区域报警</el-checkbox
          >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4"><div>.</div></el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_jinchuline"
            >路线报警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_travel_time"
            >行驶时间报警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_feifadianhuo"
            >非法点火报警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-checkbox v-model="alarm_type_list[0].confirm_feifaweiyi"
            >非法位移报警</el-checkbox
          >
        </el-col>
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="sendConfirmationAlarm"
            >发送</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">数据下行透传</el-col>
        <el-col :span="8">
          <el-col :span="8"> <span>消息类型</span> </el-col>
          <el-col :span="16">
            <el-input
              size="mini"
              v-model="params3.dataDownTrans.msg_type"
            ></el-input
          ></el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="8"> <span>消息内容</span> </el-col>
          <el-col :span="16">
            <el-input
              size="mini"
              v-model="params3.dataDownTrans.msg_content"
            ></el-input
          ></el-col>
        </el-col>
        <el-col :span="4">
          <el-button
            size="mini"
            type="primary"
            @click="sendDownlinkTransmission"
            >发送</el-button
          >
        </el-col>
      </el-row>
    </div>
    <!-- <div class="button-box">
      <el-button
        class="bottom-button"
        @click="handleSettingClick"
        type="primary"
        >设置</el-button
      >
    </div> -->

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
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      @select-item-list="updateData"
    ></Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/map/dialog.vue";
import CommonTable from "@/components/commonTable.vue";
import {
  locationInformationQuery,
  temporaryPositionTrackingControl,
  linkDetectionRequestToTerminal,
  dataDownlinkTransmission,
  manualConfirmationAlarm,
} from "@/api/paramsSetting/settings2013";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      vehicleArr: [],
      form: {
        ip: "",
        port: "",
      },
      QualityDialogFlag: false,
      ipList: [],
      flag_per: [],
      params: {
        deviceId: "",
        clientId: "",
      },
      params2: {
        clientId: "",
        deviceId: "",
        tempLocationTraceControl: {
          time_interval: "",
          position_track_validity: "",
        },
      },
      params3: {
        clientId: "",
        deviceId: "",
        dataDownTrans: {
          msg_type: "",
          msg_content: "",
        },
      },
      params4: {
        clientId: "",
        deviceId: "",
        confirmAlarm: {
          alarm_msg_no: "",
          alarm_type_list: [
            {
              confirm_jinji: "",
              confirm_weixian: "",
              confirm_jinchuarea: "",
              confirm_jinchuline: "",
              confirm_travel_time: "",
              confirm_feifadianhuo: "",
              confirm_feifaweiyi: "",
            },
          ],
        },
      },
      alarm_type_list: [
        {
          confirm_jinji: false,
          confirm_weixian: false,
          confirm_jinchuarea: false,
          confirm_jinchuline: false,
          confirm_travel_time: false,
          confirm_feifadianhuo: false,
          confirm_feifaweiyi: false,
        },
      ],
      checked1: false,
      checked2: true,
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
    content(newVal) {
      return newVal;
    },
    clientId(newVal) {
      this.params.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = newVal;
      // console.log(newVal)
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    sendLocationInformationQuery() {
      locationInformationQuery(this.params).then((res) => {
        let type = "";
        res.code == 200 ? (type = "success") : (type = "error");

        this.$message({
          type: type,
          message: res.message,
        });
      });
    },
    sendPositionTrackingControl() {
      temporaryPositionTrackingControl(this.params2).then((res) => {
        let type = "";
        res.code == 200 ? (type = "success") : (type = "error");

        this.$message({
          type: type,
          message: res.message,
        });
      });
    },
    sendRequestToTerminal() {
      linkDetectionRequestToTerminal(this.params).then((res) => {
        let type = "";
        res.code == 200 ? (type = "success") : (type = "error");

        this.$message({
          type: type,
          message: res.message,
        });
      });
    },
    sendDownlinkTransmission() {
      dataDownlinkTransmission(this.params3).then((res) => {
        let type = "";
        res.code == 200 ? (type = "success") : (type = "error");

        this.$message({
          type: type,
          message: res.message,
        });
      });
    },
    sendConfirmationAlarm() {
      _.map(this.alarm_type_list[0], (item, index) => {
        if (item == false) {
          this.params4.confirmAlarm.alarm_type_list[0][index] = "0";
        } else {
          this.params4.confirmAlarm.alarm_type_list[0][index] = "1";
        }
        return this.params4;
      });
      console.log(this.params4.confirmAlarm.alarm_type_list);

      manualConfirmationAlarm(this.params4).then((res) => {
        let type = "";
        res.code == 200 ? (type = "success") : (type = "error");

        this.$message({
          type: type,
          message: res.message,
        });
      });
    },
    verifyRespond(res) {
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

    updateData(data) {
      this.vehicleArr = data;
      this.params.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId =
        data[0].simNumber;
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
    handleSettingClick() {},
    handleSelectVehicleClick() {
      this.QualityDialogFlag = true;
    },
  },
  mounted() {
    this.params.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = this.clientId;
     if (this.$store.state.carInfo.carInfo != "") {
      this.params.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
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
.el-row {
  margin-bottom: 20px;
}
</style>
