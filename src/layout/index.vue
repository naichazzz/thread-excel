<template>
  <div style="height: 100%">
    <el-container style="height: 100%;">
      <el-header>
        <el-row :gutter="24">
          <el-col :span="10"
            ><div class="title">
              <img src="../../static/img/layout.png" style="width:35px"/>
              <h3 style="float: left">商用车企业平台</h3>
            </div></el-col
          >
          <el-col :span="12" class="hp-box" :offset="2">
            <div class="grid-content bg-purple" style="overflow: hidden">
              <div class="floatR">
                <el-dropdown @command="handleCommand">
                  <div data-cy="ind-dropdown-link" class="el-dropdown-link">
                    <el-avatar :src="avatar" class="floatL hp"></el-avatar>
                    <span>{{ name }}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </div>
                  
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item data-cy="ind-change-password-dropdown-item" command="a">
                      <i class="el-icon-edit"></i>修改密码</el-dropdown-item>
                    <el-dropdown-item data-cy="ind-exit-dropdown-item"  command="b">
                      <i class="el-icon-s-fold"></i>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>     
              <span @click="newMsg">
                <el-badge
                  is-dot
                  class="item floatR el-icon-message message"
                  v-if="tachographData.length != 0"
                >
                </el-badge>

                <el-badge class="item floatR el-icon-message message" v-else>
                </el-badge>
              </span>

              
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container style="padding-left:20px;">
        <div style="position: relative;">
          <div
            class="collapseIcon"
            @click="changeCollapse"
            :style="{right:collapseRight}"
          >
            <i :class="collapseIcon"></i>
          </div>
          <el-aside style="width: auto; border-right: 1px solid #d8d8d8;">
            <el-scrollbar :style="{ height: sidebarH }">
              <sidebar
                data-cy="hom-root-sidebar"
                @fatherMethod="chooseMenu"
                :activeMenu="currute.menuName"
                :activeMenuF="activeMenuF"
                :collapse="isCollapse"
                style="margin-top: 47px"
                :defaultOpenedsArray='OpenedsArray'
              />
            </el-scrollbar>
          </el-aside>
        </div>
        
        <el-main style="overflow-x: hidden">
          <el-container :style="{display: 'flex', height: tabboxH}">
            
            <div :style="{ width: tabBoxWidth }">
              <el-scrollbar
                style="height: 100%"
                ref="scrollContainer"
                :vertical="false"
              >
                <el-header class="tabNavi">
                  <el-tag
                    :type="item.type"
                    v-for="(item, index) in visitedViews"
                    closable
                    @click.native="chooseTab(index, item.name)"
                    @close="closeTab(index)"
                    :key="index"
                    style="margin: 2.5px 2.5px; border: 1px dashed #888"
                    >{{ item.name }}</el-tag
                  >
                </el-header>
              </el-scrollbar>
            </div>
          </el-container>
          <div class="main-box" :style="{ height: mainHeight }">
            <router-view
              @tachographParams="tachographParams"
              :clientId="clientId"
              :content="content"
              :oldContent="oldContent"
            ></router-view>
          </div>
        </el-main>
      </el-container>
      <!-- <el-container>
        <el-aside style="width:auto">
          <sidebar @fatherMethod="chooseMenu" :activeMenu='currute.menuName' :activeMenuF='activeMenuF' :collapse="isCollapse"  />
        </el-aside>
        
      </el-container> -->
    </el-container>
    <el-dialog data-cy="ind-change-password-dialog" title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form_pw" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="password">
          <el-input
            data-cy="ind-dia-old-password-input"
            v-model="form_pw.password"
            placeholder="请输入旧密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            data-cy="ind-dia-new-password-input"
            v-model="form_pw.newPassword"
            placeholder="输入新密码(含字母数字特殊字符)"
            type="password"
          >
            <template slot="append">长度7~10</template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPassword2">
          <el-input
            data-cy="ind-dia-password-confirm-input"
            v-model="form_pw.newPassword2"
            placeholder="请确认新密码"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button data-cy="ind-dia-cancel-button" @click="dialogVisible = false">取 消</el-button>
        <el-button data-cy="ind-dia-commit-button" type="primary" @click="submitForm('form_pw')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="行驶记录仪采集数据结果"
      :visible.sync="tachographVisible"
      width="80%"
    >
      <el-table :data="tachographData" @row-click="handleCurrentChange">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="车牌号" prop="vehicleNumber" sortable>
        </el-table-column>
        <el-table-column prop="commandName" label="指令名称"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tachographVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="行驶记录仪采集数据结果"
      :visible.sync="detailVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="10em" disabled>
        <el-form-item label="车牌号">
          <el-input v-model="form.vehicleNumber"></el-input>
        </el-form-item>
        <el-form-item label="脉冲系数" v-if="commandId == '0x04'">
          <el-input v-model="form.mcxs"></el-input>
        </el-form-item>
        <el-form-item
          label="实际时间"
          v-if="
            commandId == '0x04' ||
            commandId == '0x03' ||
            commandId == '0x02' ||
            commandId == '0x06'
          "
        >
          <el-input v-model="form.currentTime"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证号" v-if="commandId == '0x12'">
          <el-input v-model="form.driverLicenseNumber"></el-input>
        </el-form-item>
        <el-form-item label="车辆识别号" v-if="commandId == '0x05'">
          <el-input v-model="form.VIN"></el-input>
        </el-form-item>
        <el-form-item label="车牌号分类" v-if="commandId == '0x05'">
          <el-input v-model="form.vehicleType"></el-input>
        </el-form-item>
        <el-form-item label="状态信号" v-if="commandId == '0x06'">
          <el-input v-model="form.statusSignal"></el-input>
        </el-form-item>
        <el-form-item label="生产厂CCC认证代码" v-if="commandId == '0x07'">
          <el-input v-model="form.manufacturerCode"></el-input>
        </el-form-item>
        <el-form-item label="产品型号" v-if="commandId == '0x07'">
          <el-input v-model="form.TachographType"></el-input>
        </el-form-item>
        <el-form-item label="记录仪生产日期" v-if="commandId == '0x07'">
          <el-input v-model="form.productionDate"></el-input>
        </el-form-item>
        <el-form-item label="产品生产流水号" v-if="commandId == '0x07'">
          <el-input v-model="form.SerialNumber"></el-input>
        </el-form-item>
        <el-form-item label="记录仪标准年号" v-if="commandId == '0x00'">
          <el-input v-model="form.tachographStandardVersion"></el-input>
        </el-form-item>
        <el-form-item label="修改单号" v-if="commandId == '0x00'">
          <el-input v-model="form.modifyNumber"></el-input>
        </el-form-item>
        <el-form-item label="初始里程" v-if="commandId == '0x03'">
          <el-input v-model="form.initmile"></el-input>
        </el-form-item>
        <el-form-item label="累计里程" v-if="commandId == '0x03'">
          <el-input v-model="form.allmile"></el-input>
        </el-form-item>
        <el-form-item
          label="采集内容"
          v-if="
            commandId !== '0x00' &&
            commandId !== '0x03' &&
            commandId !== '0x05' &&
            commandId !== '0x06' &&
            commandId !== '0x04' &&
            commandId !== '0x12' &&
            commandId !== '0x02'
          "
        >
          <el-input v-model="form.content" type="area"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sidebar from "@/layout/Sidebar";
