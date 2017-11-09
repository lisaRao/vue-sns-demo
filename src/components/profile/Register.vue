<template>
    <div class="register_step1" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 注册 </x-header>
        </div>
        
        <div class="body-wrap">
            <div class="header">
                <img :src="logo" alt="logo" width="50" height="50">
            </div>
            <div class="txt">{{desc}}</div>
            <group class="weui_cells_form">
                <x-input title="用户名" label-width="1" placeholder="请输入1-20个字符" required v-model="form.username" ref="user_name" :min="1" :max="20"></x-input>
                <x-input title="密码" label-width="1" placeholder="请输入6-20个字符" type="password"  required v-model="form.password" ref="user_pass" :min="6" :max="20"></x-input>
                <x-input title="手机号" label-width="1" placeholder="请输入手机号" required name="mobile" keyboard="number" is-type="china-mobile" ref="user_phone" v-model="form.phoneNumber"></x-input>
                <x-input title="验证码" label-width="1" name="code" placeholder="验证码" keyboard="number" class="weui_vcode code_ipt" required v-model="form.msgCode" ref="user_code">
                    <x-button slot="right" :text="btnValue" :disabled="currentDown" type="primary" class="send_code_button" mini  @click.native="sendCode"></x-button>
                </x-input>
            </group>
            <div class="vux_register_button">
                <x-button @click.native="register">注册</x-button>
            </div>
            <div class="rule">
                <checker type="checkbox" v-model="agree" default-item-class="vux_checkbox_default" selected-item-class="vux_checkbox_selected" ref="rule_agree">
                    <checker-item value="1"></checker-item>
                </checker>
                <span @click="agreementPage" class="txt">阅读并同意协议</span>
            </div>
        </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>
<script>

import { XInput, Group, XButton, XHeader, Checker, CheckerItem, Toast } from 'vux'
import api from '@/service/index'
import { mapActions } from 'vuex'
import { USER_TOKEN } from '@/store/token'
import logo from '@/assets/logo.png'
import {urlGetValue } from '@/utils/libs'

export default {
    components: {
        XInput,
        Group,
        XButton,
        XHeader,
        Checker,
        CheckerItem,
        Toast
    },
    data() {
        return {
            logo,
            desc: '看！我们在改变世界',
            form: {
                username: '',
                password: '',
                phoneNumber: '',
                msgCode: ''
            },
            invitation: '',
            agree: '',
            phase: 'register',
            btnValue: '获取验证码',
            currentDown: false,
            tipsMsg: '',
            toastType: 'warn',
            toast: false,
            flag: false
        }
    },
    created() {
        if(window.location.search) {
            this.invitation = urlGetValue('invitation') || ''
        }
    },
    methods: {
        ...mapActions([USER_TOKEN]),
        sendCode(e) {
            // 判断手机号
            if (!this.$refs.user_phone.valid) {
                this.toast = !this.toast;
                this.tipsMsg = '错误的手机号';
                return;
            }
            // 手机号是否已注册验证
            this.validatePhoneNumber();
            setTimeout(()=> {
                if(this.toast) return false
                // 发送获取 code 请求
                api.sendMessageCode({
                    phoneNumber: this.form.phoneNumber,
                    phase: this.phase
                }).then(res => {
                    // test
                    console.log(res.data.code);
                    if(res.data.code !== 0) {
                        this.toast = !this.toast
                        this.tipsMsg = res.data.msg
                    }
                });
                this.downtime();
            }, 1000)

        },
        downtime: function(){
            // 设置发送按钮为 60s 一阶段发送
            let time = 60
            this.currentDown = true
            let timeDown = setInterval(() => {
                time--;
                this.btnValue = '已发送(' + time + ')';
                if (time == '0') {
                    clearInterval(timeDown)
                    this.btnValue = '获取验证码'
                    this.currentDown = false
                }
            }, 1000)
        },        
        validCode() {
            // 验证 短信验证码
            api.validMessageCode({
                phoneNumber: this.form.phoneNumber,
                msgCode: this.form.msgCode,
                phase: this.phase
            }).then(res => {
                this.toast = !this.toast;
                if(res.data.code === 0) {
                    this.tipsMsg = '成功'
                    this.toastType = 'success'
                }
                this.tipsMsg = res.data.msg;
                return;
            })
        },
        validatePhoneNumber(){
            // 验证手机是否存在
            api.phoneExist({phone: this.form.phoneNumber}).then(res=> {
                if(res.data.data) {
                    this.flag = false
                    this.toast = !this.toast
                    this.tipsMsg = '这个手机号已注册, 您可以直接登录或找回密码'
                }
            })
        },
        register() {

            if(!this.$refs.user_name.valid) {
                this.toast = !this.toast
                this.tipsMsg = '请填写用户名'
                return
            } else if(!this.$refs.user_pass.valid) {
                this.toast = !this.toast
                this.tipsMsg = '请填写密码'
                return                
            } else if(!this.$refs.user_phone.valid) {
                this.toast = !this.toast
                this.tipsMsg = '请填写手机号'  
                return                 
            } else if(!this.$refs.user_code.valid) {
                this.toast = !this.toast
                this.tipsMsg = '请填写验证码'
                return     
            } else if(this.agree != '1') {
                this.toast = !this.toast
                this.tipsMsg = '请同意用户条款'
                return                  
            } else {
                // 验证码验证
                this.validCode();
                setTimeout(()=> {
                    if(!this.toast) return false
                    let registerForm = {}
                    if(this.invitation) {
                        registerForm = this.form
                        registerForm.invitation = this.invitation
                    } else {
                        registerForm = this.form
                    }
                    api.userRegister(registerForm).then(result => {
                        if (result.data.code === 0) {
                            this.USER_TOKEN(result.data.data)
                            return
                            window.location.href = '/registernext'
                        } else {
                            this.toastType = 'warn'
                            this.toast = !this.toast;
                            this.tipsMsg = result.data.msg;
                        }
                    });
                }, 1000)
            }
        },
        agreementPage() {
            window.location.href = '/agreement';
        }
    }
}

</script>
<style lang="less">
.register_step1 {
    .header {
        padding: 2.5rem 0 .5rem;
        text-align: center;
        img {
            width: 4rem;
            height: 4rem;
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
    .vux_register_button {
        margin-top: 30px;
        padding: .5rem
    }
    .weui-btn_default {
        color: #fff
    }
    .go_login {
        text-align: center;
        font-size: 0.65rem;
        margin-top: 15px;
    }
    .vux_checkbox_default {
        display: inline-block;
        border: 1px solid #999;
        width: 19px;
        height: 19px;
    }
    .vux_checkbox_selected {
        position: relative;
        border-color: #f26f20;
        &:after {
            content: '';
            position: absolute;
            top: 3px;
            left: 2px;
            width: 12px;
            height: 6px;
            border: 2px solid #f26f20;
            border-width: 0 0 2px 2px;
            transform: rotateZ(-45deg);
        }
    }
    .rule {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 20px;
        margin: 20px 0;
        .txt {
            margin-left: 5px;
            color: #999;
            font-size: 0.65rem;
        }
    }
    .code_ipt {
        padding: 10px 15px;
    }
}
</style>

