<template>
    <div class="search_index" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: '',reventGoBack:false}">
                <span v-text="title"></span>
            </x-header>
        </div>
        <div class="body-wrap">
            <div class="search_filter">
                <xaddress v-on:getaddress="getAddressName"></xaddress>
                <divider>选择标签</divider>
                <div class="checker-ui-box">
                    <checker v-model="tagList" type="checkbox" default-item-class="demo5-item" selected-item-class="demo5-item-selected" :max="max">
                        <checker-item v-for="tag in tagLists" :value="tag.key" :key="tag.id" @on-item-click="onItemClick">{{tag.value}}</checker-item>
                    </checker>
                </div>
                <div class="ui-button" v-on:click="getSearchRecommend">
                    <x-button type="primary" text="提交" action-type="button">确定</x-button>
                </div>
            </div>
        </div>
        <v-tabbar></v-tabbar>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {

    Toast,
    XHeader,
    XButton,
    Divider,
    Checker,
    CheckerItem,
    Confirm
} from 'vux'
import xaddress from '@/components/common/Address'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import {
    mapState
} from 'vuex';
import More from '@/components/common/MoreV'
import {
    mapActions
} from 'vuex'

import {
    INTEREST_INFO
} from '@/store/interest'


export default {
    components: {
        XHeader,
        XButton,
        xaddress,
        Confirm,
        Divider,
        Checker,
        CheckerItem,
        Toast,
        'v-tabbar': vTabbar,
        'v-more': More


    },
    data() {
        return {
            tagList: [],
            tagLists: [],
            region: '',
            // token:'',

            title: '兴趣推荐',
            toastType: 'warn',
            tipsMsg: '',
            toast: false,
            loading: {
                show: false
            },
            max: 5
        }
    },

    computed: mapState({
        token: state => state.token,
        user: state => state.user
    }),
    created() {
        var token = this.token;

        api.tagList({
            token: token
        }).then(res => {
            if (res.data.code != 0) {
                this.$data.toast = !this.$data.toast;
                this.$data.tipsMsg = '获取主标签';
            } else {
                parseTag(res.data.data, this);
                if (this.$data.tagLists.length == 0) {
                    this.$data.toast = !this.$data.toast;
                    this.$data.tipsMsg = '没有标签';
                }
            }
        });


    },
    methods: {
        ...mapActions(['INTEREST_INFO']),
        onItemClick(value, display) {
            if (this.tagList.length == this.max) {
                this.$data.toast = !this.$data.toast;
                this.$data.toastType = 'text'
                this.$data.tipsMsg = '最多可选5个';
            }
        },
        getAddressName(data) {
            // 获取已选城市
            this.region = data.replace(' ', '_');
        },

        getSearchRecommend() {
            this.userList = [];
            this.searchRecommend()
        },
        searchRecommend() {
            let self = this;
            let tagList = [];
            for (let i = 0; i < this.tagList.length; i++) {
                tagList[i] = this.tagList[i];
            }

            if (this.tagList.length == 0) {
                this.toast = !this.toast
                self.$data.toastType = 'warn';
                self.$data.tipsMsg = '请选择标签';
                return false;
            }
            let param = {
                tags: tagList,
                region: self.region,
                page: self.page,
                size: self.size,
                token: this.token
            }

            api.searchRecommend({
                tags: tagList,
                region: self.region,
                page: self.page,
                size: self.size,
                token: self.token
            }).then(res => {
                if (res.data.code != 0) {
                    this.toast = !this.toast
                    self.$data.toastType = 'warn';
                    self.$data.tipsMsg = '搜索失败';
                } else {

                    this.scroll = true;
                    this.loading.show = true;
                    if (res.data.data.records.length == 0) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关用户';

                    } else {

                        this.INTEREST_INFO(param)
                        this.$router.push({
                            name: 'interestList'
                        })

                    }
                }
            })
        }
    }
}

function parseTag(data, self) {
    self.$data.tagLists = [];
    for (let i = 0; i < data.length; i++) {
        self.$data.tagLists.push({
            key: data[i].id,
            value: data[i].name
        })
    }
}
</script>
<style lang="less" scoped>
#postIndex {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    background: #fff;
}

.search_index {
    font-size: 17px;
}

.ui-button {
    margin-top: 5px;
}

.search_index .weui-label {
    width: 3em;
}

.search-list .weui-cell {
    margin-top: 5px;
}

.flex-demo {
    text-align: center;
    // color: @theme-color;
    border-radius: 4px;
    background-clip: padding-box;
}

.cell-icon {
    width: 2rem;
    height: 100%;
    display: block;
    /*padding-right: 0.5rem;*/
    display: block;
}

.flex-box {
    padding: 0 1.5rem;
    position: fixed;
    box-sizing: border-box;
    top: 10rem;
}

.search-list {
    padding-bottom: 2.224rem;
}

.post-list {
    display: block;
    padding-top: 10px;
}

li {
    list-style: none;
    text-align: -webkit-match-parent;
}

.ui-title {
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.ui-panel {
    background-color: #fff;
    overflow: hidden;
    border: 1px solid #ddd;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.ui-whitespace {
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
}

.top-box {
    display: -webkit-box;
}

.avatar-box {
    width: 50px;
    height: 50px;
}

.ui-avatar {
    width: 50px;
    height: 50px;
    background: no-repeat center center;
    background-size: cover;
    /*position: absolute;*/
    border-radius: 50%;
    z-index: 1;
}

.ui-avatar>span {
    display: block;
    overflow: hidden;
    background-repeat: no-repeat;
}

.top-box-info {
    position: relative;
    -webkit-box-flex: 1;
    margin: 0 0 0 10px;
}

.top-box-info .ui-title {
    font-size: 16px;
    color: #000;
    margin-right: 6px;
}

.ui-small {
    font-size: 12px;
    color: #777;
}

.like-box {
    padding-right: 15px;
    /*text-align: center;*/
}

.like-box i {
    vertical-align: middle;
    display: inline-block;
    width: 14px;
    height: 13px;
    background-position: 0 -21px;
    background-image: url('../../assets/common.png');
    background-repeat: no-repeat;
    background-size: 30px auto;
}

.liked i {
    display: inline-block;
    width: 14px;
    height: 13px;
    background-position: 0 -38px;
    background-image: url('../../assets/common.png');
    background-repeat: no-repeat;
    background-size: 30px auto;
}

.extra-box {
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
}

.time {
    width: 100%;
    padding-left: 72px;
}

.top-box {
    padding-right: 20px;
}

.cell-x-icon {
    fill: #C8C8CD;
    padding-left: 10px;
}

.post_index .cell-x-icon {
    position: relative;
    top: 12.5px;
    fill: #C8C8CD;
}

.demo5-item {
    min-width: 20px;
    max-width: 100%;
    height: 26px;
    padding: 2px 5px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
    margin-top: 6px;
}

.demo5-item-selected {
    background: #ffffff url('../../assets/xuanzhong.png') no-repeat right bottom;
    border-color: #ff4a00;
}

.checker-ui-box {
    text-align: center;
}
</style>
