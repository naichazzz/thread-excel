<template>
  <div>
    <div class="pageMain">
        <el-form label-position="right" label-width="8em" style="margin-top:20px" @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="角色搜索">
              <el-input
                data-cy="rol-search-name-input"
                v-model="roleName"
                placeholder="请输入内容"
                size="small"
                :clearable='true'
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:left;padding-left:2.8em;padding-top:5px">
            <el-button
                  data-cy="rol-demand-button"
                  type="primary"
                  size="small"
                  @click="search"
                  v-if="flag.indexOf('查询') > -1"
                  icon="el-icon-search"
                  >查询</el-button
                >
            </el-col>
          <div style="clear: both"></div>
        </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>角色信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button
          data-cy="rol-new-button"
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="handleClick"
          v-if="flag.indexOf('新建') > -1"
          >新建</el-button
        >
        <el-button
          data-cy="rol-delete-button"
          size="small"
          icon="el-icon-delete"
          type="danger"
          plain
          @click="deleteRows"
          v-if="flag.indexOf('删除') > -1"
          >删除</el-button
        >
        <el-button
          data-cy="rol-export-button"
          type="primary"
          plain
          size="small"
          v-if="flag.indexOf('导出') > -1"
          icon="el-icon-download"
          @click="exportData"
          >导出</el-button
        >
      </div>
      <el-table
        data-cy="rol-data-table"
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :header-cell-style="{color: '#606266' }"
        max-height="450"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ utc2beijing(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>

        <el-table-column fixed="right" label="操作" width="210">
          <template slot-scope="scope">
            <el-button
              data-cy="rol-see-button"
              type="primary"
              plain
              size="small"
              @click="handleClick(scope.row, true)"
              icon="el-icon-view"
              >查看</el-button
            >
            <el-button
              data-cy="rol-change-button"
              type="danger"
              size="small"
              plain
               icon="el-icon-edit"
              @click="handleClick(scope.row, false)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      ></el-pagination>
      <!-- 弹出框 -->
      <Dialog
          data-cy="rol_manage_dialog"
          :QualityDialogFlag.sync="QualityDialogFlag"
          @isQualityDialog="isQualityDialogShow"
          :rowInfo="rowInfo"
          :isExamine="isExamine"
        ></Dialog>
      <DialogS :QualityDialogFlag.sync="QualityDialogFlagS"></DialogS>
    </div>
  </div>
</template>

<script>
import Dialog from "@/components/roleManage/dialog.vue";
import DialogS from "@/components/roleManage/dialog_see.vue";
import { roleList, deleteInfo, exportData } from "@/api/system/roleManager";
import fileDownload from "js-file-download";
import "@/assets/css/common.css";

export default {
  data() {
    return {
      loading: true,
      isExamine: false,
      boxHeight: "",
      input: "",
      roleName: "",
      rowInfo: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      tableData: [],
      QualityDialogFlag: false,
      QualityDialogFlagS: false,
      multipleSelection: [],
      flag: [],
      params: null,
    };
  },
  components: {
    Dialog,
    DialogS,
  },
  methods: {
    isQualityDialogShow(msg) {
      this.QualityDialogFlag = false;
      this.onload();
    },
    onload() {
      this.params = {
        roleName: this.roleName,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      roleList(this.params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    search(){
      this.pageNum=1
      this.onload()
    },
    deleteRows() {
      // console.log(this.multipleSelection.length);
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "您还未选择角色",
        });
        return;
      } else {
        this.$confirm("是否确认删除该角色?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            let roleId = _.map(this.multipleSelection, (item) => {
              return item.id;
            });
            let roleIds = roleId.toString();

            deleteInfo(roleIds).then((res) => {
               if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除角色信息成功！",
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
    exportData() {
      this.$confirm("是否确认导出角色数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var that=this
        console.log(this.params)
        exportData(this.params).then((res) => {
          fileDownload(res,'角色信息表导出'+that.localTime()+'.xlsx'); 
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onload();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.onload();
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleClick(row, isExamine) {
      this.rowInfo = row;
      this.QualityDialogFlag = true;
      if (this.isExamine == undefined) {
        this.isExamine = false;
      } else {
        this.isExamine = isExamine;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    seeClick() {
      this.QualityDialogFlagS = true;
    },
    // 查看权限
    checkPro(data) {
      this.checkPromis(data).then((res) => {
        if (res) {
          this.flag.push(data[2]);
        }
      });
    },
  },
  mounted() {
    this.onload();
  },
  created() {
    this.checkPro(["系统管理", "角色管理", "查询"]);
    this.checkPro(["系统管理", "角色管理", "新建"]);
    this.checkPro(["系统管理", "角色管理", "修改"]);
    this.checkPro(["系统管理", "角色管理", "导出"]);
    this.checkPro(["系统管理", "角色管理", "删除"]);
  },
};
</script>

<style scoped>
.toolBox {
  display: flex;
}
.inputBox {
  width: auto;
  margin-top: 4px;
}
</style>
