<template>
  <div class="login-container">
    <div class="title">
      <span class="logo" />
      <div class="sysName">
        <span class="text">社会化消防安全管理平台</span>
        <span class="text-EN">SOCIALIZED FIRE SAFETY MANAGEMENT PLATFORM</span>
      </div>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="loginName">
        <span class="icon-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="请输入账号"
          name="loginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="icon-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button class="login-btn" :loading="loading" type="primary" @click.prevent="handleLogin">登录</el-button>

      <!-- <button class="login-btn login-btn-primary login-btn-ghost login-btn-shine" :loading="loading" @click.native.prevent="handleLogin">登陆</button> -->

    </el-form>
    <div class="footer">版权所有：青岛宽广网络科技有限公司，技术支持：青岛宽广网络科技有限公司</div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: '',
        password: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted () {
    // this.createParticle()
    if (this.loginForm.loginName === '') {
      this.$refs.loginName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  unmounted () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      const Base64 = require('js-base64').Base64
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', { ...this.loginForm, password: Base64.encode(this.loginForm.password) })
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
              this.$message({
                message: '登录成功',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 14px;
      &:-webkit-autofill {
        // /box-shadow: 0 0 0px 1000px #C7C6C6 inset !important;/
        -webkit-text-fill-color: #ededed !important;
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
      }
      &:-internal-autofill-selected{
        background-color: transparent!important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__content{
     background: rgba(0, 0, 0, 0.1);
     border: 1px solid#5ee4fe;
     background: transparent;
  }
}
</style>

<style lang="scss" scoped>
@font-face {
  font-family: 'font1';
  src: url('./fonts/login_sysName.TTF');
}
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  padding: 35px 0  24px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #001646;
  background-image: url(./images/login_bg.jpg);
  background-repeat: no-repeat;
  background-position: left center;
  .title{
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 260px;
    .logo{
      display: inline-block;
      width: 80px;
      height: 84px;
      background: url(./images/login_logo.png)0 0 no-repeat;
    }
    .sysName{
      color: #fff;
      display: flex;
      flex-direction: column;
      .text{
        font-size: 32px;
        font-family: 'font1';
      }
      .text-EN{
        font-size: 14px;
      }
    }
    .text{

    }
  }
  .footer{
    font-size: 14px;
    color: #c7c7c7;
  }

  .login-form {
    position: absolute;
    right: 15%;
    top: 50%;
    transform: translateY(-50%);
    width: 415px;
    max-width: 100%;
    height: 410px;
    padding: 0 33px;
    overflow: hidden;
    background: url(./images/login_form_bg.png)0 0 no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-size: 100% 100%;
  }
  .login-btn{
    width:100%;
    height: 66px;
    --hue: 190;
    position: relative;
    padding: 1rem 3rem;
    font-size: 1rem;
    line-height: 1.5;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    background: linear-gradient(to right, #30e2fd, #4d55e5);
    border: none;
    border-radius: 5px;
    outline: transparent;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: 0.25s;
    margin-top: 30px;
    &:hover {
      // background: hsl(var(--hue), 100%, 31%);
    }
    &-primary {
      --hue: 215;
    }
    &-ghost {
      color: hsl(var(--hue), 100%, 41%);
      border-color: hsl(var(--hue), 100%, 41%);
      &:hover {
        color: white;
      }
    }
    &-shine {
      color: white;
      &::before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          120deg,
          transparent,
          hsla(var(--hue), 100%, 41%, 0.5),
          transparent
        );
        transform: translateX(-100%);
        transition: 0.6s;
      }

      &:hover {
        box-shadow: 0 0 20px 10px hsla(var(--hue), 100%, 41%, 0.5);
      }

      &:hover::before {
        transform: translateX(100%);
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .icon-container {
    color: #5ee4fe;
    vertical-align: middle;
    display: inline-block;
    font-size: 18px;
    padding: 0 10px;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #6ee1f5;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #5ee4fe;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