import router from "../router";
import { chooseMenu } from "@/api/system/tagsView.js";
import { changePW } from "@/api/login.js";
import { setTablist, getTablist } from "@/utils/auth";
import { collectionResult } from "@/api/system/terminalSetting/tachograph";
import io from "socket.io-client";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      let exp = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{7,10}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!exp.test(value)) {
        callback(new Error("密码不符合规范"));
      } else {
        if (this.form_pw.newPassword2 !== "") {
          this.$refs.ruleForm.validateField("newPassword2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form_pw.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      query: {
        commandId: "",
        deviceId: "",
        optId: "",
        vehicleNumber: "",
      },
      commandId: "",
      tachographVisible: false,
      form: {},
      detailVisible: false,
      tachographData: [],
      tabList: [],
      currute: [],
      dialogVisible: false,
      form_pw: {},
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        newPassword2: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
      mainHeight: "",
      activeMenuF: "",
      tabBoxWidth: "",
      isCollapse: false,
      clientId: "",
      content: {},
      oldContent: {},
      collapseRight:'15px',
      collapseIcon:'el-icon-s-fold',
      sidebarH:'',
      OpenedsArray:[],
      tabboxH:0
    };
  },
  computed: {
    ...mapGetters(["avatar", "permission_routes", "name", "visitedViews"]),
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap;
    },
  },
  created() {
    this.tabList = this.visitedViews;
    if(!this.visitedViews||this.visitedViews.length==0){
      this.tabboxH=0
    }
    else{
      this.tabboxH='47px'
    }
    var fullHeight = document.documentElement.clientHeight;
    this.mainHeight = fullHeight - 60 - 42 - 20 + "px";
    this.sidebarH=fullHeight - 60 - 42 - 20 +47+ "px";
    this.tabBoxWidth = document.documentElement.clientWidth - 230 + "px";
  },
  components: {
    sidebar,
  },

  methods: {
    changeCollapse() {
      if (this.isCollapse) {
        this.isCollapse = false;
        this.collapseRight='15px'
        this.collapseIcon='el-icon-s-fold'
      } else {
        this.isCollapse = true;
        this.collapseRight='20px'
        this.collapseIcon='el-icon-s-unfold'
      }
    },
    newMsg() {
      this.tachographVisible = true;

      collectionResult(this.query).then((res) => {
        // console.log(res.code == 200 && res.data != null);
        if (res.code == 200 && res.data != null) {
          this.tachographData.push(res.data);
          this.tachographData = _.uniqBy(this.tachographData, "commandId");
          sessionStorage.setItem(
            "tachographData",
            JSON.stringify(this.tachographData)
          );
        }
      });
    },
    tachographParams(msg) {
      this.query = msg;
      // this.query = {
      //   commandId: "0x05",
      //   deviceId: "00000000064746215406",
      //   optId: "EEFFGG",
      //   vehicleNumber: "456",
      // };
      console.log(this.query)
      var that=this
      setTimeout(function(){
        collectionResult(that.query).then((res) => {
          console.log(res)
          if (res.code == 200 && res.data != null) {
            that.tachographData.push(res.data);
            that.tachographData = _.uniqBy(that.tachographData, "commandId");
            sessionStorage.setItem(
              "tachographData",
              JSON.stringify(that.tachographData)
            );
          }
        });
      },2000)
    },

    handleCurrentChange(row) {
      this.form = row;
      this.commandId = row.commandId;
      this.detailVisible = true;

      _.remove(this.tachographData, (item) => {
        return item.commandId == row.commandId;
      });

      sessionStorage.setItem(
        "tachographData",
        JSON.stringify(this.tachographData)
      );
    },
    handleClose(done) {
      this.query = {};
      this.detailVisible = false;
      let { ...foa } = this.tachographData;
      var _tachographData=foa;
      this.tachographData=[]
      setTimeout(function(){
        this.tachographData=_tachographData
      },500)
    },
    chooseMenu(e) {
      chooseMenu(e.key).then((res) => {
        // console.log(res);
        const $scrollWrapper = this.scrollWrapper;
        const $container = this.$refs.scrollContainer.$el;
        const $containerWidth = $container.offsetWidth;
        // console.log(e.key);
        var currTag = "";
        for (var i = 0; i <= res.length; i++) {
          if (e.key == res[i].name) {
            currTag = i;
            // console.log(currTag);
            // console.log(res.length / 2);
            break;
          }
        }
        if (currTag <= res.length / 2) {
          $scrollWrapper.scrollLeft = 0;
        } else {
          $scrollWrapper.scrollLeft =
            $scrollWrapper.scrollWidth - $containerWidth;
        }
        this.tabboxH='47px'
      });
    },
    chooseTab(index, name) {
      this.tabList = this.visitedViews;
      for (var i = 0; i < this.tabList.length; i++) {
        this.tabList[i].type = "info";
      }
      this.tabList[index].type = "";
      this.$store.dispatch("tagsView/addVisitedView", this.tabList);
      sessionStorage.setItem("tabList", JSON.stringify(this.tabList));
      if (this.tabList[index].path) {
        this.$router.push({
          path: this.tabList[index].path,
        });
      } else {
        this.filterMenu(name, this.permission_routes);
      }
    },
    closeTab(index) {
      this.tabList = this.visitedViews;
      if (this.tabList.length == 1) {
        this.tabList = [];
        this.currute=[]
        this.OpenedsArray=[]
        this.tabboxH=0
        this.$router.push({
          path: "/",
        });
      } else {
        if (this.tabList[index].type == "") {
          if (index == 0) {
            this.tabList[index + 1].type = "";
          } else if (this.tabList.length - 1 > 0) {
            this.tabList[index - 1].type = "";
          }
          this.tabList.splice(index, 1);
          var name;
          if (index > 0) {
            name = this.tabList[index - 1].name;
            // if (this.tabList[index - 1].path) {
            //   this.$router.push({
            //     path: this.tabList[index - 1].path,
            //   });
            // } else {
            //   this.filterMenu(name, this.permission_routes);
            // }
            this.filterMenu(name, this.permission_routes);
          } else {
            name = this.tabList[index].name;
            // if (this.tabList[index].path) {
            //   this.$router.push({
            //     path: this.tabList[index].path,
            //   });
            // } else {
            //   this.filterMenu(name, this.permission_routes);
            // }
            this.filterMenu(name, this.permission_routes);
          }
        } else {
          this.tabList.splice(index, 1);
        }
      }
      this.$store.dispatch("tagsView/addVisitedView", this.tabList);
      sessionStorage.setItem("tabList", JSON.stringify(this.tabList));
    },
    filterMenu(name, list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].children) {
          for (var j = 0; j < list[i].children.length; j++) {
            if (list[i].children[j].menuName === name) {
              this.currute = list[i].children[j];
              this.activeMenuF = list[i].menuName;
              // console.log(this.activeMenuF);
              break;
            }
          }
        } else {
          if (list[i].menuName === name) {
            this.currute = list[i];
            break;
          }
        }
      }
      this.$router.push({
        path: this.currute.path,
      });
    },
    logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        sessionStorage.removeItem('activeMenu');
        this.$store.dispatch("LogOut").then(() => {
          location.href = "/login";
        });
      });
    },
    changePW() {
      this.dialogVisible = true;
    },
    handleCommand(command){
      if(command=='a'){
        this.changePW()
      }
      else if(command=='b'){
        this.logout()
      }
    },
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            username: this.name,
            oldPassword: this.form_pw.password,
            newPassword: this.form_pw.newPassword,
          };
          changePW(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "修改密码成功",
                type: "success",
              });
              this.$store.dispatch("LogOut").then(() => {
                location.href = "/login";
              });
            } else {
              // console.log(res);
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          });
        } else {
          // console.log(res);
          return false;
        }
        this.dialogVisible = false;
      });
    },
    // 消息弹出框
    open3() {
        this.$notify.info({
          title: '消息',
          message: this.content
        });
      },
    updateSocket(newVal) {
      this.oldContent = this.content;
      this.content = newVal;
      console.log(newVal)
      // 测试消息弹出
      this.open3()
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
  mounted() {
    if (JSON.parse(sessionStorage.getItem("tachographData")) !== null) {
      this.tachographData = JSON.parse(
        sessionStorage.getItem("tachographData")
      );
    }

    this.clientId = this.guid();
    let opts = {
      query: "clientId=" + this.clientId,
    };

    let socket = io.connect("47.94.166.147:10001", opts);
    let _this = this;

    socket.on("connect", function () {
      console.log("连接成功");
    });

    socket.on("push_event", function (data) {
      console.log(data);
      _this.updateSocket(JSON.parse(data.content));
    });
    socket.on("disconnect", function () {
      console.log("已经下线");
    });
    socket.on("connect_error", function (error) {
      console.log(error);
      socket.close();
    });
  },
  watch: {
    isCollapse(val) {
      // console.log(val);
      if (!val) {
        this.tabBoxWidth = document.documentElement.clientWidth - 230 + "px";
      } else {
        this.tabBoxWidth = document.documentElement.clientWidth - 94 + "px";
      }
    },
  },
  // beforeDestroy() {
  //   localStorage.removeItem("tachographData");
  // },
};
</script>

<style>
</style>
