<template>
    <div class="fence">
        <el-dialog
        title="设置围栏"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="QualityDialogClose"
        fullscreen
        v-if="visible"
        v-loading="loading"
        >
            <div class="mapBox">
                <div class="map" ref="map" id="map"></div>
                <!-- <div class='info'>操作说明：圆和矩形通过拖拽来绘制，多边形通过点击来绘制</div> -->
                <div class="input-card">
                    <el-form :inline="true" :model="formInline" v-if="fatherType=='new'">
                        <el-form-item label="">
                            <el-radio-group v-model="formInline.radio" @change="changeType">
                                <el-radio :label="3">画多边形</el-radio>
                                <el-radio :label="2">画矩形</el-radio>
                                <el-radio :label="1">画圆形</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="deleteDraw">清除</el-button>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="info" icon="el-icon-close" size="mini" plain @click="closeDraw">退出</el-button>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="success" icon="el-icon-check" size="mini" plain @click="saveDraw">保存</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="reDraw" v-if="fatherType=='modify'">清除重画</el-button>
                </div>
                <div class="setInfo" ref="setInfo">
                    <el-form ref="form" :model="form" label-width="8em" size="small" :rules="rules" style="max-height:90%;overflow-y:auto">
                        <el-form-item label="围栏名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
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
                        <el-form-item label="" style="text-align:left" v-if="isCricle==true">
                            <el-switch
                            v-model="value"
                            active-text="自动绘制"
                            inactive-text="手动绘制"
                            @change='changeSwitch'>
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="设置圆心" v-if="value">
                            <el-input v-model="form.centre" placeholder="longitude,latitude"></el-input>
                        </el-form-item>
                        <el-form-item label="设置半径" v-if="value">
                            <el-input v-model="form.radius" @change='autoDraw'></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="进围栏设置">
                                    <el-select v-model="insetValue" multiple placeholder="请选择">
                                        <el-option
                                        v-for="item in inSet_options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="出围栏设置">
                                    <el-select v-model="outsetValue" multiple placeholder="请选择">
                                        <el-option
                                        v-for="item in inSet_options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="设置速度" style="text-align:left">
                            <el-checkbox v-model="form.speedRule" @change='changeSpeedrule'></el-checkbox>
                        </el-form-item>
                        <el-form-item label="限速" :rules="[{required:form.speedRule ? true : false, message: '请输入限速值',trigger: 'blur'}]" prop="maxSpeed" ref="maxSpeed">
                            <el-input v-model="form.maxSpeed" :disabled="!form.speedRule">
                                <template slot="append">km/h</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="超速持续时间" :rules="[{required:form.speedRule ? true : false, message: '请输入超速持续时间',trigger: 'blur'}]" prop="overspeedTime" ref="overspeedTime">
                            <el-input v-model="form.overspeedTime" :disabled="!form.speedRule">
                                <template slot="append">秒</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="夜间最高速度" :rules="[{required:form.speedRule ? true : false, message: '请输入夜间最高速度',trigger: 'blur'}]" prop="maxNightSpeed" ref="maxNightSpeed">
                            <el-input v-model="form.maxNightSpeed" :disabled="!form.speedRule">
                                <template slot="append">km/h</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="设置时间" style="text-align:left">
                            <el-checkbox v-model="form.timeRule" @change='changeTimerule'></el-checkbox>
                        </el-form-item>
                        <el-form-item label="开始时间" style="text-align:left;" :rules="[{required:form.timeRule ? true : false, message: '请设置开始时间',trigger: 'blur'}]" prop="startTime" ref="startTime">
                            <el-date-picker
                            v-model="form.startTime"
                            type="datetime"
                            placeholder="选择日期时间" :disabled="!form.timeRule" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" style="text-align:left" :rules="[{required:form.timeRule ? true : false, message: '请设置结束时间',trigger: 'blur'}]" prop="endTime" ref="endTime">
                            <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            placeholder="选择日期时间" :disabled="!form.timeRule" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" :rows="3"></el-input>
                        </el-form-item>

                    </el-form>
                    <el-button type="primary" @click="commitInfo" class="button">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import AMap from 'AMap'
