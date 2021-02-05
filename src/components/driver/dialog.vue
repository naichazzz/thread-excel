<template>
  <div>
    <el-dialog
      title="司机管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="QualityDialogClose"
      v-if="visible"
    >
		<el-tabs type="border-card" @tab-click="gotoGroup" v-model="activeName">
			<el-tab-pane :label="titleGroup.tab1" name="1">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          class="left"
          :rules="rules"
          size="mini"
        >
          <el-form-item label="姓名" prop="name" >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="form.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="驾驶证编号">
            <el-input v-model="form.licenseNumber"></el-input>
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.idNumber"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="titleGroup.tab2" name="2">
        <el-input
          placeholder="请输入内容"
          v-model="searchGroup"
          class="input-with-select"
          size="small"
        >
          <el-select
            v-model="selectType"
            slot="prepend"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option label="按组名" value="1"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
        <el-table
          :data="tableData_group"
          style="width: 100%"
          highlight-current-row
          :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
          row-key="id"
          ref="groupList"
          @select="select"
          @selection-change="handle_selectionChangeSingle"
          default-expand-all
          max-height="300px"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
            prop="groupName"
            label="组名"
            width="180"
          ></el-table-column>

          <el-table-column prop="remark" label="描述"></el-table-column>
        </el-table>
      </el-tab-pane>
		</el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="QualityDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import {grouplist} from "@/api/system/group";
export default {
  // components: { IconSelect },
  data() {
    return {
      visible: false,
      form: {
        name: "",
        phoneNumber: "",
        licenseNumber : "",
        idNumber: "",
        address: "",
        remark: "",
        groupId:this.$store.state.user.groupId
      },
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      tableData_group:[],
      searchGroup:'',
      selectType:'按组名',
      activeName:'1',
      titleGroup:{
        tab1:'添加司机信息',
        tab2:'添加所属组',
      }
    };
  },
  props: {
    QualityDialogFlag: {
      default: false,
    },
    addOrModify: {
      default: "add",
    },
    nowData:{
      default:this.form
    }
  },
  // created(){
  //   console.log(this.nowData)
  //   this.form=this.nowData
  // },
  methods: {
    confirm() {
      console.log(this.form.groupId)
      if(this.form.name==''||this.form.groupId==''){
        this.$message({
                        message: '请确认已添加用户姓名和所属组',
                        type: 'error'
                      });
        return
      }
      this.$emit("form-data", this.form, this.addOrModify);
      this.$emit("update:QualityDialogFlag", false);
      this.activeName='1'
    },
    QualityDialogClose() {
      this.activeName='1'
      this.$emit("update:QualityDialogFlag", false);
      
    },
    gotoGroup() {
      let data={
        groupName:''
      }
      grouplist(data).then(res=>{
        console.log(res)
        this.tableData_group=res.data
        if(this.form.groupId!=''&&this.form.groupId){
          var that=this
          that.findGroup(that.tableData_group)
        }
      })
    },
    // 遍历查找默认组
    findGroup(group){
      var that=this
      setTimeout(function(){
        group.forEach(row => {
            if(row.id == that.form.groupId) {
              that.$refs.groupList.toggleRowSelection(row, true);
            }
            else if(row.childList){
              that.findGroup(row.childList)
            }

          });
      },100)

    },
    // 搜索
    search(){
      let data={
        groupName:this.searchGroup
      }
      grouplist(data).then(res=>{
        console.log(res)
        this.tableData_group=res.data
        if(this.form.group!=''&&this.form.group){
          var that=this
          that.findGroup(that.tableData_group)
        }
      })
    },
    // 组的单选控制
    // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
    select(selection, row) {
      console.log(row);
      if (selection.length == 0){
        this.form.groupId=''
        return
      }
      else{
        this.selectedList_group = row;
      this.form.groupId=this.selectedList_group.id
      this.$refs.groupList.clearSelection();
      
      this.$refs.groupList.toggleRowSelection(row, true);
      }
      
    },
    handle_selectionChangeSingle(row) {
      console.log(row)
      // this.selectedList_group = row;
      // this.form.groupId=this.selectedList_group.id
    },
  },
  watch: {
    QualityDialogFlag() {
      this.visible = this.QualityDialogFlag;
      let { ...foa } = this.nowData;
      this.form=foa;
      if(this.nowData.name==''){
        this.titleGroup={
          tab1:'添加司机信息',
          tab2:'添加所属组',
        }
      }
      else{
        this.titleGroup={
          tab1:'编辑司机信息',
          tab2:'编辑所属组',
        }
      }
    }
  },
};
</script>

<style>
</style>
