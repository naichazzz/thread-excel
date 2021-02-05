<template>
  <el-menu
        :unique-opened='true'
        class="el-menu-vertical-demo"
        text-color="#666"
        active-text-color="#fff"
        :default-active='activeName'
        :default-openeds="defaultOpenedsArray"
        @select='chooseMenu'
        :collapse='collapse'
        ref='menu'
        router>
        <el-submenu :index="route.menuName" v-for="(route) in permission_routes" v-if="!route.meta" :key="route.menuName">
          <template slot="title">
            <item v-if="route.menuName" :icon="route.icon" :title="route.menuName" style="color:red"/>
          </template>
          <el-menu-item :index='item.menuName' v-for="(item) in route.children" :key="item.menuName" :route="item.path">
            <item v-if="item.menuName" :icon="item.icon" :title="item.menuName" />
          </el-menu-item>
        </el-submenu>
      </el-menu>
</template>

<script>
  import { mapGetters} from "vuex";
  import Item from './Item'
  export default {
    data(){
      return{
        activeName:''
      }
    },
    computed: {
      ...mapGetters(["permission_routes"]),
    },
    created(){
      if(sessionStorage.getItem('activeMenu')){
        this.activeName=sessionStorage.getItem('activeMenu')
      }
      else{
        this.activeName=''
      }
    },
    props:{
      activeMenu:'',
      activeMenuF:'',
      collapse:'',
      defaultOpenedsArray:{
        type:Array, 
        default:function(){
            return [];//或者是return {}
        }
      }
    },
    components:{Item},
    methods:{
      chooseMenu(key, keyPath){
       
        // console.log(keyPath)
        // this.$refs.menu.close(keyPath[0])
        this.$emit('fatherMethod',{key, keyPath})
        sessionStorage.setItem('activeMenu',key)
      }
    },
    watch:{
      activeMenu(val){
        sessionStorage.setItem('activeMenu',val)
        this.activeName=val
      }
    }
  }
</script>

<style>
  .el-menu{text-align: left;}
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-submenu.is-active .el-submenu__title{
    background: #ecf1ff;
    color: #4977FC !important;
    border-top-left-radius:50px;
    border-bottom-left-radius:50px;
    border-top-right-radius:0;
    border-bottom-right-radius:0;
  }
</style>
