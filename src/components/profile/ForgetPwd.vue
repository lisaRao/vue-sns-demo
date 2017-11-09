<template>
    <div class="forget_pwd_step1">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 找回密码 </x-header>
        </div>
        <div class="body-wrap">
            <div class="header">
                <img :src="logo" alt="logo" width="50" height="50">
            </div>
            <group class="weui_cells_form">
                <x-input title="手机号" name="mobile" placeholder="请输入手机号" keyboard="number" is-type="china-mobile" required ref="user_phone" v-model="form.phone"></x-input>
                <x-input title="验证码" label-width="2" name="code" placeholder="验证码" keyboard="number" class="weui_vcode code_ipt" required v-model="form.msgCode" ref="user_code">
                    <x-button slot="right" :text="btnValue" :disabled="currentDown" type="primary" class="send_code_button" mini @click.native="sendCode"></x-button>
                </x-input>
                <x-input title="密码" label-width="2" placeholder="请输入6-20个字符" type="password" required v-model="form.password" :min="6" :max="20" ref="user_pass"></x-input>
            </group>
            <div class="reset_pwd_button">
                <x-button type="primary" @click.native="resetpassword"> 确定 </x-button>
            </div>
        </div>
        <toast v-model="toast" type="warn" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>

<script>
import { XInput, Group, XButton, XHeader, Toast } from 'vux'
import logo from '@/assets/logo.png'
import api from '@/service/index'
export default {
    components: {
        XInput,
        Group,
        XButton,
        Toast,
        XHeader
    },
    data() {
        return {
            logo,
            msg: '找回密码',
            phase: 'reset_password',
            form: {
                phone: 0,
                password: '',
                msgCode: ''
            },
            btnValue: '获取验证码',
            currentDown: false,
            tipsMsg: '',
            toast: false,
            flag: false
        }
    },
    methods: {
        sendCode(e) {
            // 判断手机号
            if (!this.$refs.user_phone.valid) {
                this.toast = !this.toast;
                this.tipsMsg = '错误的手机号';
                return;
            }
            // 手机号是否已注册验证
            this.validatePhoneNumber();
            setTimeout(() => {
                if (!this.flag) return
                // 发送获取 code 请求
                api.sendMessageCode({
                    phoneNumber: this.form.phone,
                    phase: this.phase
                }).then(res => {
                    console.log(res.data.code);
                    if (res.data.code !== 0) {
                        this.toast = !this.toast
                        this.tipsMsg = res.data.msg
                    }
                });
                this.downtime()
            }, 2000)
        },
        downtime: function() {
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
                phoneNumber: this.form.phone,
                msgCode: this.form.msgCode,
                phase: this.phase
            }).then(res => {
                if (res.data.code === 0) {
                    this.flag = true
                } else {
                    this.flag = false
                    this.toast = !this.toast
                    this.tipsMsg = res.data.msg
                    return;
                }
            })
        },
        validatePhoneNumber() {
            // 验证手机是否存在
            api.phoneExist({ phone: this.form.phone }).then(res => {
                if (res.data.data) {
                    this.flag = true
                } else {
                    this.flag = false
                    this.toast = !this.toast
                    this.tipsMsg = '您填写的手机号未注册,请先去注册吧~'
                }
            })
        },
        resetpassword() {
            // 必填项 验证
            if (!this.$refs.user_phone.valid) {
                this.flag = false
                this.toast = !this.toast
                this.tipsMsg = '请填写手机号'
                return
            } else if(!this.$refs.user_pass.valid) {
                this.flag = false
                this.toast = !this.toast
                this.tipsMsg = '请填写密码'
                return
            } else if(!this.$refs.user_code.valid) {
                this.flag = false
                this.toast = !this.toast
                this.tipsMsg = '请填写验证码'
                return
            }
            else {
                // 验证码验证
                this.validCode();
                setTimeout(() => {
                    if (this.flag) {
                        api.resetPassword(this.form).then(result => {
                            if (result.data.code === 0) {
                                this.toast = !this.toast
                                this.tipsMsg = '修改密码成功'
                                setTimeout(() => {
                                    window.location.href = '/login';
                                }, 3000)
                            } else {
                                this.flag = false
                                this.toast = !this.toast;
                                this.tipsMsg = result.data.msg;
                            }
                        });
                    }
                }, 1000)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.forget_pwd_step1 {
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
    .step_next_button {
        padding: .5rem
    }
    .code_ipt {
        padding: 10px 15px;
    }
    .reset_pwd_button {
        width: 90%;
        margin: 30px auto;
    }
}
</style>
