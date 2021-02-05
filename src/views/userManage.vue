<template>
  <div>
    <div class="pageMain">
      <el-form ref="form" label-width="6em"  size="small" style="text-align: left;margin-top: 20px;">
        <el-col :span="6">
          <el-form-item label="用户名">
            <el-input data-cy="use-search-input" v-model="name" placeholder="请输入内容" :clearable='true'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select data-cy="use-screen-use-status-select" v-model="status" placeholder="请选择">
              <el-option
                v-for="item in options_status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属组">
            <treeselect
                data-cy="use-screen-group-treeselect"
                v-model="groupId"
                :options="groupOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                style="height:28px !important"
                size='small'
              />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色名">
            <el-input data-cy="use-role-input" v-model="role" placeholder="请输入内容" :clearable='true'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备注">
            <el-input data-cy="use-remarks-input" v-model="remark" placeholder="请输入内容" :clearable='true'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;">
          <el-button data-cy="use-search-button" type="primary"  @click='searchInfo' v-if="flag.indexOf('查询')>-1" icon="el-icon-search" size="small">查询</el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>用户信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button type="primary" size="small" @click="handleClick2(1)" v-if="flag.indexOf('新建')>-1" icon="el-icon-plus">新建</el-button>
        <el-button type="danger" size="small" @click='handleDelete' v-if="flag.indexOf('删除')>-1" icon="el-icon-delete" plain>删除</el-button>
        <el-button type="primary" size="small" v-if="flag.indexOf('导出')>-1" @click="exportData" icon="el-icon-download" plain>导出</el-button>
      </div>
      <div class="tableBox">
        <el-table
            data-cy="use-data-table"
            :data="userList"
            style="width: 100%"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :header-cell-style="{color:'#606266'}"
            v-loading="loading"
            stripe
            max-height="450"
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
            >
            </el-table-column>
            <el-table-column
              prop=""
              label="状态"
              >
              <template slot-scope="scope" v-if="scope.row.status2">
                <el-tag
                    :type="scope.row.status2 === '启用'? 'primary' : 'danger'"
                    disable-transitions
                    >{{scope.row.status2}} </el-tag
                  >
              </template>
            </el-table-column>
            <el-table-column
              label="角色"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-for="role in userList[scope.$index].userRoleList" :key="role.roleName">{{role.roleName}} </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="group.groupName"
              label="所属组"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="nickName"
              label="全名">
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="联系电话"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createBy"
              label="创建者">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="320">
              <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="handleClick(scope.row)" icon="el-icon-view">查看车辆</el-button>
                <el-button type="danger" size="small" plain @click="handleClick2(scope.row)" v-if="flag.indexOf('修改')>-1" icon="el-icon-edit">编辑</el-button>
                <el-button type="info" size="small" plain @click="handleClick_CP(scope.row)" icon="el-icon-unlock">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-sizes="[5,100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total='total' class="pagination-box">
      </el-pagination>
      <!-- 弹出框 -->
      <Dialog :QualityDialogFlag.sync="QualityDialogFlag" :formData='currUser' :type='type' @get-list='refresh'></Dialog>
    </div>
  </div>
</template>

