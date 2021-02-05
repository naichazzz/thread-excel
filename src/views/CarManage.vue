<template>
<div>
  <div class="pageMain">
    <div class="titleLine">
      <el-divider direction="vertical"></el-divider>
      <span>车辆信息</span>
    </div>
    <el-form label-position="right" :model="query" label-width="7em" size="small">
      <el-col :span="6">
        <el-form-item label="车牌号">
          <el-input
            v-model="query.numberPlate"
            placeholder="请输入内容"
            :clearable='true'
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="车牌颜色">
          <el-select
            v-model="query.plateColor"
            placeholder="请选择"
            :clearable='true'
          >
            <el-option
              v-for="item in options_color"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictLabel"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="厂牌类型">
          <el-select v-model="query.brandType" placeholder="请选择">
            <el-option
              v-for="item in options_company"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictLabel"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="text-align:left;padding-left:2.8em;">
        <el-button
            type="primary"
            size="small"
            @click="showMore1"
            v-if="flag_per.indexOf('查询') > -1"
            >{{more.more1==0?'更多选项':'收起选项'}}<i :class="more.more1==0?'el-icon-arrow-down el-icon--right':'el-icon-arrow-up el-icon--right'"></i></el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="onload"
            v-if="flag_per.indexOf('查询') > -1"
            icon="el-icon-search"
            >查询</el-button
          >
      </el-col>
      <el-col :span="6" v-show="more.more1==1">
        <el-form-item label="启用状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option
              v-for="item in options_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-show="more.more1==1">
        <el-form-item label="司机姓名">
          <el-input
            v-model="query.driverName"
            placeholder="请输入内容"
            :clearable='true'
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-show="more.more1==1">
        <el-form-item label="公司名称">
          <el-input
            v-model="query.ownerCompany"
            placeholder="请输入内容"
            :clearable='true'
          ></el-input>
        </el-form-item>
      </el-col>
      <div style="clear: both"></div>
      <el-col :span="6" v-show="more.more1==1">
        <el-form-item label="车辆类型">
          <el-select v-model="query.type" placeholder="请选择" :clearable='true'>
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
      <div style="clear: both"></div>
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>终端信息</span>
      </div>
      <el-col :span="6">
        <el-form-item label="终端号码">
          <el-input
            v-model="query.terminalNumber"
            placeholder="请输入内容"
            :clearable='true'
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="终端类型">
          <el-select
            v-model="query.terminalType"
            placeholder="请选择"
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
      </el-col>
      <el-col :span="6">
        <el-form-item label="通讯类型">
          <el-select
            v-model="query.communicationType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options_communiType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="text-align:left;padding-left:2.8em;">
        <el-button
            type="primary"
            size="small"
            @click="showMore2"
            v-if="flag_per.indexOf('查询') > -1"
            >{{more.more2==0?'更多选项':'收起选项'}}<i :class="more.more2==0?'el-icon-arrow-down el-icon--right':'el-icon-arrow-up el-icon--right'"></i></el-button
          >
      </el-col>
      <el-col :span="6" v-show="more.more2==1">
        <el-form-item label="SIM卡号">
          <el-input
            v-model="query.simNumber"
            placeholder="请输入内容"
            :clearable='true'
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-show="more.more2==1">
        <el-form-item label="身份识别卡">
          <el-select
            v-model="query.idCardState"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options_personID"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-show="more.more2==1">
        <el-form-item label="协议类型">
          <el-select
            v-model="query.protocolType"
            placeholder="请选择"
            :clearable='true'
          >
            <el-option
              v-for="item in options_agreement"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictLabel"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      
      <div style="clear: both"></div>
    </el-form>
  </div>
  <div class="fengeLine" style="margin-top:20px"></div>
  <div class="pageMain">
    <div class="titleLine">
      <el-divider direction="vertical"></el-divider>
      <span>车辆信息列表</span>
    </div>
    <div class="buttonBox">
      <el-button
        type="primary"
        @click="handleClick('add')"
        v-if="flag_per.indexOf('新建') > -1"
        icon="el-icon-plus"
        size="small"
        >新建</el-button
      >
      <el-button
        @click="dialogVisible_upload = true"
        type="primary"
        plain
        size="small" 
        icon="el-icon-upload2"
        >导入</el-button
      >
      <el-button
        type="primary"
        plain
        size="small"
        v-if="flag_per.indexOf('导出') > -1"
        icon="el-icon-download"
        @click="exportCarList"
        >导出</el-button
      >
    </div>
    <div class="tableBox">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :default-sort="{ prop: 'date', order: 'descending' }"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{color:'#606266'}"
        v-loading="loading"
        max-height="450"
        stripe
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column label="车牌号" width="120" prop="numberPlate" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="plateColor" label="车牌颜色" width="120">
        </el-table-column>
        <el-table-column prop="status" label="启用状态" width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '可用' ? 'primary' : 'danger'"
              disable-transitions
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="terminalNumber" label="终端号码" width="120">
        </el-table-column>
        <el-table-column prop="simNumber" label="SIM卡号" width="120">
        </el-table-column>
        <el-table-column prop="type" label="车辆类型" width="120">
        </el-table-column>
        <!-- <el-table-column prop="address" label="自定义车辆类型" width="120">
        </el-table-column> -->
        <el-table-column prop="brandType" label="厂牌类型" width="120">
        </el-table-column>
        <el-table-column prop="vehicleColor" label="车身颜色" width="120">
        </el-table-column>
        <el-table-column prop="ownerCompany" label="公司名称" width="120">
        </el-table-column>
        <el-table-column prop="ownerPhone" label="车主电话" width="120">
        </el-table-column>
        <el-table-column prop="driverNames" label="司机名称" width="120">
        </el-table-column>
        <el-table-column prop="driverPhones" label="司机电话" width="120">
        </el-table-column>
        <el-table-column prop="idCardState" label="证件号码" width="120">
        </el-table-column>
        <el-table-column prop="terminalType" label="终端类型" width="120">
        </el-table-column>
        <el-table-column prop="communicationType" label="通讯类型" width="120">
        </el-table-column>
        <el-table-column prop="idCardState" label="身份识别卡" width="120">
        </el-table-column>
        <el-table-column prop="protocolType" label="协议类型" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              @click="viewUser(scope.row.id)"
              icon="el-icon-view"
              >查看所属用户</el-button
            >
            <el-button
              type="danger"
              size="small"
              plain
              @click="handleClick('edit', scope.row)"
              v-if="flag_per.indexOf('修改') > -1"
              icon="el-icon-edit"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination-box"
    >
    </el-pagination>
    <!-- 弹出框 -->
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      @QualityDialogFlagC="QualityDialogFlagClose"
      :rowInfo="rowInfo"
      :isDialogDis="isDialogDis"
    ></Dialog>

    <el-dialog
      title="查看所属用户信息"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-table
        :data="userTableData"
        style="width: 100%;margin-top:-10px"
        :header-cell-style="{color: '#606266' }"
        stripe
        v-loading="loading"
        max-height="450"
      >
        <el-table-column label="用户ID" prop="id"> </el-table-column>
        <el-table-column prop="userName" label="用户名"> </el-table-column>
        <el-table-column prop="remark" label="用户描述"> </el-table-column>
        <el-table-column prop="nickName" label="全名"> </el-table-column>
        <el-table-column prop="phoneNumber" label="电话"> </el-table-column>
        <el-table-column prop="email" label="电子邮箱"> </el-table-column>
      </el-table>
      <el-pagination
        @size-change="userSizeChange"
        @current-change="userCurrentChange"
        :current-page="userTableQuery.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="userTableQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
        class="pagination-box"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        > -->
      </span>
    </el-dialog>
    <el-dialog
      title="批量上传车辆信息"
      :visible.sync="dialogVisible_upload"
      width="40%"
    >
    <div class="buttonBox">
      <el-button
        type="primary"
        plain
        size="small"
        icon="el-icon-download"
        @click="exportCartemplate"
        >下载模板</el-button
      >
      <el-upload
        class="upload-demo"
        action="http://47.94.166.147:9100/dev/api/v1/business-admin/vehicle/importVehicle/"
        :show-file-list='false'
        multiple
        :headers='header'
        name='excelFile'
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success='uploadFile_success'
        :on-error='uploadFile_error'>
        <el-button type="primary"
        plain
        size="small" icon="el-icon-upload2">批量导入</el-button>
        
      </el-upload>
      <div slot="tip" class="el-upload__tip">只能导入模板格式的excel文件</div>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import "@/assets/css/common.css";