import {newFence,fenceDetail} from "@/api/system/terminalSetting/electronicFence.js";
var mouseTool,map
var overlays=[]
export default {
    data(){
        return{
            visible: false,
            center:[121.59996, 31.197646],
            zoom:5,
            mapHeight:0,
            value:false,
            form:{
                name:'',
                alarmType:'1',
                graphType:'3',
                polygon:null,
                rectangle:null,
                circle:null,
                remark:'',
                speedRule:false,
                timeRule:false,
                startTime:'',
                endTime:'',
                maxSpeed:'',
                overspeedTime:'',
                maxNightSpeed:''
            },
            loading:true,
            formInline:{
                radio:3
            },
            isCricle:false,
            setSpeed:false,
            setTime:false,
            rules:{
                name :[{required: true, message: '请输入', trigger: 'blur'}],
            },
            inSet_options:[
                {
                value: '报警给驾驶员',
                label: '报警给驾驶员'
                }, {
                value: '报警给平台',
                label: '报警给平台'
                }
            ],
            options_status:[{
                dictValue:'1',
                dictLabel:'进入报警'
            },{
                dictValue:'2',
                dictLabel:'离开报警'
            }],
            insetValue:[],
            outsetValue:[],
            setCircle:false,
            
        }
    },
    props:{
        QualityDialogFlag: {
            default: false,
        },
        fatherType:{
            default: 'new',
        },
        shape:{
            default:'polygon'
        },
        fenceId:{
            default:undefined
        }
    },
    mounted(){
        
    },
    created(){
        
        
    },
    methods:{
        changeSpeedrule(val){
            if(!val){
                this.$refs.maxSpeed.clearValidate(['maxSpeed'])
                this.$refs.overspeedTime.clearValidate(['overspeedTime'])
                this.$refs.maxNightSpeed.clearValidate(['maxNightSpeed'])
            }
        },
        changeTimerule(val){
            if(!val){
                this.$refs.startTime.clearValidate(['startTime'])
                this.$refs.endTime.clearValidate(['endTime'])
            }
        },
        QualityDialogClose() {
            this.$emit("update:QualityDialogFlag", false);
            this.loading=true
            this.value=false
            this.form={
                alarmType:'1'
            }
            this.formInline={
                radio:3
            }
            this.isCricle=false
           
        },
        // 重刷用户列表
        getUserList(){
            this.$emit('get-list')
        },
        commitInfo(){
            if(this.form.name==''){
                this.$message({
                                message: '请输入围栏名称',
                              });
            }
            else{
                if(this.form.polygon==null&&this.form.rectangle==null&&this.form.circle==null){
                    this.$message({
                                message: '请设置围栏并点击保存',
                              });
                }
                else{
                    if(this.form.timeRule&&(this.form.startTime==''||this.form.endTime=="")){
                        this.$message({
                                message: '请设置起止时间',
                              });
                              return
                    }
                    if(this.form.speedRule&&(this.form.maxSpeed==''||this.form.overspeedTime==""||this.form.maxNightSpeed=="")){
                        this.$message({
                                message: '请设置速度信息',
                              });
                              return
                    }
                    let { ...foa } = this.form;
                    if(this.form.timeRule){
                        foa.timeRule=1
                    }
                    else if(!this.form.timeRule){
                        foa.timeRule=0
                    }
                    if(this.form.speedRule){
                        foa.speedRule=1
                    }
                    else if(!this.form.speedRule){
                        foa.speedRule=0
                    }
                    var inArea={
                        inDriver:0,
                        inPlatform:0
                    }
                    var outArea={
                        inDriver:0,
                        inPlatform:0
                    }
                    if(this.insetValue.indexOf('报警给驾驶员')>=0){
                        inArea.inDriver=1
                    }
                    if(this.insetValue.indexOf('报警给平台')>=0){
                        inArea.inPlatform=1
                    }
                    if(this.outsetValue.indexOf('报警给驾驶员')>=0){
                        outArea.inDriver=1
                    }
                    if(this.outsetValue.indexOf('报警给平台')>=0){
                        outArea.inPlatform=1
                    }
                    foa.inArea=inArea
                    foa.outArea=outArea
                    delete foa.centre
                    delete foa.radius
                    newFence(foa).then(res=>{
                        console.log(res)
                        if(res.code==200){
                            this.$message({
                                message: '创建围栏成功',
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
                        this.QualityDialogClose()
                    })
                }
            }
            
        },
        createMap(){
            var that=this
            map = new AMap.Map(that.$refs.map, {
                    resizeEnable: true,
                    center: that.center,//地图中心点
                    zoom: that.zoom //地图显示的缩放级别
                    }).on('zoomend',function(){
                    that.zoom=map.getZoom()
                    });
            AMap.plugin([
                'AMap.ToolBar',
                'AMap.Scale',
                'AMap.OverView',
                'AMap.MapType',
                'AMap.Geolocation'
            ],function(){
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar());

                // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
                map.addControl(new AMap.Scale());

                // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
                map.addControl(new AMap.OverView({isOpen:true}));

                // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
                // map.addControl(new AMap.MapType());

                // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
                // map.addControl(new AMap.Geolocation());
            });
            this.loading=false
            map.plugin(["AMap.MouseTool"],function(){
                mouseTool = new AMap.MouseTool(map); 
                mouseTool.on('draw',function(e){
                    if(overlays){
                        map.remove(overlays)
                    }
                    // overlays.push(e.obj);
                    overlays=e.obj
                    
                })
            
            })
            // 新建
            if(this.fatherType=='new'){
                var that=this
                setTimeout(function(){that.draw(3)},500)
                
            }
            // 编辑
            else{
                fenceDetail(this.fenceId).then(res=>{
                    console.log(res)
                    this.form=res.data
                    
                    if(res.data.graphType==2){
                        console.log(JSON.parse(res.data.rectangle))
                        this.editShape('rectangle',JSON.parse(res.data.rectangle))
                    }
                })
                this.editShape(this.shape)
            }
        },
        editShape(shape,shapeDetail){
            if(shape=='cricle'){
                // 取circle信息
                var circle = new AMap.Circle({
                    center: [116.433322, 39.900255],
                    radius: 1000, //半径
                    borderWeight: 3,
                    strokeColor: "#FF33FF", 
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    strokeStyle: 'dashed',
                    strokeDasharray: [10, 10], 
                    // 线样式还支持 'dashed'
                    fillColor: '#1791fc',
                    zIndex: 50,
                })
                circle.setMap(map)
                map.setFitView([ circle ])
                overlays=circle
                map.plugin(["AMap.CircleEditor"],function(){
                    var circleEditor = new AMap.CircleEditor(map, circle)
                    circleEditor.open()
                })
            }
            else if(shape=='rectangle'){
                // 取矩形信息
                var southWest = new AMap.LngLat(shapeDetail.leftTopPoint.lon, shapeDetail.leftTopPoint.lat)
                var northEast = new AMap.LngLat(shapeDetail.rightBottomPoint.lon, shapeDetail.rightBottomPoint.lat)
                var bounds = new AMap.Bounds(southWest, northEast)

                var rectangle = new AMap.Rectangle({
                    bounds: bounds,
                    strokeColor:'red',
                    strokeWeight: 6,
                    strokeOpacity:0.5,
                    strokeDasharray: [30,10],
                    // strokeStyle还支持 solid
                    strokeStyle: 'dashed',
                    fillColor:'blue',
                    fillOpacity:0.5,
                    cursor:'pointer',
                    zIndex:50,
                })
                rectangle.setMap(map)
                map.setFitView([ rectangle ])
                overlays=rectangle
                map.plugin(["AMap.RectangleEditor"],function(){
                    var rectangleEditor = new AMap.RectangleEditor(map, rectangle)
                    rectangleEditor.open()
                })
            }
            else if(shape=='polygon'){
                // 取多边形信息
                var path = [
                    [116.403322, 39.920255],
                    [116.410703, 39.897555],
                    [116.402292, 39.892353],
                    [116.389846, 39.891365]
                ]

                var polygon = new AMap.Polygon({
                    path: path,
                    strokeColor: "#FF33FF", 
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    zIndex: 50,
                })
                map.add(polygon)
                // 缩放地图到合适的视野级别
                map.setFitView([ polygon ])
                overlays=polygon
                map.plugin(["AMap.PolyEditor"],function(){
                    var polyEditor = new AMap.PolyEditor(map, polygon)
                    polyEditor.open()
                })
            }
        },
        changeType(type){
            if(type==1){
                this.isCricle=true
            }
            else{
                this.isCricle=false
            }
            this.value=false
            this.form.graphType=type
            this.draw(type)
        },
        draw(type){
            switch(type){
                case 3:{
                    mouseTool.polygon({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Polygon的Option设置
                    });
                    break;
                }
                case 2:{
                    mouseTool.rectangle({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Polygon的Option设置
                    });
                    break;
                }
                case 1:{
                    mouseTool.circle({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Circle的Option设置
                    });
                    break;
                }
            }
        },
        reDraw(){
            this.fatherType='new'
            this.deleteDraw()
            this.draw(3)
        },
        deleteDraw(){
            map.remove(overlays)
            overlays = [];
            if(this.circle){
                this.cleanDrawcricle()
                this.form.centre=''
                this.form.radius=''
            }
        },
        closeDraw(){
            mouseTool.close(true)//关闭，并清除覆盖物
            this.formInline.radio=0
            this.isCricle=false
            if(this.circle){
                this.cleanDrawcricle()
                this.form.centre=''
                this.form.radius=''
            }
        },
        saveDraw(){
            this.formInline.radio=0
            mouseTool.close(false)
            
            //画圆形
            if(this.form.graphType==1){
                // 手动设置
                if(this.setCircle){
                    this.form.circle={
                        centerPoint:{
                            lat:this.centerPoint[1],
                            lon:this.centerPoint[0]
                        },
                        radius:this.radius
                    }
                    
                }
                else{
                    
                    this.form.circle={
                        centerPoint:{
                            lat:overlays.Ce.center.lat,
                            lon:overlays.Ce.center.lng
                        },
                        radius:overlays.Ce.radius
                    }
                }
                this.form.polygon=null
                this.form.rectangle=null
            }
            else if(this.form.graphType==2){
                
                this.form.rectangle={
                    leftTopPoint:{
                        lat:overlays.Ce.path[1].lat,
                        lon:overlays.Ce.path[1].lng
                    },
                    rightBottomPoint:{
                        lat:overlays.Ce.path[3].lat,
                        lon:overlays.Ce.path[3].lng
                    }
                }
                this.form.polygon=null
                this.form.circle=null
            }
            else if(this.form.graphType==3){
                console.log(overlays)
                var paths=[]
                overlays.Ce.path.forEach(element => {
                    var item={
                        lat:element.lat,
                        lon:element.lng
                    }
                    paths.push(item)
                });
                this.form.polygon={
                    points:paths
                }
                this.form.rectangle=null
                this.form.circle=null
            }
        },
        changeSwitch(value){
            console.log(value)

            if(value==true){
                this.formInline.radio=1
                mouseTool.close(true)//关闭
                this.setCircle=true
            }
            else{
                if(this.circle){
                    this.cleanDrawcricle()
                }
                this.formInline.radio=1
                this.draw(1)
                this.setCircle=false
            }
        },
        autoDraw(val){
            if(this.circle){
                this.cleanDrawcricle()
            }
            
            if(this.form.centre&&this.form.radius){
                var str = this.form.centre.split(',');
                this.centerPoint=str
                this.radius=val
                var longitude=str[0]
                var latitude=str[1]
                var circle = new AMap.Circle({
                    center: new AMap.LngLat(longitude, latitude), // 圆心位置
                    radius: val,  //半径
                    strokeColor: "#F33",  //线颜色
                    strokeOpacity: 1,  //线透明度
                    strokeWeight: 3,  //线粗细度
                    fillColor: "#ee2200",  //填充颜色
                    fillOpacity: 0.35 //填充透明度
                });
                this.circle=circle
                map.add(circle);
                map.setFitView();
            }
            else{
                this.$message({
                      message: '请输入圆心和半径',
                    });
            }
        },
        cleanDrawcricle(){
            map.remove(this.circle);
            map.setFitView();
        }
    },
    watch:{
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
            console.log(this.fatherType)
            var that=this
            if(this.visible){
                setTimeout(function(){
                    that.$refs.map.style.height=document.documentElement.clientHeight-54+'px'
                    that.$refs.setInfo.style.height=document.documentElement.clientHeight-54-80+'px'
                    that.createMap()
                },500)
                
            }
        }
    }
}
</script>
<style>
    .fence .el-dialog__body{padding: 0 !important;}
    .fence .mapBox{width: 100%;overflow: hidden;}
    .fence .map{width: 60%;float: left;}
    .fence .setInfo{width: 34%;float: left;padding:40px 3%; position: relative; height: 100%;}
    .fence .button{width:140px;margin-top:20px;position: absolute; left: 50%;margin-left: -70px;bottom: 80px;}
    .fence .info{position: absolute;right: 41%;bottom: 20px;background: #fff;padding: 10px 15px; box-shadow: rgb(182, 182, 182) 0px 0px 5px;}
    .fence .input-card{position: absolute;right: 41%;top: 70px;background: #fff;padding: 5px 10px; border-radius: 5px;box-shadow: rgb(182, 182, 182) 0px 0px 5px;}
    .fence .input-card .el-form-item{margin-bottom: 0;}
    .fence .input-card .el-radio{margin-right: 5px;}
    .fence .el-select__tags{flex-wrap: nowrap;}
    .fence .el-form .el-select{overflow: hidden;}
</style>