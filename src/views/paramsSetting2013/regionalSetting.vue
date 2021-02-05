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
        clearable
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
        ref="form"
        :inline="true"
        label-width="7em"
        v-if="
          settingTypeValue == '1' ||
          settingTypeValue == '2' ||
          settingTypeValue == '3'
        "
      >
        <el-form-item label="区域ID">
          <el-input
            v-model="area1.area_list[0].id"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域名称">
          <el-input
            v-model="area1.area_list[0].area_name"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="中心点纬度" v-if="settingTypeValue == '1'">
          <el-input
            v-model="area1.area_list[0].centre_latitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="中心点经度" v-if="settingTypeValue == '1'">
          <el-input
            v-model="area1.area_list[0].centre_longitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="半径" v-if="settingTypeValue == '1'">
          <el-input
            v-model="area1.area_list[0].radius"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item label="左上点纬度" v-if="settingTypeValue == '2'">
          <el-input
            v-model="area1.area_list[0].left_latitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="左上点经度" v-if="settingTypeValue == '2'">
          <el-input
            v-model="area1.area_list[0].left_longitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="右下点纬度" v-if="settingTypeValue == '2'">
          <el-input
            v-model="area1.area_list[0].right_latitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="右下点经度" v-if="settingTypeValue == '2'">
          <el-input
            v-model="area1.area_list[0].right_longitude"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="area1.area_list[0].start_time"
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
            v-model="area1.area_list[0].end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最高速度">
          <el-input
            v-model="area1.area_list[0].max_speed"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="超速持续时间">
          <el-input
            v-model="area1.area_list[0].overspeed_time"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="夜间最高速度">
          <el-input
            v-model="area1.area_list[0].max_night_speed"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.time_rule">启用时间规则</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.speed_rule">启用速度规则</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.in_driver">进入报给驾驶员</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.in_platform">进入速度平台</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.out_driver">驶出报给驾驶员</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="attr.out_platform">驶出速度平台</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="attr.latitude">
            <el-radio label="0">北纬</el-radio>
            <el-radio label="1">南纬</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="attr.longitude">
            <el-radio label="0">东经</el-radio>
            <el-radio label="1">西京</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="attr.door_status">
            <el-radio label="0">允许开门</el-radio>
            <el-radio label="1">禁止开门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="attr.msg_status">
            <el-radio label="0">进区域开通信模块</el-radio>
            <el-radio label="1">进区域关通信模块</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="attr.gnss_status">
            <el-radio label="0">进区域不采GNSS</el-radio>
            <el-radio label="1">进区域采集GNSS</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div v-if="settingTypeValue == '3'">
        <div v-for="(item, index) in vertex_list" :key="index">
          <p>
            顶点项{{ index + 1 }}
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              size="mini"
              @click="addVertex"
              v-if="index == 0"
            ></el-button>
          </p>
          <div class="contactsContainer">
            <div>
              <span>经度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.vertex_lat"
              ></el-input>
            </div>
            <div>
              <span>纬度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.vertex_lon"
              ></el-input>
            </div>
            <div>
              <el-button
                type="danger"
                icon="el-icon-minus"
                circle
                size="mini"
                @click="minusContacts(index)"
                v-if="index > 2"
              ></el-button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div v-if="settingTypeValue == '4'">
          <div class="inquiryArea">
            <span class="disIB">查询类型</span>
            <el-select
              clearable
              size="mini"
              v-model="params3.selectAreaLine.selecttype"
              placeholder="请选择"
            >
              <el-option label="圆形" value="1"></el-option>
              <el-option label="矩形" value="2"></el-option>
              <el-option label="多边形" value="3"></el-option>
              <el-option label="线路" value="4"></el-option>
            </el-select>
          </div>
          <div class="inquiryArea">
            <span class="disIB">ID数量</span>
            <el-input
              clearable
              size="mini"
              v-model="params3.selectAreaLine.selectnum"
              style="width: 50%"
            ></el-input>
          </div>
        </div>
        <div v-if="settingTypeValue == '5'" style="margin-top: 20px">
          <span class="disIB">删除类型</span>
          <el-select
            clearable
            size="mini"
            v-model="deleteType"
            placeholder="请选择"
          >
            <el-option label="删除圆形区域" value="1"></el-option>
            <el-option label="删除矩形区域" value="2"></el-option>
            <el-option label="删除多边形区域" value="3"></el-option>
            <el-option label="删除路段" value="4"></el-option>
          </el-select>
        </div>
        <div v-if="settingTypeValue == '4' || settingTypeValue == '5'">
          <div
            v-for="(item, index) in selectlist"
            :key="index"
            class="inquiryArea"
          >
            <span class="disIB">区域/路段ID{{ index + 1 }}</span>
            <el-input
              clearableF
              size="mini"
              v-model="item.id"
              style="width: 50%"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              size="mini"
              @click="addArea"
              v-if="index == 0"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-minus"
              circle
              size="mini"
              @click="minusArea(index)"
              v-if="index != 0"
            ></el-button>
          </div>
        </div>
      </div>

      <el-form :inline="true" label-width="7em" v-if="settingTypeValue == '6'">
        <el-form-item label="路线ID">
          <el-input
            v-model="params5.linePoint.line_id"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="路线名称">
          <el-input
            v-model="params5.linePoint.line_name"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="params5.linePoint.start_time"
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
            v-model="params5.linePoint.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="路线属性">
          <el-checkbox
            v-model="attr5.time_rule"
            label="启用时间规则"
            name="type"
          ></el-checkbox>
          <el-checkbox
            v-model="attr5.in_driver"
            label="进入报给驾驶员"
            name="type"
          ></el-checkbox>
          <el-checkbox
            v-model="attr5.in_platform"
            label="进入报给平台"
            name="type"
          ></el-checkbox>
          <el-checkbox
            v-model="attr5.out_driver"
            label="驶出报给驾驶员"
            name="type"
          ></el-checkbox>
          <el-checkbox
            v-model="attr5.out_platform"
            label="驶出报给平台"
            name="type"
          ></el-checkbox>
        </el-form-item>
      </el-form>

      <div v-if="settingTypeValue == '6'">
        <div
          v-for="(item, index) in params5.linePoint.linepoint_list"
          :key="index"
        >
          <p>
            拐点{{ index + 1 }}
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              size="mini"
              @click="addPointForm"
              v-if="index == 0"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-minus"
              circle
              size="mini"
              @click="minusPointForm(index)"
              v-if="index != 0"
            ></el-button>
          </p>
          <div class="contactsContainer">
            <div>
              <span>拐点ID</span>
              <el-input
                clearable
                size="mini"
                v-model="item.point_id"
              ></el-input>
            </div>
            <div>
              <span>路段ID</span>
              <el-input clearable size="mini" v-model="item.road_id"></el-input>
            </div>
            <div>
              <span>纬度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.point_lat"
              ></el-input>
            </div>
            <div>
              <span>经度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.point_lon"
              ></el-input>
            </div>
            <div>
              <span>路段宽度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.road_width"
              ></el-input>
            </div>
            <div>
              <span>行驶过长阈值</span>
              <el-input
                clearable
                size="mini"
                v-model="item.road_travel_long"
              ></el-input>
            </div>
            <div>
              <span>路段最高速度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.road_max_speed"
              ></el-input>
            </div>
            <div>
              <span>超速持续时间</span>
              <el-input
                clearable
                size="mini"
                v-model="item.road_overspeed_time"
              ></el-input>
            </div>
            <div>
              <span>夜间最高速度</span>
              <el-input
                clearable
                size="mini"
                v-model="item.road_max_night_speed"
              ></el-input>
            </div>
            <div>
              <span>路段属性</span>
              <el-checkbox
                label="行驶时间"
                name="type"
                v-model="item.roadattr[0].travetime"
              ></el-checkbox>
              <el-checkbox
                label="限速"
                name="type"
                v-model="item.roadattr[0].travespeed"
              ></el-checkbox>
              <el-radio-group v-model="item.roadattr[0].latitude">
                <el-radio label="0">北纬</el-radio>
                <el-radio label="1">南纬</el-radio>
              </el-radio-group>
              <el-radio-group v-model="item.roadattr[0].longitude">
                <el-radio label="0">东经</el-radio>
                <el-radio label="1">西经</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <el-button
        class="bottom-button"
        @click="handleSettingClick"
        type="primary"
        >发送</el-button
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
  setCircleArea,
  setRectangleArea,
  setPolygonArea,
  queryAreaOrLineData,
  deleteCircleArea,
  deleteRectangleArea,
  deletePolygonArea,
  deleteRoute,
  setRoute,
} from "@/api/paramsSetting/settings2013";
import JsonViewer from "vue-json-viewer";
export default {
  data() {
    return {
      settingTypeValue: "1",
      settingTypeOptions: [
        { label: "设置圆形区域", value: "1" },
        { label: "设置矩形区域", value: "2" },
        { label: "设置多边形区域", value: "3" },
        { label: "查询区域/路段", value: "4" },
        { label: "删除区域/路段", value: "5" },
        { label: "设置路线", value: "6" },
      ],

      longitude1: "",
      vehicleArr: [],

      QualityDialogFlag: false,
      attr: {
        time_rule: false,
        speed_rule: false,
        in_driver: false,
        in_platform: false,
        out_driver: false,
        out_platform: false,
        latitude: "0",
        longitude: "0",
        door_status: "0",
        msg_status: "0",
        gnss_status: "0",
      },
      params: {
        clientId: "",
        deviceId: "",
        area: {},
      },

      params1: {
        clientId: "",
        deviceId: "",
        rectList: {},
      },

      params2: {
        clientId: "",
        deviceId: "",
        polygonArea: {},
      },
      params3: {
        clientId: "",
        deviceId: "",
        selectAreaLine: {
          selecttype: "",
          selectnum: "",
          selectlist: [],
        },
      },
      params4: {
        clientId: "",
        deviceId: "00000000064746215406",
        areaListDel: {
          area_list: [],
        },
        ids: { area_list: [] },
      },
      params5: {
        clientId: "",
        deviceId: "",
        linePoint: {
          line_id: "",
          attr: [],
          start_time: "",
          end_time: "",
          linepoint_list: [
            {
              point_id: "",
              road_id: "",
              point_lat: "",
              point_lon: "",
              road_width: "",
              roadattr: [
                {
                  travetime: false,
                  trave_time: "0",
                  travespeed: false,
                  trave_speed: "0",
                  latitude: "0",
                  longitude: "0",
                },
              ],
              road_travel_long: "",
              road_travel_bzhu: "",
              road_max_speed: "",
              road_overspeed_time: "",
              road_max_night_speed: "",
            },
          ],
          line_name: "",
        },
      },
      deleteType: "1",
      selectlist: [{ id: "" }],
      vertex_list: [
        { vertex_lat: "", vertex_lon: "" },
        { vertex_lat: "", vertex_lon: "" },
        { vertex_lat: "", vertex_lon: "" },
      ],
      attr5: {
        time_rule: false,
        in_driver: false,
        in_platform: false,
        out_driver: false,
        out_platform: false,
      },

      area1: {
        set_attr: "1",
        area_num: "",
        area_list: [
          {
            id: "",
            attr: {},
            vertex_list: {},
            centre_latitude: "",
            centre_longitude: "",
            radius: "",
            start_time: "",
            end_time: "",
            max_speed: "",
            overspeed_time: "",
            max_night_speed: "",
            area_name: "",
            left_latitude: "", //左上点纬度
            left_longitude: "", //左上点经度
            right_latitude: "", //右下点纬度
            right_longitude: "", //右下点纬度
          },
        ],
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
      this.params.clientId = this.params1.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = this.params5.clientId = newVal;
      // console.log(newVal)
      return newVal;
    },
    oldContent(newVal) {
      return newVal;
    },
  },
  methods: {
    settingTypeChange() {},
    addVertex() {
      let formItems = {
        vertex_lat: "",
        vertex_lon: "",
      };
      this.vertex_list.push(formItems);
    },
    minusContacts(ind) {
      this.vertex_list.splice(ind, 1);
    },
    addArea() {
      let formItems = {
        id: "",
      };
      this.selectlist.push(formItems);
    },
    minusArea(ind) {
      this.selectlist.splice(ind, 1);
    },

    addPointForm() {
      let formItems = {
        point_id: "",
        road_id: "",
        point_lat: "",
        point_lon: "",
        road_width: "",
        roadattr: [
          {
            travetime: false,
            trave_time: "0",
            travespeed: false,
            trave_speed: "0",
            latitude: "0",
            longitude: "0",
          },
        ],
        road_travel_long: "",
        road_travel_bzhu: "",
        road_max_speed: "",
        road_overspeed_time: "",
        road_max_night_speed: "",
      };
      this.params5.linePoint.linepoint_list.push(formItems);
    },
    minusPointForm(ind) {
      this.params5.linePoint.linepoint_list.splice(ind, 1);
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
      this.params.deviceId = this.params1.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId = this.params5.deviceId =
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
      let attr = {};
      _.map(this.attr, (item, ind) => {
        if (item === true || item === "1") {
          attr[ind] = "1";
        } else {
          attr[ind] = "0";
        }
      });

      if (this.settingTypeValue == "1") {
        this.area1.area_list[0].attr = attr;
        this.params.area = this.area1;
        setCircleArea(this.params).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "2") {
        this.area1.area_list[0].attr = attr;
        this.params1.rectList = this.area1;

        setRectangleArea(this.params1).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "3") {
        // this.params2.polygonArea.attr= attr;
        this.area1.area_list[0].attr = attr;
        this.area1.area_list[0].vertex_list = this.vertex_list;
        this.params2.polygonArea = this.area1.area_list[0];
        setPolygonArea(this.params2).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "4") {
        this.params3.selectAreaLine.selectlist = this.selectlist;
        queryAreaOrLineData(this.params3).then((res) => {
          let type = "";
          res.code == 200 ? (type = "success") : (type = "error");

          this.$message({
            type: type,
            message: res.message,
          });
        });
      } else if (this.settingTypeValue == "5") {
        if (this.deleteType == "4") {
          this.params4.areaListDel.area_list = this.selectlist;
          deleteRoute(this.params4).then((res) => {
            let type = "";
            res.code == 200 ? (type = "success") : (type = "error");

            this.$message({
              type: type,
              message: res.message,
            });
          });
        } else {
          this.params4.ids.area_list = this.selectlist;
          if (this.deleteType == "1") {
            deleteCircleArea(this.params4).then((res) => {
              let type = "";
              res.code == 200 ? (type = "success") : (type = "error");

              this.$message({
                type: type,
                message: res.message,
              });
            });
          } else if (this.deleteType == "2") {
            deleteRectangleArea(this.params4).then((res) => {
              let type = "";
              res.code == 200 ? (type = "success") : (type = "error");

              this.$message({
                type: type,
                message: res.message,
              });
            });
          } else if (this.deleteType == "3") {
            deletePolygonArea(this.params4).then((res) => {
              let type = "";
              res.code == 200 ? (type = "success") : (type = "error");

              this.$message({
                type: type,
                message: res.message,
              });
            });
          }
        }
      } else if (this.settingTypeValue == "6") {
        _.map(this.params5.linePoint.linepoint_list, (item, index) => {
          console.log(item.roadattr[0]);
          if (item.roadattr[0].travespeed == true) {
            this.params5.linePoint.linepoint_list[index].trave_speed = "1";
          } else if (item.roadattr[0].travetime == true) {
            this.params5.linePoint.linepoint_list[index].trave_time = "1";
          } else {
            this.params5.linePoint.linepoint_list[index].trave_speed = "0";
            this.params5.linePoint.linepoint_list[index].trave_time = "0";
          }
        });

        let attr5 = {};
        _.map(this.attr5, (item, ind) => {
          if (item === true || item === "1") {
            attr5[ind] = "1";
          } else {
            attr5[ind] = "0";
          }
        });
        this.params5.linePoint.attr[0] = attr5;
        setRoute(this.params5).then((res) => {
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
      this.params.deviceId = this.params1.deviceId = this.params2.deviceId = this.params3.deviceId = this.params4.deviceId = this.params5.deviceId = this.$store.state.carInfo.carInfo[0].simNumber;
    }
    this.params.clientId = this.params1.clientId = this.params2.clientId = this.params3.clientId = this.params4.clientId = this.params5.clientId = this.clientId;
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
  flex-wrap: wrap;
}
.contactsContainer div span {
  /* float: left; */
  line-height: 40px;
  margin-right: 5px;
}
.contactsContainer div .el-input {
  width: 60%;
}
.inquiryArea {
  margin-top: 15px;
}
.disIB {
  display: inline-block;
  width: 20%;
  text-align: right;
}
</style>
