<template>
    <div>
        <el-form ref="form" label-width="6em"  size="mini" style="text-align: left;margin-top: 20px;">
            <el-col :span="6">
                <el-form-item label="围栏名称">
                    <el-input v-model="form.name" placeholder="请输入内容" size="mini" :clearable='true'></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="形状类型">
                <el-select v-model="form.graphType" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in options_shape"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="报警类型">
                <el-select v-model="form.alarmType" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in options_status"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="">
                <el-button type="primary" size="mini" @click='searchInfo' icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-col>
            <div style="clear: both"></div>
        </el-form>
        <div class="buttonBox">
            <el-button type="primary" size="small" @click="createFence" icon="el-icon-plus">新建</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" plain @click="deleteFence">删除</el-button>
            <el-button type="primary" size="small" icon="el-icon-upload2" plain >导入电子围栏</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" plain @click="exportList">导出电子围栏</el-button>
        </div>
        <div class="tableBox">
            <el-divider content-position="left">查询结果</el-divider>
            <el-table
            :data="infoList"
            style="width: 100%"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
            v-loading="loading"
            border
            max-height="450">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="围栏名称"
                >
                </el-table-column>
                <el-table-column
                    prop="graphType"
                    label="形状类型"
                    :formatter="shapeFormat"
                >
                </el-table-column>
                <el-table-column
                    prop="alarmType"
                    label="报警类型"
                    :formatter="statusFormat"
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="230">
                    <template slot-scope="scope">
                        <el-button @click="modify(scope.row)" type="text" size="small" icon="el-icon-edit">编辑</el-button>
                        <el-button type="text" size="small" @click="checkShape(scope.row)" icon="el-icon-view">查看形状</el-button>
                        <el-button type="text" size="small" icon="el-icon-truck" @click="chooseCar(scope.row)">选择车辆</el-button>
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
        <Dialog :QualityDialogFlag.sync="QualityDialogFlag" :fatherType="fatherType" @get-list='refresh' :fenceId='fenceId'></Dialog>
        <DialogCar :QualityDialogFlag.sync="QualityDialogFlag_car" :fenceId='fenceId'></DialogCar>
        <DialogShape :QualityDialogFlag.sync="QualityDialogFlag_shape"></DialogShape>
    </div>
</template>
<script>
import Dialog from '@/components/electronicFence/index.vue';
import DialogCar from '@/components/electronicFence/chooseCar.vue';
import DialogShape from '@/components/electronicFence/checkShape.vue';
import { getList,deleteItem,exportData} from "@/api/system/terminalSetting/electronicFence.js";
import fileDownload from "js-file-download";
export default {
    data(){
        return{
            form:{
                name:'',
                alarmType:'0',
                graphType:'0'
            },
            infoList:[{
                name:'围栏一',
                shape:'圆形'
            }],
            multipleSelection:'',
            total:0,
            pageSize:5,
            pageNum:1,
            QualityDialogFlag:false,
            options_status:[],
            options_shape:[
                
            ],
            fatherType:'new',
            QualityDialogFlag_car:false,
            QualityDialogFlag_shape:false,
            fenceId:0,
            loading:false
        }
    },
    components:{
        Dialog,
        DialogCar,
        DialogShape
      },
    created(){
        this.getFenceList()
        this.getDicts("sys_report_type").then(response => {
            this.options_status = response.data;
        });
        this.getDicts("sys_graph_type").then(response => {
            this.options_shape = response.data;
        });
    },
    methods:{
        getFenceList(){
            this.loading=true
            let { ...data } = this.form
            if(this.form.alarmType=='0'){
                data.alarmType=''
            }
            if(this.form.graphType=='0'){
                data.graphType=''
            }
            data.pageSize=this.pageSize
            data.pageNum=this.pageNum
            data.groupId=this.$store.state.user.groupId
            getList(data).then(res=>{
                console.log(res)
                if(res.code==200){
                    this.infoList=res.data.list
                    this.total=res.data.total
                }
                else{
                    this.$message({
                                message: res.message,
                                type: 'error'
                              });
                }
                this.loading=false
            })
        },
        refresh(){
          this.pageNum=1
          this.getFenceList()
        },
        exportList(){
            let { ...data } = this.form
            if(this.form.alarmType=='0'){
                data.alarmType=''
            }
            if(this.form.graphType=='0'){
                data.graphType=''
            }
            data.pageSize=this.pageSize
            data.pageNum=this.pageNum
             var that=this
            that.$confirm('是否确认导出所有用户数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }).then(function(){
                    exportData(data).then(res=>{
                        console.log(res)
                        fileDownload(res,'电子围栏信息表导出'+that.parseTime(new Date() )+'.xlsx'); 
                    })
                })
        },
        deleteFence(){
            if(this.multipleSelection==''||this.multipleSelection.length==0){
                this.$message({
                    type: "warning",
                    message: "您还未选择电子围栏",
                });
                return;
            }
            var deleteList=[]
            this.multipleSelection.forEach(element => {
                deleteList.push(element.id)
            });
            let data={
                electricFenceIds:deleteList
            }
            var that=this
            that.$confirm('是否确认删除所选信息?', "警告", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(function(){
                    deleteItem(data).then(res=>{
                        if(res.code==200){
                            that.$message({
                                type: "success",
                                message: "删除电子围栏成功",
                            });
                        }
                        else{
                            that.$message({
                                message: res.message,
                            });
                        }
                        that.pageNum=1
                        that.getFenceList()
                    })
                })
            
        },
        // 字典状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.options_status, row.alarmType);
        },
        shapeFormat(row, column) {
            return this.selectDictLabel(this.options_shape, row.graphType);
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          console.log(val)
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageSize=val
          this.getFenceList()
        },
        handleCurrentChange(val) {
            this.loading=true
            let { ...data } = this.form
            if(this.form.alarmType=='0'){
                data.alarmType=''
            }
            if(this.form.graphType=='0'){
                data.graphType=''
            }
            data.pageSize=this.pageSize
            data.pageNum=val
            data.groupId=this.$store.state.user.groupId
            getList(data).then(res=>{
                if(res.code==200){
                    this.infoList=res.data.list
                    this.total=res.data.total
                }
                else{
                    this.$message({
                                message: res.message,
                                type: 'error'
                              });
                }
                this.loading=false
            })
        },
        createFence(){
            this.QualityDialogFlag=true
            this.fatherType='new'
        },
        modify(row){
            this.QualityDialogFlag=true
            this.fatherType='modify'
            this.fenceId=row.id
        },
        chooseCar(row){
            this.QualityDialogFlag_car=true
            this.fenceId=row.id
        },
        checkShape(){
            this.QualityDialogFlag_shape=true
        },
        searchInfo(){
            this.getFenceList()
        }
    }
}
</script>
<style scoped>
    .buttonBox{
        display: flex;
        margin-left: -5px;
    }
    .buttonBox .el-button{
        margin: 5px 8px 5px 0;
    }
</style>