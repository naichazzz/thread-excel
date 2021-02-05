<template>
  <div style="text-align: left;">
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>设置参数选项</span>
      </div>
      <div style="display:flex;padding-bottom:10px">
            <div style="width:240px;border-right: 1px #eeeeee solid; padding-right:20px;min-width:240px">
              <el-radio-group v-model="radio">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-radio :label="1">车辆信息</el-radio>
                    <el-radio :label="2">脉冲系数</el-radio>
                    <el-radio :label="3">初次安装日期</el-radio>
                  </el-col>
                  <el-col :span="12">
                    <el-radio :label="4">记录仪时间</el-radio>
                    <el-radio :label="5">起始里程</el-radio>
                    <el-radio :label="6">状态信号配置</el-radio>
                  </el-col>
                </el-row>
                </el-radio-group>
            </div>
            <div>
              <div v-if="radio==1">
                <el-form ref="form" :model="form_car" label-width="80px" inline size="small">
                  <el-form-item label="车牌号">
                    <el-input v-model="form_car.numberPlate"></el-input>
                  </el-form-item>
                  <el-form-item label="车辆类型">
                    <!-- <el-input v-model="form_car.ctype"></el-input> -->
                    <el-select v-model="form_car.ctype" placeholder="请选择" :clearable='true'>
                      <el-option
                        v-for="item in options_carType"
                        :key="item.dictLabel"
                        :label="item.dictLabel"
                        :value="item.dictLabel"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="识别号">
                    <el-input v-model="form_car.vin"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="radio==2">
                <el-form ref="form" :model="form_mcxs" label-width="80px"  size="small" inline>
                  <el-form-item label="当前时间">
                    <el-date-picker
                      v-model="form_mcxs.time"
                      type="datetime"
                      placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="脉冲系数">
                    <el-input v-model="form_mcxs.mcxs" style="width:220px"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="radio==3">
                <el-form ref="form" :model="form_first" label-width="120px" size="small">
                  <el-form-item label="初次安装时间">
                    <el-date-picker
                      v-model="form_first.timecc"
                      type="datetime"
                      placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="radio==4">
                <el-form ref="form" :model="form_jly" label-width="100px" size="small">
                  <el-form-item label="记录仪时间">
                    <el-date-picker
                      v-model="form_jly.time"
                      type="datetime"
                      placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="radio==5">
                <el-form ref="form" :model="form_cslc" label-width="8em" size="small" inline>
                  <el-form-item label="记录仪时间">
                      <el-date-picker
                        v-model="form_cslc.time"
                        type="datetime"
                        placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width:200px">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="初次安装时间">
                      <el-date-picker
                        v-model="form_cslc.timecc"
                        type="datetime"
                        placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width:200px">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="初始里程">
                      <el-input v-model="form_cslc.initmile"></el-input>
                    </el-form-item>
                    <el-form-item label="累计行驶里程">
                      <el-input v-model="form_cslc.allmile"></el-input>
                    </el-form-item>
                </el-form>
              </div>
              <div v-if="radio==6">
                <div style="width:100%;overflow:hidden">
                  <el-form ref="form" :model="form_ztxh" label-width="150px" style="float:left" size="small" inline>
                    <el-form-item label="D0的状态信号名称">
                      <el-input v-model="form_ztxh.d0"></el-input>
                    </el-form-item>
                    <el-form-item label="D1的状态信号名称">
                      <el-input v-model="form_ztxh.d1"></el-input>
                    </el-form-item>
                    <el-form-item label="D2的状态信号名称">
                      <el-input v-model="form_ztxh.d2"></el-input>
                    </el-form-item>
                    <el-form-item label="D3的状态信号名称">
                      <el-input v-model="form_ztxh.d3" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D4的状态信号名称">
                      <el-input v-model="form_ztxh.d4" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D5的状态信号名称">
                      <el-input v-model="form_ztxh.d5" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D6的状态信号名称">
                      <el-input v-model="form_ztxh.d6" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="D7的状态信号名称">
                      <el-input v-model="form_ztxh.d7" disabled></el-input>
                    </el-form-item>
                  </el-form>
              </div>
              </div>
            </div>
          </div>
    </div>
    <div class="fengeLine"></div>
    <div class="pageMain">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>车辆信息列表</span>
      </div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{color:'#606266'}">
        <el-table-column
              type="index"
              label="序号"
              width="70"
              :index="index+1">
            </el-table-column>
        <el-table-column
          prop="numberPlate"
          label="车牌号"
          show-overflow-tooltip
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
        <el-button type="primary" class="right-button" @click="handleClick" v-if="flag_per.indexOf('选择车辆')>-1" icon="el-icon-search">选择车辆</el-button>
        <el-button type="primary"
          plain class="right-button" @click="setting" v-if="flag_per.indexOf('设置')>-1" >设置</el-button>
      </div>
      <!-- 弹出框 -->
      <Dialog :QualityDialogFlag.sync="QualityDialogFlag" @select-item-list='getList'></Dialog>
    </div>
    
  </div>
