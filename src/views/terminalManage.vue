<template>
  <div>
    <div class="pageMain">
      <el-form ref="form" :model="form" label-width="8em"  size="small" style="text-align: left;margin-top: 20px;">
        <el-col :span="6">
          <el-form-item label="终端状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in options_Status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终端类型">
            <el-select v-model="form.typeId" placeholder="请选择" :clearable='true'>
              <el-option
                v-for="item in options_terminaType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终端号码">
            <el-input v-model="form.id" placeholder="请输入内容" :clearable='true'></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="通讯类型">
            <el-select v-model="form.communicationType" placeholder="请选择">
              <el-option
                v-for="dict in options_communiType"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份识别卡">
            <el-select v-model="form.idCardState" placeholder="请选择">
              <el-option
                label="有"
                value="有">
              </el-option>
              <el-option
                label="无"
                value="无">
              </el-option>
              <el-option
                label="全部"
                value="">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属组">
            <treeselect
                v-model="form.groupId"
                :options="groupOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                style="height:28px !important"
                size='small'
              />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:left;padding-left:2.8em;">
          <el-button type="primary" size="small" @click='search' v-if="flag_per.indexOf('查询')>-1" icon="el-icon-search">查询</el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>终端信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button type="primary" size="small" @click='handleClick' v-if="flag_per.indexOf('新建')>-1" icon="el-icon-plus">新建</el-button>
        <el-button size="small" @click='handleDelete' v-if="flag_per.indexOf('删除')>-1" icon="el-icon-delete"
          type="danger"
          plain>删除</el-button>
        <el-button type="primary" size="small" @click="handleExport" v-if="flag_per.indexOf('导出')>-1" icon="el-icon-download" plain>导出</el-button>
      </div>
      <div class="tableBox">
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{color:'#606266'}"
            @selection-change="handleSelectionChange"
            max-height="450"
            v-loading="loading"
            stripe
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="终端号码"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="终端类型"
            >
            </el-table-column>
            <el-table-column
              prop="groupName"
              label="所属组"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="communicationType"
              label="通讯类型"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="installTime"
              label="安装时间"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="installPerson"
              label="安装者"
              >
            </el-table-column>
            <el-table-column
              
              label="终端状态"
            >
              <template slot-scope="scope" v-if="scope.row.status">
                <el-tag
                  :type="scope.row.status === '可用' ? 'primary' : 'danger'"
                  disable-transitions
                  >{{ scope.row.status }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="idCardState"
              label="身份识别卡"
              width="100"
              >
            </el-table-column>
            <el-table-column
              prop="protocol"
              label="协议类型"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="num"
              label="终端编号"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="upgradeTime"
              label="最后升级时间"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="danger" size="small" plain v-if="flag_per.indexOf('修改')>-1" icon="el-icon-edit">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-sizes="[20,50,100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" class="pagination-box">
      </el-pagination>
      <!-- 弹出框 -->
      <Dialog :QualityDialogFlag.sync="QualityDialogFlag" @child-event='getList' :formData='currTerminal' :type='type'></Dialog>
    </div>
  </div>
</template>

<script>
  import "@/assets/css/common.css"
  import Dialog from '@/components/terminal/dialog.vue';
  import {getlist,deletelist,modifylist,exportUser} from "@/api/system/terminal.js";
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { grouplist} from "@/api/system/group";
  import * as terminalType from "@/api/system/terminalType.js";
  import fileDownload from "js-file-download";
  export default {
      data() {
        return {
          license:'',
          company:'',
          SIMCard:'',
          SIMStatus: '',
          terminaType:'',
          licenseType:'',
          Equipmentstatus:'',
          options_Status:[
            {
              value: '',
              label: '全部'
            }, {
              value: '已用',
              label: '已用'
            }, {
              value: '可用',
              label: '可用'
            }
          ],
          options_terminaType:[],
          options_licenseType:[],
          options_communiType:[],

          options_Equi:[],
          tableData: [],
          multipleSelection: [],
          QualityDialogFlag:false,
          pageSize:20,
          pageNum:1,
          total:0,
          groupOptions:[],
          group:0,
          form:{
            status:'',
            idCardState:'',
            typeId:'',
            id:'',
            communicationType:'全部',
            groupId:this.$store.state.user.groupId,
          },
          currTerminal:{},
          type:'',
          flag_per:[],
          loading:false
        };
      },
      components:{
        Dialog,
        Treeselect
      },
      created() {
        this.getList()
        let params = {
          groupName: ''
        };
        this.gotGroupList(params)
        this.terminalType()
        this.getDicts("sys_communi_type").then(response => {
          this.options_communiType = response.data;
          console.log(response.data)
        });
        this.checkPro(['基本信息管理','终端管理','查询'])
        this.checkPro(['基本信息管理','终端管理','新建'])
        this.checkPro(['基本信息管理','终端管理','修改'])
        this.checkPro(['基本信息管理','终端管理','导出'])
        this.checkPro(['基本信息管理','终端管理','删除'])
      },
      methods: {
        getList(){
          this.loading=true
          let { ...foa } = this.form;
          let data=foa
          if(this.form.communicationType=='全部'){
            data.communicationType=''
          }
          data.pageSize=this.pageSize
          data.pageNum=this.pageNum
          console.log(data)
          getlist(data).then(res=>{
            console.log(res)
            if(res.code==200){
              this.total=res.data.total
              this.tableData=res.data.list
            }
            else{
              this.$message({
                      message: res.message,
                    });
            }
            this.loading=false
          })
        },
        // 修改
        modify(row){
          console.log(row)
          this.QualityDialogFlag = true
          this.currTerminal=row
          this.type='modify'
        },
        // 查询列表
        search(){
          this.getList()
        },
        // 删除终端
        handleDelete() {
          var val = this.multipleSelection;
          console.log(val)
          if(!val.length){
            this.$message({
                      message: '请选择要删除的终端',
                    });
             return
          }
          var id=[]
          val.forEach(function(item) {
            id.push(item.id)
          })
          var that=this
          that.$confirm('是否确认删除所选信息?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function() {
                  console.log(id)
                  deletelist(id).then(res=>{
                    console.log(res)
                    if(res.code==200){
                      that.$message({
                                message: '删除终端信息成功',
                                type: 'success'
                              });
                      that.getList()
                    }
                    else{
                      that.$message({
                                message: res.message,
                                type:'error'
                              });
                    }
                  })
                })
        },
        // 取终端类型
        terminalType(){
          let data={
            pageNum: 1,
            pageSize: 10000000,
          }
          terminalType.getList(data).then(res=>{
            console.log(res)
            this.options_terminaType=res.data.list
          })
        },
        handleClick(tab, event) {
          this.QualityDialogFlag = true
          this.currTerminal={
            id: '',
            num:'',
            type:'',
            protocol:'',
            idCardState:'无',
            installPerson:'',
            installTime:'',
            upgradeTime:'',
            groupId:this.$store.state.user.groupId
          }
          this.type='new'
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },

        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageSize=val
          this.getList()
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          let { ...foa } = this.form;
          let data=foa
          if(this.form.communicationType=='全部'){
            data.communicationType=''
          }
          data.pageSize=this.pageSize
          data.pageNum=val
          this.loading=true
          console.log(data)
          getlist(data).then(res=>{
            console.log(res)
            if(res.code==200){
              this.total=res.data.total
              this.tableData=res.data.list
            }
            else{
              this.$message({
                      message: res.message,
                    });
            }
            this.loading=false
          })
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
        /** 导出按钮操作 */
        handleExport() {
          let { ...foa } = this.form;
          let data=foa
          if(this.form.communicationType=='全部'){
            data.communicationType=''
          }
          data.pageSize=this.pageSize
          data.pageNum=this.pageNum
          var that=this
          this.$confirm('是否确认导出终端数据?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function() {
              exportUser(data).then(res=>{
                console.log(res)
                fileDownload(res,'终端信息表导出'+that.localTime()+'.xlsx'); 
              })
            })
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

<style scoped="scoped">
  .vue-treeselect__control{width: 196px!important ;height: 28px !important;z-index: 99999;}
  .inputBox{position: relative;overflow: auto;}
</style>
