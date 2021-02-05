<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-header>
        <el-row :gutter="24">
          <el-col :span="6"><div class="title"><h3>标题占位文字</h3></div></el-col>
          <el-col :span="6" :offset="12" class="hp-box">
            <div class="grid-content bg-purple" style="overflow: hidden">
              <div class="floatL">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class='floatL hp'></el-avatar>
                <span>系统管理员</span>
              </div>
              <el-button type="text" icon="el-icon-s-fold" size="medium" class="buttonC floatL">退出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                text-color="#fff"
                active-text-color="#fff"
                @select='chooseMenu'
                ref='menu'
                router>
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>基本信息管理</span>
                  </template>
                  <el-menu-item index="用户管理">用户管理</el-menu-item>
                  <el-menu-item index="角色管理">角色管理</el-menu-item>
                  <el-menu-item index="菜单管理">菜单管理</el-menu-item>
                  <el-menu-item index="组管理">组管理</el-menu-item>
                  <el-menu-item index="车辆管理">车辆管理</el-menu-item>
                  <el-menu-item index="SIM卡管理">SIM卡管理</el-menu-item>

                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>车辆监控</span>
                  </template>
                  <el-menu-item index="车辆监控">车辆监控</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                </el-submenu>

              </el-menu>
        </el-aside>
        <el-main>
          <el-container>
            <el-header class='tabNavi' v-if='tabList.length>0'>
              <el-tag :type="item.type" v-for="(item,index) in tabList" closable @click.native='chooseTab(index,item.name)' @close='closeTab(index)' :key='index'>{{item.name}}</el-tag>
            </el-header>
          </el-container>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import router from '../router'
  export default {
      data(){
        return{
          tabList:[]
        }
      },
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);

        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        chooseMenu(key, keyPath){
          console.log(key);
          this.$refs.menu.close(keyPath[0])
          console.log(this.tabList.length)
          if(this.tabList.length>0){
            for(var i=0;i<this.tabList.length;i++){

              if(this.tabList[i].name==key){

                this.tabList[i].type='success'
                for(var j=0;j<this.tabList.length;j++){
                  if(this.tabList[j].name!=key){
                    this.tabList[j].type='info'
                  }
                }
                break;
              }
              else{
                if(i==this.tabList.length-1){
                  var item={name:key,type:'success'}
                  this.tabList.push(item)
                  for(var i=0;i<this.tabList.length-1;i++){
                    this.tabList[i].type='info'
                  }
                }
              }
            }
          }
          else{
            var item={name:key,type:'success'}
            this.tabList.push(item)
          }
        },
        chooseTab(index,name){

          for(var i=0;i<this.tabList.length;i++){
            this.tabList[i].type='info'
          }
          this.tabList[index].type='success'
          this.$router.push({
          	path: '/'+name
          })
        },
        closeTab(index){
          if(this.tabList[index].type=='success'){
            if(this.tabList.length-1>0){
              this.tabList[index-1].type='success'
            }
          }
          this.tabList.splice(index, 1)
          console.log(this.tabList)
        }
      }
    }
</script>

<style>
  .el-header, .el-footer {
      background-image: url(../assets/bac2.jpg);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: left;
      color: #fff;
      text-align: center;
      line-height: 60px;
      padding: 0;
    }
    .el-menu{background-color:inherit;}
    .el-aside {
      color: #333;
      text-align: center;
      line-height: 200px;
      background-color: #002c95;
      background-position: left;
      opacity: 0.8;
    }

    .el-main {
      background-color: #fff;
      color: #333;
      text-align: center;
      padding: 0;
    }

    body > .el-container {
      margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
      line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
      line-height: 320px;
    }
    h3{margin: 0;}
    .title{width: 100%;text-align: left;margin-left: 30px;color: #FFFFFF;}
    .buttonC{color: #ffffff;font-size: 16px;margin-top: 10px;margin-left: 20px;}
    a{color: #FFFFFF;text-decoration: none;}
    .tabNavi{background-color: #FFFFFF !important;line-height: 0; text-align: left;padding: 5px; height: auto !important;width: 100%;background-image: none;}
    .el-submenu__title i{color: #fff;}
    .floatL{float: left;}
    .floatR{float: right;}
    .hp{height: 40px;margin-top: 10px;margin-right: 10px;}
    .el-submenu__title:hover,.el-menu-item:hover{
            border-left:#33A2EF solid 6px !important;
            background-color: #E2EFF9 !important;
            color: #38B2FF !important;
            //less语法，实现鼠标悬停时icon变色
            i {
                color: #38B2FF;
            }
        }
</style>
