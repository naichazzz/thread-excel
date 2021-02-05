<template>
  <div>
    <div class="pageMain">
      <el-form ref="form" label-width="8em"  size="small" style="text-align: left;margin-top: 20px;">
        <el-col :span="6">
          <el-form-item label="菜单名称">
            <el-input v-model="name" placeholder="请输入内容" :clearable='true'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="全部状态">
            <el-select v-model="Status" placeholder="请选择" >
            <el-option
              v-for="item in options_SIMStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6"  style="text-align:left;padding-left:2.8em;">
          <el-button type="primary" @click='searchMenu' v-if="flag.indexOf('查询')>-1" icon="el-icon-search" size="small">查询</el-button>
        </el-col>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>菜单信息列表</span>
      </div>
      <div class="buttonBox">
        <el-button type="primary" size="small" @click="newMenu" v-if="flag.indexOf('新建')>-1" icon="el-icon-plus">新建</el-button>
        <el-button type="danger" size="small" @click='deleteMenu' v-if="flag.indexOf('删除')>-1" icon="el-icon-delete" plain>删除</el-button>
        <!-- <el-button type="primary" size="small" v-if="flag.indexOf('导出')>-1" icon="el-icon-download" plain>导出</el-button> -->
      </div>
      <div class="tableBox">
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            row-key="id"
            stripe
            @selection-change="handleSelectionChange"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :header-cell-style="{color:'#606266'}"
            v-loading="loading"
            max-height="450">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="menuName"
              label="菜单名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="menuType"
              label="菜单编码"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
              <template slot-scope="scope" v-if="scope.row.status">
                <el-tag
                  :type="scope.row.status === true ? 'primary' : 'danger'"
                  disable-transitions
                  >{{scope.row.status==true?'显示':'隐藏'}} </el-tag
                >
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="remark"
              label="备注"
              show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="modify(scope.row)" type="danger"
              size="small"
              plain v-if="flag.indexOf('修改')>-1" icon="el-icon-edit">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400" class="pagination-box">
      </el-pagination> -->
      <!-- 弹出框 -->
      <Dialog :QualityDialogFlag.sync="QualityDialogFlag" @get-list='gotMenuList' :formData='currMenu' :action='action'></Dialog>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/menu/dialog.vue';
  import "@/assets/css/common.css";
  import {menulist,deleteMenu} from "@/api/system/menu";
  export default {
      data() {
        return {
          license:'',
          company:'',
          name:'',
          Status:'',
          apply:'',
          options_SIMStatus:[
            {label:'启用',value:true},
            {label:'停用',value:false},
            {label:'全部',value:''}
          ],
          tableData: [],
          multipleSelection: [],
          QualityDialogFlag:false,
          currentPage: 4,
          loading:true,
          currMenu:{},
          action:0,
          flag:[]
        };
      },
      components:{
        Dialog
      },
      mounted() {
        let data={}
        this.gotMenuList(data)
        this.checkPro(['系统管理','菜单管理','查询'])
        this.checkPro(['系统管理','菜单管理','新建'])
        this.checkPro(['系统管理','菜单管理','修改'])
        this.checkPro(['系统管理','菜单管理','导出'])
        this.checkPro(['系统管理','菜单管理','删除'])
      },
      created() {
        
      },
      methods: {
        // 取menu
        gotMenuList(data){
          menulist(data).then(res=>{
            console.log(res)
            this.tableData=res.data.menus
            // this.changeStatus(this.tableData)
            this.loading=false
          })
        },

        // 查询菜单
        searchMenu(){
          console.log(this.Status)
          this.loading=true
          let data={
            menuName:this.name,
            status:this.Status
          }
          console.log(data)
          this.gotMenuList(data)
        },
        // 删除菜单
        deleteMenu(){
          var that=this
          if(that.multipleSelection.length==0){
            this.$message({
              type: "warning",
              message: "您还未选择菜单",
            });
            return;
          }
          
          that.$confirm('是否确认删除所选信息?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function() {
                  var deleteList=[]
                  for(var i=0;i<that.multipleSelection.length;i++){
                    deleteList.push(that.multipleSelection[i].id)
                  }
                  deleteMenu(deleteList).then(res=>{
                    console.log(res)
                    if(res.code==200){
                      that.$message({
                        message: '删除菜单信息成功',
                        type: 'success'
                      });
                      let data={}
                      that.gotMenuList(data)
                    }
                  })
              })
          },
          
        
        // 编辑菜单
        modify(row){
          this.currMenu=row
          this.action=1
          console.log(row)
          this.QualityDialogFlag = true
        },
        newMenu(){
          this.action=0
          this.currMenu={
            menuName: '',
            parentId:0,
            resource: '显示',
            path:'',
            component:'',
            menuType: "M",
            icon:'',
            status:true
          }
          this.QualityDialogFlag = true
        },
        // handleClick(tab, event) {
        //   this.QualityDialogFlag = true
        // },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          console.log(val)
        },
        deleteRow(index, rows) {
          rows.splice(index, 1);
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        // 查看权限
        checkPro(data){
          this.checkPromis(data).then(res=>{
            if(res){
              this.flag.push(data[2])
            }
          })
        }
      }
    };
</script>

<style>

</style>
