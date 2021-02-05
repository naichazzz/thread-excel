<template>
  <div class="root-box">
    <div class="form-box">
      <el-form
        data-cy="dis-form"
        ref="form"
        :model="form"
        label-width="140px"
        size="mini"
      >
        <el-form-item data-cy="dis-send-mode-radio" label="下发方式">
          <el-radio-group v-model="form.sendMode">
            <el-radio
              v-for="dict in sendModeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="间隔时间" v-if="form.sendMode === 'schedule'">
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
        </el-form-item>
        <el-form-item data-cy="dis-send-type-radio" label="下发类型">
          <el-radio-group v-model="form.sendType">
            <el-radio
              v-for="dict in sendTypeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item data-cy="dis-send-level-radio" label="下发等级">
          <el-radio-group class="sendLevel" v-model="form.sendLevel">
            <el-radio
              v-for="dict in sendLevelList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item data-cy="dis-message-type-radio" label="调度信息类型">
          <el-radio-group class="messageType" v-model="form.messageType">
            <el-radio
              v-for="dict in messageTypeList"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item data-cy="dis-message-demo-select" label="常用调度信息">
          <el-select
            v-model="messageDemo"
            size="mini"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in messageDemoList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入调度信息">
          <el-input
            data-cy="dis-message-content-input"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.messageContent"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            data-cy="dis-select-car-button"
            type="primary"
            size="small"
            @click="handleClickSelect"
            v-if="flag_per.indexOf('选择车辆') > -1"
          >
            选择车辆
          </el-button>
          <el-button
            data-cy="dis-send-button"
            type="danger"
            size="small"
            @click="handleClickSend"
            v-if="flag_per.indexOf('发送') > -1"
          >
            发送
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <common-table :totalData="vehicleArr"></common-table>
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      @select-item-list="updateData"
    ></Dialog>
  </div>
</template>

<script>
import { sendDispatch } from "@/api/system/carDispatch";
import { parseTime } from "@/utils/ruoyi";
import Dialog from "@/components/map/dialog.vue";
import CommonTable from "@/components/commonTable.vue";
export default {
  data() {
    return {
      /**
       * 选择车辆数组
       */
      vehicleArr: [],
      startTime: "00:00:00",
      endTime: "23:59:59",
      form: {
        /** 下发方式 */
        sendMode: "",
        /** 定时任务间隔时间 */
        frequency: "",
        /** 定时任务结束时间 */
        finishTime: "",
        /** 下发类型：中心导航信息：0;CAN故障码信息：1; */
        sendType: "",
        /** 下发等级：服务：01;紧急:10;通知：11; */
        sendLevel: "",
        /** 调度信息类型：服务：2;通知：1; */
        messageType: "",
        /** 信息内容 */
        messageContent: "",
      },
      /**
       * 表单规则
       */
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
      QualityDialogFlag: false,
      /** 在线状态列表 */
      onlineStatusList: [],
      flag_per: [],
    };
  },
  watch: {
    messageDemo: function (val) {
      this.form.messageContent = val;
    },
  },
  created() {
    this.getDicts("sys_dis_send_mode").then((response) => {
      this.sendModeList = response.data;
      this.form.sendMode = this.getDefault(this.sendModeList);
    });
    this.getDicts("sys_dis_send_type").then((response) => {
      this.sendTypeList = response.data;
      this.form.sendType = this.getDefault(this.sendTypeList);
    });
    this.getDicts("sys_dis_send_level").then((response) => {
      this.sendLevelList = response.data;
      this.form.sendLevel = this.getDefault(this.sendLevelList);
    });
    this.getDicts("sys_dis_message_type").then((response) => {
      this.messageTypeList = response.data;
      this.form.messageType = this.getDefault(this.messageTypeList);
    });
    this.getDicts("sys_dis_message_demo").then((response) => {
      this.messageDemoList = response.data;
      // this.messageDemo = this.getDefault(this.messageDemoList);
    });
    this.getDicts("sys_online_status").then((response) => {
      this.onlineStatusList = response.data;
      this.form.onlineStatus = this.getDefault(this.onlineStatusList);
    });

    this.checkPro(["车辆监控管理", "车辆调度", "选择车辆"]);
    this.checkPro(["车辆监控管理", "车辆调度", "发送"]);
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
     * 选择车辆按钮
     */
    handleClickSelect(tab, event) {
      this.QualityDialogFlag = true;
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
      if (this.form.sendMode == "schedule") {
        if (!Number.isInteger(this.form.frequency)) {
          this.$message({
            message: "间隔时间请输入数值",
            type: "error",
          });
          return false;
        }
        if (this.form.frequency < 0 || this.form.frequency > 10000) {
          this.$message({
            message: "间隔时间在0-10000之间",
            type: "error",
          });
          return false;
        }
        if (this.form.finishTime == "") {
          this.$message({
            message: "请选择终止时间",
            type: "error",
          });
          return false;
        }
      }
      return true;
    },
    /**
     * 发送按钮
     */
    handleClickSend(tab, event) {
      if (!this.formVerification()) {
        return;
      }
      // 收集要向后台发送的调度信息
      let data = {
        sendMode: this.form.sendMode,
        frequency: this.form.frequency,
        finishTime: parseTime(this.form.finishTime, "{h}:{i}:{s}"),
        sendType: this.form.sendType,
        emergencyType: this.form.sendLevel,
        messageType: this.form.messageType,
        messageContent: this.form.messageContent,
        deviceIdList: [],
      };
      this.vehicleArr.forEach(function (item) {
        data.deviceIdList.push(item.deviceId);
      });
      sendDispatch(data).then((res) => {
        this.verifyRespond(res);
      });
    },

    /**
     * 更新所有车辆所有数据
     */
    updateData(data) {
      console.log(data);
      this.vehicleArr = data;
    },

    /**
     * 获取默认项，暂时先取第一项
     */
    getDefault(list) {
      if (list.length > 0) {
        return list[0].dictValue;
      }
      return "";
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
};
/**
 * 获取当前时间
 */
function getCurrentTime() {
  let time = parseTime(new Date(), "{h}:{i}:{s}");
  console.log(time);
  return time;
}
</script>

<style scoped>
.root-box {
  text-align: left;
  margin-top: 20px;
}
.form-box {
  width: 90%;
}
</style>
