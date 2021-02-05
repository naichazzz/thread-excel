<template>
  <div v-if="visible">
    <el-dialog
      :title="isExamine?'角色信息查看':'角色信息维护'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="QualityDialogClose"
      width="60%"
      :destroy-on-close="true"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="8em"
        class="left"
        :inline="true"
        :rules="rules"
        :disabled="isExamine"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input data-cy="rol-name-input" v-model="form.roleName" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            data-cy="rol-describe-input"
            v-model="form.remark"
            size="mini"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            clearable>
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="功能名称：" v-if="!isExamine">
          <el-input
            data-cy="rol-menu-name-input"
            v-model="menuName"
            size="mini"
            class="smallSelect"
            clearable>
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!isExamine">
          <el-button data-cy="rol-menu-demand-button" type="primary" @click="searchRole" size="mini"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        data-cy="rol-tree-data-table"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px;"
        row-key="id"
        ref="multipleTable"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        max-height="300"
        @select="select"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="55"
          v-if="!isExamine"
        ></el-table-column>
        <el-table-column
          prop="menuName"
          label="功能名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button data-cy="rol-clear-button" @click="QualityDialogClose">取 消</el-button>
        <el-button data-cy="rol-ok-button" type="primary" @click="commitInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import { menuList, addInfo, updateInfo } from "@/api/system/roleManager";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      visible: false,
      menuName: "",
      form: {
        roleName: "",
        remark: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
      },
      options: [],
      form2: {
        value: "",
        rule: "",
        ruleText: "",
      },
      multipleList: [],
      tableData: [],
      tableDataContainer: [],
      loading: false
    };
  },
  props: {
    QualityDialogFlag: {
      default: false,
    },
    rowInfo: {
      default: {},
      // type:Object
    },
    isExamine: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    QualityDialogFlag() {
      this.form = {
        roleName: "",
        remark: "",
      };
      this.visible = this.QualityDialogFlag;
      if(this.visible==true){
        this.menuListInfo();
      }
    },
    rowInfo(newVal) {
      this.form.roleName = newVal.roleName;
      this.form.remark = newVal.remark;
      console.log(this.isExamine)
      if (this.isExamine) {
        this.tableData = this.rowInfo.roleMenuTreeList;
      } else {
        this.tableData = this.tableDataContainer;

        // this.multipleList = newVal.roleMenuTreeList;
        var that=this
        setTimeout(() => {
          that.getChildsData(that.tableDataContainer);
        });
      }

      return newVal;
    },
    isExamine(newVal) {
      
      if (this.isExamine) {
        this.tableData = this.rowInfo.roleMenuTreeList;
      }
      return newVal;
    },
    
    
  },
  computed: {
    ...mapGetters(["permission_routes"]),
  },
  methods: {
    // 多选
    select (selection, row) {
      if (selection.some(el => { return row.id === el.id })) {
        if (row.children) {
          this.selectChild(row.children,true)
        }
      } else {
        if (row.children) {
          this.selectChild(row.children,false)
        }
      }
    },
    // 循环选择自组
    selectChild(list,type){
      list.map(j => {
            this.toggleSelection(j, type)
            if(j.children){
              this.selectChild(j.children,type)
            }
          })
      
    },
    toggleSelection (row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row, select)
        })
      }
    },
    getChildsData(data) {
      // return new Promise(function (reslove, reject) {
        
      // })
      _.map(data, (item) => {
        _.map(this.rowInfo.roleMenuIdList, (roleMenuIdItem) => {
          if (item.id == roleMenuIdItem) {
            this.$refs.multipleTable.toggleRowSelection(item, true);
            console.log(item.id)
            return
          } else if (item.children != null || item.children.length != 0) {
            this.getChildsData(item.children);
          }
        });
      });
    },
    menuListInfo() {
      // console.log(this.permission_routes);
      // this.tableData = this.permission_routes;
      if (this.isExamine) {
        this.tableData = this.rowInfo.roleMenuTreeList;
        return
      }
      let params = {
        menuName: this.menuName,
      };
      this.loading=true
      menuList(params).then((res) => {
        // console.log(res);
        this.tableData = res.data.menus;
        this.tableDataContainer = res.data.menus;
        var that=this
        setTimeout(function(){
          that.getChildsData(that.tableDataContainer);
          that.loading=false
        },200)
        
      });
    },
    QualityDialogClose() {
      this.$emit("isQualityDialog", false);
      this.multipleList=[]
      this.menuName=''
    },
    searchCar() {
      console.log("submit!");
    },
    searchRole() {
      this.menuListInfo();
    },
    handleSelectionChange(val) {
      this.multipleList = val;
       console.log(val);
    },
    commitInfo() {
      if(this.isExamine){
        this.QualityDialogClose();
      }
      else{
        this.$refs.form.validate((valid) => {
          if (valid) {
            let roleMenuIdList = _.map(this.multipleList, (item) => {
                return item.id;
              });
              this.form.roleMenuIdList = roleMenuIdList;
              if (!this.rowInfo.roleName) {
                // todo添加接口
                addInfo(this.form).then((res) => {
                  if (res.code == 200) {
                    this.$message({
                      message: "新增角色信息成功",
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
              } else {
                let roleId = this.rowInfo.id;
                updateInfo(roleId, this.form).then((res) => {
                  if (res.code == 200) {
                    this.$message({
                      message: "修改角色信息成功",
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
          } else {
            return false;
          }
        });
      }
      
    },
  },
  mounted() {
    // this.menuListInfo();
  },
};
</script>

<style scoped>
.left {
  text-align: left;
}
.el-form-item {
  margin-bottom: 0;
}
.smallSelect {
  width: 150px;
}
</style>
