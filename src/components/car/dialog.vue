<template>
  <div class="carDia">
    <el-dialog title="车辆维护" :visible.sync="visible" :close-on-click-modal="false" @close="QualityDialogClose" v-if="visible" width="70%">
      <el-tabs type="border-card" @tab-click="tabClick" v-model="tab">
        <el-tab-pane :label="titleGroup.tab1" name="first">
          <el-form :model="form" :rules="rules" size="mini" class="left" style="max-height: 400px; overflow-y: scroll"
            ref="form" :disabled="isDialogDis">
            <el-form-item label="车牌号" :label-width="formLabelWidth" prop="numberPlate">
              <el-input v-model="form.numberPlate" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="车牌颜色" :label-width="formLabelWidth" prop="plateColor">
              <el-select v-model="form.plateColor" placeholder="请选择" size="mini">
                <el-option v-for="item in options_color" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="VIN" :label-width="formLabelWidth" prop="chassisNumber">
              <el-input v-model="form.chassisNumber" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="车辆类型" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in options_carType" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            
            <!-- <el-form-item label="自定义车牌类型" :label-width="formLabelWidth">
                <el-input v-model="form.type2" autocomplete="off" size="mini" class="inputBox2"></el-input>
              </el-form-item> -->
            <el-form-item label="发动机号" :label-width="formLabelWidth">
              <el-input v-model="form.engineNumber" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            
            <el-form-item label="厂牌类型" :label-width="formLabelWidth">
              <el-select v-model="form.brandType" placeholder="请选择">
                <el-option v-for="item in options2" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车身颜色" :label-width="formLabelWidth">
              <el-select v-model="form.vehicleColor" placeholder="请选择">
                <el-option v-for="item in options3" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行业编码" :label-width="formLabelWidth">
              <el-select v-model="form.industryCode" placeholder="请选择">
                <el-option v-for="item in options4" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="引擎类型" :label-width="formLabelWidth">
              <el-select v-model="form.engineType" placeholder="请选择">
                <el-option v-for="item in options5" :key="item.dictLabel" :label="item.dictLabel"
                  :value="item.dictLabel">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车籍地" :label-width="formLabelWidth">
              <el-cascader :options="optionsThree" v-model="selectedThree" placeholder="省市区三级联动" @change="handleChange"
                ref="three"></el-cascader>
            </el-form-item>
            <el-form-item label="车籍编码" :label-width="formLabelWidth">
              <el-input v-model="form.vehicleCode" autocomplete="off" size="mini" class="inputBox2" disabled></el-input>
            </el-form-item>
            <el-divider content-position="left">车主信息</el-divider>
            <el-form-item label="公司名称" :label-width="formLabelWidth">
              <el-input v-model="form.ownerCompany" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="车主姓名" :label-width="formLabelWidth">
              <el-input v-model="form.ownerName" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="车主电话" :label-width="formLabelWidth">
              <el-input v-model="form.ownerPhone" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="许可证号" :label-width="formLabelWidth">
              <el-input v-model="form.ownerPermitNumber" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="titleGroup.tab2" name="second" disabled>
          <el-row>
            <el-col :span="20">
              <el-input placeholder="请输入内容" v-model="searchDriver" class="input-with-select" size="small">
                <el-select v-model="selectType" slot="prepend" placeholder="请选择" style="width: 100px;">
                  <el-option label="按姓名" value="1"></el-option>
                  <el-option label="按电话" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button size="small" type="primary">添加司机</el-button>
            </el-col>
          </el-row>
          <!-- <Transfer :tableNow="driverTitle"></Transfer> -->
        </el-tab-pane>
        <!-- <el-tab-pane :label="titleGroup.tab3" name="third">
          
        </el-tab-pane> -->
        <el-tab-pane :label="titleGroup.tab4" name="fourth">
          <el-row :gutter="20">
            <el-col :span="12">
              <div>
                <el-input placeholder="请输入内容" v-model="groupName" class="input-with-select" size="small">
                  <el-select v-model="query.groupName" slot="prepend" placeholder="请选择" style="width:100px">
                    <el-option label="按组名" value="1"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="getGroupList"></el-button>
                </el-input>
                <el-table :data="tableDataTree" style="width: 100%" ref="multipleTables" tooltip-effect="dark" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange" row-key="id" :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }" default-expand-all max-height="300px" @select="select">
                <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column prop="groupName" label="组名"></el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-input placeholder="请输入内容" v-model="searchTerminalType" class="input-with-select" size="small" clearable>
                  <el-select v-model="selectTerminalType" slot="prepend" placeholder="请选择" style="width: 100px;">
                    <el-option label="终端号码" value="1"></el-option>
                    <el-option label="SIM卡号" value="2"></el-option>
                    <!-- <el-option label="终端类型" value="3"></el-option> -->
                    <el-option label="通讯类型" value="4"></el-option>
                    <el-option label="通讯协议" value="5"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="searchTerminalList"></el-button>
                </el-input>
                <el-table :data="tableData" v-loading="loading2" style="width: 100%;" ref="multipleTable"  tooltip-effect="dark" max-height="300px">
                  <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
                  <el-table-column prop="id" label="终端号码" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="simNumber" label="SIM卡号" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="typeName" label="终端类型">
                  </el-table-column>
                  <el-table-column prop="communicationType" label="通讯类型">
                  </el-table-column>
                  <el-table-column prop="protocol" label="通讯协议">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" v-if="form.terminalNumber==scope.row.id" @click="unbundling(scope.row)" :disabled="isDialogDis">解绑</el-button>
                      <el-button type="primary" size="small" @click="bindClick(scope.row)" v-else  :disabled="isDialogDis">绑定</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :current-page="query.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="query.pageSize" :pager-count='pagerCount'
                  layout="total, sizes, prev, pager, next" :total="total" class="pagination-box" style="width:100%">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
          
          
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="QualityDialogClose">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看车辆 -->
    <el-dialog title="所属用户信息" :visible.sync="visible_car" :close-on-click-modal="false" @close="QualityDialogClose">
      <el-table :data="tableData2" style="width: 100%" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
        <el-table-column prop="" label="用户ID" width="120"> </el-table-column>
        <el-table-column prop="" label="用户名" width="120"> </el-table-column>
        <el-table-column prop="" label="用户描述"> </el-table-column>
        <el-table-column prop="" label="全名"> </el-table-column>
        <el-table-column prop="" label="电话"> </el-table-column>
        <el-table-column prop="" label="电子邮件"> </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000" style="margin-top: 10px">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import Transfer from "@/components/transfer.vue";
