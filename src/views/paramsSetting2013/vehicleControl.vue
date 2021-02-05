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
    <div style="margin-bottom: 20px">
      <span>设置类型</span>
      <el-select
        v-model="settingType"
        size="mini"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="form-box" v-if="settingType == '1'">
      <el-form ref="form" :model="form" label-width="140px" size="mini">
        <el-form-item label="下方方式">
          <el-radio-group v-model="form.sendMode">
            <el-radio
              disabled
              v-for="dict in sendModeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="间隔时间" v-if="form.sendMode === 'schedule'">
          <el-input
            v-model.number="form.frequency"
            placeholder="请输入间隔时间"
            size="mini"
            clearable
          >
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="终止时间" v-if="form.sendMode === 'schedule'">
          <el-time-picker
            v-model="form.finishTime"
            :picker-options="{
              selectableRange: startTime + ' - ' + endTime,
            }"
            placeholder="请输入结束时间"
            size="mini"
            style="width: 100%"
          >
          </el-time-picker>
        </el-form-item> -->
        <el-form-item label="下发类型" data-cy="send-type-form-item">
          <el-radio-group v-model="form.sendText.sign_list[0].infor">
            <el-radio
              v-for="dict in sendTypeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下发等级">
          <el-radio-group
            class="type"
            v-model="form.sendText.sign_list[0].type"
          >
            <el-radio
              v-for="dict in sendLevelList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调度信息类型">
          <el-radio-group class="messageType" v-model="form.sendText.text_type">
            <el-radio
              v-for="dict in messageTypeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="常用调度信息">
          <el-select
            v-model="form.sendText.text_type"
            size="mini"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in messageDemoList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入调度信息">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.sendText.text_infor"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="settingType == '3'">
      <div
        v-for="(item, index) in vehicleControl.vehicleControlItems"
        :key="index"
      >
        <p>
          车辆控制{{ index + 1 }}
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            size="mini"
            @click="addContacts"
            v-if="index == 0"
          ></el-button>
        </p>
        <div class="contactsContainer">
          <div>
            <span>控制类型ID</span>
            <el-input size="mini" clearable v-model="item.id"></el-input>
          </div>
          <div>
            <span>控制参数</span>
            <el-input size="mini" clearable v-model="item.value"></el-input>
          </div>
          <div>
            <el-button
              type="danger"
              icon="el-icon-minus"
              circle
              size="mini"
              @click="minusContacts(index)"
              v-if="index != 0"
            ></el-button>
          </div>
        </div>
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

    <p v-if="optId != ''"><span>optId:</span> {{ optId }}</p>
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
  sendText,
  inquireDriverInfo,
  vehicleControl,
} from "@/api/paramsSetting/settings2013";
// import { setCallForwarding } from "@/api/system/terminalSetting/callForwarding";
// import { TERMINAL_PARAMETER_ID_CALL_FORWARDING } from "@/utils/config.js";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "文本信息下发",
        },
        {
          value: "2",
          label: "上报驾驶员身份信息",
        },
        {
          value: "3",
          label: "车辆控制",
        },
      ],
      settingType: "1",
      optId: "",
      vehicleControl: {
        clientId: "",
        deviceId: "",
        vehicleControlItems: [
          {
            id: "",
            value: "",
          },
        ],
      },

      startTime: "00:00:00",
      endTime: "23:59:59",
      form: {
        /** 下发方式 */
        sendMode: "single",
        /** 定时任务间隔时间 */
        frequency: "",
        /** 定时任务结束时间 */
        finishTime: "",
        /** 下发类型：中心导航信息：0;CAN故障码信息：1; */
        infor: "",
        /** 下发等级：服务：01;紧急:10;通知：11; */
        type: "",
        /** 调度信息类型：服务：2;通知：1; */
        /** 信息内容 */
        clientId: "",
        deviceId: "",
        sendText: {
          text_type: "1",
          text_infor: "",
          sign_list: [{ type: "01", display: "1", read: "1", infor: "0" }],
        },
      },
      params: {
        clientId: "",
        deviceId: "",
      },
      rules: {
        frequency: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      sendModeList: [],
      sendTypeList: [],
      sendLevelList: [],
      messageTypeList: [],
      /** 常用调度信息 */
      messageDemo: "",
      messageDemoList: [],
      // content: {},
      vehicleArr: [],

      QualityDialogFlag: false,
      ipList: [],
      flag_per: [],
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
      this.form.clientId = this.params = this.vehicleControl.clientId = newVal;

      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    addContacts() {
      let formItems = {
        id: "",
        value: "",
      };
      this.vehicleControl.vehicleControlItems.push(formItems);
    },
    minusContacts(ind) {
      // let vehicleControlItems=this.vehicleControl.vehicleControlItems
      // _.remove(vehicleControlItems,(item,index)=>{
      //   // console.log(item,index)
      //   return index==ind
      // })
      // this.vehicleControl.vehicleControlItems=vehicleControlItems

      this.vehicleControl.vehicleControlItems.splice(ind, 1);
    },
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

    updateData(data) {
      this.vehicleArr = data;
      this.form.deviceId = this.params.deviceId = this.vehicleControl.deviceId =
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
    handleSettingClick() {
      if (this.settingType == "1") {
        sendText(this.form).then((res) => {
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
        });
      } else if (this.settingType == "2") {
        inquireDriverInfo(this.params).then((res) => {
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
        });
      } else if (this.settingType == "3") {
        vehicleControl(this.vehicleControl).then((res) => {
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
        });
      }

      console.log(this.form);
    },
    handleSelectVehicleClick() {
      this.QualityDialogFlag = true;
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
  mounted() {
    this.form.clientId = this.params.clientId = this.vehicleControl.clientId = this.clientId;
    if (this.$store.state.carInfo.carInfo != "") {
      this.form.deviceId = this.params.deviceId = this.vehicleControl.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
    }
    // console.log(this.form.sendText.sign_list)
    this.getDicts("sys_dis_send_mode").then((response) => {
      this.sendModeList = response.data;
      // this.form.sendMode = "single";
    });
    this.getDicts("sys_dis_send_type").then((response) => {
      this.sendTypeList = response.data;
      this.form.infor = "0";
    });
    this.getDicts("sys_dis_send_level").then((response) => {
      this.sendLevelList = response.data;
      this.form.text_type = "01";
    });
    this.getDicts("sys_dis_message_type").then((response) => {
      this.messageTypeList = response.data;
      this.form.text_type = "1";
    });
    this.getDicts("sys_dis_message_demo").then((response) => {
      this.messageDemoList = response.data;
      // this.messageDemo = this.getDefault(this.messageDemoList);
    });
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
.contactsContainer {
  display: flex;
}
.contactsContainer div span {
  /* float: left; */
  line-height: 40px;
  margin-right: 5px;
}
.contactsContainer div .el-input {
  width: 60%;
}
</style>
