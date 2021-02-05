<template>
  <div>
    <!-- 用户维护 -->
    <el-dialog title="用户维护" :visible.sync="visible" :close-on-click-modal="false"
    @close="QualityDialogClose" v-if="visible"  >
      <el-tabs type="border-card" v-model="activeName" :before-leave="beforeHandle" v-loading="loading_all">
        <el-tab-pane :label="titleGroup.tab1" name="1">
          <el-form :model="form" :rules="rules" ref="formTable" size="mini">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-show="titleGroup.tab1=='添加用户信息'">
              <el-input v-model="form.password" autocomplete="off" size="mini" class="inputBox2" show-password minlength="7">
                <template slot="append">长度:7~10</template>
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="password2" v-show="titleGroup.tab1=='添加用户信息'">
              <el-input v-model="form.password2" autocomplete="off" size="mini" class="inputBox2" show-password minlength="7">
                <template slot="append">长度:7~10</template>
              </el-input>
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth" prop="status2">
              <el-select v-model="form.status2" placeholder="请选择状态" size="mini" class="inputBox2">
                <el-option label="启用" value="启用"></el-option>
                <el-option label="停用" value="停用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="全名" :label-width="formLabelWidth" prop="nickName">
              <el-input v-model="form.nickName" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="form.phoneNumber" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="form.email" autocomplete="off" size="mini" class="inputBox2"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="form.remark" autocomplete="off" size="mini" class="inputBox2" type="textarea"
  :rows="2"></el-input>
            </el-form-item>
          </el-form>
          <el-button style="margin-top: 12px;" @click="next('form')" type="primary" plain>下一步</el-button>
        </el-tab-pane>
        <el-tab-pane :label="titleGroup.tab2" name="2">
          <el-form ref="form_car" :model="form_role" :inline="true" class="left">
            <el-form-item label="">
              <el-input v-model="form_role.search" size="mini" class="smallInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchRole" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="roleData"
            style="width: 100%"  
            @selection-change="handleSelectionChange"
            ref="roleList"
            max-height="300"
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色"
              >
            </el-table-column>
            <el-table-column
              prop="remark"
              label="描述"
              >
            </el-table-column>
          </el-table>
          <el-button style="margin-top: 12px;" @click="next" type="primary" plain>下一步</el-button>
        </el-tab-pane>
        <el-tab-pane :label="titleGroup.tab3" name="3">
          <el-form ref="form_car" :model="form_group" :inline="true" class="left">
            <el-form-item label="">
              <el-input v-model="form_group.search" size="mini" class="smallInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchGroup" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
              :data="tableData_group"
              style="width: 100%"
              row-key="id"
              @select="select"
              @selection-change="handle_selectionChangeSingle"
              ref="groupList"
              :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
              default-expand-all
              max-height="300px">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="groupName"
                label="组名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="描述"
               >
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 12px;" @click="commitInfo">确 定</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 查看车辆 -->
    <el-dialog title="车辆信息" :visible.sync="visible_car" :close-on-click-modal="false"
  @close="QualityDialogClose">
      <el-form ref="form_car" :model="form_car" style="text-align: left;" label-width="6em" >
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input v-model="form_car.numberPlate" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属组">
            <!-- <el-input v-model="form_car.ownerCompany" size="mini"></el-input> -->
            <treeselect
                v-model="form_car.groupId"
                :options="groupOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                style="line-height:28px !important;margin-top:5px"
              />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="padding-left:2.8em;margin-top:6px">
          <el-button type="primary" @click="searchCar" size="small" icon="el-icon-search">查询</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" plain @click="exprotCar">导出</el-button>
        </el-col>
        <!-- <el-col :span="4" style="padding-left:2.8em;">
          
        </el-col> -->
        <div style="clear: both"></div>
      </el-form>
      <el-divider content-position="left">查询结果</el-divider>
       <el-table
        :data="tableData"
        style="width: 100%" stripe :header-cell-style="{color:'#606266'}"
        max-height="300"
        v-loading="loading"
        fit>
        <el-table-column
          prop="numberPlate"
          label="车牌号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ownerCompany"
          label="所属企业"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="所属组"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="terminalNumber"
          label="终端号码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="simNumber"
          label="SIM卡号"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[20,50,100, 200]"
      :page-size='pageSize'
      layout="total, sizes, prev, pager, next, jumper"
      :total="total_car"
      style="padding:10px 0;text-align:right">
    </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import "@/assets/css/dialogstyle.css"
  import {newUser,updateUser,getUserCar,exportCarData} from "@/api/system/user";
  import {roleList} from "@/api/system/roleManager";
  import {grouplist} from "@/api/system/group";
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import fileDownload from "js-file-download";
  export default{
    data(){
      var validatePass = (rule, value, callback) => {
        let exp = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{7,10}$/;
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!exp.test(value)) {
          callback(new Error("密码不符合规范"));
        } else {
          if (this.form.password2 !== "") {
            this.$refs.formTable.validateField("password2");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            };
      return{
        activeName:'1',
        form:{
          id:'',
          userName: '',
          password: '',
          status: '',
          nickName: '',
          phoneNumber: '',
          email: '',
          remark: '',
          userRoleList:'',
          group:'',
          createBy:'',
          status2:'启用'
        },
        form_car:{
          numberPlate:'',
          groupId:undefined
        },
        form_role:{
          search:''
        },
        form_group:{
          search:''
        },
        formLabelWidth: '100px',
        visible: false,
        visible_car:false,
        roleData:[],
        rules:{
          userName :[{required: true, message: '请输入用户名', trigger: 'blur'}],
          password :[
            {required: true, message: '请输入密码', trigger: 'blur'},
            { validator: validatePass, trigger: "blur" }
          ],
          password2 :[
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          // nickName:[{required: true, message: '请输入', trigger: 'blur'}],
          status2:[{required: true, message: '请选择', trigger: 'blur'}]
        },
        multipleSelection: [],
        tableData:[],
        tableData_group:[],
        selectedList_group:[],
        pageSize:20,
        pageNum:1,
        total_car:0,
        titleGroup:{
            tab1:'添加用户信息',
            tab2:'添加角色',
            tab3:'添加所属组'
          },
        loading:false,
        groupOptions:[],
        loading_all:false
      }
    },
    props:{
      QualityDialogFlag:{
                  default: 'false'
              },
      formData:{
         type: Object,
         default:function(){
         				return {
                 id:'',
                 userName: '',
                 password: '',
                 status: '',
                 nickName: '',
                 phoneNumber: '',
                 email: '',
                 remark: '',
                 userRoleList:'',
                 group:'',
                 createBy:'',
                 status2:'启用'
               };
         			}

      },
      type:''
    },
    components:{
        Treeselect
      },
    methods: {
            QualityDialogClose() {
                this.$emit("update:QualityDialogFlag", 'false');
                this.form.userRoleList=''
                this.form.group=''
                this.activeName='1'
                this.form_car={
                  numberPlate:'',
                  ownerCompanyy:''
                }
                this.selectedList_group=[]
                this.multipleSelection=[]
            },
            commitInfo(){
              
              var userRoleIdList=[]
              for(var i=0;i<this.multipleSelection.length;i++){
                userRoleIdList.push(this.multipleSelection[i].id)
              }

              if(this.type=='new'){
           
                if(this.selectedList_group.length>0){
                  var selectrow=this.selectedList_group
                var groupId=selectrow[0].id
                let data={
                  userName:this.form.userName,
                  password:this.form.password,
                  status:this.form.status2=='启用'?true:false,
                  nickName:this.form.nickName,
                  phoneNumber:this.form.phoneNumber,
                  email:this.form.email,
                  remark:this.form.remark,
                  userRoleIdList:userRoleIdList,
                  groupId:groupId
                }
                console.log(data)
                  newUser(data).then(res=>{
                  console.log(res)
                    if(res.code==200){
                      this.$message({
                                message: '新增用户信息成功',
                                type: 'success'
                              });
                      this.getUserList()
                    }
                    else{
                      this.$message({
                                message: res.message,
                                type: 'error'
                              });
                    }
                  })
                }
                else{
                  this.$message({
                                message: '创建失败，请选择分组',
                                type: 'error'
                              });
                }
              }
              else{
                var selectrow=''
                if(this.selectedList_group.length==1){
                  selectrow=this.selectedList_group[0]
                }
                else if(this.selectedList_group.length>1){
                  selectrow=this.selectedList_group[1]
                }
                var groupId=selectrow.id
                let data={
                  userName:this.form.userName,
                  // password:this.form.password,
                  status:this.form.status2=='启用'?true:false,
                  nickName:this.form.nickName,
                  phoneNumber:this.form.phoneNumber,
                  email:this.form.email,
                  remark:this.form.remark,
                  userRoleIdList:userRoleIdList,
                  groupId:groupId
                }
                var _id=this.form.id
                updateUser(data,_id).then(res=>{
                  if(res.code==200){
                    this.$message({
                              message: '修改用户信息成功',
                              type: 'success'
                            });
                     this.getUserList()
                  }
                  else{
                      this.$message({
                                message: res.message,
                                type: 'error'
                              });
                    }
                })
              }
              this.QualityDialogClose()
            },
            // 重刷用户列表
            getUserList(){
              let data=[]
              this.$emit('get-list',data)
            },
            // 取group
            gotGroupList(data){
              grouplist(data).then(res=>{
                this.groupOptions = this.handleTree(res.data, "id");
              })
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
            // 切换tab
            tabClick(e){
              console.log(e)
              if(e.label=='添加角色'||e.label=='编辑角色'){
                let data={
                  pageNum:1,
                  pageSize:100000,
                  roleName:''
                }
                this.getRoleList(data)
              }
              else if(e.label=='添加所属组'||e.label=='编辑所属组'){
                let data={
                  groupName:''
                }
                this.getGroupList(data)
              }
            },
            // 获取角色列表
            getRoleList(data){
              roleList(data).then(res=>{
                console.log(res)

                this.roleData=res.data.list
                if(this.roleData.length==0){
                  this.roleData=[]
                  return
                }
                console.log(this.roleData)
                if(this.form.userRoleList!=''&&this.form.userRoleList){
                  var that=this
                  setTimeout(function(){

                    for(var i=0;i<that.form.userRoleList.length;i++){
                      that.roleData.forEach(row => {
                        console.log(row);
                        if (row.id == that.form.userRoleList[i].id) {
                          console.log(row);
                          that.$refs.roleList.toggleRowSelection(row, true);
                        }
                      });
                    }
                    that.loading_all=false
                  },500)

                }
              })
            },
            // 获取组信息
            getGroupList(data){
              grouplist(data).then(res=>{
                console.log(res)
                this.tableData_group=res.data
                if(this.form.group!=''&&this.form.group){
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
                    if(row.id == that.form.group.id) {
                      console.log(row);
                      console.log(that.form.group.id);
                      that.$refs.groupList.toggleRowSelection(row, true);
                    }
                    else if(row.childList){
                      that.findGroup(row.childList)
                    }

                  });
              },1000)

            },
            // 组的单选控制
            // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
            select(selection, row) {
              console.log(row);
              this.$refs.groupList.clearSelection();
              if (selection.length == 0) return;
              this.$refs.groupList.toggleRowSelection(row, true);
            },
            // tab切换加判断条件
            beforeHandle(e){
              console.log(e)
              var flag
              if(e==2){
                this.$refs.formTable.validate((valid)=>{
                  if(!valid){
                   flag=false
                  }
                  return flag
                })
              }
              else if(e==3){
                if(this.multipleSelection.length==0){
                  this.$message({
                      message: '请选择角色',
                      type: 'info'
                    });
                  flag=false
                }
                return flag
              }
              return flag
            },
            handle_selectionChangeSingle(row) {
              console.log(row)
              this.selectedList_group = row;
            },

            searchCar() {
                  let data=this.form_car
                  data.pageSize=this.pageSize
                  data.pageNum=this.pageNum
                  data.userId=this.formData.id
                  getUserCar(data).then(res=>{
                    this.total_car=res.data.total
                    this.tableData=res.data.list
                  })
                },
            // 导出车辆列表
            exprotCar(){
              let data=this.form_car
              data.pageSize=this.pageSize
              data.pageNum=this.pageNum
              data.userId=this.formData.id
              var that=this
              that.$confirm('是否确认导出车辆数据?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function() {
                  exportCarData(data).then(res=>{
                      fileDownload(res,'用户车辆信息表导出'+that.localTime()+'.xlsx'); 
                  })
                })
            },
            searchRole(){
              let data={
                pageNum:1,
                pageSize:100000,
                roleName:this.form_role.search
              }
              this.getRoleList(data)
            },
            searchGroup(){
              let data={
                groupName:this.form_group.search
              }
              this.getGroupList(data)
            },
            handleSelectionChange(val) {
              this.multipleSelection = val;
              console.log(val)
            },

            next(){
              if(this.activeName=='1'){
                this.$refs.formTable.validate((valid)=>{
                  if(valid){
                    this.activeName='2'
                    // let e={
                    //   label:'添加角色'
                    // }
                    // this.tabClick(e)
                  }
                  else{
                    return false
                  }
                })


              }
              else if(this.activeName=='2'){
                if(this.multipleSelection.length>0){
                  this.activeName='3'
                  // let e={
                  //   label:'添加所属组'
                  // }
                  // this.tabClick(e)
                }
                else{
                  this.$message({
                      message: '请选择角色',
                      type: 'info'
                    });
                }
              }
            },
            handleSizeChange(val) {
              console.log(`每页 ${val} 条`);
              this.loading=true
              this.pageSize=val
              let data={
                userId:this.formData.id,
                  pageSize:this.pageSize,
                  pageNum:this.pageNum
              }
              getUserCar(data).then(res=>{
                  this.loading=false
                  this.total_car=res.data.total
                  this.tableData=res.data.list
                })
            },
            handleCurrentChange(val) {
              console.log(`当前页: ${val}`);
              this.loading=true
              let data={
                userId:this.formData.id,
                  pageSize:this.pageSize,
                  pageNum:val
              }
              getUserCar(data).then(res=>{
                  this.loading=false
                  this.total_car=res.data.total
                  this.tableData=res.data.list
                })
            }
        },
        watch: {
            QualityDialogFlag() {
              if(this.QualityDialogFlag=='user'){
                this.visible=true
                let { ...foa } = this.formData;
                this.form=foa;
                console.log(this.formData)
                if(this.formData.userName==''){
                  this.titleGroup={
                    tab1:'添加用户信息',
                    tab2:'添加角色',
                    tab3:'添加所属组'
                  }
                  var validatePass = (rule, value, callback) => {
                    let exp = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{7,10}$/;
                    if (value === "") {
                      callback(new Error("请输入密码"));
                    } else if (!exp.test(value)) {
                      callback(new Error("密码不符合规范"));
                    } else {
                      if (this.form.password2 !== "") {
                        this.$refs.formTable.validateField("password2");
                      }
                      callback();
                    }
                  };
                  var validatePass2 = (rule, value, callback) => {
                    if (value === '') {
                      callback(new Error('请再次输入密码'));
                    } else if (value !== this.form.password) {
                      callback(new Error('两次输入密码不一致!'));
                    } else {
                      callback();
                    }
                  };
                  this.rules={
                    userName :[{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password :[
                      {required: true, message: '请输入密码', trigger: 'blur'},
                      { validator: validatePass, trigger: "blur" }
                    ],
                    password2 :[
                      {required: true, message: '请再次输入密码', trigger: 'blur'},
                      {validator: validatePass2, trigger: 'blur'}
                    ],
                    status2:[{required: true, message: '请选择', trigger: 'blur'}]
                  }
                }
                else{
                  this.loading_all=true
                  this.titleGroup={
                    tab1:'编辑用户信息',
                    tab2:'编辑角色',
                    tab3:'编辑所属组'
                  }
                  this.rules={
                    userName :[{required: true, message: '请输入', trigger: 'blur'}],
                    status2:[{required: true, message: '请选择', trigger: 'blur'}]
                  }
                }
              }
              else if(this.QualityDialogFlag=='car')
              {
                this.visible_car=true
                this.loading=true
                let data={
                  userId:this.formData.id,
                  pageSize:this.pageSize,
                  pageNum:this.pageNum
                }
                getUserCar(data).then(res=>{
                  console.log(res)
                  this.loading=false
                  this.total_car=res.data.total
                  this.tableData=res.data.list
                })
                let params = {
                  groupName: ''
                };
                this.gotGroupList(params)
              }
              else if(this.QualityDialogFlag=='false'){
                this.visible=false
                this.visible_car=false
              }
               let data={
                  pageNum:1,
                  pageSize:100000,
                  roleName:''
                }
                this.getRoleList(data)
                let data2={
                  groupName:''
                }
                this.getGroupList(data2)
            },
        }
  }
</script>

<style scoped>
  .inputBox2{width: 100%;float: left;}
  .smallInput{width: 150px!important;}
  .tableHeader{background-color: #f5f7fa;}
  .left{text-align: left;}
</style>
