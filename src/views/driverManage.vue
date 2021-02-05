<template>
  <div>
    <div class="pageMain">
      <el-form ref="form" label-width="8em"  size="small" style="text-align: left;margin-top: 20px;">
        <el-col :span="6">
          <el-form-item label="司机姓名">
            <el-input
              v-model="screenName"
              placeholder="请输入内容"
              :clearable='true'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input
              v-model="screenTel"
              placeholder="请输入内容"
              :clearable='true'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;">
          <el-button type="primary" size="small" @click="handleSearchClick" v-if="flag_per.indexOf('查询')>-1" icon="el-icon-search">
              查询
          </el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>司机信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button type="primary" size="small" @click="handleAddClick" v-if="flag_per.indexOf('新建')>-1" icon="el-icon-plus"> 
          新建
        </el-button>
        <el-button type="danger" size="small" @click="handleDeleteClick" v-if="flag_per.indexOf('删除')>-1" plain icon="el-icon-delete">
          删除
        </el-button>
        <el-button type="primary" size="small" @click="handleExportClick" v-if="flag_per.indexOf('导出')>-1" plain icon="el-icon-download">
          导出
        </el-button>
        
      </div>
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{color:'#606266'}"
          v-loading="loading"
          max-height="450"
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="司机姓名" width="120">
          </el-table-column>
          <el-table-column prop="groupName" label="所属组" width="120">
          </el-table-column>
          <el-table-column
            prop="licenseNumber"
            label="驾驶证编码"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="phoneNumber" label="电话"> </el-table-column>
          <el-table-column prop="address" label="住址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="idNumber" label="身份证号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="创建时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ utc2beijing(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleModifyClick(scope.row)" type="danger" size="small" plain v-if="flag_per.indexOf('修改')>-1"  icon="el-icon-edit">
                编辑
              </el-button>
              <!-- <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      >
      </el-pagination>
      <!-- 弹出框 -->
      <Dialog
        :QualityDialogFlag.sync="QualityDialogFlag"
        :addOrModify="addOrModify"
        @form-data="formBack"
        :nowData='currDriver'
      ></Dialog>  
    </div>
  </div>
</template>

<script>
import "@/assets/css/common.css";
import Dialog from "@/components/driver/dialog.vue";
import {
  addDriver,
  deleteDriver,
  modifyDriver,
  searchDriver,
  exportData
} from "@/api/system/driverManage";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      /** 筛选条件：姓名 */
      screenName: "",
      /** 筛选条件：电话 */
      screenTel: "",
      /** 每页显示条数 */
      pageSize: 10,
      /** 查询结果 */
      tableData: [

      ],
      multipleSelection: [],
      QualityDialogFlag: false,
      addOrModify: "add",
      currentPage: 1,
      total:0,
      currDriver:{
        name: "",
        phoneNumber: "",
        licenseNumber : "",
        idNumber: "",
        address: "",
        remark: "",
        groupId:this.$store.state.user.groupId
      },
      flag_per:[],
      // 遮罩层
      loading: true,
    };
  },
  components: {
    Dialog,
  },
  created() {
    
    let data={
      pageSize:this.pageSize,
      pageNum:this.currentPage
    }
    this.getList(data)
    this.checkPro(['基本信息管理','司机管理','查询'])
    this.checkPro(['基本信息管理','司机管理','新建'])
    this.checkPro(['基本信息管理','司机管理','修改'])
    this.checkPro(['基本信息管理','司机管理','导出'])
    this.checkPro(['基本信息管理','司机管理','删除'])
  },
  methods: {
    /**
     * 输出应答
     */
    verifyRespond(res,type) {
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: type+"司机信息成功",
          type: "success",
        });
        let data={
          pageSize:this.pageSize,
          pageNum:this.currentPage
        }
        this.getList(data)
      } else {
        this.$message({
          message: res.message,
          type: "failed",
        });
        let data={
          pageSize:this.pageSize,
          pageNum:this.currentPage
        }
        this.getList(data)
      }
    },
    /**
     * 增
     */
    handleAddClick() {
      this.QualityDialogFlag = true;
      this.addOrModify = "add";
      this.currDriver={
        name: "",
        phoneNumber: "",
        licenseNumber : "",
        idNumber: "",
        address: "",
        remark: "",
        groupId:this.$store.state.user.groupId
      }
    },
    formBack(formData, addOrModify) {
      console.log(addOrModify);
      console.log(formData)
      if (addOrModify === "add") {
        addDriver(formData).then((res) => {
          this.verifyRespond(res,'新增');
        });
      } else {
        formData.id=this.currDriver.id
        modifyDriver(formData).then((res) => {
          this.verifyRespond(res,'修改');
        });
      }
    },
    /**
     * 删
     */
    handleDeleteClick() {
      if(this.multipleSelection.length==0){
        this.$message({
          message: "请选择要删除的数据"
        });
        return
      }
      let idList = [];
      this.multipleSelection.forEach((element) => {
        idList.push(element.id);
      });
      console.log(this.multipleSelection)
      var that=this
      that.$confirm('是否确认删除所选信息?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function() {
              deleteDriver(idList).then((res) => {
                that.verifyRespond(res,'删除');
              });
            })
      
    },
    /**
     * 改
     */
    handleModifyClick(rows) {
      this.QualityDialogFlag = true;
      this.addOrModify = "modify";
      console.log(rows)
      this.currDriver=rows
    },
    // 取List
    getList(data){
      this.loading = true;
      searchDriver(data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.loading = false;
          this.tableData=res.data.list
          this.total=res.data.total
        }
      })
    },
    /**
     * 查
     */
    handleSearchClick() {
      let data={
        name:this.screenName,
        phoneNumber:this.screenTel,
        pageSize:this.pageSize,
        pageNum:this.currentPage
      }
      console.log(data)
      this.getList(data)
    },
    /**
     * 导出
     */
    handleExportClick() {
      let data={
        name:this.screenName,
        phoneNumber:this.screenTel
      }
      var that=this
      that.$confirm('是否确认导出司机数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          exportData(data).then(res=>{
            console.log(res)
            fileDownload(res,'司机信息表导出'+that.localTime()+'.xlsx'); 
          })
        })
    },
    /**
     * 每页显示条数改变
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      let data={
        pageSize:this.pageSize,
        pageNum:this.currentPage,
        name:this.screenName,
        phoneNumber:this.screenTel,
      }
      console.log(data)
      this.getList(data)
    },
    /**
     * 当前页改变
     */
    handleCurrentPageChange(currentPage) {
      let data={
        name:this.screenName,
        phoneNumber:this.screenTel,
        pageSize:this.pageSize,
        pageNum:currentPage
      }
      console.log(data)
      this.getList(data)
    },
  
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 查看权限
    checkPro(data){
      this.checkPromis(data).then(res=>{
        if(res){
          this.flag_per.push(data[2])
        }
      })
    }
  },
};
</script>

<style>
</style>
