<template>
  <div class="root-box controlContainer">
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
        clearable
        size="mini"
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
    <el-form
      :model="firstForm"
      ref="firstForm"
      label-width="180px"
      v-if="settingType == '1'"
    >
      <el-form-item label="连接控制">
        <el-input
          clearable
          size="mini"
          v-model="firstForm.connect_control"
        ></el-input>
      </el-form-item>
      <el-form-item label="监管平台鉴权码">
        <el-input
          clearable
          size="mini"
          v-model="firstForm.auth_code"
        ></el-input>
      </el-form-item>
      <el-form-item label="拨号点名称">
        <el-input
          clearable
          size="mini"
          v-model="firstForm.bohao_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="拨号用户名">
        <el-input
          clearable
          size="mini"
          v-model="firstForm.bohao_user"
        ></el-input>
      </el-form-item>
      <el-form-item label="拨号密码">
        <el-input
          clearable
          size="mini"
          v-model="firstForm.bohao_pwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input clearable size="mini" v-model="firstForm.address"></el-input>
      </el-form-item>
      <el-form-item label="TCP端口">
        <el-input clearable size="mini" v-model="firstForm.tcp_port"></el-input>
      </el-form-item>
      <el-form-item label="UDP端口">
        <el-input clearable size="mini" v-model="firstForm.ucp_port"></el-input>
      </el-form-item>
      <el-form-item label="连接到指定服务器时限">
        <el-col :span="11">
          <el-input
            clearable
            size="mini"
            v-model="firstForm.interval"
            style="width: 80%"
          ></el-input>
        </el-col>
        <el-col :span="11">
          <el-button @click="sendTerminalControl('2')">发送</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="终端复位">
        <el-button @click="sendTerminalControl('4')">发送</el-button>
      </el-form-item>
      <el-form-item label="终端恢复出厂设置">
        <el-button @click="sendTerminalControl('5')">发送</el-button>
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      :model="secondForm"
      class="demo-form-inline"
      v-if="settingType == '2'"
      label-width="10em"
    >
      <el-form-item label="升级类型">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.uptype"
        ></el-input>
      </el-form-item>
      <el-form-item label="制造商ID">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.zzs_id"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="终端固件版本号长度">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.user"
        ></el-input>
      </el-form-item>
      <el-form-item label="升级数据包长度">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.user"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="终端固件版本号">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.ter_ver"
        ></el-input>
      </el-form-item>
      <el-form-item label="升级数据包">
        <el-input
          clearable
          size="mini"
          v-model="secondForm.sendTerPack.up_pack"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-form
      :model="thirdForm"
      class="demo-form-inline"
      v-if="settingType == '3'"
      label-width="10em"
    >
      <el-form-item label="标志">
        <el-select
          v-model="thirdForm.callBack.mark"
          clearable
          size="mini"
          placeholder="请选择"
        >
          <el-option :key="0" :label="0" :value="0"> </el-option>
          <el-option :key="1" :label="1" :value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input
          clearable
          size="mini"
          v-model="thirdForm.callBack.tel_num"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form
      :model="fourthForm"
      class="demo-form-inline"
      v-if="settingType == '4'"
      label-width="10em"
    >
      <el-form-item label="设置类型">
        <el-input
          clearable
          size="mini"
          v-model="fourthForm.setTelBook.type"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="电话号码">
        <el-input clearable size="mini" v-model="fourthForm.user"></el-input>
      </el-form-item> -->
    </el-form>
    <div v-if="settingType == '4'">
      <div v-for="(item, index) in fourthForm.setTelBook.lxr_list" :key="index">
        <p>
          联系人{{ index + 1 }}
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
            <span>标志</span>
            <el-input clearable size="mini" v-model="item.lxrbz"></el-input>
          </div>
          <div>
            <span> 电话号码</span>
            <el-input clearable size="mini" v-model="item.tel_num"></el-input>
          </div>
          <div>
            <span>联系人 </span>
            <el-input clearable size="mini" v-model="item.lxr_name"></el-input>
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
        v-if="settingType != '1'"
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
  terminalControl,
  sendTerminalUpgradePackage,
  callBack,
  setPhoneBook,
} from "@/api/paramsSetting/settings2013";
// import { TERMINAL_PARAMETER_ID_CALL_FORWARDING } from "@/utils/config.js";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "终端控制",
        },
        {
          value: "2",
          label: "下发终端升级包",
        },
        {
          value: "3",
          label: "电话回拨",
        },
        {
          value: "4",
          label: "设置电话本",
        },
      ],
      settingType: "1",
      vehicleArr: [],
      firstForm: {
        clientId: "",
        deviceId: "",
        cmd_id: "",
        connect_control: "",
        auth_code: "",
        bohao_name: "",
        bohao_user: "",
        bohao_pwd: "",
        address: "",
        tcp_port: "",
        ucp_port: "",
        interval: "",
      },
      secondForm: {
        clientId: "",
        deviceId: "",
        sendTerPack: {
          uptype: "",
          zzs_id: "",
          ter_ver: "",
          up_pack: "",
        },
      },
      thirdForm: {
        clientId: "",
        deviceId: "",
        callBack: {
          mark: "",
          tel_num: "",
          callBackAttrs: [{ call: "", monitor: "" }],
        },
      },
      fourthForm: {
        clientId: "",
        deviceId: "",
        setTelBook: {
          type: "",
          lxr_list: [{ lxrbz: "", tel_num: "", lxr_name: "" }],
        },
      },

      contactForm: [
        {
          user: "",
          phoneNumber: "",
          contacts: "",
        },
      ],
      QualityDialogFlag: false,
      playback: "playback",
      optId: "",
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
      this.firstForm.clientId = this.secondForm.clientId = this.thirdForm.clientId = this.fourthForm.clientId = newVal;
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    sendTerminalControl(cmd_id) {
      this.firstForm.cmd_id = cmd_id;
      terminalControl(this.firstForm).then((res) => {
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
    },
    addContacts() {
      let formItems = {
        lxrbz: "",
        tel_num: "",
        lxr_name: "",
      };

      this.fourthForm.setTelBook.lxr_list.push(formItems);
    },
    minusContacts(ind) {
      this.fourthForm.setTelBook.lxr_list.splice(ind, 1);
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
      // this.firstForm.deviceId = "";
      this.firstForm.deviceId = this.secondForm.deviceId = this.thirdForm.deviceId = this.fourthForm.deviceId =
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
      if (this.settingType == "2") {
        sendTerminalUpgradePackage(this.secondForm).then((res) => {
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
        if (this.thirdForm.callBack.mark == "0") {
          this.thirdForm.callBack.callBackAttrs[0].call = 1;
          this.thirdForm.callBack.callBackAttrs[0].monitor = 0;
        } else if (this.thirdForm.callBack.mark == "1") {
          this.thirdForm.callBack.callBackAttrs[0].call = 0;
          this.thirdForm.callBack.callBackAttrs[0].monitor = 1;
        }
        callBack(this.thirdForm).then((res) => {
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
      } else if (this.settingType == "4") {
        setPhoneBook(this.fourthForm).then((res) => {
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
    },
    handleSelectVehicleClick() {
      this.QualityDialogFlag = true;
    },
    updateSocket(newVal) {
      this.content = newVal;
    },
  },
  mounted() {
    this.firstForm.clientId = this.secondForm.clientId = this.thirdForm.clientId = this.fourthForm.clientId = this.clientId;
    if (this.$store.state.carInfo.carInfo != "") {
      this.firstForm.deviceId = this.secondForm.deviceId = this.thirdForm.deviceId = this.fourthForm.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
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
.controlContainer .el-input__inner {
  max-width: 300px;
}
</style>
