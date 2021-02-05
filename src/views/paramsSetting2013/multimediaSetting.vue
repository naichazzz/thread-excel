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
    <div>
      <span>设置类型</span>
      <el-select
        v-model="settingTypeValue"
        placeholder="请选择"
        size="mini"
        @change="settingTypeChange"
      >
        <el-option
          v-for="item in settingTypeOptions"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div>
      <el-form
        ref="formContainer"
        :inline="true"
        label-width="180px"
        v-if="settingTypeValue == '1'"
      >
        <el-form-item label="通道ID">
          <el-input
            v-model="params.photoCmd.channel"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="拍摄命令">
          <el-select
            clearable
            size="mini"
            v-model="params.photoCmd.photo_order"
            placeholder="请选择"
          >
            <el-option label="停止拍摄" value="0"></el-option>
            <el-option label="录像" value="0xFFFF"></el-option>
            <el-option label="拍照张数" value=" "></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拍照间隔/录像时间">
          <el-input
            v-model="params.photoCmd.photo_interval"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="保存标志">
          <el-select v-model="params.photoCmd.photo_save" placeholder="请选择">
            <el-option label="实时上传" value="0"></el-option>
            <el-option label="保存" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
          <el-select
            clearable
            size="mini"
            v-model="photo_fenbianlu"
            placeholder="请选择"
          >
            <el-option label="最低分辨率" value="S00"></el-option>
            <el-option label="320*240" value="S320_240"></el-option>
            <el-option label="640*480" value="S640_480"></el-option>
            <el-option label="800*600" value="S800_600"></el-option>
            <el-option label="1024*768" value="S1024_768"></el-option>
            <el-option label="176*144" value="S176_144"></el-option>
            <el-option label="352*288" value="S352_288"></el-option>
            <el-option label="704*288" value="S704_288"></el-option>
            <el-option label="704*576" value="S704_576"></el-option>
            <el-option label="最高分辨率" value="SFF"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图像/视频质量">
          <el-input
            v-model="params.photoCmd.photo_zhiliang"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="亮度">
          <el-input
            v-model="params.photoCmd.liangdu"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="对比度">
          <el-input
            v-model="params.photoCmd.duibidu"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="饱和度">
          <el-input
            v-model="params.photoCmd.baohedu"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="色度">
          <el-input
            v-model="params.photoCmd.sedu"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-form
        :inline="true"
        label-width="180px"
        v-if="settingTypeValue == '2'"
      >
        <el-form-item label="多媒体类型">
          <el-select
            clearable
            size="mini"
            v-model="params1.seachMediaData.media_type"
            placeholder="请选择"
          >
            <el-option label="图像" value="0"></el-option>
            <el-option label="音频" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道ID">
          <el-input
            v-model="params1.seachMediaData.channel"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件编码">
          <el-select
            clearable
            size="mini"
            v-model="params1.seachMediaData.event_code"
            placeholder="请选择"
          >
            <el-option label="图像" value="0"></el-option>
            <el-option label="音频" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="params1.seachMediaData.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="params1.seachMediaData.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <el-form
        :inline="true"
        label-width="180px"
        v-if="settingTypeValue == '3'"
      >
        <el-form-item label="多媒体类型">
          <el-select
            clearable
            size="mini"
            v-model="params2.mediaDataUp.media_type"
            placeholder="请选择"
          >
            <el-option label="图像" value="0"></el-option>
            <el-option label="音频" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道ID">
          <el-input
            v-model="params2.mediaDataUp.channel"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件编码">
          <el-select
            clearable
            size="mini"
            v-model="params2.mediaDataUp.event_code"
            placeholder="请选择"
          >
            <el-option label="图像" value="0"></el-option>
            <el-option label="音频" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="params2.mediaDataUp.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="params2.mediaDataUp.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="删除标志">
          <el-select
            clearable
            size="mini"
            v-model="params2.mediaDataUp.del_flag"
            placeholder="请选择"
          >
            <el-option label="保留" value="0"></el-option>
            <el-option label="删除" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form
        :inline="true"
        label-width="180px"
        v-if="settingTypeValue == '4'"
      >
        <el-form-item label="录音命令">
          <el-select
            clearable
            size="mini"
            v-model="params3.startSound.sound_cmd"
            placeholder="请选择"
          >
            <el-option label="停止录音" value="0"></el-option>
            <el-option label="开始录音" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录音时间">
          <el-input
            v-model="params3.startSound.sound_time"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="保存标志">
          <el-select
            clearable
            size="mini"
            v-model="params3.startSound.save_flag"
            placeholder="请选择"
          >
            <el-option label="实时上传" value="0"></el-option>
            <el-option label="保存" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录音采样率">
          <el-select
            clearable
            size="mini"
            v-model="params3.startSound.adio_ate"
            placeholder="请选择"
          >
            <el-option label="8k" value="0"></el-option>
            <el-option label="11k" value="1"></el-option>
            <el-option label="23k" value="2"></el-option>
            <el-option label="32k" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form
        :inline="true"
        label-width="180px"
        v-if="settingTypeValue == '5'"
      >
        <el-form-item label="多媒体ID">
          <el-input
            v-model="params4.singleMediaData.media_ID"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="删除标志">
          <el-select
            clearable
            size="mini"
            v-model="params4.singleMediaData.del_flag"
            placeholder="请选择"
          >
            <el-option label="保留" value="0"></el-option>
            <el-option label="删除" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
  cameraShootsImmediately,
  storedMultimediaDataRetrieval,
  storeMultimediaDataUpload,
  recordingStart,
  oneStoredMultimediaDataUpload,
} from "@/api/paramsSetting/settings2013";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      settingTypeValue: "1",
      settingTypeOptions: [
        { label: "摄像头立即拍摄", value: "1" },
        { label: "储存多媒体检查", value: "2" },
        { label: "储存多媒体数据上传", value: "3" },
        { label: "录音开始", value: "4" },
        { label: "单条储存多媒体数据上传", value: "5" },
      ],
      formContainer: {},
      options1: [],
      vehicleArr: [],
      QualityDialogFlag: false,
      ipList: [],
      flag_per: [],
      photo_fenbianlu: "",
      params: {
        clientId: "",
        deviceId: "",
        photoCmd: {
          channel: "",
          photo_order: "",
          photo_interval: "",
          photo_save: "",
          photo_fenbianlu: [],
          photo_zhiliang: "",
          liangdu: "",
          duibidu: "",
          baohedu: "",
          sedu: "",
        },
      },
      params1: {
        clientId: "",
        deviceId: "",
        seachMediaData: {
          media_type: "",
          channel: "",
          event_code: "",
          start_time: "",
          end_time: "",
        },
      },
      params2: {
        clientId: "",
        deviceId: "",
        mediaDataUp: {
          media_type: "",
          channel: "",
          event_code: "",
          start_time: "",
          end_time: "",
          del_flag: "",
        },
      },
      params3: {
        clientId: "",
        deviceId: "",
        startSound: {
          sound_cmd: "",
          sound_time: "",
          save_flag: "",
          adio_ate: "",
        },
      },
      params4: {
        clientId: "",
        deviceId: "",
        singleMediaData: {
          media_ID: "",
          del_flag: "",
        },
      },
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
      this.params.clientId = this.params1.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = newVal;
      // console.log(newVal)
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    settingTypeChange() {
      if (this.settingTypeValue == "4") {
        this.options1 = [
          { label: "录音命令", value: "0x001" },
          { label: "录音时间", value: "0x001" },
          { label: "保存标志", value: "0x001" },
          { label: "音频采样率", value: "0x001" },
        ];
      } else if (this.settingTypeValue == "5") {
        this.options1 = [
          { label: "多媒体ID", value: "0x001" },
          { label: "删除标志", value: "0x001" },
        ];
      }
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
      this.params.deviceId = this.params1.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId =
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
      if (this.settingTypeValue == "1") {
        let photo_fenbianlu = {};
        photo_fenbianlu[this.photo_fenbianlu] = "1";
        this.params.photoCmd.photo_fenbianlu.push(photo_fenbianlu);
        cameraShootsImmediately(this.params).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "2") {
        storedMultimediaDataRetrieval(this.params1).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "3") {
        storeMultimediaDataUpload(this.params2).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "4") {
        recordingStart(this.params3).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "5") {
        oneStoredMultimediaDataUpload(this.params4).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

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
  },
  mounted() {
    if (this.$store.state.carInfo.carInfo != "") {
      this.params.deviceId = this.params1.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
    }
    this.params.clientId = this.params1.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = this.clientId;
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