<script>
  import "@/assets/css/common.css"
  import Dialog from '@/components/dialog.vue';
  import {listUser,deleteUser,newUser,exportData,resetPsw} from "@/api/system/user";
  import fileDownload from "js-file-download";
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { grouplist} from "@/api/system/group";
  export default {
      data() {
        return {
          name:'',
          status:'',
          groupId:undefined,
          role:'',
          remark:'',
          options_status:[
            {label:'启用',value:true},
            {label:'停用',value:false},
            {label:'全部',value:''}
          ],
          userList:[],
          multipleSelection: [],
          QualityDialogFlag: false,
          form: {
            name: '',
            status:'',
            group:'',
            role:'',
            remark:''
          },
          formLabelWidth: '100px',
          // 遮罩层
          loading: true,
          total:0,
          currUser:{},
          type:'0',
          pageSize:5,
          pageNum:1,
          flag:[],
          groupOptions:[]
        };
      },
      components:{
        Dialog,
        Treeselect
      },
      props: {
              // QualityDialogFlag: {
              //     default: false
              // },
          },
      created() {
        let data={
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        this.getList(data)
        let params = {
          groupName: ''
        };
        this.gotGroupList(params)
        // console.log(this.checkPro(['基本信息管理','用户管理','查询']))
        this.checkPro(['系统管理','用户管理','查询'])
        this.checkPro(['系统管理','用户管理','新建'])
        this.checkPro(['系统管理','用户管理','修改'])
        this.checkPro(['系统管理','用户管理','导出'])
        this.checkPro(['系统管理','用户管理','删除'])
      },

      methods: {
        /** 查询用户列表 */
        getList(data) {
          this.loading = true;
          listUser(data).then(response => {
            console.log(response)
            if(response.code==200){
              console.log(this.pageNum)
              this.userList = response.data.list;
              this.total=response.data.total
              
              for(var i=0;i<this.userList.length;i++){
                if(this.userList[i].status==false){
                  this.userList[i].status2='停用'
                }
                else if(this.userList[i].status==true){
                  this.userList[i].status2='启用'
                }
              }
            }
            else{
              this.$message({
                      message: response.message,
                      type: 'info'
                    });
            }
            this.loading = false;
            }
          );

        },
        refresh(){
          this.pageNum=1
          console.log(this.pageNum)
          let data={
            pageNum:1,
            pageSize:this.pageSize
          }
          this.getList(data)
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
        // 取group
        gotGroupList(data){
          grouplist(data).then(res=>{
            console.log(res)
            this.groupOptions = this.handleTree(res.data, "id");
            // console.log(this.groupOptions)
            // this.group=this.groupOptions[0].id
          })
        },
        // 查看权限
        checkPro(data){
          this.checkPromis(data).then(res=>{
            if(res){
              this.flag.push(data[2])
            }
          })
        },
        // 查询用户
        searchInfo(){
          this.pageNum=1
          let data={
            userName:this.name,
            status:this.status,
            groupId:this.groupId,
            roleName:this.role,
            remark:this.remark,
            pageSize:this.pageSize,
            pageNum:1
          }
          this.getList(data)
        },
        // 导出
        exportData(){
          let data={
                userName:this.name,
                status:this.status,
                group:this.group,
                roleName:this.role,
                remark:this.remark,
                pageSize:this.pageSize,
                pageNum:this.pageNum
              }
          var that=this
          that.$confirm('是否确认导出用户数据?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function() {
              
              exportData(data).then(res=>{
                console.log(res)
                fileDownload(res,'用户信息表导出'+that.localTime()+'.xlsx'); 
              })
            })
        },
        handleClick(row) {
          this.QualityDialogFlag = 'car'
          console.log(row);
          this.currUser=row
        },
        // 重置密码
        handleClick_CP(row){
          resetPsw(row.id).then(res=>{
            console.log(res)
            if(res.code==200){
              this.$message({
                                message: res.data,
                                type: 'success'
                              });
            }
            else{
              this.$message({
                                message: res.message,
                                type: 'error'
                              });
            }
          })
        },
        handleClick2(row) {
          if(row!=1){
            this.currUser=row
            this.type='modify'
          }
          else{
            this.currUser={
              id:'',
              userName: '',
              password: '',
              status: '',
              nickName: '',
              phoneNumber: '',
              email: '',
              remark: '',
              createBy:'',
              status2:'启用'
            }
            this.type='new'
          }
          this.QualityDialogFlag = 'user'
          console.log(row);
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          console.log(val)
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageSize=val
          this.searchInfo()
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          let data={
            pageNum:val,
            pageSize:this.pageSize
          }
          this.getList(data)
        },
        // 删除用户
        handleDelete() {
          if(this.multipleSelection.length==0){
            this.$message({
              message: "请选择要删除的数据"
            });
            return
          }
              var that = this;
              var val = this.multipleSelection;
              if (val) {
                // val.forEach(function(item, index) {
                //   that.userList.forEach(function(itemI, indexI) {
                //     if (item === itemI) {
                //       that.userList.splice(indexI, 1);
                //       console.log(itemI)
                //     }
                //   });
                // });
                var deleteUserG=[]
                for(var i=0;i<val.length;i++){
                  deleteUserG.push(val[i].id)
                }
                let data={
                  userids:deleteUserG
                }
                that.$confirm('是否删除所选账户?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function() {
                  deleteUser(data).then(res=>{
                    console.log(res)
                    if(res.code==200){
                      that.$message({
                                message: '删除用户信息成功',
                                type: 'success'
                              });
                      that.$refs.multipleTable.clearSelection();
                    }
                    that.searchInfo()
                  })
                })
              }
              
            }
      }
    };
</script>

<style scoped>
  .inputBox2{width: 80%;float: left;}
</style>
