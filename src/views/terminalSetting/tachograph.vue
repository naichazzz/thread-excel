<template>
  <div style="text-align: left;">
    <div class="pageMain">
      <el-row style="padding:20px 0;">
        <el-col :span="6"> <el-radio v-model="query.id" label="0x00">执行标准版本</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x01">当前驾驶人信息</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x02">实时时间</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x03">累计行驶里程</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x04">脉冲系数</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x05">车辆信息</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x06">状态信号配置信息</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x07">唯一性编号</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x08">指定的行驶速度记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x09">指定的位置信息记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x10">指定的事故疑点记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x11">指定的超时驾驶记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x12">指定的驾驶人身份记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x13">指定的外部供电记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x14">指定的参数修改记录</el-radio></el-col>
        <el-col :span="6"> <el-radio v-model="query.id" label="0x15">指定的速度状态日志</el-radio></el-col>
      </el-row>
      <el-form
        ref="form"
        :model="formR"
        size="small"
        label-width="100px"
        v-if="
          query.id !== '0x00' &&
            query.id !== '0x01' &&
            query.id !== '0x02' &&
            query.id !== '0x03' &&
            query.id !== '0x04' &&
            query.id !== '0x05' &&
            query.id !== '0x06' &&
            query.id !== '0x07'
        "
      >
        <el-form-item label="选择起止时间">
          <el-date-picker
            v-model="formR.value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>车辆信息列表</span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="{color: '#606266' }">
        <!-- <el-table-column type="index" label="序号" width="70"> </el-table-column> -->
        <el-table-column prop="numberPlate" label="车牌号"> </el-table-column>
        <el-table-column prop="simNumber" label="SIM卡号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="chassisNumber" label="VIN" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="groupName" label="企业名称"> </el-table-column>
        <el-table-column prop="terminalType" label="终端类型"> </el-table-column>
        <el-table-column
          prop="terminalNumber"
          label="终端号码"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="onlineStatus"
          label="在线状态"
          :formatter="statusFormat"
        >
        </el-table-column>
        <el-table-column prop="type" label="车辆类型"> </el-table-column>
        <el-table-column prop="communicationType" label="通讯类型">
        </el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" @click="handleClick" class="right-button" icon="el-icon-search"
          >选择车辆</el-button
        >
        <el-button
          type="primary"
          plain
          
          @click="submit"
          class="right-button"
          >采集</el-button
        >
      </div>
      <!-- 弹出框 -->
      <Dialog
        :QualityDialogFlag.sync="QualityDialogFlag"
        :isPlayback="playback"
        @select-item-list="getList"
        :isTachograph="1"
      ></Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from "@/components/map/dialog.vue";
import { collection } from "@/api/system/terminalSetting/tachograph";

export default {
  data() {
    return {
      formR: {
        value: ""
      },
      index: 0,
      playback: "playback",
      tableData: [],
      QualityDialogFlag: false,
      options_online: [],
      options: [],
      query: {
        id: "",
        deviceId: "",
        time1: "",
        time2: ""
      },
      tachographParams: {}
    };
  },
  components: {
    Dialog
  },
  methods: {
    // 在线状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.options_online, row.onlineStatus);
    },
    handleClick(tab, event) {
      this.QualityDialogFlag = true;
    },
    getList(data) {
      console.log(data)
      this.tableData = data;
      this.query.deviceId = data[0].deviceId;
      this.getDicts("sys_online_status").then(response => {
        this.options_online = response.data;
      });
    },
    submit() {
      if(!this.query.deviceId){
        this.$message({
            type: "info",
            message: "请先选择车辆"
          });

        return
      }
      collection(this.query)
        .then(res => {
          this.tachographParams.deviceId = res.data.deviceId;
          this.tachographParams.optId = res.data.optId;
          this.tachographParams.vehicleNumber = this.tableData[0].numberPlate;
          this.tachographParams.commandId = this.query.id;
          
          // this.tachographParams.deviceId = '13';
          // this.tachographParams.optId = 'ce18b30f-a927-4b36-9497-8c5b39ee69a711609381010349';
          // this.tachographParams.vehicleNumber = '00000000064746215406';
          // this.tachographParams.commandId = '0x05';
          console.log(this.tachographParams)
          this.$emit("tachographParams", this.tachographParams);
          this.$message({
            type: "success",
            message: "操作成功！"
          });
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err
          });
        });
    },
    changeTime() {
      this.query.time1 = this.formR.value[0];
      this.query.time2 = this.formR.value[1];
    }
  }
};
</script>

<style scoped>
.button-box {
 width: 100%;overflow: hidden;padding-bottom: 10px;margin-top: 10px;
}
.box-card .el-card__header {
  background-color: cornflowerblue !important;
}
.box-card {
  margin-bottom: 15px;
}
.el-radio {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
