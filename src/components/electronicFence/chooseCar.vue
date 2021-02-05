<template>
    <div>
        <el-dialog
        title="选择车辆"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="QualityDialogClose"
        width="70%"
        v-if="visible"
        >
            <el-form ref="form" label-width="5.5em"  size="mini" style="text-align: left;">
                <el-col :span="6">
                    <el-form-item label="查询列表">
                        <el-select v-model="form.list" placeholder="请选择" size="mini">
                            <el-option
                            v-for="item in options_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车牌号">
                        <el-input v-model="form.name" placeholder="请输入内容" size="mini" :clearable='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="SIM卡号">
                        <el-input v-model="form.sim" placeholder="请输入内容" size="mini" :clearable='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="VIN码">
                        <el-input v-model="form.vin" placeholder="请输入内容" size="mini" :clearable='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="终端号码">
                        <el-input v-model="form.terminalId" placeholder="请输入内容" size="mini" :clearable='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="企业名称">
                        <el-select v-model="form.company" placeholder="请选择" size="mini">
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
                    <el-form-item label="终端类型">
                        <el-select v-model="form.terminalType" placeholder="请选择" size="mini">
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
                    <el-form-item label="在线状态">
                        <el-select v-model="form.status" placeholder="请选择" size="mini">
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
                    <el-form-item label="车辆类型">
                        <el-select v-model="form.carType" placeholder="请选择" size="mini">
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
                    <el-form-item label="">
                        <el-button type="primary" size="mini" @click='searchInfo' icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-col>
                <div style="clear: both"></div>
            </el-form>
            <el-row>
                <el-col :span="10">
                    <el-table
                    :data="data1"
                    border
                    ref="selection"
                    @selection-change="checkAll"
                    style="width: 100%"
                    height="300"
                    >
                    <el-table-column type="selection" fixed width="30">
                    </el-table-column>
                    <el-table-column
                        prop="numberPlate"
                        label="车牌号"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="terminalId"
                        label="终端号"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="企业名称"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="车辆类型"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="4">
                    <div class="opSetting">
                        <div @click="handelSelect">
                            <el-button
                            icon="el-icon-d-arrow-right"
                            :disabled="nowSelectData.length ? false : true"
                            size="mini"
                            type="primary"
                            >
                            </el-button>
                        </div>
                        <div style="margin-top: 20px" @click="handleRemoveSelect">
                            <el-button
                            icon="el-icon-d-arrow-left"
                            :disabled="nowSelectRightData.length ? false : true"
                            size="mini"
                            type="primary"
                            >
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <el-table
                    :data="selectArr"
                    border
                    ref="selection"
                    @selection-change="checkRightAll"
                    style="width: 100%"
                    height="300"
                    >
                    <el-table-column type="selection" fixed width="30">
                    </el-table-column>
                    <el-table-column
                        prop="numberPlate"
                        label="车牌号"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="terminalId"
                        label="终端号"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="企业名称"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="车辆类型"
                        width="100"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="QualityDialogClose">取 消</el-button>
                <el-button type="primary" @click="commintInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { setCars } from "@/api/system/terminalSetting/electronicFence.js";
export default {
    data(){
        return{
            visible: false,
            form:{
                list:'待选列表',
                status:'全部'
            },
            options_status:[{
                label:'全部',
                value:'全部'
            },{
                label:'在线',
                value:'在线'
            },{
                label:'离线',
                value:'离线'
            }],
            data1: [{
                numberPlate:'1',
                terminalId:'1',
                address:'2222',
                type:'1'
            }],//待选列表
            nowSelectData: [], // 左边选中列表数据
            nowSelectRightData: [], // 右边选中列表数据
            selectArr: [], // 右边列表
            options_list:[{
                label:'待选列表',
                value:'待选列表'
            },{
                label:'已选列表',
                value:'已选列表'
            }]
        }
    },
    props:{
        QualityDialogFlag: {
            default: false,
        },
        fenceId:0
    },
    methods:{
        searchInfo(){},
        QualityDialogClose() {
            this.$emit("update:QualityDialogFlag", false);
        },
        checkAll(val) {
            this.nowSelectData = val;
        },
        checkRightAll(val) {
        this.nowSelectRightData = val;
        },
        // 待选->已选
        handelSelect() {
        this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
        this.handleRemoveTabList(this.nowSelectData, this.data1);
        this.nowSelectData = [];
        },
        // 已选->待选
        handleRemoveSelect() {
        this.data1 = this.handleConcatArr(this.data1, this.nowSelectRightData);
        this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
        this.nowSelectRightData = [];
        },
        handleConcatArr(selectArr, nowSelectData) {
            let arr = [];
            arr = arr.concat(selectArr, nowSelectData);
            return arr;
            },
        handleRemoveTabList(isNeedArr, originalArr) {
            if (isNeedArr.length && originalArr.length) {
                for (let i = 0; i < isNeedArr.length; i++) {
                    for (let k = 0; k < originalArr.length; k++) {
                        if (isNeedArr[i]["id"] === originalArr[k]["id"]) {
                        originalArr.splice(k, 1);
                        }
                    }
                }
            }
        },
        commintInfo(){
            var vehicleIds=[]
            this.selectArr.forEach(element => {
                vehicleIds.push(element.terminalId)
            });
            let data={
                id:this.fenceId,
                vehicleIds:vehicleIds
            }
            console.log(data)
            setCars(data).then(res=>{
                console.log(res)
                if(res.code==200){
                    this.$message({
                        type: "success",
                        message: "设置车辆成功",
                    });
                }
                else{
                    this.$message({
                        message: res.message,
                        type: "error",
                    });
                }
                this.QualityDialogClose()
            })
        }
    },
    watch:{
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
        }
    }
}
</script>