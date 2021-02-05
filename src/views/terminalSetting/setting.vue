<template>
    <div style="text-align:left;">
      <div class="pageMain">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 20px;" label-width="5em" size="small">
            <el-form-item label="选择参数">
                <el-select v-model="value1" placeholder="请选择">
                    <el-option
                    v-for="item in options1"
                    :key="item.dictLabel"
                    :label="item.dictLabel"
                    :value="item.dictValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="value2" placeholder="请选择">
                    <el-option
                    v-for="item in options2"
                    :key="item.dictLabel"
                    :label="item.dictLabel"
                    :value="item.dictValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="valueText" :clearable='true'></el-input>
            </el-form-item>
        </el-form>
      </div>
      <div class="fengeLine"></div>
      <div class="pageMain">
          <div class="titleLine">
            <el-divider direction="vertical"></el-divider>
            <span>车辆信息列表</span>
          </div>
          <el-table
          :data="tableData"
          :header-cell-style="{color:'#606266'}"
          style="width: 100%"
          stripe>
          <!-- <el-table-column
                type="index"
                label="序号"
                width="70"
                :index="index">
              </el-table-column> -->
          <el-table-column
            prop="numberPlate"
            label="车牌号"
            >
          </el-table-column>
          <el-table-column
            prop="simNumber"
            label="SIM卡号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="chassisNumber"
            label="VIN"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="企业名称"
            >
          </el-table-column>
          <el-table-column
            prop="terminalType"
            label="终端类型"
            >
          </el-table-column>
          <el-table-column
            prop="terminalNumber"
            label="终端号码"
          show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="onlineStatus"
            label="在线状态"
            >
          </el-table-column>
          <el-table-column
            prop="type"
            label="车辆类型"
            >
          </el-table-column>
          <el-table-column
            prop="communicationType"
            label="通讯类型"
            >
          </el-table-column>
        </el-table>
        <div class="button-box">
            <el-button type="primary" style="float: left;" @click="handleClick" icon="el-icon-search">选择车辆</el-button>
            <el-button type="primary" @click="onSubmit" plain style="float: left;">设置</el-button>
        </div>
      </div>
        <!-- 弹出框 -->
        <Dialog :QualityDialogFlag.sync="QualityDialogFlag" @select-item-list='getList'></Dialog>
    </div>
</template>
<script>
    import Dialog from '@/components/map/dialog.vue';
    import {uploadInfo} from "@/api/system/terminalSetting/setting.js";
  export default {
    data() {
      return {
        formInline: {
          value1:'',
          value2:''
        },
        value1:'',
        value2:'',
        options1:[],
        options2:[],
        tableData:[],
        QualityDialogFlag:false,
        index:0,
        valueText:''
      }
    },
    components: {
        Dialog
      },
    created(){
        this.getDicts("sys_system_setting").then(response => {
            console.log(response)
            this.options1 = response.data;
        });
    },
    methods: {
        getList(data){
          this.tableData=data
        //   this.getDicts("sys_online_status").then(response => {
        //     this.options_online = response.data;
        //   });
        },
        handleClick(tab, event) {
          this.QualityDialogFlag = true
        },
        onSubmit() {
            console.log(this.value2);
            if(this.tableData==[]||this.tableData.length==0){
                this.$message({
                      message: '请选择车辆',
                      type: 'info'
                    });
                return
            }
            var deviceIdList=[]
            this.tableData.forEach(function(item){
                deviceIdList.push(item.deviceId)
            })
            let data={
                deviceIdList:deviceIdList,
                id:this.value2,
                value:this.valueText
            }
            uploadInfo(data).then(res=>{
                console.log(res)
                if(res.code==200){
                  this.$message({
                      message: '参数设置成功',
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
        }   
    },
    watch:{
        value1(val){
            console.log(this.value1)
            this.value2=''
            this.getDicts(this.value1).then(response => {
                console.log(response)
                this.options2 = response.data;
            });
        }
    }
  }
</script>
<style scoped>
  .button-box{width: 100%;overflow: hidden;padding-bottom: 10px;margin-top: 10px;}
</style>