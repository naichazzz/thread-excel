<template>
  <div>
    <div class="pageMain">
      <el-form
        ref="form"
        :model="form"
        label-width="7em"
        size="small"
        style="text-align: left; margin-top: 20px"
      >
        <el-col :span="6">
          <el-form-item label="SIM卡号">
            <el-input
              data-cy="sim-screen-sim-input"
              v-model="screenSimId"
              placeholder="请输入内容"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SIM卡状态">
            <el-select
              data-cy="sim-screen-sim-status-select"
              v-model="screenSimStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in simStatusList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属组">
            <treeselect
              data-cy="sim-screen-group-treeselect"
              v-model="screenGroup"
              :options="screenGroupList"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;">
          <el-button
            data-cy="sim-search-button"
            type="primary"
            size="small"
            @click="handleSearchClick"
            icon="el-icon-search"
            v-if="flag_per.indexOf('查询') > -1"
          >
            查询
          </el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="tableBox">
        <div class="titleLine">
          <el-divider direction="vertical"></el-divider>
          <span>SIM卡信息列表</span>
        </div>
        <div class="buttonBox">
          <el-button
            data-cy="sim-create-button"
            type="primary"
            size="small"
            @click="handleAddClick"
            icon="el-icon-plus"
            v-if="flag_per.indexOf('新建') > -1"
          >
            新建
          </el-button>
          <el-button
            data-cy="sim-delete-button"
            type="danger"
            size="small"
            plain
            icon="el-icon-delete"
            @click="handleDeleteClick"
            v-if="flag_per.indexOf('删除') > -1"
            >删除</el-button
          >
          <el-button
            data-cy="sim-export-button"
            type="primary"
            size="small"
            plain
            icon="el-icon-download"
            @click="handleExportClick"
            v-if="flag_per.indexOf('导出') > -1"
            >导出</el-button
          >
        </div>
        <el-table
          data-cy="sim-data-table"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{ color: '#606266' }"
          v-loading="loading"
          max-height="450"
          stripe
        >
          <el-table-column
            data-cy="sim-selection-column"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            prop="simNumber"
            label="SIM卡号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="bindStatus"
            label="SIM卡状态"
            :formatter="statusFormat"
          >
            <template slot-scope="scope">
              <!-- 后续后端会改为字符串，不用数据字典，所以暂时硬编码 -->
              <el-tag
                :type="scope.row.bindStatus === 0 ? 'primary' : 'danger'"
                disable-transitions
                >{{ scope.row.bindStatus === 0 ? "可用" : "已用" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="所属组"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="handleModifyClick(scope.row)"
                type="danger"
                size="small"
                plain
                icon="el-icon-edit"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      ></el-pagination>
      <Dialog
        data-cy="sim_manage_dialog"
        :postInfo="postInfo"
        @form-data="formBack"
        :dialogVisible.sync="dialogVisible"
      ></Dialog>
    </div>
  </div>
</template>

<script>
import "@/assets/css/common.css";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Dialog from "@/components/simCard/dialog.vue";
import {
  addSim,
  deleteSim,
  searchSim,
  modifySim,
  exportData
} from "@/api/system/SIMCard";
import { selectDictLabel } from "@/utils/ruoyi";
import { grouplist } from "@/api/system/group";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      /** ============ 翻页 ============ */
      /** 当前页码 */
      currentPage: 1,
      /** 每页显示条数 */
      pageSize: 10,
      /** 总条数 */
      total: 0,
      /** 表数据 */
      tableData: [],
      /** 已选数据 */
      multipleSelection: [],

      /** ============ 检索条件 ============ */
      form: {},
      /** sim卡号 */
      screenSimId: "",
      /** sim卡状态 */
      screenSimStatus: "2",
      /** sim卡状态列表 */
      simStatusList: [
        {
          dictValue: "2",
          dictLabel: "全部"
        },
        {
          dictValue: "0",
          dictLabel: "可用"
        },
        {
          dictValue: "1",
          dictLabel: "已用"
        }
      ],
      screenGroup: this.$store.state.user.groupId,
      screenGroupList: [],

      /** ============ 弹出框用 ============ */
      dialogVisible: false,
      /** 所选行 */
      rowInfo: {},
      postInfo: {},

      flag_per: [],
      loading: false
    };
  },
  components: {
    Dialog,
    Treeselect
  },
  methods: {
    /**
     * 输出应答
     */
    verifyRespond(res, info) {
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: info + "SIM卡信息成功",
          type: "success"
        });
      } else {
        this.$message({
          message: res.message,
          type: "failed"
        });
      }
    },
    /**
     * 表单返回
     */
    formBack(formData) {
      if (formData.addOrModify === "add") {
        addSim(formData).then(res => {
          this.verifyRespond(res, "新增");
          if (res.code == 200) {
            this.screenSimStatus = "0";
            this.loadData();
          }
        });
      } else {
        let par = {
          id: formData.id.toString(),
          gid: formData.gid.toString()
        };
        modifySim(par).then(res => {
          this.verifyRespond(res, "编辑");
          if (res.code == 200) {
            this.loadData();
          }
        });
      }
    },
    /**
     * 点击增加按钮
     */
    handleAddClick() {
      this.dialogVisible = true;
      this.postInfo = {
        gid: this.$store.state.user.groupId,
        addOrModify: "add"
      };
    },
    /**
     * 点击删除按钮
     */
    handleDeleteClick() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择要删除的SIM卡"
        });
        return;
      }
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 删除SIMCard
     */
    deleteData() {
      let idArr = [];
      this.multipleSelection.forEach(element => {
        idArr.push(element.id);
      });
      deleteSim(idArr).then(res => {
        console.log("========应答========");
        console.log(res);
        this.verifyRespond(res, "删除");
        if (res.code == 200) {
          this.loadData();
        }
      });
    },
    /**
     * 点击修改按钮
     */
    handleModifyClick(row) {
      this.postInfo = { ...row, addOrModify: "modify" };
      this.dialogVisible = true;
    },

    /**
     * 加载数据
     */
    loadData() {
      if (!(this.flag_per.indexOf("查询") > -1)) {
        console.log("此用户没有查询权限");
        return;
      }
      this.loading = true;
      let par = {
        simNumber: this.screenSimId,
        bindStatus: this.screenSimStatus == "2" ? "" : this.screenSimStatus,
        gid: this.screenGroup,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      searchSim(par).then(res => {
        console.log("========应答========");
        console.log(res);
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    /**
     * 点击查询按钮
     */
    handleSearchClick() {
      this.loadData();
    },
    /**
     * 导出
     */
    handleExportClick() {
      let that = this;
      this.$confirm("是否确认导出SIM卡数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          let par = {
            simNumber: that.screenSimId,
            bindStatus: that.screenSimStatus,
            gid: that.screenGroup,
            pageNum: that.currentPage,
            pageSize: that.pageSize
          };
          return exportData(par);
        })
        .then(res => {
          console.log(res);
          fileDownload(
            res,
            "SIM卡信息表导出" + that.localTime() + ".xlsx"
          );
        });
    },
    /**
     * 每页显示条数改变
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadData();
    },
    /**
     * 当前页改变
     */
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.loadData();
    },
    /**
     * SIM卡状态格式化
     */
    statusFormat(row, column) {
      let ret = this.selectDictLabel(this.simStatusList, row.bindStatus);
      return ret;
    },
    /**
     * 获取默认项，暂时先取第一项
     */
    getDefault(list) {
      if (list.length > 0) {
        return list[0].dictValue;
      }
      return "";
    },
    /**
     * 选择变化
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.childList && !node.childList.length) {
        delete node.childList;
      }
      return {
        id: node.id,
        label: node.groupName,
        children: node.childList
      };
    },
    /**
     * 查看权限
     */
    checkPro(data) {
      this.checkPromis(data).then(res => {
        if (res) {
          this.flag_per.push(data[2]);
        }
      });
    }
  },
  /**
   * 生命周期：创建
   */
  created() {
    this.loading = true;
    let params = {
      groupName: ""
    };
    grouplist(params).then(res => {
      console.log(res);
      this.loading = false;
      this.screenGroupList = this.handleTree(res.data, "id");
      console.log(this.screenGroupList);
      this.loadData();
    });

    // this.getDicts("sys_sim_status").then((response) => {
    //   this.simStatusList = response.data;
    //   this.screenSimStatus = this.getDefault(this.simStatusList);
    // });

    this.checkPro(["基本信息管理", "SIM卡管理", "查询"]);
    this.checkPro(["基本信息管理", "SIM卡管理", "新建"]);
    this.checkPro(["基本信息管理", "SIM卡管理", "修改"]);
    this.checkPro(["基本信息管理", "SIM卡管理", "导出"]);
    this.checkPro(["基本信息管理", "SIM卡管理", "删除"]);
  }
};
</script>

<style scoped>
.vue-treeselect__control {
  width: 196px !important ;
  height: 28px !important;
  z-index: 99999;
}
</style>
