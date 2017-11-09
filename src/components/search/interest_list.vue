<template>
    <div class="search_index">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: '',reventGoBack:false}">
                <span>兴趣推荐</span>
            </x-header>
        </div>
        <div class="body-wrap">
            <div id="postIndex">
                <ul class="post-list">
                    <li class="ui-panel" v-if="user.nickyName" v-for="(user,id) in userList" :key="id">
                        <div class="top-box ui-whitespace">
                            <div class="avatar-box">
                                <div class="ui-avatar" @click="gotoCent(user.id)" :style="user.avatarUrl | style">
                                </div>
                            </div>
                            <div class="top-box-info" @click="gotoMsg(user.id,user.nickyName)">
                                <div class="ui-title vux-label" v-text="user.nickyName"></div>
                                <div class="extra-box">
                                    <span v-text="user.constellation"></span>
                                </div>
                            </div>
                            <span v-if="user.isFriend==0">
                                    <x-icon type="plus" class="cell-x-icon " @click="addFridendOnConfirm(user)"></x-icon>
                            </span>
                        </div>
                    </li>
                </ul>
                <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
            </div>
        </div>
        <v-tabbar></v-tabbar>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    Toast,
    XHeader
} from 'vux'
import xaddress from '@/components/common/Address'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import {
    mapState
} from 'vuex';
import More from '@/components/common/MoreV'


export default {
    components: {
        XHeader,
        Toast,
        'v-tabbar': vTabbar,
        'v-more': More
    },
    data() {
        return {
            userList: [],
            tagId: '',
            region: '',
            addFridend: {
                show: false,
                content: "",
                friendId: ""
            },
            page: 1,
            size: 10,
            toastType: 'warn',
            tipsMsg: '',
            pageCount: 1,
            toast: false,
            loading: {
                show: false
            },
            scroll: true,
            max: 5
        }
    },

    computed: mapState({
        user: state => state.user,
        interest: state => state.interest
    }),
    created() {
        this.page = 1;
        this.pageCount = 1;
        this.userList = [];
        this.searchRecommend()

    },
    methods: {
        addFridendOnConfirm(data) {
            let param = {
                "friendId": data.id,
                'token': this.token
            }
            api.addFriend(param).then(res => {
                // 登录请求处理
                if (res.data.code == 0) {
                    this.toast = "添加成功"
                    this.addFridend.show = false;
                    data.isFriend = 1;
                } else if (res.data.code == 6) {
                    this.toast = !this.toast
                    this.tipsMsg = res.data.msg;
                    this.toastType = 'warn';
                }
            });
        },
        getScrollData() {
            if (this.scroll) {
                this.scroll = false;
                this.loading.show = true;

                if (this.page < this.pageCount) {
                    this.page += 1;
                    this.searchRecommend()

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

        searchRecommend() {
            let self = this;
            let tagList = [];
            console.log(self.interest.tags.length)
            for (let i = 0; i < self.interest.tags.length; i++) {
                tagList[i] = self.interest.tags[i];
            }

            api.searchRecommend({
                tags: tagList,
                region: self.interest.region,
                page: self.page,
                size: self.size,
                token: self.interest.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.toast = !self.toast
                    self.$data.toastType = 'warn';
                    self.$data.tipsMsg = '搜索失败';
                } else {

                    self.scroll = true;
                    self.loading.show = true;
                    if (res.data.data.records.length == 0 && self.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关用户';

                    } else {
                        self.$data.pageCount = Math.ceil(res.data.data.total / self.size)
                        parseUser(res.data.data.records, self)

                    }
                }
            })
        }
    }
}


function parseUser(data, self) {
    var list = [];
    for (let i = 0; i < data.length; i++) {
        self.$data.userList.push(data[i]);
    }
    self.$refs.loadingMore.loadingStatus('loaded')

}
</script>
<style lang="less" scoped>
#postIndex {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    margin-bottom: 60px;
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
