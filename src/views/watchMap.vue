<template>
  <div id="box">
    <div class="map" ref="map" id="top">


    </div>
    
    <div id="resize"></div>
    <div class="tableBox" ref='tableBox' id="bottom">
      <el-row style="padding: 10px 0;">
        <el-col :span="1"><i class="el-icon-refresh" style="font-size:24px;margin-top:5px" @click="refresh"></i></el-col>
        <el-col :span="1"><i class="el-icon-rank" @click="toggle" style="font-size:24px;margin-top:5px"></i></el-col>
        <el-col :span="14">&ensp;</el-col>
        <el-col :span="8" class="buttonGroup"><el-button type="primary" size="small" @click="beginFllow" v-if="flag_per.indexOf('车辆跟踪')>-1">车辆跟踪</el-button><el-button type="primary" size="small" @click='drawRectangleB' v-if="flag_per.indexOf('区域查车')>-1">区域查车</el-button><el-button type="primary" size="small" @click="handleClick" v-if="flag_per.indexOf('选择车辆')>-1">选择车辆</el-button></el-col>
      </el-row>
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{color:'#606266'}"
          stripe
          fit
          max-height="350"
          highlight-current-row
          @current-change="handleCurrentChange"
          >
          <el-table-column
            prop="numberPlate"
            label="车牌号"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="simNumber"
            label="SIM卡号"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="chassisNumber"
            label="VIN"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="gpstime"
            label="GPS时间"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="speed"
            label="速度"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="gpsspeed"
            label="记录仪速度"
            show-overflow-tooltip
            width="100px"
            >
          </el-table-column>
          <el-table-column
            prop="onlineStatus"
            label="在线状态"
            show-overflow-tooltip
           >
          </el-table-column>
          <el-table-column
            prop="vehicleStatus"
            label="车辆状态"
            show-overflow-tooltip
           >
          </el-table-column>
          <el-table-column
            prop="alarmType"
            label="报警类型"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="direction"
            label="方向"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="mileage"
            label="里程"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="longitude"
            label="经度"
            show-overflow-tooltip
            width="150px"
            >
          </el-table-column>
          <el-table-column
            prop="latitude"
            label="纬度"
            show-overflow-tooltip
            width="150px"
            >
          </el-table-column>
          <el-table-column
            prop="cardStatus"
            label="卡状态"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="driverName"
            label="当前驾驶员姓名"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="driverLicenseNumber"
            label="驾驶证号"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="cardChangeTime"
            label="插拔卡时间"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="certificateCode"
            label="从业资格证编码"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="callCar(scope.row)">车辆点名</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 弹出框 -->
    <Dialog :QualityDialogFlag.sync="QualityDialogFlag" :type='type' @child-event='getList'></Dialog>
    <!-- 车辆跟踪弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="30%">
      <el-form  :model="form2" class="demo-form-inline" size="mini" label-width="120px" :rules="rules" ref="form2">
        <el-form-item label="时间间隔" prop="timer">
          <el-input v-model="form2.timer" placeholder="时间间隔(秒)"></el-input>
        </el-form-item>
        <el-form-item label="位置跟踪有效期" prop="timeArea">
          <el-input v-model="form2.timeArea" placeholder="有效期(分钟)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="followed(form2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import Dialog from '@/components/map/dialog.vue';
  import AMap from 'AMap'
  import Vue from 'vue'
  import fullscreen from 'vue-fullscreen'
  Vue.use(fullscreen)
  import {carlist,arealist,caller,followed} from "@/api/system/map/mapList.js";
  var mouseTool, timer, aData,timerMeter,map
  var cluster = [];
  export default{
    data(){
      var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
                  let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
                  if (value === '') {
                      callback(new Error('请输入内容'));
                  } else if (!reg.test(value)) {
                      callback(new Error('请输入数字'));
                  } else {
                      callback();
                  }
              };

      var valiNumberPass2 = (rule, value, callback) => {//正整数
                  let reg = /^[+]{0,1}(\d+)$/g;
                  if (value === '') {
                      callback(new Error('请输入内容'));
                  } else if (!reg.test(value)) {
                      callback(new Error('请输入0及0以上的整数'));
                  } else {
                      callback();
                  }};

      return{
        index:0,
        show:false,
        center:[121.59996, 31.197646],
        markers:[],
        zoom:5,
        tableData:[],
        QualityDialogFlag:false,
        map:[],
        flag:false,
        type:1,
        dialogVisible: false,
        form2:{
          timer:'',
          timeArea:''
        },
        terminalIdList:[],
        deviceIdList:[],
        timer:10000,
        rules:{
          timer :[
            {required: true, validator:valiNumberPass1, trigger: "blur" },

          ],
          timeArea :[
            {required: true, validator:valiNumberPass2, trigger: "blur" }

          ]
        },
        pageSize:500,
        pageNum:1,
        num:0,
        isArea:false,
        flag_per:[],
        isFollowing:false,
        fullscreen: false
      }
    },
    created() {
      this.checkPro(['车辆监控管理','车辆监控','选择车辆'])
        this.checkPro(['车辆监控管理','车辆监控','区域查车'])
        this.checkPro(['车辆监控管理','车辆监控','车辆跟踪'])

      // this.$refs.map.style.height=(document.documentElement.clientHeight-60)+'px'
    },
    mounted(){
      this.$refs.map.style.height=(document.documentElement.clientHeight-65)*0.7+'px'
      this.$refs.tableBox.style.height=(document.documentElement.clientHeight-65)*0.3+'px'
      this.dragControllerDiv()
      this.init()
    },
    components: {
        Dialog
      },
    methods:{
      init() {
        let data={
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        this.createMap()
        // 初始页面不显示车
        // let basePosition=[];
        // let markers=[]
        // carlist(data).then(res=>{
        //   console.log(res)
        //   basePosition=res.data
        //   this.makeCluster(basePosition,markers)
        //   this.basePosition=basePosition
        // })

      },
      createMap(){
        var that=this
        map = new AMap.Map(this.$refs.map, {
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
            map.addControl(new AMap.MapType());

            // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
            // map.addControl(new AMap.Geolocation());
        });
        that.map=map
        map.on("rightclick",function(e){
          if(mouseTool){
            mouseTool.close(true)
          }
          
        })
      },
      makeCluster(basePosition,markers){
        var that=this
        that.num=0
        console.log(markers)
        for(var i=0;i<basePosition.length;i++){

          markers.push(new AMap.Marker({
              position: [basePosition[i].longitude, basePosition[i].latitude],
              // content: "<div style='background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;'></div>",
              icon: "static/img/car.png",
              offset: new AMap.Pixel(-15, -15),
              title:basePosition[i].id
              // label:({
              //   offset: new AMap.Pixel(-10, 0),  //设置文本标注偏移量
              //   content: '<div>'+i+'</div>', //设置文本标注内容
              //   direction: 'top' //设置文本标注方位
              // })
          }).on('mouseover',function(el){
            console.log(el.target)
            var info=''
            console.log(that.basePosition)
            
            that.basePosition.forEach(function(element){
              // element.longitude = String(element.longitude).replace(/^(.*\..{6}).*$/,"$1");
              // element.longitude = Number(element.longitude)
              if(el.target.w.position.lng== element.longitude||el.target.w.position.R== element.longitude&&el.target.w.position.lat==element.latitude||el.target.w.position.Q==element.latitude){
                info= "<div style='text-align: left'><div style='color:red'>车牌号:"+element.numberPlate+"</div>"+"<div>GPS时间:"+element.gpstime+"</div>"+"<div style='color:red'>车速:"+element.speed+"km/h</div>"+"<div>车辆状态:"+element.vehicleStatus+"</div>"+"<div>报警状态:"+element.alarmType+"</div>"+"<div>方向:"+element.direction+"</div>"+"<div>里程:"+element.mileage+"</div>"+"<div>记录仪速度："+element.gpsspeed+"km/h</div></div>"
                // var lnglat=[el.target.w.position.lng,el.target.w.position.lat]
                // that.convertFrom(lnglat,'gps',info);
              }
            })

            this.setLabel({
                  offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
                  content: info, //设置文本标注内容
                  direction: 'top' //设置文本标注方位
              });
          }).on('mouseout',function(el){
            this.setLabel(null);
          }).on('click',function(el){
            map.setCenter([el.target.G.position.lng, el.target.G.position.lat]);
            that.center=[el.target.G.position.lng, el.target.G.position.lat]
          }))
        }
        map.plugin(["AMap.MarkerClusterer"],function(){
          cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});

        })

        that.markers=markers

        
        this.map=map
      },
      getList(data,deviceIdList){
        this.terminalIdList=data
        this.deviceIdList=deviceIdList
        // this.isArea=false
        this.clock()
        setTimeout(function(){map.setFitView()},1000)
        
      },
      handleClick(tab, event) {
        
        this.type=1
        // this.isArea=false
        // // 清除历史点
        // if(cluster){
        //   map.remove(cluster);
        // }
        
        if(this.Rectangle){
          this.clearPolygon()
        }
        this.QualityDialogFlag = true
      },
      refresh(){
        console.log('refresh')
        if(timer){
            this.$message({
                      message: '信息刷新中',
                      type: 'info'
                    });
            clearInterval(timer)
            timer=setInterval(this.clock,this.timer)
        }
        else{
          this.$message({
                      message: '请先选择车辆',
                      type: 'info'
                    });
        }
      },
      // 车辆点名
      callCar(e){
        let data={
          deviceId:e.deviceId
        }
        caller(data).then(res=>{
          console.log(res)
          if(res.code==200){
            this.$message({
                      message: '车辆点名成功',
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
      // 点车辆跟踪按钮
      beginFllow(){
        if(this.tableData.length){

            this.dialogVisible = true
            this.clearPolygon()
        }
        else{

          this.$message({
                    message: '请先选择车辆',

                  });
        }

      },
      // 车辆跟踪
      followed(form2){
        this.$refs.form2.validate((valid)=>{
          if(valid){
            this.timer=this.form2.timer*1000
            this.timeArea=this.form2.timeArea*60
            let data={
              deviceIdList:this.deviceIdList,
              timeInterval:this.form2.timer,
              validity:this.timeArea
            }
            followed(data).then(res=>{
              console.log(res)
              if(res.code==200){
                this.$message({
                      message: '车辆跟踪设置成功',
                      type: 'success'
                    });
                aData = new Date()
              if(timer){
                clearInterval(timer)
              }
              timer=setInterval(this.clock,this.timer)
              timerMeter=setInterval(this.timerMeter,10000)
              this.dialogVisible = false
              this.isFollowing=true
              }
              else{
                this.$message({
                      message: res.message
                    });
              }
            })
          }
        })


      },
      // 计算时间差
      getDiffTime(aData,bData){
        const  getDifference = (bData.getFullYear() - aData.getFullYear())*365*24*60*60
                +(bData.getMonth() - aData.getMonth() +1)*30*24*60*60
                +(bData.getDate() - aData.getDate() )*24*60*60
                +(bData.getHours() -  aData.getHours() )*60*60
                +(bData.getMinutes() - aData.getMinutes()  )*60
                +(bData.getSeconds() - aData.getSeconds() )
         return getDifference
      },
      // 计时器
      timerMeter(){
        var bData=new Date()
        // var getDiffTime=this.getDiffTime(aData,bData)
        var getDiffTime=parseInt(bData-aData)/1000
        console.log(getDiffTime)
        if(getDiffTime>this.timeArea){
          clearInterval(timerMeter)
          clearInterval(timer)
          this.timer=10000
          timer=setInterval(this.clock,this.timer)
          this.isFollowing=false
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handler({BMap,map}){
        console.log(map)
      },
      infoWindowOpen(){
        this.show=true
      },
      infoWindowClose(){
        this.show=false
      },
      // 选中表格
      handleCurrentChange(val){
        console.log(val)
        map.setCenter([val.longitude, val.latitude]);
        this.center=[val.longitude, val.latitude]
        map.setZoom(20)
      },
      // change(){
      //   this.center={lng: 121.4000, lat: 31.1000}
      // },
      mapResize(){
        // this.zoom=7

        console.log(this.zoom)
      },
     drawRectangleB(){
       // 清除历史点
      // map.remove(cluster);
       this.drawRectangle()
     },
      // 绘制矩形
     drawRectangle:function () {
       // var mouseTool
       var that=this

       that.map.plugin(["AMap.MouseTool"],function(){

         mouseTool = new AMap.MouseTool(that.map)
         mouseTool.rectangle({
           strokeColor:'red',
           strokeOpacity:0.5,
           strokeWeight: 2,
           fillColor:'blue',
           fillOpacity:0.5,
           // strokeStyle还支持 solid
           strokeStyle: 'solid',
           // strokeDasharray: [30,10],
         })
         var Rectangle=[]
         mouseTool.on('draw', function(event) {
           if(that.Rectangle){
             that.map.remove(that.Rectangle)
           }
           // event.obj 为绘制出来的覆盖物对象
           Rectangle=event.obj
            // mouseTool.close(false)
           console.log(Rectangle.getPath())
           that.Rectangle=Rectangle
           mouseTool.close(false)
           let data={
             lat_lt:Rectangle.getPath()[0].lat,
             lon_lt:Rectangle.getPath()[0].lng,
             lat_rb:Rectangle.getPath()[2].lat,
             lon_rb:Rectangle.getPath()[2].lng,
             pageNum:1,
             pageSize:500
           }
           that.searchByArea(data)
         })

       })

      },
      // 定时取数据
      clock(){
        let data={
            vehicleIdList:this.terminalIdList,
            pageNum:this.pageNum,
            pageSize:this.pageSize
          }
          console.log(data)
          carlist(data).then(res=>{
            console.log(res)
            let markers=[]
            if(res.code==200){
                map.remove(cluster);
                console.log('已清除cluster')
                this.tableData=res.data
                this.makeCluster(this.tableData,markers)
                this.basePosition=this.tableData
                console.log(this.basePosition)
                // if(this.isFollowing){
                //   this.path.push([])
                // }
            }
          })
        
      },

      // 清空绘制
      clearPolygon:function(){
        var that=this
        that.map.remove(that.Rectangle);
      },
      // 区域查车
      searchByArea(data){
        let markers=[]
        arealist(data).then(res=>{
          console.log(res)
          if(res.code==200){
            
            // 清除历史点
            // map.remove(cluster);
            // 清除绘制区域
            this.clearPolygon()
            // let basePosition=res.data;
            // this.basePosition=basePosition
            // this.makeCluster(basePosition,markers)
            this.tableData=res.data
            var _terminalIdList=[]
            this.tableData.forEach(function(element){ 
              _terminalIdList.push(element.vehicleId)
            })
            this.terminalIdList=_terminalIdList
            this.clock()
              // this.isArea=true
          }
          else{
            this.$message({
                      message: res.message,
                      type: 'error'
                    });
          }
        })
      },
      dragControllerDiv: function () {
        let resize = document.getElementById('resize')
        let top = document.getElementById('top')
        let bottom = document.getElementById('bottom')
        let box = document.getElementById('box')
        let totalH=document.documentElement.clientHeight-60
        resize.onmousedown = function (e) {
          let startY = e.clientY
          // resize.top = resize.offsetTop
          resize.top = parseInt(top.style.height)
          document.onmousemove = function (e) {
            let endY = e.clientY
            box.style.cursor='n-resize'
            let moveLen = resize.top + (endY - startY)

            let maxT = box.clientHeight - resize.offsetHeight

            // if (moveLen < 150){moveLen = 360}
            // else if (moveLen > maxT - 800){
            //   moveLen = maxT - 800
            // }

            resize.style.top = moveLen
            top.style.height = moveLen + 'px'
            bottom.style.height = (totalH - moveLen - 5) + 'px'

          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
            resize.releaseCapture && resize.releaseCapture()
            box.style.cursor='default'
          }
          resize.setCapture && resize.setCapture()
          return false
        }
      },
      // 查看权限
        checkPro(data){
          this.checkPromis(data).then(res=>{
            if(res){
              this.flag_per.push(data[2])
            }
          })
        },
        // 全屏相关
        toggle () {
            this.$fullscreen.toggle(this.$el.querySelector('.map'), {
            wrap: false,
            callback: this.fullscreenChange
          })
        },
        fullscreenChange (fullscreen) {
          this.fullscreen = fullscreen
        }
    },
    watch: {
        terminalIdList(val) {
          var that=this
          console.log(val)
          // 清除历史点
          
          if(timer){
            clearInterval(timer)
            // map.remove(cluster);
            // console.log('已清除cluster')
          }
          if(timerMeter){
            clearInterval(timerMeter)
          }
          timer=setInterval(that.clock,that.timer)
        }
    },
    beforeDestroy(){
      if(timer){
        clearInterval(timer)
      }
      if(timerMeter){
        clearInterval(timerMeter)
      }
    }
  }
</script>

<style scoped>
  .bm-view{
    height: 100%;
  }
  .button{position:absolute; top: 5px;left: 5px; background-color: #2C3E50;z-index: 9999;}
  .map{position: relative;}
  #resize{width: 100%;height: 5px;background-color: #eee; }
  .tableBox{width: 100%;}
  #resize:hover{
    cursor:n-resize
  }
  .amap-demo{height: 100%;}
  .buttonGroup .el-button{float: right;margin-left: 10px;}
  .left{text-align: left !important;}
  .amap-marker-label{text-align: left;}
  /* .fullScreenBtn{position: absolute;bottom: 10px;left: 10px;} */
</style>
