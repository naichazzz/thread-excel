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
    <div class="button-box">
      <el-button
        class="bottom-button"
        @click="handleSettingClick"
        type="primary"
        >设置</el-button
      >
    </div>

    <el-divider content-position="left">日志查询列表</el-divider>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="SIM卡号">
        <el-input v-model="formInline.simcode" clearable></el-input>
      </el-form-item>
      <el-form-item label="指令ID">
        <el-input v-model="formInline.optid" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息ID">
        <el-input v-model="formInline.msgid" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="datePickerChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLoad">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="logQueryData"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      border
      v-loading="loading"
      max-height="450"
    >
      <el-table-column prop="msgid" label="消息ID"> </el-table-column>
      <el-table-column prop="optid" label="指令ID"> </el-table-column>
      <el-table-column prop="simcode" label="SIM卡号"> </el-table-column>
      <el-table-column prop="time" label="时间"> </el-table-column>
      <el-table-column
        prop="oridata"
        label="原始报文"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ayadata"
        label=" 消息体"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="decdata"
        label=" 解析后报文"
         width="380"
      >
        <template slot-scope="scope" v-if="scope.row.decdata!=''">
          <json-viewer
            :value="JSON.parse(scope.row.decdata)"
            :expand-depth="1"
            copyable
            sort
          ></json-viewer>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="pageCurrentChange"
      :current-page="formInline.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="formInline.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination-box"
    >
    </el-pagination>
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
import { getTerminalMessageList } from "@/api/paramsSetting/settings2013";
import { TERMINAL_PARAMETER_ID_CALL_FORWARDING } from "@/utils/config.js";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      vehicleArr: [],
      form: {
        ip: "",
        port: "",
      },
      loading: false,
      formInline: {
        groupId: this.$store.state.user.groupId,
        pageNum: 1,
        pageSize: 10,
        simcode: "",
        msgid: "",
        optid: "",
        startTime: "",
        endTime: "",
      },
      logQueryData: [],
      total: 0,
      time: "",
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
  methods: {
    datePickerChange() {
      this.formInline.startTime = this.time[0];
      this.formInline.endTime = this.time[1];
    },
    onLoad() {
      this.loading = true;
      // console.log(this.formInline);
      getTerminalMessageList(this.formInline).then((res) => {
        // console.log(res.data.list);
        this.total=res.data.total
        this.loading = false;
        this.logQueryData = res.data.list;
      });
    },
    pageSizeChange(val) {
      this.formInline.pageNum = 1;
      this.formInline.pageSize = val;
      this.onLoad();
    },
    pageCurrentChange(val) {
      this.formInline.pageNum = val;
      this.onLoad();
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
    this.onLoad();
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
