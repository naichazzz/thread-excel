<template>
  <div>
    <div class="pageMain">
        <el-form
          label-position="right"
          :model="query"
          label-width="8em"
          style="margin-top: 20px"
          size="small"
        >
          <el-col :span="6">
            <el-form-item label="终端名称">
              <el-input
                data-cy="typ-search-name-input"
                v-model="query.name"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备制造商省ID">
              <el-input
                data-cy="typ-search-manufacturerProvinceId-input"
                v-model="query.manufacturerProvinceId"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端型号">
              <el-input
                data-cy="typ-search-model-input"
                v-model="query.model"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制造商ID">
              <el-input
                data-cy="typ-search-manufacturerId-input"
                v-model="query.manufacturerId"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备制造商市ID">
              <el-input
                data-cy="typ-search-manufacturerCityId-input"
                v-model="query.manufacturerCityId"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="型号编码">
              <el-input
                data-cy="typ-search-modelId-input"
                v-model="query.modelId"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="厂家编码">
              <el-input
                data-cy="typ-search-factoryId-input"
                v-model="query.factoryId"
                placeholder="请输入内容"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="通讯类型">
              <el-select
                data-cy="typ-search-communicationType-select"
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
          <div style="clear: both"></div>
        </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>终端类型信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button
          data-cy="typ-search-button"
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="onload"
          v-if="flag_per.indexOf('查询') > -1"
          >查询</el-button
        >
        <el-button
          data-cy="typ-create-button"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleClick('add')"
          v-if="flag_per.indexOf('新建') > -1"
          >新建</el-button
        >
        <el-button
          data-cy="typ-delete-button"
          size="small"
          icon="el-icon-delete"
          type="danger"
          plain
          @click="deleteItem"
          v-if="flag_per.indexOf('删除') > -1"
          >删除</el-button
        >
        <el-button
          type="primary"
          plain
          size="small"
          icon="el-icon-download"
          v-if="flag_per.indexOf('导出') > -1"
          @click="exportList"
          >导出</el-button
        >
      </div>
      <div class="tableBox">
        <el-table
          data-cy="typ-data-table"
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
          <el-table-column data-cy="typ-checkbox" type="selection" width="55"> </el-table-column>
          <el-table-column label="终端类型名称" width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            prop="manufacturerProvinceId"
            label="设备制造商省ID"
          >
          </el-table-column>
          <el-table-column
            prop="manufacturerCityId"
            label="设备制造商市ID"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="manufacturerId" label="制造商ID">
          </el-table-column>
          <el-table-column prop="model" label="终端型号">
          </el-table-column>
          <el-table-column prop="factoryId" label="厂家编码">
          </el-table-column>
          <el-table-column prop="modelId" label="型号编码">
          </el-table-column>
          <el-table-column prop="communicationType" label="通讯类型" width="120">
            <template slot-scope="scope">
              <el-tag
                :type="
                  scope.row.communicationType === 'tcp' ||
                  scope.row.communicationType === 'TCP'
                    ? 'primary'
                    : 'success'
                "
                disable-transitions
                >{{ scope.row.communicationType }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="small"
                plain
                icon="el-icon-edit"
                @click="handleClick('edit', scope.row)"
                v-if="flag_per.indexOf('修改') > -1"
                >编辑</el-button
              >
              <!-- <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      >
      </el-pagination>
      <!-- 弹出框 -->
      <Dialog
        data-cy="typ_manage_dialog"
        :QualityDialogFlag.sync="QualityDialogFlag"
        :rowInfo="rowInfo"
        @QualityDialogFlagC="QualityDialogFlagClose"
      ></Dialog>
    </div>
    

    
  </div>
</template>

<script>
import "@/assets/css/common.css";
import { getList, deleteList,exportData } from "@/api/system/terminalType.js";
import Dialog from "@/components/terminalType/dialog.vue";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        manufacturerProvinceId: "",
        manufacturerId: "",
        model: "",
        manufacturerCityId: "",
        modelId: "",
        factoryId: "",
        communicationType: "",
      },
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
      tableData: [],
      rowInfo: {},
      multipleSelection: [],
      QualityDialogFlag: false,
      flag_per: [],
      loading:false
    };
  },
  components: {
    Dialog,
  },
  created() {
    this.checkPro(["基本信息管理", "终端类型管理", "查询"]);
    this.checkPro(["基本信息管理", "终端类型管理", "新建"]);
    this.checkPro(["基本信息管理", "终端类型管理", "修改"]);
    this.checkPro(["基本信息管理", "终端类型管理", "导出"]);
    this.checkPro(["基本信息管理", "终端类型管理", "删除"]);
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
      this.loading=true
      getList(this.query).then((res) => {
        console.log(res.data.list)
        this.total = res.data.total;
        this.tableData = res.data.list;
        this.loading=false
      });
    },
    exportList(){
      var that=this
      that.$confirm('是否确认导出终端类型数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          exportData(that.query).then(res=>{
            console.log(res)
            fileDownload(res,'终端类型信息表导出'+that.localTime()+'.xlsx'); 
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
                  message: "删除终端类型成功！",
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
              this.query.pageNum=1
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
    QualityDialogFlagClose(msg) {
      this.QualityDialogFlag = msg;
      this.onload();
    },
    handleClick(status, row) {
      status == "edit" ? (this.rowInfo = row) : (this.rowInfo = null);
      console.log(this.rowInfo);
      this.QualityDialogFlag = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
  },
  mounted() {
    this.onload();
  },
};
</script>

<style>
</style>
