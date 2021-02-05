<template>
  <div class="mapDialog">
    <el-dialog
      title="选择车辆"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="QualityDialogClose"
      fullscreen
      v-if="visible"
    >
      <el-form
        :model="formInline"
        class="demo-form-inline"
        size="small"
        label-width="6em"
        style="text-align: left"
      >
        <el-col :span="6">
          <el-form-item label="车牌号">
            <el-input
              v-model="formInline.numberPlate"
              placeholder=""
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SIM卡号">
            <el-input
              v-model="formInline.simNumber"
              placeholder=""
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="VIN码">
            <el-input
              v-model="formInline.chassisNumber"
              placeholder=""
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终端号码">
            <el-input
              v-model="formInline.terminalNumber"
              placeholder=""
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业名称">
            <treeselect
              v-model="formInline.groupId"
              :options="groupOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
              style="height: 28px !important"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终端类型">
            <el-select
              v-model="formInline.terminalType"
              placeholder="请选择"
              :clearable="true"
            >
              <el-option
                v-for="item in options_terminaType"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="在线状态">
            <el-select v-model="formInline.onlineStatus" placeholder="请选择">
              <el-option
                v-for="item in options_online"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆类型">
            <el-select
              v-model="formInline.type"
              placeholder="请选择"
              :clearable="true"
            >
              <el-option
                v-for="item in options_carType"
                :key="item.dictLabel"
                :label="item.dictLabel"
                :value="item.dictLabel"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right">
          <el-form-item label="">
            <el-button type="primary" @click="onSubmit" icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
      <el-divider content-position="left">车辆信息列表</el-divider>
      <div style="padding: 10px; text-align: left; overflow: hidden">
        <div style="float: left">
          <span>车辆总数：{{ total }}，当前已选择车辆数：{{ selectNum }}</span>
        </div>
      </div>
      <el-table
        data-cy="cho-data-table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select="select"
        stripe
        :header-cell-style="{ color: '#606266' }"
        max-height="430"
        v-loading="loading"
        @select-all="selectAll"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="numberPlate" label="车牌号"> </el-table-column>
        <el-table-column prop="simNumber" label="SIM卡号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="chassisNumber" label="VIN" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="groupName" label="企业名称"> </el-table-column>
        <el-table-column prop="terminalType" label="终端类型">
        </el-table-column>
        <el-table-column
          prop="terminalNumber"
          label="终端号码"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="onlineStatus" label="在线状态">
        </el-table-column>
        <el-table-column prop="type" label="车辆类型"> </el-table-column>
        <el-table-column prop="communicationType" label="通讯类型">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400, 500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button data-cy="cho-cancel-button" @click="QualityDialogClose"
          >取 消</el-button
        >
        <el-button data-cy="cho-commit-button" type="primary" @click="chooseCar"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import "@/assets/css/common.css";
