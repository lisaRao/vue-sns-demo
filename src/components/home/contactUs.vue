<template>
    <div class="contact_us">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <span>联系我们</span>
            </x-header>
        </div>
        <div class="contact_content body-wrap" v-html="content"> </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1000">{{tipsMsg}}</toast>
        <!-- <v-tabbar></v-tabbar> -->
    </div>
</template>
<script>
import {
    XHeader,
    Group,
    Cell,
    Panel,
    Toast
} from 'vux'

import {
    mapState
} from 'vuex';
import api from '@/service/index';

export default {
    components: {
        XHeader,
        Toast
    },
    data() {
        return {
            content: '<h1></h1>',
            toast:false,
            toastType:'warn',
            tipsMsg:'网络错误'

        }
    },
    activated() {
        let data;
        api.getPicTextArea({
            name: 'contact'
        }).then(res => {

            if (res.data.code == 0) {
                data = res.data.data;
                this.content=data.content;
                if(this.content==undefined){
                    this.content='<div>暂无联系方式</div>';
                }
            } else {
                this.toast = !this.toast;
                this.toastType = 'warn';
                this.tipsMsg = '网络错误';
            }
        })

    }
}
</script>
<style type="text/css" media="screen">
    .contact_content{
        padding:0 10px;
    }
</style>