import "@/assets/css/dialogstyle.css";
import { regionData } from "element-china-area-data";
import { getlist } from "@/api/system/carManage.js";
import {
  addList,
  editList,
  getDicList,
  setGroups,
} from "@/api/system/carManage.js";
import { grouplist } from "@/api/system/group";
export default {
  data() {
    return {
      loading: true,
      currentRow: null,
      disabled: false,
      query: {
        pageNum: 1,
        pageSize: 10,
        groupName: "1",
        groupId: this.$store.state.user.groupId,
      },
      total: 0,
      visible: false,
      visible_car: false,
      formLabelWidth: "100px",
      options_color: [],
      options_carType: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      form: {
        numberPlate: "",
        plateColor: "",
        type: "",
        // type2:'',
        brandType: "",
        engineType: "",
        engineNumber: "",
        chassisNumber: "",
        vehicleColor: "其他",
        industryCode: "",
        // comment:'',
        // typeCar:'',

        // product:'',
        // productCode:'',
        // engine:'',
        ownerCompany: "",
        ownerName: "",
        ownerPhone: "",
        ownerPermitNumber: "",
        terminalNumber: "",
        vehicleProvince: "",
        vehicleArea: "",
        vehicleCode: "",
      },
      tableData: [],
      tableData2: [],
      tableDataTree: [],
      groupName: "",
      multipleSelection: [],
      tab: "first",
      optionsThree: regionData,
      selectedThree: [],
      searchDriver: "",
      searchTerminalType: "",
      selectType: "1",
      selectTerminalType: "1",
      rules: {
        numberPlate: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        chassisNumber: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        plateColor: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
      driverTitle: [
        {
          title: "司机姓名",
          value: "name",
        },
        {
          title: "电话",
          value: "ownerPhone",
        },
        {
          title: "身份证号",
          value: "ownerPermitNumber",
        },
      ],
      zhongduanTitle: [
        {
          title: "终端号码",
          value: "name",
        },
        {
          title: "SIM卡号",
          value: "ownerPhone",
        },
        {
          title: "终端类型",
          value: "ownerPermitNumber",
        },
      ],
      titleGroup:{
        tab1:'添加车辆信息',
        tab2:'添加司机',
        tab3:'添加终端',
        tab4:'添加所属组'
      },
      loading2:true,
      pagerCount:5
    };
  },
  props: {
    QualityDialogFlag: {
      default: false,
    },
    rowInfo: {
      default: {
        terminalNumber:'',
        groupId:''
      },
    },
    isDialogDis: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    QualityDialogFlag(newVal) {
      this.visible = this.QualityDialogFlag;
      if(this.visible){
        this.getGroupList();
        this.getRow()
      }
      return newVal;
    },
    rowInfo(newVal) {
      
      return newVal;
    },
    isDialogDis(newVal) {
      return newVal;
    },
  },
  components: {
    Transfer,
  },
  methods: {
    getRow(){
      this.tab = "first";
      if (JSON.stringify(this.rowInfo) !== "null") {
        let { ...foa } = this.rowInfo;
                this.form=foa;
        this.query.groupId=this.form.groupId
        this.selectedThree[0] = this.form.vehicleProvince;
        this.selectedThree[1] = this.form.vehicleArea;
        this.selectedThree[2] = this.form.vehicleCode;
        this.titleGroup={
          tab1:'编辑车辆信息',
          tab2:'编辑司机',
          tab3:'编辑终端',
          tab4:'编辑所属组'
        }
      } else {
        this.form = {
          plateColor: "农黄",
          type: "普货",
          terminalNumber: "",
        };
        this.titleGroup={
          tab1:'添加车辆信息',
          tab2:'添加司机',
          tab3:'添加终端',
          tab4:'添加所属组'
        }
      }
      this.getTerminalList()
    },
    getDic() {
      getDicList("sys_number_color").then((res) => {
        this.options_color = res.data;
      });
      getDicList("sys_car_type").then((res) => {
        this.options_carType = res.data;
      });
      getDicList("sys_car_color").then((res) => {
        this.options3 = res.data;
      });
      getDicList("sys_company_type").then((res) => {
        this.options2 = res.data;
      });
      getDicList("sys_Industry_code").then((res) => {
        this.options4 = res.data;
      });
      getDicList("sys_engine_type").then((res) => {
        this.options5 = res.data;
      });
    },
    tabClick(tab, event) {
      this.tab = tab.name;
      this.query.pageNum = 1;
      this.query.pageSize = 10;
      if (tab.index == 2) {
        // this.loading = true;
        // this.getTerminalList();
      } else if (tab.index == 3) {
        // this.loading = true;
        // this.getGroupList();
      }
    },
    searchTerminalList(){
      this.query.pageNum=1
      this.getTerminalList()
    },
    getTerminalList() {
      // this.query.pageNum=1
      let params={
        pageSize: this.query.pageSize,
        pageNum: this.query.pageNum,
        groupId: this.query.groupId,
        id:'',
        simNumber:'',
        communicationType:''
      }
     if (this.selectTerminalType == "2") {
        params.simNumber = this.searchTerminalType;
      } else if (this.selectTerminalType == "3") {
        params.terminalType = this.searchTerminalType;
      }else  if (this.selectTerminalType == "1") {
        if (this.form.terminalNumber != ""&&this.form.terminalNumber != null) {
          params.id = this.form.terminalNumber;
          // params.status = "已用";
        }else if(this.rowInfo&&this.query.groupId==this.rowInfo.groupId){
          this.form.terminalNumber=this.rowInfo.terminalNumber
          params.id = this.form.terminalNumber;
        } 
        else {
          // params.status = "可用";
          params.id = this.searchTerminalType;
        }
      }
      else if(this.selectTerminalType == "4"){
        params.communicationType=this.searchTerminalType;
      }
      else if(this.selectTerminalType == "5"){
        params.protocol=this.searchTerminalType;
      }
      getlist(params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.loading2 = false;
      });
    },
    bindClick(row) {
      this.form.terminalNumber = row.id;
    },
    unbundling(row) {
      this.form.terminalNumber = "";
      this.rowInfo.terminalNumber=""
      this.getTerminalList()
    },
    getGroupList() {
      let params = {
        groupName: this.groupName,
      };
      grouplist(params).then((res) => {
        // console.log(res.data.groups);
        this.tableDataTree = res.data;
        // groupId: this.$store.state.user.groupId
        let row = null;
        if (this.rowInfo != null) {
         
          var that=this
          that.query.groupId=that.rowInfo.groupId
          that.findGroup(that.tableDataTree,that.rowInfo.groupId)
        } else {
         
          var that=this
          that.form.groupId=that.$store.state.user.groupId
          that.findGroup(that.tableDataTree,that.$store.state.user.groupId)
        }
      });
    },
    // 遍历查找默认组
    findGroup(group,id){
      var that=this
      setTimeout(function(){
        group.forEach(row => {
            if(row.id == id) {
              that.$refs.multipleTables.toggleRowSelection(row, true);
              that.loading = false;
            }
            else if(row.childList){
              that.findGroup(row.childList,id)
            }

          });
      },500)

    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
    select(selection, row){
      // this.selectedList =row;
      this.form.groupId=row.id
      this.$refs.multipleTables.clearSelection();
      if(selection.length == 0) return ;
      this.$refs.multipleTables.toggleRowSelection(row, true);
      // 终端联动
      this.query.groupId=row.id
      this.loading2=true
      this.form.terminalNumber=''
      this.searchTerminalList()
      
    },
    handleSizeChange(val) {
      this.query.pageNum = 1;
      this.query.pageSize = val;
      this.getTerminalList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTerminalList();
    },
    addInfo() {
      // let groupIds = [];
      // if (this.multipleSelection.length != 0) {
      //   groupIds = _.map(this.multipleSelection, (item) => {
      //     return item.id;
      //   });
      // }

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.rowInfo) != "null") {
            editList(this.form).then((res) => {
              // setGroups().then((res) => {});
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改车辆信息成功！",
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
            // this.form.groupId = this.$store.state.user.groupId;
            addList(this.form).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "新增车辆信息成功！",
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
        } else {
          return false;
        }
      });
    },
    QualityDialogClose() {
      this.visible = false;
      this.form = {
          plateColor: "农黄",
          type: "普货",
          terminalNumber: "",
        };
      this.tab = "first";
      this.query.groupId=this.$store.state.user.groupId,
      this.$emit("QualityDialogFlagC", false);
    },
    handleChange() {
      // console.log(this.selectedThree);
      this.form.vehicleProvince = this.selectedThree[0];
      this.form.vehicleArea = this.selectedThree[1];
      this.form.vehicleCode = this.selectedThree[2];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  mounted() {
    this.getDic();
    
  },
  created(){
    
  }
};
</script>

<style>
.carDia .inputBox2 {
  width: 100%;
  float: left;
}

.carDia .left {
  text-align: left;
}

.carDia .split {
  height: 50px;
}

.carDia .el-select .el-input {
  width: 90px;
}

.carDia .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.carDia .el-transfer-panel {
  width: 39% !important;
}
.carDia .el-select > .el-input {
  width: 100%;
}
.carDia .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