import {
  searchlist,
  carTypelist,
  carCompanylist,
} from "@/api/system/map/searchList.js";
import * as terminalType from "@/api/system/terminalType.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  // components: { IconSelect },
  data() {
    return {
      visible: false,
      formInline: {
        onlineStatus: "全部",
      },
      options: [],
      tableData: [],
      currentPage: 1,
      form2: {
        timer: "",
        region: "",
      },
      selectNum: 0,
      pageSize: 500,
      pageNum: 1,
      total: 0,
      options_online: [],
      selectColumn: [],
      options_terminaType: [],
      chooseAll: 0,
      cancelAll: 0,
      options_carType: [],
      groupOptions: [],
      loading: false,
    };
  },
  props: {
    QualityDialogFlag: {
      default: false,
    },
    type: {
      default: 0,
    },
    isPlayback: {
      default: "",
    },
    isTachograph: {
      default: "0",
    },
  },
  components: {
    Treeselect,
  },
  created() {},
  methods: {
    // 选择车辆确定按钮
    chooseCar() {
      var idList = [];
      var deviceIdList = [];
      var selectItemList = [];
      if (this.chooseAll == 1 || this.cancelAll == 1) {
        idList = [];
      } else {
        if (this.selectColumn == [] || this.selectColumn.length == 0) {
          this.$message({
            message: "请选择车辆",
          });
          return;
        }
        // console.log(this.selectColumn)
        this.selectColumn.forEach(function (item) {
          idList.push(item.vehicleId);
          deviceIdList.push(item.deviceId);
          selectItemList.push(item);
        });
      }
      console.log(selectItemList);
     
      this.$store.commit("selectedCarInfo", selectItemList);

      this.$emit("child-event", idList, deviceIdList);
      this.$emit("select-item-list", selectItemList);

      this.QualityDialogClose();
    },
    getCartype() {
      carTypelist().then((res) => {
        this.options_carType = res.data;
      });
    },
    getCompanyList() {
      let data = {
        groupName: "",
      };
      carCompanylist(data).then((res) => {
        // console.log(res);
        this.groupOptions = res.data;
      });
    },
    getList(data) {
      this.loading = true;
      searchlist(data).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          if (res.data == null) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.total;
            // this.options_carType=res.data.expandInfo.typeOptions
            // this.groupOptions=res.data.expandInfo.groupNameOptions
          }
        } else {
          this.$message({
            message: res.message,
            type: "",
          });
        }
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.childList && !node.childList.length) {
        delete node.childList;
      }
      return {
        id: node.id,
        label: node.groupName,
        children: node.childList,
      };
    },
    QualityDialogClose() {
      this.$emit("update:QualityDialogFlag", false);
      this.formInline = {};
    },
    onSubmit() {
      let data = this.formInline;
      data.pageSize = this.pageSize;
      data.pageNum = this.pageNum;
      // console.log(data);
      this.getList(data);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      let data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      this.pageSize = val;
      this.getList(data);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let data = {
        pageSize: this.pageSize,
        pageNum: val,
      };
      this.getList(data);
    },
    handleSelectionChange(val) {
      // console.log(val);
      if (this.isPlayback == "") {
        this.selectNum = val.length;
        this.selectColumn = val;
      } else {
        this.selectColumn = [];
        this.selectNum = 1;
        this.selectColumn.push(val.pop());
      }
    },
    selectAll() {
      if (this.isTachograph == "1") {
        this.$message({
          message: "只能选择一辆车",
        });
        this.$refs.multipleTable.clearSelection();
      }
    },
    select(selection, row) {
      this.chooseAll = 0;
      this.cancelAll = 0;
      if (this.isPlayback != "") {
        this.$refs.multipleTable.clearSelection();
        if (selection.length == 0) return;
        this.$refs.multipleTable.toggleRowSelection(row, true);
      }
      this.formInline = {};
    },
    // 在线状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.options_online, row.onlineStatus);
    },
    // 取终端类型
    terminalType() {
      let data = {
        pageNum: 1,
        pageSize: 10000000,
      };
      terminalType.getList(data).then((res) => {
        // console.log(res);
        this.options_terminaType = res.data.list;
      });
    },
    // 全部选择
    chooseAlldata() {
      this.$refs.multipleTable.toggleAllSelection();
      this.chooseAll = 1;
      this.cancelAll = 0;
    },
    // 全部取消
    cancelAlldata() {
      this.$refs.multipleTable.clearSelection();
      this.chooseAll = 0;
      this.cancelAll = 1;
    },
  },
  watch: {
    QualityDialogFlag() {
      this.visible = this.QualityDialogFlag;
      if (this.visible) {
        let data = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        };
        this.getList(data);
        this.terminalType();
        this.getCartype();
        this.getCompanyList();
        this.getDicts("sys_online_status").then((response) => {
          // console.log(response);
          this.options_online = response.data;
        });
      }
    },
    isPlayback(newVal) {
      return newVal;
    },
  },
  mounted() {},
};
</script>

<style>
.mapDialog .dialog-footer {
  margin-top: 40px;
}
.mapDialog .el-table th > .cell .el-checkbox:last-of-type {
  display: inline-block !important;
}
</style>
