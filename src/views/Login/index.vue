<template>
  <div class="login">
    <ul class="login-heaher">
      <li>{{$t('language')}}</li>
      <li>{{$t('customerCase')}}</li>
      <li>{{$t('about')}}</li>
      <li>{{$t('appointmentExperience')}}</li>
    </ul>
    <div class="login-main">
      <h2>{{$t('formName')}}</h2>
      <div class="login-form">
        <svg class="login-form-bg" id="组_11" data-name="组 11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="658" height="489.5" viewBox="0 0 658 489.5">
          <defs>
            <filter id="filter" x="0.5" y="0.5" width="657" height="487" filterUnits="userSpaceOnUse">
              <feGaussianBlur result="blur" stdDeviation="2.333" in="SourceAlpha"/>
              <feComposite result="composite"/>
              <feComposite result="composite-2"/>
              <feComposite result="composite-3"/>
              <feFlood result="flood" flood-color="#3180ea" flood-opacity="0.35"/>
              <feComposite result="composite-4" operator="in" in2="composite-3"/>
              <feBlend result="blend" mode="screen" in2="SourceGraphic"/>
              <feBlend result="blend-2" in="SourceGraphic"/>
              <feGaussianBlur result="blur-2" stdDeviation="8" in="SourceAlpha"/>
              <feFlood result="flood-2" flood-color="#3180ea" flood-opacity="0.35"/>
              <feComposite result="composite-6" operator="out" in2="blur-2"/>
              <feComposite result="composite-5" operator="in" in2="SourceAlpha"/>
              <feBlend result="blend-3" mode="screen" in2="blend-2"/>
            </filter>
            <filter id="filter-2" x="6.5" y="6.5" width="644" height="474" filterUnits="userSpaceOnUse">
              <feFlood result="flood" flood-color="#000b21" flood-opacity="0.9"/>
              <feComposite result="composite" operator="in" in2="SourceGraphic"/>
              <feBlend result="blend" in2="SourceGraphic"/>
              <feGaussianBlur result="blur" stdDeviation="10.667" in="SourceAlpha"/>
              <feFlood result="flood-2" flood-color="#457acf" flood-opacity="0.4"/>
              <feComposite result="composite-3" operator="out" in2="blur"/>
              <feComposite result="composite-2" operator="in" in2="SourceAlpha"/>
              <feBlend result="blend-2" in2="blend"/>
            </filter>
          </defs>
          <g style="fill: none; filter: url(#filter)">
            <path id="圆角矩形_1_拷贝_4" data-name="圆角矩形 1 拷贝 4" class="cls-1" d="M16.5,6.5h628a6,6,0,0,1,6,6v462a6,6,0,0,1-6,6H16.5a10,10,0,0,1-10-10V16.5A10,10,0,0,1,16.5,6.5Z" style="stroke: inherit; filter: none; fill: inherit"/>
          </g>
          <use xlink:href="#圆角矩形_1_拷贝_4" style="stroke: #042c71; filter: none; fill: none"/>
          <path id="圆角矩形_1_拷贝_4-2" data-name="圆角矩形 1 拷贝 4" class="cls-2" d="M16.5,6.5h628a6,6,0,0,1,6,6v462a6,6,0,0,1-6,6H16.5a10,10,0,0,1-10-10V16.5A10,10,0,0,1,16.5,6.5Z"/>
          <path id="矩形_2_副本_2_拷贝" data-name="矩形 2 副本 2 拷贝" class="cls-3" d="M2677.64,2808.85h-32.33v36.27l-7.31,8.21V2801h46.63Zm-0.26,468.31h-32.12v-36.27l-7.26-8.2v52.32h46.33Zm567.24-467h32.12v36.27l7.27,8.2v-52.32h-46.33Zm0.26,467h31.91v-36.27l7.22-8.2v52.32h-46.03Z" transform="translate(-2632.5 -2795.5)"/>
        </svg>
        <h3>{{$t('userLogin')}}</h3>
        <el-input v-model="userName" @focus="errText = null">
          <i slot="prefix" class=" iconfont icon-Itsmine"></i>
        </el-input>
        <el-input v-model="password" type="password"  @focus="errText = null">
          <i slot="prefix" class=" iconfont icon-Lock"></i>
        </el-input>
        <p>
          <el-checkbox v-model="isSave" size='medium'></el-checkbox>
          <span>{{$t('rememberPassword')}}</span>
          <span class="err-text" v-if="errText">{{errText}}</span> 
        </p>
        <el-button @click="login()">{{$t('login')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {Login} from '@/request/api.js'
import {post } from '@/request/http.js';
import Md5 from 'js-md5'
export default {
  data() {
    return {
      userName:"",
      password:"",
      isSave:true,
      errText:''
    };
  },
  computed: {},
  created() {
    this.clickEnter()
  },
  methods: {
        /**
         * 点击Enter键登录
         */
        clickEnter(){
            document.onkeydown = e =>
             {
              let event = window.event||e
              let _key = event.keyCode;
              if (_key === 13) {
                  this.login()
              }
            };
            this.userName = localStorage.getItem('userName')||''
            this.password = localStorage.getItem('password')||''
        },
        /**
         * 记住用户名和密码
         */
        saveUserInfo(){
            if(this.isSave){
                localStorage.setItem('userName',this.userName)
                localStorage.setItem('password',this.password)
            }else{
                localStorage.removeItem('userName')
                localStorage.removeItem('password')
            }
        },
        async login(){
            if(!this.userName){
              this.errText = '请输入用户名'
              return
            }
            if(!this.password){
              this.errText = '请输入密码'
              return
            }
            Login({
                FUserName:this.userName,
                FPassword:this.password
            })
            .then((result) => {
                this.saveUserInfo()
                let data = result.FObject[0]
                let {FBSAddress,FTokenID,FUserGUID,FUserName} = data
                localStorage.setItem('FToken',FTokenID)
                window.location.href = `${FBSAddress}?token=${FTokenID}&userName=${FUserName}&userId=${FUserGUID}`
            }).catch((err) => {
                if(err.Result == 103){
                    this.errText = '用户名或密码错误'
                }else{
                    this.errText = '未知错误，请联系管理员'
                    }
            });
        }
  }
};
</script>
<style lang="scss">
.login{
  width: 100%;
  height: 100%;
  background: url(../../assets/images/login/login.png);
  position: relative;
  .login-heaher{
    padding-top: 20px;
    padding-right: 104px;
    text-align: right;
    li{
      display: inline-block;
      line-height: 94px;
      font-size: 22px;
    }
    li+li{
      margin-left: 53px;
    }
  }
  .login-main{
    width: 646px;
    position: absolute;
    top: 210px;
    right: 67px;
    h2{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size:50px;
      font-family:Microsoft YaHei;
      font-weight:800;
      color:#020925;
      line-height:73px;
      -webkit-text-stroke: 2px #00F9F4;
     /*  text-shadow:0px 0px 1px #00F9F4,0px 0px 2px #00F9F4,0px 0px 3px #00F9F4,0px 0px 4px #00F9F4; */
      /* -webkit-text-stroke:4px #020925;
      text-stroke:4px #020925; */
    }
    .login-form{
      width:646px;
      height:484px;
      margin-top: 102px;
      padding-top: 32px;
      box-sizing: border-box;
      position: relative;
      background: rgba($color: #020A23, $alpha: .9);
      box-shadow: 0 0 10px 10px #0F2245 inset;
      &-bg{
        position: absolute;
        top: -6px;
        left: -6px;
        .cls-1, .cls-2 {
          fill: none;
        }

        .cls-1 {
          stroke: #042c71;
          stroke-width: 1px;
          filter: url(#filter);
        }

        .cls-2 {
          filter: url(#filter-2);
        }

        .cls-3 {
          fill: #00fff9;
          fill-rule: evenodd;
        }
      }
      h3{
        font-size: 30px;
        color: #3EAFFD;
      }
      .el-input{
        width:459px;
        height:78px;
        margin-top: 28px;
        line-height: 78px;
        &__inner{
          height: 100%;
          padding-left: 50px;
          border-radius: 0;
          font-size: 26px;
          color: #D3D4D4;
          background:rgba(115,195,250,0.1);
          border:1px solid rgba(62,175,253,1);
        }
        &__prefix{
          .iconfont{
            font-size: 40px;
            color: #B8DBEF
          }
        }
      }
      >p{
        margin-top: 46px;
        padding-left: 96px;
        text-align: left;
        font-size: 22px;
        color: #C1C1C1;
        >span{
          margin-left: 13px;
        }
        .el-checkbox{
            &__input{
                .el-checkbox__inner{
                    width: 28px;
                    height: 28px;
                    &::after{
                        height: 20px;
                        left: 10px;
                        width: 8px;
                    }
                }
            }
            .el-checkbox__input.is-checked .el-checkbox__inner, 
            .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                background-color: #102136;
                border-color: #102136
            }
            &__label{
                font-size:20px;
                color: #999999;
                font-weight:bold;
            }
        }
        .err-text{
            color: red;
            margin-left: 28px;
        }
      }
      .el-button{
        width:459px;
        height:78px;
        margin-top: 24px;
        position: relative;
        z-index: 2;
        background:rgba(4,140,146,1);
        color: white;
        font-size: 28px;
        border: none;
        &:hover{
          background:rgba(4,140,146,0.8)
        }
      }
    }
  }
}
</style>