import {
  getList,
  deleteList,
  getDicList,
  vehicleOwnerList,
  exportData,
  exportTemplate
} from "@/api/system/carManage.js";
import { getTerminalList } from "@/api/system/terminalType.js";
import Dialog from "@/components/car/dialog.vue";
import fileDownload from "js-file-download";
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        groupId: this.$store.state.user.groupId,
        communicationType: "",
        numberPlate: "",
        plateColor: "黄",
        brandType: "",
        status: "",
        driverName: "",
        ownerCompany: "",
        type: "",
        terminalNumber: "",
        terminalType: "",
        simNumber: "",
        idCardState: "",
        protocolType: "",
      },
      rowInfo: {},
      dialogVisible: false,
      type: "",
      isDialogDis: false,
      ownerCompany: "",
      plateColor: "",
      activeName: "first",
      numberPlate: "",
      color: "",
      status: "",
      chassisNumber: "",
      driverName: "",
      carType: "",
      defaultType: "",
      terminalNo: "",
      terminalType: "",
      communiType: "",
      simNumber: "",
      idCardState: "",
      protocolType: "",
      options_agreement: [],
      options_personID: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "有",
          label: "有",
        },
        {
          value: "无",
          label: "无",
        },
      ],
      options_communiType: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "TCP",
          label: "TCP",
        },
        {
          value: "UDP",
          label: "UDP",
        },
      ],
      options_terminalType: [],
      options_color: [],
      options_company: [],
      options_status: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "已用",
          value: "已用",
        },
        {
          label: "可用",
          value: "可用",
        },
      ],
      options_carType: [],
      tableData: [],
      multipleSelection: [],
      QualityDialogFlag: false,
      currentPage: 4,
      flag_per: [],
      loading: false,
      userTableData: [],
      userTableQuery: {
        pageSize: 10,
        pageNum: 1,
        vehicleId: "",
      },
      userTotal: 0,
      fileList: [],
      header:{
        ContentType:'multipart/form-data; boundary=<calculated when request is sent>',
        Authorization:'Bearer ' + getToken()
      },
      more:{
        more1:0,
        more2:0
      },
      dialogVisible_upload:false
    };
  },
  components: {
    Dialog,
  },
  created() {
    this.checkPro(["基本信息管理", "车辆管理", "查询"]);
    this.checkPro(["基本信息管理", "车辆管理", "新建"]);
    this.checkPro(["基本信息管理", "车辆管理", "修改"]);
    this.checkPro(["基本信息管理", "车辆管理", "查看"]);
    this.checkPro(["基本信息管理", "车辆管理", "导入"]);
    this.checkPro(["基本信息管理", "车辆管理", "导出"]);
    this.checkPro(["基本信息管理", "车辆管理", "删除"]);
  },
  methods: {
    checkPro(data) {
      this.checkPromis(data).then((res) => {
        if (res) {
          this.flag_per.push(data[2]);
        }
      });
    },
    onload() {
      // console.log(this.query);
      this.loading = true;
      getList(this.query).then((res) => {
        this.loading = false;
        this.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // uploadFile_success(res){
    //   console.log(res)
    //   this.fileList=[]
    // },
    uploadFile_error(res){
      console.log(res)
      this.fileList=[]
    },
    exportCarList(){
      var that=this
      that.$confirm('是否确认导出车辆数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          exportData(that.query).then(res=>{
            console.log(res)
            fileDownload(res,'车辆信息表导出'+that.localTime()+'.xlsx'); 
          })
        })
    },
    reset() {
      this.query = {
        pageNum: 1,
        pageSize: 10,
        groupId: this.$store.state.user.groupId,
        communicationType: "",
        numberPlate: "",
        plateColor: "黄",
        brandType: "",
        status: "",
        driverName: "",
        ownerCompany: "",
        type: "",
        terminalNumber: "",
        terminalType: "",
        simNumber: "",
        idCardState: "",
        protocolType: "",
      };

      this.onload();
    },
    showMore1(){
      if(this.more.more1==0){
        this.$set(this.more,'more1',1)
      }
      else{
        this.$set(this.more,'more1',0)
      }
    },
    showMore2(){
      if(this.more.more2==0){
        this.$set(this.more,'more2',1)
      }
      else{
        this.$set(this.more,'more2',0)
      }
    },
    getDic() {
      let params = {
        pageNum: 1,
        pageSize: 100,
      };
      getDicList("sys_number_color").then((res) => {
        this.options_color = res.data;
      });
      getDicList("sys_car_type").then((res) => {
        this.options_carType = res.data;
      });
      getDicList("sys_company_type").then((res) => {
        this.options_company = res.data;
      });
      getDicList("sys_agreement_type").then((res) => {
        this.options_agreement = res.data;
      });
      getTerminalList(params).then((res) => {
        console.log(res.data.list)
        this.options_terminalType = res.data.list;
      });
    },
    QualityDialogFlagClose(msg) {
      this.QualityDialogFlag = msg;
      this.onload();
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    viewUser(id) {
      this.userTableQuery.vehicleId = id;
      this.dialogVisible = true;
      vehicleOwnerList(this.userTableQuery).then((res) => {
        this.userTableData = res.data.list;
        this.userTotal = res.data.total;
      });
    },
    handleClick(status, row) {
      this.QualityDialogFlag = true;
      status != "add" ? (this.rowInfo = row) : (this.rowInfo = null);
      if (status == "examin") {
        this.isDialogDis = true;
      } else {
        this.isDialogDis = false;
      }
    },
    deleteItem() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "您还未选择数据",
        });
        return;
      } else {
        this.$confirm("是否确认删除该条信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            let groupIds = _.map(this.multipleSelection, (item) => {
              return item.id;
            });

            let checkedGroupList = groupIds.toString();

            deleteList(checkedGroupList).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除车辆成功",
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
              this.onload();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    detail(row) {
      this.QualityDialogFlag = true;
      this.rowInfo = row;
    },
    handleSizeChange(val) {
      this.query.pageNum = 1;
      this.query.pageSize = val;
      this.onload();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.onload();
    },
    userSizeChange(val) {
      this.userTableQuery.pageNum = 1;
      this.userTableQuery.pageSize = val;
      this.viewUser(this.userTableQuery.vehicleId);
    },
    userCurrentChange(val) {
      this.userTableQuery.pageNum = val;
      this.viewUser(this.userTableQuery.vehicleId);
    },
    // 导出模板
    exportCartemplate(){
      exportTemplate().then(res=>{
        fileDownload(res,'车辆导入模板.xlsx');
      })
    },
    // 成功导入钩子函数
    uploadFile_success(res){
      if(res.code==200){
        this.$message({
                  type: "success",
                  message: res.data,
                });
        this.dialogVisible_upload=false
        this.fileList=[]
      }
    }
  },
  mounted() {
    this.getDic();
    this.onload();
    // console.log(this.$store.state.user.groupId);
  },
};
</script>

<style scoped>
.el-col-6 {
  height: 48px;
}
.el-dialog__footer {
  margin-top: 25px;
}
.upload-demo{margin: 0 10px;}
</style>
