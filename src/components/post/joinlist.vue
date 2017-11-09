<template>
    <div class="post_index" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <span>参与的用户</span>
            </x-header>
        </div>
        <div class="body-wrap">
            <ul class="post-list">
                <template v-for="user in userList">
                    <li class="ui-panel">
                        <div class="top-box ui-whitespace">
                          <div class="avatar-box">
                            <div class="ui-avatar" @click="gotoCent(user.userId)" :style="user.avatarUrl | style">
                            </div>
                          </div>
                            <div class="top-box-info">
                                <div class="ui-title vux-label" v-text="user.nickyName" @click="gotoMsg(user.userId,user.nickyName)"></div>
                                <div class="extra-box">
                                    <span v-text="user.addDate"></span>
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
            <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
        </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1000">{{tipsMsg}}</toast>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import {
    XHeader,
    Group,
    Cell,
    Toast
} from 'vux'

import api from '@/service/index';
import vTabbar from '../common/Tabbar.vue';
import {
    param
} from '@/utils/libs';
import {
    store
} from '@/store'

import {
    mapState
} from 'vuex'

import More from '@/components/common/MoreV'


export default {
    components: {
        XHeader,
        Group,
        Cell,
        Toast,
        'v-tabbar': vTabbar,
        'v-more': More

    },
    data() {
        return {
            userList: [],
            friendsList: '',
            userPhone: '',
            postId: '',
            page: 1,
            size: 10,

            toast: false,
            tipsMsg: '',
            toastType: 'warn',
            scroll: true,
            loading: {
                show: false
            }
        }
    },
    computed: mapState({
        token: state => state.token,
        user: state => state.user
    }),
    activated() {
        this.postId = this.$route.query.post;
        this.userList = [];
        this.getFriendsList();
    },
    methods: {
        // 获取好友列表
        getFriendsList() {
            api.participationList({
                token: this.token,
                page: this.page,
                size: this.size,
                postId: this.postId
            }).then(res => {

                if (res.data.code != 0) {
                    this.$data.toast = !this.$data.toast;
                    this.$data.tipsMsg = '没有相关用户';
                } else {
                    let records = res.data.data.records;
                    this.pageCount = Math.ceil(res.data.data.total / this.size)
                    this.scroll = true;
                    if (records.length == 0) {
                        this.$data.toast = !this.$data.toast;
                        this.$data.toastType = 'text';
                        this.$data.tipsMsg = '没有相关用户';
                    } else {
                        for (let i = 0; i < res.data.data.records.length; i++) {
                            this.$data.userList.push(res.data.data.records[i]);
                        }

                    }
                }


            });
        },
        getScrollData: function() {
            if (this.scroll) {
                this.scroll = false;
                this.loading.show = true;
                if (this.page < this.pageCount) {

                    this.page += 1;
                    this.getFriendsList();

                } else {
                    this.$refs.loadingMore.loadingStatus('loaded')
                }
            }
        },
        gotoMsg(userId, nickName) {
            if (userId != this.user.id) {
                this.$router.push({
                    name: 'chat',
                    query: {
                        userId: userId,
                        toUserName: nickName
                    }
                })
            } else {
                this.$router.push({
                    name: 'Index'
                });

            }
        },
        gotoCent(userId) {     
            if (userId != this.user.id) {
                this.$router.push({
                    name: 'userinfo',
                    params: {
                        uid: userId
                    }
                });
            } else {
                this.$router.push({
                    name: 'Index'
                });

            }
        },
    }
}
</script>
<style lang="less" scoped>
.weui-tabbar {
    position: fixed;
    bottom: 0px;
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
    /*border-bottom: 1px solid #*/
}

.cell-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    /*padding-right: 0.5rem;*/
    display: block;
}

.post_index .weui-cell_access .weui-cell__ft:after {
    display: none;
}

.post-list {
    display: block;
    background-color: #f2f2f2;
    padding-top: 10px;
    margin-bottom: 60px;
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
  position: absolute;
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

#postIndex {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
}
</style>
