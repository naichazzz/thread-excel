<template>
    <div class="alarm">
        <el-dialog title="处理详情" :visible.sync="visible" :close-on-click-modal="false" @close="QualityDialogClose">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-container>
                        <el-header>车辆信息</el-header>
                        <el-main>
                            <div class="alarmDetail">
                                 <div class="left">车牌号：</div>
                                <div class="right">吉A123456</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">SIM卡号：</div>
                                <div class="right">18936245628</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">VIN：</div>
                                <div class="right">WYK5648921</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">在线状态：</div>
                                <div class="right"><span>离线</span><i class="point gray"></i></div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">企业名称：</div>
                                <div class="right">解放公司</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">驾驶员：</div>
                                <div class="right">张三</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">驾驶员电话：</div>
                                <div class="right">18923345774</div>
                            </div>
                        </el-main>
                    </el-container>
                </el-col>
                <el-col :span="8">
                    <el-container>
                        <el-header>报警信息</el-header>
                        <el-main>
                            <div class="alarmDetail">
                                 <div class="left">报警类型：</div>
                                <div class="right">超速报警</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">报警时间：</div>
                                <div class="right">20-11-11 10:10:10</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">报警地点：</div>
                                <div class="right">吉林省长春市前进大街与繁荣路交叉口</div>
                            </div>
                        </el-main>
                    </el-container>
                </el-col>
                <el-col :span="8">
                    <el-container>
                        <el-header>处理信息</el-header>
                        <el-main>
                            <div class="alarmDetail">
                                 <div class="left">报警处理方式：</div>
                                <div class="right">下发信息</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">报警处理内容：</div>
                                <div class="right">请减速行驶！</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">处理时间：</div>
                                <div class="right">20-11-11 10:10:10</div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">处理状态：</div>
                                <div class="right"><span>已处理</span><i class="point green"></i></div>
                            </div>
                            <div class="alarmDetail">
                                 <div class="left">处理人：</div>
                                <div class="right">admin</div>
                            </div>
                        </el-main>
                    </el-container>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            visible: false,
        }
    },
    props: {
        QualityDialogFlag: {
            default: false,
        },
    },
    methods:{
        QualityDialogClose() {
            this.$emit("update:QualityDialogFlag", false);
        },
    },
    watch: {
        QualityDialogFlag() {
        this.visible = this.QualityDialogFlag;
        }
    },
}
</script>
<style scoped>
.alarm .el-header{font-weight: bold;font-size: 16px;}
.alarm .el-header,.alarm .el-main{background: #eee !important;color:#000 !important}
.alarm .el-main{height: 273px;}
.alarm .alarmDetail {padding: 10px;display: flex;}
.alarm .alarmDetail .left{text-align: left;font-weight: bold;width: 50%;}
.alarm .alarmDetail .right{text-align: right;width: 50%;}
.alarm .point{width:5px;height:5px;border-radius: 50px;float: right;margin-right: 5px;margin-top: 7px;}
.alarm .green{background-color: green;}
.alarm .gray{background-color: gray;}
.alarm .alarmDetail .right span{float: right;}
    /* .bg-purple{background-color: aqua;height: 20px;} */
</style>