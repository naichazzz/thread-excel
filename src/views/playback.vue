<template>
  <div id="outer-box">
    <div id="container"></div>
    <!-- <div id="panel">
      <div id="routes-container"></div>
    </div> -->
    <div class="input-card">
      <h4>轨迹回放控制</h4>
      <div class="input-item">
        <input
          type="button"
          class="btn"
          value="开始动画"
          @click="startAnimation()"
        />
        <input
          type="button"
          class="btn"
          value="暂停动画"
          @click="pauseAnimation()"
        />
        <input
          type="button"
          class="btn"
          value="继续动画"
          @click="resumeAnimation()"
        />
        <input
          type="button"
          class="btn"
          value="停止动画"
          @click="stopAnimation()"
        />
        <!-- <el-slider
        v-model="speedValue"
        :max="10000"
        show-input>
      </el-slider> -->
        <el-button type="primary" plain size="mini" @click="exportData"
          >导出</el-button
        >
      </div>
      <div class="input-item"></div>
      <!-- <div class="input-item">
        <el-slider
        v-model="speedValue"
        show-input
        max="10000">
      </el-slider>
      </div> -->
    </div>

    <div class="searchContainer">
      <el-form
        label-position="right"
        label-width="80px"
        :model="query"
        size="mini"
        :rules="rules"
        ref="formTable"
      >
        <el-form-item label="车牌号" prop="numberPlate">
          <el-input
            v-model="query.numberPlate"
            @focus="searchNumberPlate"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" style="text-align:left" prop="startTime">
          <el-date-picker
            v-model="query.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%"
            @blur="compareDate(query.startTime,query.endTime,'begin')"
            :picker-options="pickerDisabled"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" style="text-align:left" prop="endTime">
          <el-date-picker
            v-model="query.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%"
            @blur="compareDate(query.startTime,query.endTime,'end')"
            :picker-options="pickerDisabled"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间间隔" prop="timeInterval">
          <el-input
            v-model="query.timeInterval"
            placeholder="请输入时间间隔（分钟）"
          ></el-input>
          <!-- <el-time-picker v-model="query.timeInterval" value-format="HH:mm:ss"></el-time-picker> -->
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </el-form-item>
      </el-form>

      <div ref="myChart" class="myChart">时速图</div>
    </div>

    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        height="300"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
        highlight-current-row
        @row-click="handleCurrentChange"
        :row-class-name="tableRowClassName"
        :header-cell-style="{ color: '#606266' }"
        stripe
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="车牌号">
          <template slot-scope="scope">{{ scope.row.numberPlate }}</template>
        </el-table-column>
        <el-table-column prop="name" label="GPS时间"> </el-table-column>
        <el-table-column prop="speed" label="速度 单位:km/h" width="120px">
        </el-table-column>
        <el-table-column prop="direction" label="方向"> </el-table-column>
        <el-table-column prop="longitude" label="经度"> </el-table-column>
        <el-table-column prop="latitude" label="纬度"> </el-table-column>
        <el-table-column prop="mileage" label="里程 单位:km"> </el-table-column>
        <el-table-column prop="alarmType" label="报警状态"> </el-table-column>
        <el-table-column prop="vehicleStatus" label="车辆状态">
        </el-table-column>
      </el-table>
    </div>
    <Dialog
      :QualityDialogFlag.sync="QualityDialogFlag"
      :isPlayback="playback"
      @select-item-list="getList"
    ></Dialog>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
import AMap from "AMap";
import { listInfo, getLaLInfo, exportData } from "@/api/system/playback.js";
import axios from "axios";
import * as echarts from "echarts";
import Dialog from "@/components/map/dialog.vue";
import fileDownload from "js-file-download";

