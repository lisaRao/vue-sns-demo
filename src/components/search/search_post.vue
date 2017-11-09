<template>
    <div class="search_post" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 兴趣论坛 </x-header>
        </div>
        <div class="body-wrap">
            <div class="bor-bottom" v-if="isSearching">
                <xaddress v-on:getaddress="getAddressName"></xaddress>
                <selector title="标签" placeholder="请选择标签" :options="tagList" direction="left" v-model="tagId"></selector>
            </div>
            <div class="ui-button" v-on:click="onSubmit">
                <x-button type="primary" text="提交" action-type="button">提交</x-button>
            </div>
            <group class="search-list" v-if="!isSearching">
              <div  v-for="(user,id) in userList" :key="id" >
                    <cell :title="user.title" :inline-desc="user.desc">
                        <x-icon type="ios-plus" class="cell-x-icon"></x-icon>
                        <i slot="icon" class="icon iconfont cell-icon" :class="user.icon"></i>
                    </cell>
              </div>

            </group>
        </div>
        <toast v-model="toast" type="warn" is-show-mask :time="1500">{{tipsMsg}}</toast>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import {
    XHeader,
    Group,
    Cell,
    XButton,
    Selector,
    Toast
} from 'vux'
import xaddress from '@/components/common/Address'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index';
import {
    mapState
} from 'vuex';

export default {
    components: {
        XHeader,
        Group,
        Cell,
        XButton,
        Selector,
        xaddress,
        Toast,
        'v-tabbar': vTabbar
    },
    data() {
        return {
            isSearching: true,
            region: '',
            tagList: [],
            isOnfocus: false,
            results: [],
            key: '',
            tagId: '',
            userList: [],
            placeholder: 0 + '',
            toast: false,
            tipsMsg: ''
        }
    },
    computed: mapState({
        token: state => state.token
    }),

    created() {
        let self = this;
        console.log(api)
        api.tagList({
            token: this.token
        }).then(res => {
            self.$data.list = res.data.data;
            if (res.data.code != 0) {
                self.$data.toast = true;
                self.$data.tipsMsg = '获取主题失败';
            } else {
                parseTag(res.data.data, self)
            }
        });
    },
    methods: {
        onSubmit() {
            let self = this,
                arr = [1, 2, 3, 4, 5, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15],
                userList = [];
            let param = {
                tagId: self.$data.tagId,
                region: self.$data.region,
                page: 1,
                size: 10,
                token: this.token
            };
            let url;
            console.log(self.$data.region)
            if (self.$data.region == '') {
                self.$data.toast = true;
                self.$data.tipsMsg = '请选择城市';
                return;
            }
            if (self.$data.tagId == '') {
                self.$data.toast = true;
                self.$data.tipsMsg = '请选择标签';
                return;
            }
            this.$router.push({ name: 'postList', params: { postType: 0 }, query: { tagId: this.tagId, region: this.region } });
        },
        getAddressName(data) {
            // 获取已选城市
            this.$data.region = data.replace(' ', '_');
        },

        logShow(str) {
            console.log(str)
        },
        logHide(str) {
            console.log('on-hide', str)
        },
    }

}

function parseTag(data, self) {
    self.$data.tagList = [];
    for (let i = 0; i < data.length; i++) {
        self.$data.tagList.push({
            key: data[i].id,
            value: data[i].name
        })
    }
    console.log(self.$data.tagList)
}


</script>
<style lang="less" scoped>
.search_post {
    font-size: 17px;
}

.search_post .weui-label {
    width: 3rem;
}

.search_post .ui-button {
    padding: 10px;
}
</style>
