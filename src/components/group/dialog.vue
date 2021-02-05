<template>
  <div>
    <el-dialog
      title="组管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="QualityDialogClose"
      width="60%"
    >
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="titleGroup.tab1" name="first">
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
            class="left"
            :rules="rules"
            size="mini"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="组名称" prop="groupName">
                  <el-input data-cy="gro-groupName-input" v-model="form.groupName" :clearable='true'></el-input>
                </el-form-item>
                <el-form-item label="组编码">
                  <el-input data-cy="gro-groupCode-input" v-model="form.groupCode" :clearable='true'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级组">
                  <el-cascader
                     data-cy="gro-parentGroupId-select"
                    :options="options"
                    :props="props"
                    v-model="parentGroupId"
                    :clearable='true'
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input
                    data-cy="gro-remark-input"
                    v-model="form.remark"
                    type="textarea"
                    :rows="2"
                    :clearable='true'
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="上级组权限">
                  <el-input v-model="form.parePower" type="textarea" :rows="4"></el-input>
                </el-form-item>-->
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="titleGroup.tab2" name="second">
          <el-form
            data-cy="gro-carTab-form"
            ref="form"
            :model="form2"
            class="left"
            :rules="rules"
            size="mini"
            :inline="true"
          >
            <el-form-item label="过滤列表">
              <el-select v-model="form2.value" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input v-model="form2.numberPlate" :clearable='true'></el-input>
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-select v-model="form2.type" placeholder="请选择" size="mini" :clearable='true'>
                <el-option
                  v-for="item in options_carType"
                  :key="item.dictLabel"
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SIM卡号">
              <el-input v-model="form2.simNumber" :clearable='true'></el-input>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input v-model="form2.ownerCompany" :clearable='true'></el-input>
            </el-form-item>
            <el-form-item label="终端类型">
              <el-select
                v-model="form2.terminalType"
                placeholder="请选择"
                size="mini"
                :clearable='true'
              >
                <el-option
                  v-for="item in options_terminalType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCarList" size="mini"
                >查询</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" size="mini">导出</el-button>
            </el-form-item> -->
          </el-form>
          <el-col :span="10">
            <el-table
              :data="data1"
              border
              ref="selection"
              @selection-change="checkAll"
              style="width: 100%"
              height="300"
              v-loading="loading"
            >
              <el-table-column type="selection" fixed width="30" :selectable="selectable">
              </el-table-column>
              <el-table-column
                prop="numberPlate"
                label="车牌号"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="plateColor"
                label="车牌颜色"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="brandType"
                label="企业名称"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="type"
                label="车辆类型"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="terminalType"
                label="终端类型"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="terminalNumber"
                label="终端号码"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="simNumber" label="SIM卡号">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="3">
            <div class="opSetting">
              <div @click="handelSelect">
                <el-button
                  icon="el-icon-d-arrow-right"
                  :disabled="nowSelectData.length ? false : true"
                  size="mini"
                  type="primary"
                >
                </el-button>
              </div>
              <div style="margin-top: 20px" @click="handleRemoveSelect">
                <el-button
                  icon="el-icon-d-arrow-left"
                  :disabled="nowSelectRightData.length ? false : true"
                  size="mini"
                  type="primary"
                >
                </el-button>
              </div>
            </div>
          </el-col>

          <el-col :span="10">
            <el-table
              :data="selectArr"
              border
              ref="selection"
              @selection-change="checkRightAll"
              style="width: 100%"
              height="300"
              v-loading="loading"
            >
              <el-table-column type="selection" fixed width="30" :selectable="selectable">
              </el-table-column>
              <el-table-column
                prop="numberPlate"
                label="车牌号"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="plateColor"
                label="车牌颜色"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="brandType"
                label="企业名称"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="type"
                label="车辆类型"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="terminalType"
                label="终端类型"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="terminalNumber"
                label="终端号码"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="simNumber"
                label="SIM卡号"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </el-col>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button data-cy="gro-cancel-button" @click="QualityDialogClose">取 消</el-button>
        <el-button data-cy="gro-sure-button" type="primary" @click="submitGroupInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import {
  grouplist,
  addGroupList,
  updateGroupList,
  getGroupAndvehInfo,
  getCar
} from "@/api/system/group";
import { getDicList } from "@/api/system/carManage.js";
import { getTerminalList } from "@/api/system/terminalType.js";
export default {
  // components: { IconSelect },
  data() {
    return {
      activeName: "first",
      selectArr: [], // 右边列表
      buttonSize: "large",
      options: [],
      data1: [],
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
      options_carType: [],
      options_terminalType: [],
      visible: false,
      rules: {
        groupName: [
          { required: true, message: "请输入组名称", trigger: "blur" },
        ],
      },
      form: {
        groupName: "",
        parentGroupId: "",
        groupCode: "",
        remark: "",
        parePower: "",
      },
      deviceId: [],
      props: {
        value: "id",
        label: "groupName",
        checkStrictly: true,
        children: "childList",
      },
      options2: [
        { label: "已选列表", value: 0 },
        { label: "待选列表", value: 1 },
      ],
      form2: {
        groupId: this.$store.state.user.groupId,
        pageNum: 1,
        pageSize: 9999,
        value: 1,
        numberPlate: "",
        type: "",
        simNumber: "",
        ownerCompany: "",
        terminalType: "",
      },
      data: [],
      parentGroupId: [],
      value: [],
      params: {},
      titleGroup:{
        tab1:'添加组信息',
        tab2:'添加组车辆'
      },
      loading:false
    };
  },
  props: {
    QualityDialogFlag: {
      default: false,
    },
    rowInfo: {
      default: {},
      type: Object,
    },
  },
  watch: {
    QualityDialogFlag() {
      this.visible = this.QualityDialogFlag;
      this.activeName = "first";
    },
    rowInfo(newVal) {
      // console.log(this.rowInfo);
      if (!this.rowInfo.id) {
        this.deviceId = [];
        this.form={
          groupName: "",
          parentGroupId: "",
          groupCode: "",
          remark: "",
          parePower: "",
        }
        this.titleGroup={
          tab1:'添加组信息',
          tab2:'添加组车辆'
        }
      } else {
        this.form = this.rowInfo;
        this.parentGroupId = this.rowInfo.parentGroupId;
        this.titleGroup={
          tab1:'编辑组信息',
          tab2:'编辑组车辆'
        }
      }

      return newVal;
    },
  },
  methods: {
    checkAll(val) {
      this.nowSelectData = val;
    },
    checkRightAll(val) {
      this.nowSelectRightData = val;
    },
    // 待选->已选
    handelSelect() {
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
      this.handleRemoveTabList(this.nowSelectData, this.data1);
      this.nowSelectData = [];
    },
    // 已选->待选
    handleRemoveSelect() {
      this.data1 = this.handleConcatArr(this.data1, this.nowSelectRightData);
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArr, nowSelectData);
      return arr;
    },
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["id"] === originalArr[k]["id"]) {
              originalArr.splice(k, 1);
            }
          }
        }
      }
    },
    // 设置复选框中禁用的行
    selectable(row,index){
      if(row.viewByBind==0){
        return true
      }
      else if(row.viewByBind==1){
        return false
      }
    },
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.getCarList();
      }
    },
    getCarList() {
      this.loading=true
      let params = {
        groupId: this.rowInfo.id,
        // pageNum: 1,
        // pageSize: 9999,
      };
      let newParams = {
        groupId: this.rowInfo.id,
        // pageNum: 1,
        // pageSize: 9999,
      };
      // 在已选列表查询数据
      if (this.form2.value == 0) {
        newParams = {
          groupId: this.rowInfo.id,
          pageNum: 1,
          pageSize: 9999,
          numberPlate: this.form2.numberPlate,
          type: this.form2.type,
          simNumber: this.form2.simNumber,
          ownerCompany: this.form2.ownerCompany,
          terminalType: this.form2.terminalType,
        };
        params = {
          groupId: this.$store.state.user.groupId,
          // pageNum: 1,
          // pageSize: 9999,
        };
      } 
      // 在待选列表查询数据
      else {
        this.form2.groupId=this.rowInfo.id
        params = this.form2;
        newParams = {
          groupId: this.rowInfo.id,
          // pageNum: 1,
          // pageSize: 9999,
        };
      }
      getCar(params).then((res) => {
        this.data1 = res.data;
        this.loading=false
      });

      if (this.rowInfo.id) {
        // console.log(this.rowInfo.id)

        // params.groupId = this.rowInfo.id;
        getGroupAndvehInfo(newParams).then((res) => {
          this.selectArr = res.data;
          this.loading=false
        });
      }
    },
    onload() {
      let params = {
        groupName: this.form.groupName,
      };
      grouplist(params).then((res) => {
        this.options = this.getChildsData(res.data);
      });
    },

    getChildsData(data) {
      _.map(data, (item) => {
        if (item.childList == null || item.childList.length < 1) {
          item.childList = undefined;
        } else {
          this.getChildsData(item.childList);
        }
      });
      return data;
    },
    submitGroupInfo() {
      if(this.form.groupName==''){
        this.$message({
              message: '请输入组名称',
              type: "warning",
            });
        return
      }
      this.params.sysGroup = this.form;
      // this.params.groupId= this.$store.state.user.groupId
      console.log(this.selectArr);
      this.params.deviceIds = _.map(this.selectArr, (item) => {
        return item.id;
      });
      // console.log(this.params);
      if (typeof this.parentGroupId == "object") {
        this.form.parentGroupId = this.parentGroupId.pop();
      } else {
        this.form.parentGroupId = this.parentGroupId;
      }
      // console.log(JSON.stringify(this.rowInfo) == "{}");
      if (!this.rowInfo.id) {
        addGroupList(this.params).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "新增组信息成功",
            });
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.QualityDialogClose();
        });
      } else {
        updateGroupList(this.params).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "修改组信息成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.QualityDialogClose();
        });
      }
    },
    handleChange(value) {
      this.deviceId = value;
    },
    QualityDialogClose() {
      this.$emit("QualityDialogClosed", false);
      this.selectArr=[]
    },
    searchRole() {
      // console.log("submit!");
    },
  },
  mounted() {
    this.onload();
    this.handelSelect();
    getDicList("sys_car_type").then((res) => {
      this.options_carType = res.data;
    });
    let params = {
      pageNum: 1,
      pageSize: 100,
    };
    getTerminalList(params).then((res) => {
      this.options_terminalType = res.data.list;
    });
  },
};
</script>

<style scoped>
.left {
  text-align: left;
}
.el-transfer-panel {
  width: 37% !important;
}
.el-transfer {
  text-align: left;
}
</style>
