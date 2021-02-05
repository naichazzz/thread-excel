<template>
  <div class="main login">
    <div class="loginBox">
      <div class="pngBox">
        <div class="imgBox">
          <img src="../../static/img/login.png" alt="">
        </div>
        <div class="textBox">
          <h2>HI！用户您好</h2>
          <span>欢迎登录商用车企业平台 ！</span>
        </div>
      </div>
      <div class="logInForm">
        <h2 class="log_title">商用车企业平台</h2>
        <el-form :model="form" ref='loginForm' :rules="formItemRules">
          <el-form-item label="" prop="username">
            <el-input data-cy="log-username-input" v-model="form.username" placeholder="请输入内容" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input data-cy="log-password-input" placeholder="请输入密码" v-model="form.password" show-password prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item label="" prop="code">
            <el-input  data-cy="log-verification-code-input" placeholder="请输入验证码" v-model="form.code" class="codeInput" maxlength='4' prefix-icon="el-icon-tickets"></el-input>
            <div class="coderight">
                <img data-cy="log-code-image" :src="codeUrl" @click="getCode" class="login-code-img"/>
            </div>
          </el-form-item>
          
          <el-form-item>
              <el-button data-cy="log-login-button"  type="primary" @click="submitForm" class="button">登录</el-button>
          </el-form-item>
          <div class="buttonBox">
            <div class="floatL">
              <el-form :inline="true">
                <el-form-item label="">
                  <el-checkbox data-cy="log-remember-me-checkbox" v-model="form.rememberMe" class="floatL colorW">记住密码</el-checkbox>
                </el-form-item>
              </el-form>
            </div>
            <!-- <div class="floatR">
              <el-form-item label="">
                <el-link type="primary" style='margin-right: 10px;' href="">注册账户</el-link>
                <el-link type="primary" href="">忘记密码</el-link>
              </el-form-item>
            </div> -->
          </div>
         </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import * as http from '@/api/login'
  import SIdentify from "../components/identify.vue";
  import Cookies from "js-cookie";
  export default {
    data () {
      return {
        codeUrl:"",
        form: {
          username: '',
          password: '',
          rememberMe: true,
          code:'',
          uuid: ""
        },
        identifyCode:'',
        identifyCodes:'1234567890abcdefghijklmnopqrstuvwsyz',
        formItemRules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
        }
      }
    },
    components: {
        SIdentify: SIdentify
      },
    created() {
      this.getCode();
      this.getCookie();
    },
    methods: {
        submitForm () {
          this.$refs['loginForm'].validate((valid) => {
            if (valid) {
              const loading = this.$loading({
                          lock: true,//lock的修改符--默认是false
                          text: 'Loading',//显示在加载图标下方的加载文案
                          spinner: 'el-icon-loading',//自定义加载图标类名
                          background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                          target: document.querySelector('#app')//loadin覆盖的dom元素节点
                  });
              // 判断是否点击了自动登录
              if (this.form.rememberMe) {
                Cookies.set("username", this.form.username, { expires: 30 });
                Cookies.set("password", this.form.password, { expires: 30 });
                Cookies.set('rememberMe', this.form.rememberMe, { expires: 30 });
              } else {
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove('rememberMe');
              }
              console.log(this.form)
              this.$store
                .dispatch("Login", this.form)
                .then(res => {
                  console.log(res)
                  if(res.code!=200){
                    this.getCode();
                  }
                  loading.close()
                  this.$router.push({ path:'/' });
                })
                .catch(() => {
                  loading.close()
                  this.loading = false;
                  this.getCode();
                });
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        getCookie() {
          const username = Cookies.get("username");
          const password = Cookies.get("password");
          const rememberMe = Cookies.get('rememberMe')
          this.form = {
            username: username === undefined ? this.form.username : username,
            password: password === undefined ? this.form.password : password,
            rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
          };
        },
        getCode() {
          http.getCodeImg().then(res => {
        console.log(res)
            this.codeUrl = "data:image/gif;base64," + res.data.img;

            this.form.uuid = res.data.uuid;
          });
        },
        //验证码abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
        randomNum(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
          this.identifyCode = "";
          this.makeCode(this.identifyCodes, 4);
        },
        makeCode(o, l) {
          for (let i = 0; i < l; i++) {
            this.identifyCode += this.identifyCodes[
              this.randomNum(0, this.identifyCodes.length)
            ];
          }
          console.log(this.identifyCode);
        },
    }
 }
</script>

<style>
  .login .logInForm{width: 35%;padding: 5%;background-color: #4b83fc;}
  .login .pngBox{width: 55%;}
  .login .buttonBox{width: 100%;overflow: hidden;padding: 0; position: relative; color: #fff;}
  .login .floatL{float: left;}
  .login .floatR{float: right;position: absolute;top: -1px;right: 0;}
  .login .colorW{color: white !important;}
  .login .el-checkbox__input.is-checked+.el-checkbox__label{
    color: white !important;
  }
  .login .button{width: 100%;background: #fff;color: #4b83fc;padding: 15px 0;border-radius: 10px;font-size: 16px;margin-top: 20px;}
  .login {width: 100%;height: 100%;background-image: url(../../static/img/bac.png);background-position: center;background-size: cover;}
  .login .loginBox{position: fixed;width: 60%; height: 520px;top: 50%;right: 20%;margin-top: -260px; border: #002C95 1px solid;border-radius: 10px;background-image: url(../assets/bac.png);display: flex;}
  .login .codeInput{width: 55%;float: left;}
  .login .coderight{

    height: 38px;
    float: right;
  }
  .login .coderight img{
    cursor: pointer;
    vertical-align: middle;
  }
  .login .log_title{margin: 0 0 60px 0;color: #fff;}
  .login .el-link.el-link--primary{color: #fff !important;}
  /* .login .el-input{padding: 15px 0;border-radius: 10px;} */
  .login .el-input__inner{padding: 15px 40px !important;border-radius: 10px; background-color: #83affe;color: #fff;}
  .login .el-input__icon{font-size: 20px;width: 30px; color: #4b7ffc; font-weight: bold;}
  .login .el-input__inner:focus{
          background: #cadffe;
          color:#4b83fc ;
        }
  .login .imgBox{padding: 40px 0 10px;width: 100%; text-align: center;}
  .login .imgBox img{width: 60%;max-width: 360px;}
  .login .textBox{width: 100%;text-align: center;}
  .login .textBox h2{color: #4b7ffc;font-weight: 400;}
  .login .textBox span{font-size: 18px;}
</style>
