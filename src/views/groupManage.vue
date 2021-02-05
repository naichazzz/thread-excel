<template>
  <div class="groupManage">
    <div class="pageMain">
      <el-form label-position="right" :model="query" label-width="5em" style="margin-top:20px" @submit.native.prevent>
        <el-col :span="6">
          <el-form-item label="组搜索">
            <el-input
              data-cy="gro-search-groupName-input"
              v-model="groupName"
              placeholder="请输入内容"
              size="small"
              :clearable='true'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;padding-top:5px">
          <el-button data-cy="gro-search-button" type="primary" size="small" icon="el-icon-search" @click="onload" v-if="flag_per.indexOf('查询')>-1">查询</el-button>
        </el-col>
        <div style="clear:both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>组信息列表</span>
      </div>
       <div class="buttonBox">
        <el-button data-cy="gro-create-button" type="primary" size="small"  icon="el-icon-plus" @click="addGroup" v-if="flag_per.indexOf('新建')>-1">新建</el-button>
        <el-button size="small" icon="el-icon-delete" type="danger" plain @click="deleteItem" v-if="flag_per.indexOf('删除')>-1">删除</el-button>
        <el-button type="primary" plain size="small" v-if="flag_per.indexOf('导出') > -1" icon="el-icon-download" @click="exportGroup">导出</el-button>
        <el-button type="info" plain size="small" icon="el-icon-paperclip">批量增加组与车辆关系</el-button>
        <el-button type="info" plain size="small" icon="el-icon-paperclip">批量删除组与车辆关系</el-button>
      </div>
      <el-table
        data-cy=gro-data-table
        :data="tableData"
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        row-key="id"
        :header-cell-style="{ color: '#606266' }"
        :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
        stripe
        max-height="450"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="groupName" label="组名称"></el-table-column>

        <el-table-column prop="remark" label="描述"></el-table-column>

        <el-table-column fixed="right" label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="primary"
              plain
              size="small"  icon="el-icon-view" @click="carInfo(scope.row)"
            v-if="flag_per.indexOf('查看车辆')>-1"
              >查看车辆</el-button
            >
            <el-button  type="danger"
              size="small"
              plain icon="el-icon-edit" @click="handleClick(scope.row)"
            v-if="flag_per.indexOf('修改')>-1"
              >编辑</el-button
            >
            
            <!-- <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出框 -->
      <Dialog
        :QualityDialogFlag.sync="QualityDialogFlag"
        @QualityDialogClosed="QualityDialog"
        :rowInfo="rowInfo"
      ></Dialog>
    </div>
    
      
     
    <el-dialog title="查看组内车辆" :visible.sync="dialogVisible" width="80%" class="groupSeeCar">
      <el-table :data="carData"  :header-cell-style="{color: '#606266' }" stripe v-loading='loading_dialog'>
        <el-table-column label="车牌号"  prop="numberPlate" sortable>
        </el-table-column>
        <el-table-column prop="plateColor" label="车牌颜色">
        </el-table-column>
        <el-table-column prop="address" label="企业名称">
        </el-table-column>
      
        <el-table-column prop="type" label="车辆类型">
        </el-table-column>
    
        <el-table-column prop="ownerCompany" label="终端类型" >
        </el-table-column>
       
        <el-table-column prop="address" label="终端号码" >
        </el-table-column>
        <el-table-column prop="ownerCompany" label="SIM卡号">
        </el-table-column>
      </el-table>
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
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import Dialog from "@/components/group/dialog.vue";
import { grouplist, deleteGroupList,exportData,getCarList} from "@/api/system/group";
import { getList } from "@/api/system/carManage.js";
import "@/assets/css/common.css";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        groupId: "",
      },
      boxHeight: "",
      groupName: "",
      tableData: [],
      QualityDialogFlag: false,
      multipleSelection: [],
      dialogVisible: false,
      carData: [],
      loading: true,
      rowInfo: {},
      flag_per: [],
      loading_dialog:false
    };
  },
  mounted() {
    // var fullHeight=document.documentElement.clientHeight
    // this.boxHeight=fullHeight-130

    this.onload();
  },
  components: {
    Dialog,
  },
  created() {
    this.checkPro(["系统管理", "组管理", "查询"]);
    this.checkPro(["系统管理", "组管理", "新建"]);
    this.checkPro(["系统管理", "组管理", "修改"]);
    this.checkPro(["系统管理", "组管理", "查看车辆"]);
    this.checkPro(["系统管理", "组管理", "导出"]);
    this.checkPro(["系统管理", "组管理", "删除"]);
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
      let params = {
        groupName: this.groupName,
      };
      grouplist(params).then((res) => {
        // console.log(res.data.groups);
        this.tableData = res.data;
        this.loading = false;
      });
    },
    exportGroup(){
      let data = {
        groupName: this.groupName,
      };
      var that=this
      that.$confirm('是否确认导出组数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          exportData(data).then(res=>{
            console.log(res)
            fileDownload(res,'组信息表导出'+that.localTime()+'.xlsx'); 
          })
        })
    },
    deleteItem() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "您还未选择数据",
        });
        return;
      } else {
        this.$confirm("是否确认删除该组?", "提示", {
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

            deleteGroupList(checkedGroupList).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除组信息成功！",
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
    addGroup() {
      this.QualityDialogFlag = true;
      this.rowInfo = {
        groupName: "",
        parentGroupId: "",
        groupCode: "",
        remark: "",
      };
    },
    carInfo(row) {
      this.loading_dialog=true
      console.log(row);
      this.query.groupId = row.id;
      this.dialogVisible = true;
      getCarList(this.query).then((res) => {
        this.loading_dialog=false
        this.total = res.data.total;
        this.carData = res.data.list;
      });
    },
    handleSizeChange(val) {
      this.query.pageNum = 1;
      this.query.pageSize = val;
      this.onload();
      getList(this.query).then((res) => {
        this.total = res.data.total;
        this.carData = res.data.list;
      });
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.onload();
      getList(this.query).then((res) => {
        // console.log(res);
        this.total = res.data.total;
        this.carData = res.data.list;
      });
    },
    handleClick(row) {
      this.QualityDialogFlag = true;
      this.rowInfo = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    QualityDialog(msg) {
      this.QualityDialogFlag = false;
      this.onload();
    },
  },
};
</script>

<style>
.groupManage .toolBox {
  display: flex;
}
.groupManage .inputBox {
  width: auto;
  margin-top: 4px;
}
.groupManage .el-dialog__body{overflow: hidden;}
</style>
