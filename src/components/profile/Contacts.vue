<template id="postIndex">
    <div class="contacts">
        <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 好友列表 </x-header>
        <!--<x-header :right-options="{showMore: true}"  style="background-color:#000;" @on-click-more="showMenus = true">logo</x-header>-->
        <!-- <div class="add-friend">
                <div class="add-friend-form"><input type="text" placeholder="添加好友" v-model="userPhone"></div>
                <div class="add-friend-send"><span @click="onAddFriend()">确定</span></div>

            </div> -->
        <ul id="contacts-content" class="body-wrap" v-bind:style="{ height: windowHeight + 'px' }">
            <li v-for="item in friendsList">
                <!-- weipeout 组件 -->
                <swipeout-item :threshold=".5" underlay-color="#ccc">
                    <div slot="right-menu">

                        <swipeout-button @click.native="onDeFriend(item.userId)" background-color="#336DD6">删除</swipeout-button>
                        <swipeout-button background-color="#D23934">取消</swipeout-button>

                    </div>
                    <!--<router-link :to="{ path: 'chat', query:{ userId: item.userId, toUserName: item.nickName}}">-->
                    <div slot="content">
                        <div class="contacts-item vux-1px-tb">
                            <div class="contacts-img" @click="gotoUserInfo(item.userId)">
                                <img v-show="item.headerUrl" :src="item.headerUrl" />
                            </div>
                            <div class="contacts-title" @click="gotoChatPage(item.userId,item.nickName)">

                                <div class="contacts-title-name">
                                    <span>{{item.nickName}}</span>
                                </div>

                                <div class="contacts-title-detail">
                                    <span>{{item.summary}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--</router-link>-->
                </swipeout-item>
            </li>

            <load-more :show-loading="loadingShow" :tip="text"></load-more>
        </ul>
    </div>
</template>



<script>
import { XButton, Swipeout, SwipeoutItem, SwipeoutButton, XHeader, Actionsheet, TransferDom, Badge, LoadMore } from 'vux'

import api from '@/service/index';
import { store } from '@/store'
import { mapState } from 'vuex'

export default {
    components: {
        XButton, Swipeout, SwipeoutItem, SwipeoutButton, XHeader, Actionsheet, TransferDom, LoadMore
    },
    data() {
        return {
            friendsList: '',
            userPhone: '',
            loadingShow: true,
            text: '正在努力加载中...',
            windowHeight: '',
            page: 1,
            total: ''
        }
    },
    computed: mapState({ token: state => state.token }),
    created() {



    },
    activated() {
        let scrollEle = document.getElementById('contacts-content');
        scrollEle.addEventListener('scroll', this.handleScroll);
        this.page = 1;
        this.getFriendsList(1);
        this.windowHeight = window.innerHeight - 60;

    },
    methods: {
        // 获取好友列表
        getFriendsList(page) {
            if (page) {
                this.page = page;
            }
            api.friendsInfoLIst({
                token: this.token,
                page: this.page,
                size: 10
            }).then(res => {
                let records = res.data.data.records
                if (this.page === 1) {
                    this.friendsList = records;
                    this.total = res.data.data.total;
                    if (this.friendsList.length < 10) {
                        this.loadingStatus('loaded');
                    }
                } else {
                    records.forEach((v) => {
                        this.friendsList.push(v);
                    })
                }

            });
        },
        // 删除好友
        onDeFriend(userId) {
            api.deFriend({
                token: this.token,
                friendId: userId
            }).then(res => {
                // console.log(res);
                this.getFriendsList(1);
            });
        },
        // 数据加载状态
        loadingStatus: function(status) {
            switch (status) {
                case 'loaded':
                    this.text = '全部加载完毕';
                    this.loadingShow = false;
                    break;
                case 'error':
                    this.text = '服务器错误，请刷新重试';
                    this.loadingShow = false;
                    break;

                default:
                    this.text = '正在努力加载中...';
                    this.loadingShow = true;
                    break;
            }
        },
        handleScroll() {
            let scrollEle = document.getElementById('contacts-content');

            const scrollH = scrollEle.scrollHeight;
            const scrollY = scrollEle.scrollTop;
            const innerHeight = scrollEle.offsetHeight;
            const moreHeight = 30;
            // console.log(scrollH); 624
            // console.log(scrollY); 46
            // console.log(innerHeight);578
            if (scrollH < scrollY + innerHeight + moreHeight) {
                // 加载下一页数据
                if (this.page * 10 < this.total) {
                    this.page++;
                    // 加载上一页数据
                    this.getFriendsList();
                } else {
                    // console.log('加载完成....................');
                    this.loadingStatus('loaded');
                }
            }

        },
        gotoUserInfo(userId) {
            // console.log(userId);
            this.$router.push({
                name: 'userinfo',
                params: {
                    uid: userId
                },
                meta: {
                    keepAlive: true,
                    title: '个人主页'
                }
            })
        },
        gotoChatPage(userId, nickName) {
            // console.log('跳转到聊天');
            this.$router.push({
                name: 'chat',
                query: {
                    userId: userId,
                    toUserName: nickName
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
.contacts {
    font-size: 14px;
    ul,
    li {
        list-style: none;
    }
    * {
        box-sizing: border-box;
    }
    .contacts-img {
        height: 43px;
        width: 43px;
        overflow: hidden; // border: 1px solid #dedede;
        float: left;
    }
    .contacts-title {
        margin-left: 58px;
        .contacts-title-detail {
            white-space: nowrap;
        }
    }
}

.contacts-item {
    // width: 86%;
    overflow: hidden;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
    .contacts-img {
        margin: 0 6px;
    }
    .contacts-title-detail {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaa;
    }
}

.contacts>ul>li {
    // border-bottom: 1px solid #dedede;
    // padding-bottom: 6px;
}

.add-friend {
    height: 56px;
    padding: 0 6px;
    overflow: hidden;

    .add-friend-form {
        float: left;
        width: 80%;
        margin-top: 8px;
        >input {
            height: 40px;
            width: 100%;
            border: none;
            background-color: #f3f3f3;
            border-radius: 4px;
            padding-left: 9px;
        }
    }
    .add-friend-send {
        float: right;
        width: 20%;
        margin-top: 8px;
        >span {
            display: block;
            width: 90%;
            height: 40px; // margin: 0 auto;
            float: right;
            text-align: center;
            line-height: 40px;
            background-color: #f3f3f3;
            border-radius: 4px;
        }
    }
}

.contacts-title-name>span {
    color: #111;
}
#contacts-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
</style>