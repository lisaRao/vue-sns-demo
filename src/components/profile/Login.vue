<template>
    <div class="login">
        <div class="header">
            <img :src="logo" alt="logo" width="200" height="200">
        </div>
        <div class="login-form">
            <form method="post" @submit.prevent="login" autocomplete="on">
                <group class="weui_cells_form">
                    <x-input title="手机号" label-width="1" name="mobile" type="tel" id="mobile" autocomplete="username" placeholder="请输入手机号" required ref="user_phone" v-model="form.phoneNumber" keyboard="number" is-type="china-mobile"></x-input>
                    <x-input title="密码" label-width="1" name="password" type="password" autocomplete="current-password" placeholder="请输入6-20个字符" required ref="user_password" v-model="form.password" :min="6" :max="20"></x-input>
                </group>
                <div class="login_button">
                    <input type="submit" class=" weui-btn weui-btn_default vux_login_button" value="登录" />
                </div>
            </form>
        </div>
        <div class="relevant_opt_link">
            <p class="forget_pwd">
                <router-link to="/forget/">忘记密码</router-link>
            </p>
            <p class="register">
                <router-link to="/register/">新用户注册</router-link>
            </p>
        </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>

<script>
import { Group, XInput, XButton, Toast } from 'vux'
import api from '@/service/index'
import { mapActions } from 'vuex'
import { USER_TOKEN } from '@/store/token'
import logo from '@/assets/logo-login.png'
import { validatePwd } from '@/utils/libs'
export default {
    components: {
        Group,
        XInput,
        XButton,
        Toast
    },
    data() {
        return {
            logo,
            msg: '看！我们在改变世界',
            tipsMsg: '',
            toast: false,
            state: true,
            toastType: 'warn',
            form: {
                phoneNumber: '',
                password: ''
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.autoLogin()
        }, 400)
    },
    methods: {
        ...mapActions([USER_TOKEN]),
        login() {
            // 不能为空
            if(!this.form.phoneNumber) {
                this.toast = !this.toast
                this.tipsMsg = '手机号不能为空'
                return                
            }
            if (!this.form.password) {
                this.toast = !this.toast
                this.tipsMsg = '密码不能为空'
                return
            }            
            // 手机号格式
            if (!this.$refs.user_phone.valid) {
                this.toast = !this.toast;
                this.tipsMsg = '错误的手机号';
                return;
            }
            api.userLogin(this.form).then(res => {
                // 登录请求处理
                if (res.data.code === 0) {
                    this.USER_TOKEN(res.data.data)
                    window.location.href = '/'
                } else if (res.data.code === 4) {
                    this.USER_TOKEN(res.data.data)
                    window.location.href = '/registernext'
                } else if (res.data.code === 5) {
                    this.toast = true
                    this.tipsMsg = '您的账号已经被封了'
                }
                else {
                    this.toast = !this.toast
                    this.tipsMsg = res.data.msg;
                }
            }).catch((error) => { // 错误处理
                console.log(`请求异常信息:${JSON.stringify(error)}`)
            });
        },
        autoLogin: function () {
            const phone = this.$refs.user_phone.value
            const password = this.$refs.user_password.value
            if (phone !== '' && password !== '') {
                api.userLogin({
                    phoneNumber: phone,
                    password: password
                }).then(res => {
                    // 登录请求处理
                    if (res.data.code === 0) {
                        this.USER_TOKEN(res.data.data)
                        window.location.href = '/'
                    } else if (res.data.code === 4) {
                        this.USER_TOKEN(res.data.data)
                        window.location.href = '/registernext'
                    } else if (res.data.code === 5) {
                        this.toast = true
                        this.tipsMsg = '您的账号已经被封了'
                    }
                    else {
                        this.toast = !this.toast
                        this.tipsMsg = res.data.msg;
                    }
                }).catch((error) => { // 错误处理
                    console.log(`请求异常信息:${JSON.stringify(error)}`)
                });
            }
        },
        verifyPwd: function () {
            if (!validatePwd(this.form.password)) {
                this.toast = !this.toast
                this.tipsMsg = '密码以字母开头，长度在6~20之间，只能包含字母、数字和下划线'
            }
        }
    }
}
</script>

<style lang="less" scoped>
.login {
    .header {
        padding: 2.5rem 0 .5rem;
        text-align: center;
        img {
            width: 8rem;
            height: 8rem;
        }
    }
    .txt {
        text-align: center;
        font-size: 18px
    }
    .weui-cell:before {
        left: 0;
    }
    .weui_cells_form,
    .login_button {
        padding: .5rem
    }
    .vux_login_button {
        margin-top: 30px;
        height: 50px;
        line-height: 50px;
        display: block;
        background-color: #f26f20;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        width: 90%;
    }
    .relevant_opt_link {
        display: flex;
        font-size: 0.65rem;
        justify-content: center;
        margin-top: 15px;
        p {
            width: 50%;
            text-align: center;
        }
    }
}
</style>
