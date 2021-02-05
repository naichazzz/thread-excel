<template>
    <div>
        <el-dialog
        title="查看形状"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="QualityDialogClose"
        v-if="visible"
        v-loading="loading"
        >
             <div class="map" ref="map" id="map"></div>
        </el-dialog>
    </div>
</template>
<script>
import AMap from 'AMap'
var map
export default {
    data(){
        return{
            visible: false,
            zoom:5,
            loading:true
        }
    },
    props:{
        QualityDialogFlag: {
        default: false,
        }
    },
    created(){
        
    },
    methods:{
        QualityDialogClose() {
            this.$emit("update:QualityDialogFlag", false);
            this.loading=true
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
            this.createShape()
        },
        createShape(){
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
            });
            circle.setMap(map)
            // 缩放地图到合适的视野级别
            map.setFitView([ circle ])
        }
    },
    watch:{
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
            var that=this
            if(this.visible){
                setTimeout(function(){
                    // that.$refs.map.style.height=document.documentElement.clientHeight-54+'px'
                    that.createMap()
                },500)
                
            }
        }
    }
}
</script>
<style scoped>
    .map{width: 100%;height: 500px;}
</style>