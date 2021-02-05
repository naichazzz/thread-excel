<template>
  <div>
    <el-dialog title="终端信息维护" :visible.sync="visible" :close-on-click-modal="false"
    @close="QualityDialogClose" v-if="visible">
        <el-tabs type="border-card" @tab-click='tabClick' v-model="activeName" :before-leave="beforeHandle">
          <el-tab-pane :label="titleGroup.tab1" name="0">
            <el-form ref="form" :model="form" label-width="100px" class="left" :rules="rules" size="mini" style="text-align: left;">
              <el-form-item label="终端号码" prop="id">
                <el-input v-model="form.id" size="mini" ></el-input>
              </el-form-item>
              <el-form-item label="终端编号">
                <el-input v-model="form.num" size="mini" ></el-input>
              </el-form-item>
              <el-form-item label="终端类型">
                <el-select v-model="form.typeId" placeholder="请选择">
                  <el-option
                    v-for="item in options_terminaType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="协议类型">
                <el-select v-model="form.protocol" placeholder="请选择">
                  <el-option
                    v-for="dict in options_protocol"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    :value="dict.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
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
                </el-select>
              </el-form-item>

              <el-form-item label="安装人员">
                <el-input v-model="form.installPerson" size="mini" ></el-input>
              </el-form-item>
              <el-form-item label="安装时间">
                <el-date-picker
                  v-model="form.installTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDisabled">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="升级时间">
                <el-date-picker
                  v-model="form.upgradeTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDisabled">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-button style="margin-top: 12px;" @click="next(form)" type="primary" plain>下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :label="titleGroup.tab2" name="1">
            <el-input placeholder="请输入内容" v-model="searchGroup" class="input-with-select" size="small">
              <el-select v-model="selectType" slot="prepend" placeholder="请选择" style="width: 100px;">
                <el-option label="按组名" value="1"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click='searchByGroup'></el-button>
            </el-input>
            <el-table
              :data="tableData2"
              style="width: 100%" @row-click='rowClick' :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
              row-key="id"
              ref="groupList"
              @select="select"
              @selection-change="SelectionChangeGroup"
              @select-all='selectAll'
              default-expand-all
              max-height="300px"
              >
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
                prop="name"
                label="父组名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="描述">
              </el-table-column>
            </el-table>
            <el-button style="margin-top: 12px;" @click="next" type="primary" plain>下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :label="titleGroup.tab3" name="2">
            <el-row>
              <el-col :span="24">
                <el-input placeholder="请输入内容" v-model="search" class="input-with-select" size="small" :disabled='disabled'>
                  <el-select v-model="selectType_sim" slot="prepend" placeholder="请选择" style="width: 120px;">
                    <el-option label="按SIM卡号" value="1"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="search_SIM"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-table
                :data="tableData"
                style="width: 100%"
                ref="multipleTable"
                :key="id"
                max-height="300"
                v-loading='loading'>
                
                <el-table-column
                  prop="simNumber"
                  label="SIM卡号"
                 >
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                   
                    <el-button :type="scope.row.state=='1' ? 'info':'primary'" @click="bangka(scope.row, scope.$index)" :disabled="scope.row.state=='1'?true:false">绑卡</el-button>
                    <el-button :type="scope.row.state=='0' ? 'info':'primary'" @click="bangka(scope.row,scope.$index)" :disabled="scope.row.state=='0'?true:false">解绑</el-button>
                    
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" style="margin-top: 12px;" @click="commintInfo">确 定</el-button>
          </el-tab-pane>
        </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import "@/assets/css/dialogstyle.css"
  import Transfer from '@/components/transfer.vue';
  import { addlist,modifylist} from "@/api/system/terminal.js";
  import { grouplist} from "@/api/system/group";
  import * as terminalType from "@/api/system/terminalType.js";
  import {searchSim} from "@/api/system/SIMCard";
  export default{
    // components: { IconSelect },
    data(){
      return{
          visible: false,
          form: {
              id: '',
              num:'',
              type:'',
              protocol:'',
              idCardState:'',
              installPerson:'',
              installTime:'',
              upgradeTime:''
            },
          rules:{
            id :[{required: true, message: '请输入', trigger: 'blur'}],
          },
          search:'',
          selectType:'按组名',
          selectType_sim:'1',
          terminalTitle:[
            {title:'SIM卡号',value:'name'}
          ],
          tableData:[],
          tableData2:[

          ],
          searchGroup:'',
          options_terminaType:{},
          options_protocol:{},
          simNumber:'',
          selectSIM:'',
          selectedList:'',
          disabled:false,
          id:0,
          activeName:'0',
          titleGroup:{
            tab1:'添加终端信息',
            tab2:'添加所属组',
            tab3:'添加SIM卡号'
          },
          pickerDisabled: {
            disabledDate: (time) => {
              return time.getTime() > new Date() * 1 + 600 * 1000;
            }
          },
          scrollTop:0,
          loading:false
      }
    },
    components:{
      Transfer
    },
    props:{
      QualityDialogFlag:{
                  default: false
              },
      formData:{
         type: Object,
         default:function(){
         				return {
                 id: '',
                 num:'',
                 typeId:'',
                 protocol:'',
                 idCardState:'',
                 installPerson:'',
                 installTime:'',
                 upgradeTime:''
               };
         			}

      },
      type:''
    },
    created() {
      // this.terminalType()
      this.getDicts("sys_termina_protocol").then(response => {
        this.options_protocol = response.data;
      });
      
    },
    methods: {
          next(){
              if(this.activeName=='0'){
                this.$refs.form.validate((valid)=>{
                  if(valid){
                    this.activeName='1'
                    let e={
                      label:'添加所属组'
                    }
                    this.tabClick(e)
                  }
                  else{
                    return false
                  }
                })


              }
              else if(this.activeName=='1'){
                if(this.selectedList.length>0){
                  this.activeName='2'
                  let e={
                    label:'添加SIM卡号'
                  }
                  this.tabClick(e)
                }
                else{
                  this.$message({
                      message: '请选择所属组',
                      type: 'info'
                    });
                }
              }
            },
            // tab切换加判断条件
            beforeHandle(e){
              var flag
              if(e==1){
                this.$refs.form.validate((valid)=>{
                  if(!valid){
                   flag=false
                  }
                  return flag
                })
              }
              else if(e==2){
                this.$refs.form.validate((valid)=>{
                  if(!valid){
                   flag=false
                  }
                  else{
                    if(this.selectedList.length==0){
                      this.$message({
                          message: '请选择所属组',
                          type: 'info'
                        });
                      flag=false
                    }
                  }
                  return flag
                })
              }
              return flag
            },
            commintInfo(){
              this.$refs.form.validate((valid)=>{
                if(valid){
                 
                  this.form.simCardId=this.selectSIM
                  
                  if(this.type=='new'){
                    if(this.selectedList.length==0){
                      this.$message({
                                  message: '需指定组',
                                  type: 'error'
                                });
                      return
                    }
                    //  this.form.groupId=this.selectedList.id
                     console.log(this.form)
                    addlist(this.form).then(res=>{
                      console.log(res)
                      if(res.code==200){
                        // 绑组
                        this.$message({
                                  message: '新增终端信息成功',
                                  type: 'success'
                                });
                         this.$emit("child-event");
                       
                         this.QualityDialogClose()
                      }
                      else{
                        this.$message({
                                  message: res.message,
                                  type: 'error'
                                });
                      }
                      
                    })
                  }
                  else if(this.type=='modify'){
                    console.log(this.selectedList)
                    if(this.selectedList.length==0){
                      this.$message({
                                  message: '需指定组',
                                  type: 'error'
                                });
                      return
                    }
                    console.log(this.form)
                      modifylist(this.form).then(res=>{
                        if(res.code==200){
                          this.$message({
                                    message: '修改终端信息成功',
                                    type: 'success'
                                  });
                           this.$emit("child-event");    
                          this.QualityDialogClose()
                        }
                        else{
                          this.$message({
                                    message: res.message,
                                    type: 'error'
                                  });
                        }
                     
                      })
                  }
                }
                else{
                  this.$message({
                                  message: '需填写终端号码',
                                  type: 'error'
                                });
                  return false
                }
              })
            },
            // 取group
            gotGroupList(data){
              grouplist(data).then(res=>{
                console.log(res)
                this.tableData2=res.data
                if(this.form.groupId){
                  var that=this
                  that.findGroup(that.tableData2)
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
              },500)

            },
            // 取终端类型
            terminalType(){
              let data={
                pageNum: 1,
                pageSize: 100,
              }
              terminalType.getList(data).then(res=>{
                console.log(res)
                this.options_terminaType=res.data.list
              })
            },
            QualityDialogClose() {
                this.$emit("update:QualityDialogFlag", false);
                this.selectSIM=''
                this.activeName='0'
            },
            // 搜索SIM卡
            search_SIM(){
              console.log(this.selectType_sim)
              if(this.selectType_sim==2){
                  let params = {
                  groupName: this.search
                };
                grouplist(params).then(res=>{
                  console.log(res)
                })

              }
              else if(this.selectType_sim==1){
                this.simNumber=this.search;
                let par = {
                  pageNum: 1,
                  pageSize: 1000000000,
                  simNumber:this.simNumber,
                  bindStatus:0
                };
                this.loadData(par)
              }
            },
            // 切换tab
            tabClick(e){
              console.log(e)
              if(e.label=='添加所属组'||e.label=='编辑所属组'){
                // let params = {
                //   groupName: this.searchGroup
                // };
                // this.gotGroupList(params)
              }
              else if(e.label=='添加SIM卡号'||e.label=='编辑SIM卡号'){
                this.loading=true
                // 监听滚动条
                this.$refs.multipleTable.bodyWrapper.addEventListener('scroll', (res) => {
                  let height = res.target
                  this.scrollTop = height.scrollTop
                  console.log(this.scrollTop)
                },false)
                let par
                if(this.form.simNumber){
                  par = {
                    pageNum: 1,
                    pageSize: 1000000000,
                    simNumber:this.form.simNumber,
                    bindStatus:1,
                    gid:this.form.groupId
                  };
                  this.disabled=true
                }
                else{
                  par = {
                    pageNum: 1,
                    pageSize: 1000000000,
                    simNumber:this.simNumber,
                    bindStatus:0,
                    gid:this.form.groupId
                  };
                  this.disabled=false
                  
                }
                this.loadData(par)
              }

            },
            loadData(par) {
              
              searchSim(par).then((res) => {
                console.log(res)
                this.loading=false
                this.tableData = res.data.list;
                this.tableData.forEach(item=>{
                    item.state=0
                  })
                if(this.form.simCardId){
                  this.tableData.forEach(item=>{
                    if(item.id==this.form.simCardId){
                        item.state=1
                    }
                 
                  })
                  this.selectSIM=this.form.simCardId
                }
                else if(this.selectSIM!=''){
                  this.tableData.forEach(item=>{
                    if(item.id==this.selectSIM){
                        item.state=1
                    }
                 
                  })
                }
                
              });
            },
            // 查询组
            searchByGroup(){
              let params = {
                groupName: this.searchGroup
              };
              this.gotGroupList(params)
            },
            handleSelectionChange(){

            },
            // 绑卡
            
            bangka(row,id){ 
             console.log(row)
             this.loading=true
             if(row.state==1){
               this.tableData[id].state=0
               this.selectSIM=''
             }
             else{
               this.tableData.forEach(item=>{
                    this.$set(item,'state',0)
                  })
                this.tableData[id].state=1
                this.selectSIM=this.tableData[id].id
                
                console.log(id)
             }
            this.id=this.id+1
            setTimeout(() => {
              // var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
              this.$refs.multipleTable.bodyWrapper.scrollTop = this.scrollTop
              // console.log(scrollTop)
              console.log(this.scrollTop)
              // 监听滚动条
                this.$refs.multipleTable.bodyWrapper.addEventListener('scroll', (res) => {
                  let height = res.target
                  this.scrollTop = height.scrollTop
                  console.log(this.scrollTop)
                },false)
                this.loading=false
              }, 10)
            },
            // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
            select(selection, row){
              console.log(row)
              // this.selectedList =row;
              this.form.groupId=row.id
              this.$refs.groupList.clearSelection();
              if(selection.length == 0) return ;
              this.$refs.groupList.toggleRowSelection(row, true);
              
            },
            SelectionChangeGroup(row){
                this.selectedList =row;
                console.log(this.selectedList)
            },
            rowClick(row){
              console.log(this.radioId)
            },
            selectAll(){
              this.$message({
                                  message: '只能选择一个组',
                                  type: 'warning'
                                });
            }
    },
    watch: {
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
            if(this.visible){
              this.terminalType()
              let params = {
                  groupName: this.searchGroup
                };
                this.gotGroupList(params)
              
            }
        },
        formData(value){
          let { ...foa } = this.formData;
          this.form=foa;
          if(this.formData.id==''){
            this.titleGroup={
              tab1:'添加终端信息',
              tab2:'添加所属组',
              tab3:'添加SIM卡号'
            }
          }
          else{
            this.titleGroup={
              tab1:'编辑终端信息',
              tab2:'编辑所属组',
              tab3:'编辑SIM卡号'
            }
          }
        }
    }
  }
</script>

<style>
</style>