export default {
  data() {
    return {
      loading: true,
      tableData: [{ name: 11 }, { name: 22 }],
      currentRow: null,
      query: {
        pageSize: 500,
        pageNum: 1,
        numberPlate: "",
        startTime: "",
        endTime: "",
        timeInterval: "",
      },
      formLabelAlign: {
        numberPlate: "",
        startTime: "",
        endTime: "",
        timeInterval: "",
      },
      QualityDialogFlag: false,
      playback: "playback",
      navgtr: null,
      markerContent: "",
      map: null,
      msg: "",
      pathNavigs: [],
      pathSimplifierIns: null,
      path: [],
      rowNumber: 0,
      speedValue: 100,
      rules:{
          numberPlate :[{required: true, message: '请选择', trigger: 'blur'}],
          startTime:[{required: true, message: '请输入', trigger: 'blur'}],
          endTime:[{required: true, message: '请输入', trigger: 'blur'}],
          timeInterval:[{required: true, message: '请输入', trigger: 'blur'}]
      },
      pickerDisabled: {
            disabledDate: (time) => {
              return time.getTime() > new Date() * 1 + 600 * 1000;
            }
          }
    };
  },
  components: {
    Dialog,
  },
  methods: {
    onload() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        // center: [116.397428, 39.90923],
        zoom: 17,
      });

      listInfo(this.query).then((res) => {
        this.loading = false;
        this.tableData = res.data;

        let array = [];
        _.map(res.data, (item) => {
          array.push(item.longitude);
          array.push(item.latitude);
        });

        this.path = _.chunk(array, 2);

        this.lineArr = _.chunk(array, 2);

        this.marker = new AMap.Marker({
          map: map,
          position: this.path[0],
          icon: "static/img/car.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true
          
        });

        // 绘制轨迹
        var polyline = new AMap.Polyline({
          map: map,
          path: this.path,
          showDir: true,
          strokeColor: "#28F", //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6, //线宽
          // strokeStyle: "solid"  //线样式
        });

        var passedPolyline = new AMap.Polyline({
          map: map,
          // path: this.path,
          strokeColor: "#AF5", //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6, //线宽
          // strokeStyle: "solid"  //线样式
        });

        this.marker.on("moving", function (e) {
          passedPolyline.setPath(e.passedPath);
        });

        map.setFitView();

        // 图表
        let myChart = echarts.init(this.$refs.myChart);
        let option = {
          title: {
            text: "时速图",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: res.data.map(function (item) {
              return item.gpstime;
            }),
          },
          yAxis: {
            splitLine: {
              show: false,
            },
          },
          dataZoom: [
            {
              type: "inside",
            },
          ],

          series: {
            name: "速度 km/h",
            type: "line",
            data: res.data.map(function (item) {
              console.log(item)
              return item.speed;
            }),
          },
        };
        myChart.setOption(option);
      });
    },
    searchInfo(){
      var that=this
      this.$refs.formTable.validate((valid)=>{
          if(valid){
            that.onload()
          }
      })
    },
     // 比较时间大小
    compareDate(date1,date2,type){
        if(date1&&date2){
          var oDate1 = new Date(date1);
          var oDate2 = new Date(date2);
          if(oDate1.getTime() > oDate2.getTime()){
            console.log('开始时间大')
            this.$message({
                  message: '请设置结束时间大于开始时间',
                  type: "error",
                });
            if(type=='begin'){
              this.query.startTime=''
            }
            else{
              this.query.endTime=''
            }
          } else {
            console.log('结束时间大')
          }
        }
        
    },
    exportData() {
      this.$confirm("是否确认导出轨迹回放信息表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        exportData(this.query).then((res) => {
          fileDownload(
            res,
            "轨迹回放信息表导出" + this.parseTime(new Date()) + ".xls"
          );
        });
      });
    },
    startAnimation() {
      if (this.rowNumber === 0) {
        this.marker.moveAlong(this.path, this.speedValue);
      } else {
        console.log(this.rowNumber === 0);
        this.marker.moveAlong(this.lineArr, this.speedValue);
      }
      this.rowNumber = 0;
    },
    pauseAnimation() {
      this.marker.pauseMove();
    },
    resumeAnimation() {
      this.marker.resumeMove();
    },
    stopAnimation() {
      this.marker.stopMove();
    },

    getList(data) {
      // console.log(data)
      this.query.deviceId = data[0].deviceId;
      this.query.numberPlate = data[0].numberPlate;
      this.$refs.formTable.validateField('numberPlate')
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    handleCurrentChange(row, column, event) {
      this.currentRow = row;
      this.rowNumber = row.index + 1;
      this.lineArr = this.path.slice(this.rowNumber);

      this.startAnimation();
    },
    searchNumberPlate() {
      this.QualityDialogFlag = true;
    },
    setChart() {
      listInfo(this.query).then((res) => {
        // console.log(res.data)
        let myChart = echarts.init(this.$refs.myChart);
        let option = {
          title: {
            text: "时速图",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: res.data.map(function (item) {
              return item.gpstime;
            }),
          },
          yAxis: {
            splitLine: {
              show: false,
            },
          },
          dataZoom: [
            {
              type: "inside",
            },
          ],

          series: {
            name: "速度 km/h",
            type: "line",
            data: res.data.map(function (item) {
              return item.speed;
            }),
          },
        };
        myChart.setOption(option);
      });
    },
  },
  mounted() {
    this.onload();
  }
};
</script>

<style scoped>
#container {
  height: 70%;
  width: 100%;
  min-height: 600px;
}

#loadingTip {
  position: absolute;
  top: 60px;
}

body,
html {
  margin: 0;
  font-size: 12px;
}

#outer-box {
  height: inherit;
  /* padding-right: 300px; */
  position: relative;
}

.download {
  position: absolute;
  right: 10px;
  bottom: 310px;
  z-index: 999;
}

.searchContainer {
  width: 30%;
  position: absolute;
  top: 5px;
  right: 5px;
}

.searchContainer form {
  background: #fff;
  padding: 25px 20px 20px 20px;
}

.myChart {
  width: 100%;
  height: 300px;
  background: #fff;
  margin-top: 10px;
}

#panel {
  left: 0;
  width: 100%;
  z-index: 999;
  /* height: calc(100% - 300px); */
  height: 50px;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  bottom: 300px;
  background: #fff;
}

#routes-container {
  /* height: 1200px; */
  margin-left: 10px;
  margin-top: 10px;
}

#loadingTip {
  z-index: 9999;
  left: 0;
  padding: 3px 10px;
  background: red;
  color: #fff;
  font-size: 13px;
}

.route-item {
  margin-bottom: 10px;
  display: flex;
}

.route-item pre {
  margin: 0;
}

.route-item h3 {
  margin: 5px 0;
  font-size: 14px;
  cursor: pointer;
}

.hide {
  display: none;
}

.speedBox {
  padding: 5px 0;
}

.speedRange {
  vertical-align: middle;
  margin: 0;
  padding: 0;
  width: 100px;
}

.markerInfo {
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 5px;
  border: 1px solid #ccc;
  white-space: nowrap;
}

.input-card .btn {
  margin-right: 1.2rem;
  width: 7rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
</style>