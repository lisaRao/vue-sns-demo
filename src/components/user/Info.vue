<template>
    <div class="user_info" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: false}"> 我 </x-header>
        </div>
        <div class="user_home_page body-wrap" v-if="userinfoload">
            <div class="user-info-head flex">
                <div class="avatar-box">
                    <div class="photo" :style="userinfo.avatarUrl | style"></div>
                    <div class="upload-avatar-box" v-bind:class="{'has-avatar': userinfo.avatarUrl}">
                        <v-upload classname="upload-avatar" :token="token" :isShowDelBtn="false" :isPreview="false" uploadType="1" :compress="compress"></v-upload>
                    </div>
                </div>
                <div class="user-infomation-panel">
                    <p class="user-name">{{userinfo.name}}({{userinfo.logicId}})</p>
                    <p class="city-name">城市：{{userinfo.city | replaceCity}}</p>
                    <p class="user-age">年龄：{{userinfo.age}}</p>
                    <p class="constellation">星座: {{userinfo.constellation}}</p>
                    <p class="constellation">积分: {{userinfo.score}}</p>
                    <p class="wechat-name">微信: {{userinfo.weixin}}</p>
                    <p class="modify-info-btn" @click="modifyProfile"> 修改资料
                        <span class="iconfont icon-edit"></span>
                    </p>
                </div>
            </div>
            <div class="info-care-box flex">
                <p class="care-item" v-on:click="gotoPage('contacts')">
                    <span class="number">{{userinfo.friendCount}}</span>
                    <span class="label">好友</span>
                </p>
                <p class="care-item" v-on:click="gotoPage('postList')">
                    <span class="number">{{userinfo.postCount}}</span>
                    <span class="label">发帖</span>
                </p>
                <p class="care-item" v-on:click="gotoPage('tagList')">
                    <span class="number">{{userinfo.tagCount}}</span>
                    <span class="label">标签</span>
                </p>
              <p class="care-item" v-on:click="gotoPage('reply')">
                <span class="label">通知</span>
                <span class="number" v-if="userinfo.noticeCount>0"><badge text="new"></badge></span>
              </p>
            </div>
            <v-usertab :todayQuestionCount="userinfo.todayQuestionCount" historyCount="2" collectListCount="1" likeListCount="1" :uid="userinfo.id"></v-usertab>
            <h3 class="photo-title">用户相册</h3>
            <v-userphoto :photolist="userinfo.userPicUrls" :previewPhoto="userinfo.prviewPhotoList" :token="token" :hasUploadOpt="true" :canDel="true"></v-userphoto>
            <div class="user-sign">
                <h3 class="user-sign-title">个人签名</h3>
                <p class="sign-txt">{{userinfo.sign || '暂无签名'}}</p>
            </div>
            <v-bottom-nav></v-bottom-nav>
            <div class="invite-link">
                <h3> 邀请链接 </h3>
                <input id="invite" class="link-ipt" :value="userinfo.inviteUrl" readonly>
                <button class="copy-btn" data-clipboard-action="copy" data-clipboard-target="#invite">复制链接</button>
            </div>
        </div>
        <v-tabbar></v-tabbar>
        <toast v-model="toast" type="warn" :time="1500" is-show-mask>{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    XHeader,
    Panel,
    Card,
    Toast,
    Badge
} from 'vux'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import { mapState } from 'vuex'
import vUserSubTab from './UserSubTab'
import vUserPhoto from './UserPhoto'
import vBottomNav from './BottomNav'
import vUploadImg from '@/components/common/UploadImage'
import { mapActions } from 'vuex'
import { USER_DEL_TOKEN } from '@/store/token'
import { USER_INFO } from '@/store/user'
import Clipboard from '@/libs/clipboard'
export default {
    components: {
        XHeader,
        Panel,
        Card,
        Toast,
      Badge,
      'v-tabbar': vTabbar,
        'v-usertab': vUserSubTab,
        'v-userphoto': vUserPhoto,
        'v-upload': vUploadImg,
        'v-bottom-nav': vBottomNav
    },
    data() {
        return {
            userinfo: {
                name: '',
                id: 0,
                logicId: '',
                age: 0,
                city: '',
                constellation: '',
                avatarUrl: '',
                friendCount: 0,
                postCount: 0,
                tagCount: 0,
                todayQuestionCount: 0,
                userPicUrls: [],
                prviewPhotoList: []
            },
            compress: {
                width: 800,
                quality: 0.7
            },
            userinfoload: false,
            toast: false,
            tipsMsg: ''
        }
    },
    computed: mapState({
        token: state => state.token
    }),
    created() {
        // copy
        const clipboard = new Clipboard('.copy-btn');
        clipboard.on('success', (e)=> {
            this.toast = !this.toast
            this.tipsMsg = '复制成功'
        });
        clipboard.on('error', (e) => {
            this.toast = !this.toast
            this.tipsMsg = '复制失败，请手动复制'
        })
    },
    activated() {
        this.getUserInfo()
    },
    methods: {
        ...mapActions(['USER_DEL_TOKEN', 'USER_INFO']),
        getUserInfo: function(){
            api.getUser({
                token: this.token
            }).then(res => {
                if (res.data.code === 0) {
                    this.userinfo = res.data.data
                    this.userinfo.prviewPhotoList = res.data.data.userPicUrls
                    this.userinfo.userPicUrls = res.data.data.userPicUrls.slice(0, 3)
                    this.USER_INFO(this.userinfo)
                    this.userinfoload = true
                }
            }).catch(error => {
                console.log(`error: ${error}`)
            })
        },
        modifyProfile: function () {
            this.$router.push({
                path: '/updateinfo'
            })
        },
        userSignout: function () {
            this.USER_DEL_TOKEN()
            window.location.href = `/login`
        },
        gotoPage: function (name) {
            if (name === "postList") {
                this.$router.push({ name: name, params: { postType: 4, userId: this.userinfo.id } })
            } else{
                this.$router.push({ name: name })
            }
        },
        goInvite: function (url) {
            window.open(url)
        }
    }
}
</script>
<style lang="less" scoped>
.user_info {
    .flex {
        display: flex;
        align-items: center;
        align-content: center;
    }
    .avatar-box {
        width: 98px;
        height: 98px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 10px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .user-infomation-panel {
        margin: 10px;
        font-size: 14px;
        color: #666;
        line-height: 2;
    }
    .info-care-box {
        border-top: 1px solid #f1f0f0;
        border-bottom: 1px solid #f1f0f0;
        height: 45px;
        line-height: 45px;
        .care-item {
            width: 33%;
            text-align: center;
            border-right: 1px solid #f1f0f0;
            &:last-child {
                border-right: 0;
            }
            .number {
                color: #666;
            }
            .label {
                color: #999;
                font-size: 13px;
            }
        }
    }
    .photo-title {
        padding: 0 25px;
        font-size: 16px;
        color: #666;
    }
    .photo {
        width: 98px;
        height: 98px;
        background: no-repeat center center;
        background-size: cover;
        position: absolute;
        border-radius: 50%;
        z-index: 1;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .avatar-box {
        position: relative;
    }
    .upload-avatar-box {
        position: absolute;
        left: 0;
        top: 0;
    }
    .user-sign {
        padding: 0 25px;
    }
    .user-sign-title {
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
    }
    .sign-txt {
        color: #999;
        line-height: 1.5;
        font-size: 14px;
        min-height: 20px;
    }
    .bottom-nav-box {
        margin: 20px 0;
    }
    .invite-link {
        padding: 10px 15px;
        h3 {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
        }

        .link {
            font-size: 12px;
            color: #999;
            word-break: break-all;
            margin-top: 10px;
        }
    }
    .link-ipt {
        width: 68%;
        border: 1px solid #f2f2f2;
        line-height: 20px;
        padding: 6px 10px;
        vertical-align: middle;
    }
    .copy-btn {
        position: relative;
        display: inline-block;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: bold;
        line-height: 20px;
        color: #666;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        border: 1px solid #f3f0f0;
        background: none;
    }
}
</style>
