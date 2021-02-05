<template>
  <div>
    <div class="pageMain">
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="8em" style="text-align: left;margin-top: 20px;" size="small">
        <el-col :span="6">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="queryParams.dictName"
              placeholder="请输入字典名称"
              clearable
  
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字典类型" prop="dictType">
            <el-input
              v-model="queryParams.dictType"
              placeholder="请输入字典类型"
              clearable
  
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="字典状态"
              clearable

            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;">
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery" v-if="flag_per.indexOf('查询')>-1">查询</el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>字典信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
            v-if="flag_per.indexOf('新增')>-1"
          >新建</el-button>

        <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            :disabled="multiple"
            @click="handleDelete"
            v-if="flag_per.indexOf('删除')>-1"
            plain
          >删除</el-button>

      </div>
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange" :header-cell-style="{color: '#606266' }"
        stripe max-height="450">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="字典编号" align="center" prop="dictId" /> -->
        <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
        <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <router-link :to="'/dict/data/' + scope.row.dictId" @click.native="goData(scope.row.dictId)" class="link-type" v-if="flag_per.indexOf('修改')>-1">
              <span>{{ scope.row.dictType }}</span>
            </router-link>
            <div v-else>{{ scope.row.dictType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              plain
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-if="flag_per.indexOf('修改')>-1"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-box"
      ></el-pagination>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" placeholder="请输入字典名称" />
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型" />
          </el-form-item>
          <el-form-item label="状态" prop="status" style="text-align:left">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listType, getType, delType, addType, updateType, exportType, clearCache } from "@/api/system/dict/type";
import { mapGetters } from 'vuex'
import {chooseMenu} from '@/api/system/tagsView.js'
export default {
  name: "Dict",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [{dictId:1,dictName:'字典1',dictType:'字典类型',status:0,remark:'备注',createTime:'1231'}],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      pageSize: 10,
      pageNum: 1,
      flag_per:[]
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.checkPro(['系统管理','字典管理','查询'])
    this.checkPro(['系统管理','字典管理','新增'])
    this.checkPro(['系统管理','字典管理','修改'])
    this.checkPro(['系统管理','字典管理','删除'])
  },
  computed: {
    ...mapGetters([
      'visitedViews'
    ]),
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        console.log(response)
          this.typeList = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    goData(id){
      let path='/dict/data/' + id
      chooseMenu('参数管理',path).then(res=>{
        console.log(res)
      })
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.msgSuccess("修改字典类型成功");
              this.open = false;
              this.getList();
            });
          } else {
            console.log(this.form)
            addType(this.form).then(response => {
              this.msgSuccess("新增字典类型成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm('是否确认删除字典数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delType(dictIds);
        }).then((res) => {
          console.log(res)
          this.getList();
          if(res.code==200){
            this.msgSuccess("删除字典类型成功");
          }
          else{
            this.$message({
                        message:res.message,
                        type: 'error'
                      });
          }

        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportType(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 清理缓存按钮操作 */
    handleClearCache() {
      clearCache().then(response => {
        this.msgSuccess("清理成功");
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryParams.pageSize=val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum=val
      this.getList()
    },
    // 查看权限
        checkPro(data){
          this.checkPromis(data).then(res=>{
            if(res){
              this.flag_per.push(data[2])
            }
          })
        }
  }
};
</script>
<style scoped>
  .app-container{padding: 10px;}
  a{color: #006EDD;}
</style>
