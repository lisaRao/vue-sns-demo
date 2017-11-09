<template>
    <div class="post_index">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <span v-text="title"></span>
                <x-icon class="header-icon" slot="right" type="ios-plus" size="25" :class="{none:isHide}" @click="gotoAdd"></x-icon>
            </x-header>
        </div>
        <div id="postIndex">
            <ul class="post-list">
                <template v-for="info in infoList">
                    <li class="ui-panel">
                        <div class="top-box ui-whitespace">
                          <div class="avatar-box">
                            <div class="ui-avatar" @click="gotoCent(info.userId)" :style="info.avatarUrl | style">
                            </div>
                          </div>
                            <div class="top-box-info">
                                <div class="ui-title vux-label" v-text="info.title" @click="goDetail(info.id)"></div>
                                <div class="extra-box">
                                    <div class="time">
                                        <span class="ui-small" v-text="info.addDate"></span>
                                    </div>
                                  <span v-if="type==0" @click="setZan(info,1)"><x-icon :class="{'icon-red':info.like}" type="ios-heart" size="15" class="zan"></x-icon>{{info.likeCount}}</span>
                                  <span v-if="type==0" @click="setZan(info,-1)"><x-icon type="heart-broken" size="15" :class="{'icon-red':info.dislike}"  class="zan"></x-icon>{{info.dislikeCount}}</span>
                                </div>
                            </div>
                            <x-icon type="chevron-right" size="15" class="cell-x-icon icon-arrow" @click="goDetail(info.id)"></x-icon>
                        </div>
                    </li>
                </template>
            </ul>
            <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
        </div>
        <toast v-model="toast" :type="toasType" is-show-mask :time="1000">{{tipsMsg}}</toast>
        <!-- <v-tabbar></v-tabbar> -->
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
    Toast
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
            isZan: false,
            isCai: false,
            toasType: 'warn',
            type: 0,
            title: 0,
            toast: false,
            tipsMsg: '',
            showBack: true,
            zanNum: 11111,
            isHide: true,
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
        let self = this;
        this.type = this.$route.params.postType;
        this.userId = 0;
        this.infoList = [];
        this.page = 1;
        this.pageCount = 1;
        this.scroll = true;
        this.isHide = true;
        this.loading.show=true;
        this.$refs.loadingMore.loadingStatus('loading');

        self.$data.title = '帖子';
        if (this.type == 0) {
            self.$data.title = '搜索的帖子';
            self.$data.isHide = false;

            this.tagId = this.$route.query.tagId;
            this.regionId = this.$route.query.region;

            this.getSearchList();
        }

        if (this.type == 2) {
            self.$data.title = '收藏的帖子';

            this.getCollectList();


        }
        if (this.type == 4) {
            self.$data.title = '发布的帖子';
            self.$data.isHide = false;

            this.userId = this.$route.query.userId;
            this.addPostList()


        }
        if (this.type == 3) {
            self.$data.title = '点赞的帖子';
            this.likePostList();
        }


    },
    methods: {
        gotoAdd() {
            this.$router.push({
                name: 'addpost'
            });

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

        goDetail(postId) {
            this.$router.push({
                name: 'detail',
                query: {
                    post: postId
                }
            });

        },
        setLike(info) {
            var self = this;
            info.isLike = info.isLike ? false : true;
        },
        setZan(data, type) {
            let self = this,
                msg;
            api.likePost({
                type: type,
                postId: data.id,
                token: this.token
            }).then(res => {
                self.$data.toast = !this.toast;

                if (res.data.code != 0) {
                    if (res.data.code == 10 || res.data.code == 11) {
                        msg = '取消成功'
                        if (res.data.code == 10) {
                            data.likeCount = res.data.data.like;
                            data.dislikeCount = res.data.data.dislike;
                            data.like = false;

                            self.$data.isZan = false;
                        }
                        if (res.data.code == 11) {
                            data.dislikeCount = res.data.data.dislike;
                            data.likeCount = res.data.data.like;
                            data.dislike = false;

                            self.$data.isCai = false;
                        }

                    } else {
                        msg = type == 1 ? '点赞失败' : '踩失败';
                    }

                    self.$data.tipsMsg = msg;
                    self.$data.toastType = 'warn';

                } else {
                    if (type == 1) {
                        data.likeCount = res.data.data.like;
                        data.dislikeCount = res.data.data.dislike;
                        data.like = true;
                        data.dislike = false;
                        self.$data.tipsMsg = '成功点赞';
                        self.$data.toastType = 'success';

                    } else {
                         data.likeCount = res.data.data.like;
                        data.dislikeCount = res.data.data.dislike;

                        data.dislike = true;
                        data.like = false;

                        self.$data.tipsMsg = '成功踩';
                        self.$data.toastType = 'success';
                    }
                }
            })
        },
        getSearchList() {
            let self = this;
            api.getPostList({
                tagId: self.tagId,
                regionId: self.regionId,
                page: self.page,
                size: self.size,
                token: this.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.$data.toast = true;
                    self.$data.tipsMsg = '获取帖子列表失败了';
                } else {
                    if (res.data.data.records.length == 0 && this.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关帖子';
                      self.$refs.loadingMore.loadingStatus('loaded')

                    } else {
                        this.pageCount = Math.ceil(res.data.data.total / res.data.data.size);
                        parsePostList(res.data.data, self);

                    }

                }
            })

        },
        getCollectList() {
            let self = this,
                param = self.$data.param;
            api.getCollectList({
                page: self.page,
                size: self.size,
                token: this.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.$data.toast = true;
                    self.$data.tipsMsg = '获取帖子列表失败了';
                } else {
                    if (res.data.data.records.length == 0 && this.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关帖子';
                      self.$refs.loadingMore.loadingStatus('loaded')

                    } else {
                        this.pageCount = Math.ceil(res.data.data.total / res.data.data.size);
                        parsePostList(res.data.data, self);
                    }
                }
            })
        },
        addPostList() {
            let self = this;
            self.userId = self.userId == this.user.userId ? 0 : this.userId;

            api.addPostList({
                page: self.page,
                size: self.size,
                userId: this.userId,
                token: this.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.$data.toast = true;
                    self.$data.tipsMsg = '获取帖子列表失败了';
                } else {
                    if (res.data.data.records.length == 0 && this.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关帖子';
                      self.$refs.loadingMore.loadingStatus('loaded')

                    } else {
                        this.pageCount = Math.ceil(res.data.data.total / res.data.data.size);
                        parsePostList(res.data.data, self);
                    }

                }
            })
        },
        likePostList() {
            let self = this;
            api.likePostList({
                page: self.page,
                size: self.size,
                token: this.token
            }).then(res => {
                if (res.data.code != 0) {
                    self.$data.toast = true;
                    self.$data.tipsMsg = '获取帖子列表失败了';
                } else {
                    this.scroll = true;
                    if (res.data.data.records.length == 0 && this.page == 1) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'text';
                        self.$data.tipsMsg = '暂无相关帖子';
                      self.$refs.loadingMore.loadingStatus('loaded')

                    } else {
                        self.$data.pageCount = Math.ceil(res.data.data.total / this.size)
                        parsePostList(res.data.data, self)
                    }

                }
            })
        },
        getScrollData() {
            if (this.scroll) {

                this.scroll = false;
                this.loading.show = true;

                if (this.page < this.pageCount + 1) {
                    this.page += 1;

                    if (this.type == 0) {
                        this.getSearchList();
                        this.$refs.loadingMore.loadingStatus('loading')

                    }
                    if (this.type == 2) {
                        this.getCollectList();
                        this.$refs.loadingMore.loadingStatus('loading')
                    }
                    if (this.type == 4) {
                        this.addPostList();
                        this.$refs.loadingMore.loadingStatus('loading')

                    }
                    if (this.type == 3) {
                        this.likePostList();
                        this.$refs.loadingMore.loadingStatus('loading')

                    }
                } else {
                    this.$refs.loadingMore.loadingStatus('loaded')
                }
            }
        }
    }
}

function parsePostList(data, self) {
    var list = [];

    for (let i = 0; i < data.records.length; i++) {
        self.$data.infoList.push(data.records[i]);
    }
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
    padding-right: 15px;
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

.ui-avatar > span {
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
