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
      <el-select v-model="settingType" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-card class="box-card" shadow="hover" v-if="settingType == '1'">
      <div slot="header" class="clearfix">
        <span>设置参数选项</span>
      </div>
      <div>
        <el-row>
          <el-col :span="4" style="border-right: 1px #eeeeee solid">
            <div>
              <el-radio-group v-model="radio">
                <el-radio :label="1">车辆信息</el-radio>
                <el-radio :label="2">脉冲系数</el-radio>
                <el-radio :label="3">初次安装日期</el-radio>
                <el-radio :label="4">记录仪时间</el-radio>
                <el-radio :label="5">起始里程</el-radio>
                <el-radio :label="6">状态信号配置</el-radio>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="20">
            <div style="width: 80%; margin: 0 auto" v-if="radio == 1">
              <el-form ref="form" :model="form_car" label-width="80px">
                <el-form-item label="车牌号">
                  <el-input
                    clearable
                    size="mini"
                    v-model="form_car.no"
                  ></el-input>
                </el-form-item>
                <el-form-item label="车辆类型">
                  <el-input
                    clearable
                    size="mini"
                    v-model="form_car.ctype"
                  ></el-input>
                </el-form-item>
                <el-form-item label="识别号">
                  <el-input
                    clearable
                    size="mini"
                    v-model="form_car.vin"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 80%; margin: 0 auto" v-if="radio == 2">
              <el-form ref="form" :model="form_mcxs" label-width="80px">
                <el-form-item label="当前时间">
                  <el-date-picker
                    v-model="form_mcxs.time"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="脉冲系数">
                  <el-input
                    v-model="form_mcxs.mcxs"
                    style="width: 220px"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 80%; margin: 0 auto" v-if="radio == 3">
              <el-form ref="form" :model="form_first" label-width="100px">
                <el-form-item label="初次安装时间">
                  <el-date-picker
                    v-model="form_first.timecc"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 80%; margin: 0 auto" v-if="radio == 4">
              <el-form ref="form" :model="form_jly" label-width="100px">
                <el-form-item label="记录仪时间">
                  <el-date-picker
                    v-model="form_jly.time"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 80%; margin: 0 auto" v-if="radio == 5">
              <el-form ref="form" :model="form_cslc" label-width="8em">
                <el-col :span="12">
                  <el-form-item label="记录仪时间">
                    <el-date-picker
                      v-model="form_cslc.time"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="初次安装时间">
                    <el-date-picker
                      v-model="form_cslc.timecc"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="初始里程">
                    <el-input v-model="form_cslc.initmile"></el-input>
                  </el-form-item>
                  <el-form-item label="累计行驶里程">
                    <el-input v-model="form_cslc.allmile"></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
            <div style="width: 80%; margin: 0 auto" v-if="radio == 6">
              <div style="width: 100%; overflow: hidden">
                <el-col :span="12">
                  <el-form
                    ref="form"
                    :model="form_ztxh"
                    label-width="150px"
                    style="float: left"
                  >
                    <el-form-item label="D0的状态信号名称">
                      <el-input v-model="form_ztxh.d0"></el-input>
                    </el-form-item>
                    <el-form-item label="D1的状态信号名称">
                      <el-input v-model="form_ztxh.d1"></el-input>
                    </el-form-item>
                    <el-form-item label="D2的状态信号名称">
                      <el-input v-model="form_ztxh.d2"></el-input>
                    </el-form-item>
                    <el-form-item label="D3的状态信号名称">
                      <el-input v-model="form_ztxh.d3" disabled></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form
                    ref="form"
                    :model="form_ztxh"
                    label-width="150px"
                    style="float: right"
                  >
                    <el-form-item label="D4的状态信号名称">
                      <el-input v-model="form_ztxh.d4" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D5的状态信号名称">
                      <el-input v-model="form_ztxh.d5" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D6的状态信号名称">
                      <el-input v-model="form_ztxh.d6" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D7的状态信号名称">
                      <el-input v-model="form_ztxh.d7" disabled></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div v-if="settingType == '2'">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>采集命令选项</span>
        </div>
        <div style="line-height: 30px">
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x00"
              >执行标准版本</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x01"
              >当前驾驶人信息</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x02"
              >实时时间</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x03"
              >累计行驶里程</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x04"
              >脉冲系数</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x05"
              >车辆信息</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x06"
              >状态信号配置信息</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x07"
              >唯一性编号</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x08"
              >指定的行驶速度记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x09"
              >指定的位置信息记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x10"
              >指定的事故疑点记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x11"
              >指定的超时驾驶记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x12"
              >指定的驾驶人身份记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x13"
              >指定的外部供电记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x14"
              >指定的参数修改记录</el-radio
            ></el-col
          >
          <el-col :span="6">
            <el-radio v-model="tachograph.recorderCJ.id" label="0x15"
              >指定的速度状态日志</el-radio
            ></el-col
          >
        </div>
      </el-card>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        v-if="
          tachograph.recorderCJ.id !== '0x00' &&
          tachograph.recorderCJ.id !== '0x01' &&
          tachograph.recorderCJ.id !== '0x02' &&
          tachograph.recorderCJ.id !== '0x03' &&
          tachograph.recorderCJ.id !== '0x04' &&
          tachograph.recorderCJ.id !== '0x05' &&
          tachograph.recorderCJ.id !== '0x06' &&
          tachograph.recorderCJ.id !== '0x07'
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
  rivingRecoderParametersDownload,
  drivingRecorderDataCollection,
} from "@/api/paramsSetting/settings";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "行驶记录仪参数设置",
        },
        {
          value: "2",
          label: "行驶记录仪采集",
        },
      ],
      settingType: "1",
      radio: 1,
      form: {},
      form_car: {},
      form_mcxs: {},
      form_first: {},
      form_jly: {},
      form_cslc: {},
      form_ztxh: {
        d3: "近光",
        d4: "远光",
        d5: "右转向",
        d6: "左转向",
        d7: "制动",
      },

      query: {
        time1: "",
        time2: "",
      },
      formR: {
        value: "",
      },
      vehicleArr: [],
      QualityDialogFlag: false,
      ipList: [],
      flag_per: [],
      // params: {
      //   deviceId: "",
      //   terminalParamItems: [],
      //   clientId: "",
      // },
      tachographSetting: {
        clientId: "",
        deviceId: "",
        recorderSZ: {
          id: "",
          vin: "",
          no: "",
          ctype: "",
          time: "",
          timecc: "",
          mcxs: "",
          initmile: "",
          allmile: "",
          D0: "",
          D1: "",
          D2: "",
          D3: "近光",
          D4: "远光",
          D5: "右转向",
          D6: "左转向",
          D7: "制动",
        },
      },
      tachograph: {
        clientId: "",
        deviceId: "",
        recorderCJ: {
          id: "",
          time1: "",
          time2: "",
          datanum: "100",
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
      this.tachograph.clientId = this.tachographSetting.clientId = newVal;
      // console.log(newVal)
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    changeTime() {
      this.tachograph.recorderCJ.time1 = this.formR.value[0];
      this.tachograph.recorderCJ.time2 = this.formR.value[1];
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
      this.tachograph.deviceId = this.tachographSetting.deviceId =
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
        if (this.radio == 1) {
          this.tachographSetting.recorderSZ = this.form_car;
          this.tachographSetting.recorderSZ.id = "0x82";
        } else if (this.radio == 2) {
          this.tachographSetting.recorderSZ = this.form_mcxs;
          this.tachographSetting.recorderSZ.id = "0xC3";
        } else if (this.radio == 3) {
          this.tachographSetting.recorderSZ = this.form_first;
          this.tachographSetting.recorderSZ.id = "0x83";
        } else if (this.radio == 4) {
          this.tachographSetting.recorderSZ = this.form_jly;
          this.tachographSetting.recorderSZ.id = "0xC2";
        } else if (this.radio == 5) {
          this.tachographSetting.recorderSZ = this.form_cslc;
          this.tachographSetting.recorderSZ.id = "0xC4";
        } else if (this.radio == 6) {
          this.tachographSetting.recorderSZ = this.form_ztxh;
          this.tachographSetting.recorderSZ.id = "0x84";
        }
        rivingRecoderParametersDownload(this.tachographSetting).then((res) => {
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
        drivingRecorderDataCollection(this.tachograph).then((res) => {
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
  },
  mounted() {
    this.tachograph.clientId = this.tachographSetting.clientId = this.clientId;
    if (this.$store.state.carInfo.carInfo != "") {
      this.tachograph.deviceId = this.tachographSetting.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
    }
  },
};
</script>

<style scoped>
.el-radio {
  width: 100%;
  margin: 5px 30px 5px 0;
}
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
