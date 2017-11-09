<template>
    <div class="update-profie-page">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 修改资料 </x-header>
        </div>
        <div class="body-wrap">
            <group>
                <x-input title="id" label-width="1" type="text" :value.sync="userinfo.logicId" readonly></x-input>
                <x-input title="昵称" label-width="1" type="text"  v-model="userinfo.name" ></x-input>
                <selector  v-model="form.sex" title="性别" label-width="1" name="sex" :options="sexOption" @on-change="getSex"></selector>
                <x-input title="手机号" label-width="1" name="telphone" is-type="china-mobile" keyboard="number" class="weui_vcode code_ipt" :value.sync="userinfo.phone" readonly> </x-input>
                <x-input title="微信" label-width="1" type="text"  v-model="form.weixin" placeholder="可选"></x-input>
                <selector  v-model="form.phoneSecret" label-width="1" title="隐私设置" name="secret" :options="secretOption" @on-change="getSecretType"></selector>
                <xaddress v-on:getaddress="getAddressName" ref="address_option" :defaultValue="userinfo.city" :isResetStyle="true"></xaddress>
                <x-textarea title="个性签名" placeholder="请输入50字以内的个性签名" v-model="form.sign" :show-counter="true" :rows="1" :max="50" autosize></x-textarea>
            </group>
            <div class="update_profile_button">
                <x-button type="primary" class="vux_update_profile_button" @click.native="updateUserProfile"> 提交</x-button>
            </div>
        </div>
        <toast v-model="toast" type="warn" is-show-mask >{{tipsMsg}}</toast>        
    </div>
</template>
<script>
import { XHeader, Group, XInput, XButton, Selector, XTextarea, Toast } from 'vux'
import xaddress from '@/components/common/Address'
import api from '@/service/index'
import { mapState } from 'vuex'
export default {
    components: {
        XHeader,
        Group,
        XInput,
        XButton,
        Selector,
        xaddress,
        XTextarea,
        Toast
    },
    data() {
        return {
            form: {
                nickyName: '',
                sex: 1,
                city: '',
                sign: '',
                weixin: '',
                phoneSecret: 'friend_visible'
            },
            userinfo: {},
            sexOption: [{ key: '1', value: '男' }, { key: '0', value: '女' }],
            secretOption: [{ key: 'friend_visible', value: '对好友可见' }, { key: 'open', value: '全部可见' }, { key: 'secret', value: '全不可见' }],
            loaded: false,
            toast: false,
            tipsMsg: ''
        }
    },
    computed: mapState({ token: state => state.token, user: state => state.user }),
    activated() {
        this.userinfo = this.user
        this.form.phoneSecret = this.userinfo.secret.phone
        this.form.sex = this.userinfo.sex
        this.form.sign = this.userinfo.sign
        this.form.weixin = this.userinfo.weixin      
    },
    methods: {
        getSex: function (sex) {
            this.form.sex = sex
        },
        getSecretType: function (type) {
            this.form.phoneSecret = type
        },
        getAddressName: function (address) {
            // 获取已选城市
            this.form.city = address.replace(' ','_');
        },
        updateUserProfile: function () {
            api.updateProfile({
                token: this.token,
                nickName: this.userinfo.name,
                sex: this.form.sex,
                provinceAndCity: this.form.city,
                sign: this.form.sign,
                weixin: this.form.weixin,
                phoneSecret: this.form.phoneSecret
            }).then((res) => {
                if(res.data.code === 0) {
                    this.$router.push({ name: 'Index' })
                } else {
                    this.toast = true
                    this.tipsMsg = `${res.data.msg}`                    
                }
            })
        }
    }
}


</script>
<style lang="less" scoped>
.update-profie-page {
    .weui-cell:before {
        left: 0;
    }
    .update_profile_button {
        width: 90%;
        margin: 30px auto;
    }

}
</style>