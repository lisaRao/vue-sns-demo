<template>
    <div class="register_step2" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: false}"> 注册 </x-header>
        </div>
        <div class="body-wrap">
            <div class="header">
                <img :src="logo" alt="logo" width="50" height="50">
            </div>
            <div class="txt">{{desc}}</div>
            <group>
                <datetime v-model="form.birthday" @on-change="change" title="生日" :min-year="1917" :max-year="2017" :default-selected-value="form.birthday"></datetime>
                <x-input title="星座" :value.sync="constellations" readonly></x-input>
                <selector placeholder="请选择性别" v-model="form.sex" title="性别" name="sex" :options="sexOption" @on-change="getSex"></selector>
                <xaddress v-on:getaddress="getAddressName"></xaddress>
            </group>
            <div class="register2_button">
                <x-button type="primary" class="vux_register2_button" @click.native="register_profile"> 注册</x-button>
            </div>
        </div>
        <toast v-model="toast" type="warn" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>

<script>

import { Group, XInput, XButton, XHeader, Datetime,  Value2nameFilter as value2name, Selector, Toast } from 'vux'
import xaddress from '@/components/common/Address'
import logo from '@/assets/logo.png'
import { formatDate, constellation } from '@/utils/libs'
import api from '@/service/index'
import { mapState } from 'vuex'

export default {
    components: {
        Datetime,
        Group,
        XInput,
        XHeader,
        Toast,
        XButton,
        xaddress,
        Selector
    },
    data() {
        return {
            logo,
            desc: '我承诺做一个友善的人',
            form: {
                birthday: '',
                provinceAndCity: '',
                sex: 1
            },
            toast: false,
            tipsMsg: '',
            constellations: '处女座',
            sexOption: [{ key: '1', value: '男' }, { key: '0', value: '女' }]
        }
    },
    computed: mapState({ token: state => state.token }),
    created() {
        this.form.birthday = formatDate().formatDate;
        this.constellations = constellation(formatDate().month, formatDate().day);
    },
    methods: {
        change: function (value) {
            this.form.birthday = value;
            // 星座显示
            if (value) {
                const month = value.split('-')[1];
                const day = value.split('-')[2];
                this.constellations = constellation(month, day);
            }
        },
        getSex: function (value) {
            this.form.sex = value
        },
        getAddressName: function (data) {
            // 获取已选城市
            this.form.provinceAndCity = data.replace(' ', '_');
        },
        register_profile: function () {
            api.userRegisterFully({
                token: this.token,
                birthday: this.form.birthday + ' 00:00:00',
                provinceAndCity: this.form.provinceAndCity,
                sex: this.form.sex
            }).then(result => {
                // console.log(`full profile: ${result.data.code}`)
                if (result.data.code === 0) {
                    this.$router.push({ path: `/` })
                } else {
                    this.toast = true
                    this.tipsMsg = `${result.data.msg}`

                }
            })
        }
    }
}
</script>


<style lang="less">
.register_step2 {
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
    .weui-cell__ft {
        text-align: left;
        padding-left: 20px;
    }
    .weui-input,
    .weui-select {
        color: #999;
    }
    .weui-label {
        width: 3em;
    }
    .weui_cells_form,
    .register2_button {
        padding: .5rem
    }
    .vux_register2_button {
        margin-top: 30px;
        height: 50px;
        line-height: 50px;
    }
}
</style>


