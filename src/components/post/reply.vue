<template>
    <div class="post_index">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <span v-text="'收到的通知'"></span>
            </x-header>
        </div>
        <div id="postIndex">
            <ul class="post-list">
                <li class="ui-panel" v-for="info in infoList" :key="info.id">
                    <div class="top-box ui-whitespace">
                        <div class="top-box-info">
                            <div class="vux-label" v-text="info.aggregationContent" @click="goDetail(info)"></div>
                            <div class="extra-box">

                                <div class="time">
                                    <span class="ui-small" v-text="info.addDate"></span>
                                </div>
                            </div>
                        </div>
                        <x-icon type="chevron-right" size="15" class="cell-x-icon icon-arrow" @click="goDetail(info)"></x-icon>
                    </div>
                </li>
            </ul>
            <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
        </div>
        <toast v-model="toast" :type="toasType" is-show-mask :time="1000">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    XHeader,
    Tab,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    TabItem,
    Toast,
    Badge
} from 'vux'

import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index';
import {
    mapState
} from 'vuex';

import {
    param
} from '@/utils/libs';

import More from '@/components/common/MoreV'

export default {
    components: {
        XHeader,
        Tab,
        TabItem,
        Group,
        Cell,
        Flexbox,
        FlexboxItem,
        Toast,
        Badge,
        'v-tabbar': vTabbar,
        'v-more': More

    },
    data() {
        return {
            tagId: 0,
            regionId: 0,
            page: 1,
            size: 10,
            pageCount: 1,

            toasType: 'warn',
            type: 0,
            toast: false,
            tipsMsg: '',
            showBack: true,
            infoList: [],
            loading: {
                show: false
            },
            scroll: true,
            userId: 0
        }
    },
    computed: mapState({
        token: state => state.token,
        user: state => state.user
    }),
    activated() {
        this.page = 1;
        this.infoList = [];
        this.getList();
    },
    methods: {
        getList() {
            let self = this;
            api.noticeList({
                page: this.page,
                size: this.size,
                token: this.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.$data.toast = true;
                    self.$data.tipsMsg = '获取通知列表失败了';
                } else {
                    if (res.data.data.records.length == 0 && this.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无通知';
                    } else {
                        this.scroll = true;
                        this.pageCount = Math.ceil(res.data.data.total / res.data.data.size);
                        parsePostList(res.data.data, self);
                    }

                }
            })
        },
        goDetail(data) {
//            if (data.state == 0) {
                api.noticeReadBatch({
                    token: this.token,
                    postId: data.postId,
                    type: data.type
                }).then(res => {
                    console.log(res)
                })
//            }
            this.$router.push({
                name: 'detail',
                query: {
                    post: data.postId
                }
            });


        },
        getScrollData() {

            // console.log(this)
            if (this.scroll) {

                this.scroll = false;
                this.loading.show = true;

                if (this.page < this.pageCount + 1) {
                    this.page += 1;
                    this.getList();
                } else {
                    this.$refs.loadingMore.loadingStatus('loaded')
                    console.log(this.$refs)
                }
            }
        }
    }
}

function parsePostList(data, self) {
    var list = [];
    console.log(data)
    for (let i = 0; i < data.records.length; i++) {
        self.$data.infoList.push(data.records[i]);

    }

    console.log(self.$data.infoList)
    self.scroll = true;
    self.$refs.loadingMore.loadingStatus('loaded')

}
</script>
<style scoped>
body>div {
    height: 100%;
    overflow: auto;
}

.top-box-info .extra-box span {
    /*padding-left: px;*/
}

.header-icon {
    fill: #fff;
    position: relative;
    top: -3px;
    left: -3px;
}

.none {
    display: none;
}

.post_index {
    font-size: 0.75rem;
    height: 100%;
    /*background-color: #f2f2f2;*/
    /*border-bottom: 1px solid #*/
}

.cell-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    /*padding-right: 0.5rem;*/
    display: block;
}



/*.icon-arrow{
      position: absolute;
      bottom:12px;

    }*/

.post_index .weui-cell_access .weui-cell__ft:after {
    display: none;
}

.post-list {
    display: block;
    background-color: #f2f2f2;
    padding-top: 10px;
    /*margin-bottom: 60px;*/
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

.ui-avatar {
    /*width: 50px;*/
    /*height: 50px;*/
    overflow: hidden;
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



/*.time {
      position: absolute;
      right: -20px;
  }
  */

.top-box-info {}

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

.icon-red.zan {
    fill: #f26f20;
}

#postIndex {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
}
</style>