</template>

<script>
  import Dialog from '@/components/map/dialog.vue';
  import {uploadInfo} from "@/api/system/terminalSetting/tachographSetting.js";
  import { carTypelist} from "@/api/system/map/searchList.js";
  export default {
      data () {
        return {
          radio: 1,
          form:{},
          form_car:{},
          form_mcxs:{},
          form_first:{},
          form_jly:{},
          form_cslc:{},
          form_ztxh:{
            d3:'近光',
            d4:'远光',
            d5:'右转向',
            d6:'左转向',
            d7:'制动'
          },
          QualityDialogFlag:false,
          tableData: [],
          index:0,
          flag_per:[],
          options_carType:[]
        };
      },
      components: {
        Dialog
      },
      created(){
        this.checkPro(['终端设置','行驶记录仪参数设置','选择车辆'])
        this.checkPro(['终端设置','行驶记录仪参数设置','设置'])
        this.getCartype();
      },
      methods:{
        // 在线状态字典翻译
        statusFormat(row, column) {
          return this.selectDictLabel(this.options_online, row.onlineStatus);
        },
          handleClick(tab, event) {
          this.QualityDialogFlag = true
        },
        getList(data){
          this.tableData=data
          this.getDicts("sys_online_status").then(response => {
            this.options_online = response.data;
          });
        },
        getCartype(){
          carTypelist().then(res=>{
            this.options_carType=res.data
          })
        },
        setting(){
          if(this.tableData.length>1){
            this.$message({
                message: '只能为一个车辆设置参数',
                type: 'error'
              });
            return
          }
          else if(!this.tableData.length||this.tableData.length==0){
            this.$message({
                message: '请选择车辆',
                type: 'error'
              });
            return
          }
          
          if(this.radio==1){
            this.form=this.form_car
            this.form.commandId='0x82'
          }
          else if(this.radio==2){
            this.form=this.form_mcxs
            this.form.commandId='0xC3'
          }
          else if(this.radio==3){
            this.form=this.form_first
            this.form.commandId='0x83'
          }
          else if(this.radio==4){
            this.form=this.form_jly
            this.form.commandId='0xC2'
          }
          else if(this.radio==5){
            this.form=this.form_cslc
            this.form.commandId='0xC4'
          }
          else if(this.radio==6){
            this.form=this.form_ztxh
            this.form.commandId='0x84'
          }
          this.form.deviceId=this.tableData[0].deviceId
          // this.form.vin=this.tableData[0].chassisNumber
          let data=this.form
          console.log(data)
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
    }
</script>

<style scoped>
  .el-radio{width: 100%;margin:5px 30px 5px 0 ;}
  .button-box{width: 100%;overflow: hidden;padding-bottom: 10px;margin-top: 10px;}
</style>
