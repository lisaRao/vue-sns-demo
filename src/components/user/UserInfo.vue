<template>
    <div class="other_user_info" id="postIndex" v-if="userinfoload">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> {{userinfo.name}} 的主页 </x-header>
        </div>
        <div class="user_home_page body-wrap" v-show="userinfoLen > 0">
            <div class="user-info-head flex">
                <div class="avatar-box">
                    <div class="photo" :style="userinfo.avatarUrl | style"></div>
                </div>
                <div class="user-infomation-panel">
                    <p class="user-name">姓名：{{userinfo.name}}({{userinfo.logicId}})</p>
                    <p class="city-name">城市：{{userinfo.city | replaceCity}}</p>
                    <p class="user-age">生日：{{userinfo.birthday | replaceBirthday}}</p>
                    <p class="constellation">星座: {{userinfo.constellation}}</p>
                    <p class="constellation" v-show="userinfo.phone">手机: {{userinfo.phone}}</p>
                    <p class="sex"> 性别: {{userinfo.sex | formatSex}}</p>
                    <p class="wechat-name">微信: {{userinfo.weixin}}</p>
                    <p class="chat-btn" @click="gotoChat"> 对话 </p>
                </div>
            </div>

            <div class="info-care-box flex">
                <p class="care-item" v-on:click="gotoPage('postList')">
                    <span class="label">发帖</span>
                </p>
                <p class="care-item" v-on:click="gotoPage('Hquestion')">
                    <span class="label">历史答题</span>
                </p>
                <p class="care-item" v-on:click="gotoPage('usertags')">
                    <span class="label">标签</span>
                </p>
            </div>

            <div v-show="userinfo.userPicUrls.length > 0">
                <h3 class="photo-title">用户相册</h3>
                <v-userphoto :photolist="userinfo.userPicUrls" :previewPhoto="userinfo.prviewPhotoList" :token="token" :hasUploadOpt="false" :canDel="false" classname="other-photolist"></v-userphoto>
            </div>
            <div class="user-sign">
                <h3 class="user-sign-title">个人签名</h3>
                <p class="sign-txt">{{userinfo.sign || '暂无签名'}}</p>
            </div>
        </div>
        <div class="no-data" v-show="userinfoLen == 0">信息获取错误</div>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import { XHeader, Panel, Card, Toast } from 'vux'
import vTabbar from '../common/Tabbar.vue'
import api from '@/service/index'
import { mapState } from 'vuex'
import vUserSubTab from './UserSubTab'
import vUserPhoto from './UserPhoto'
import vBottomNav from './BottomNav'
import vUploadImg from '@/components/common/UploadImage'

export default {
    components: {
        XHeader,
        Panel,
        Card,
        Toast,
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
            userinfoload: true,
            toast: false,
            userinfoLen: 1,
            tipsMsg: ''
        }
    },
    computed: mapState({
        token: state => state.token
    }),
    activated(){
        this.getuser()
    },
    methods: {
        getuser: function() {
            api.getUser({
                token: this.token,
                otherUsersId: this.$route.params.uid
            }).then(res => {
                if (res.data.code === 0) {
                    this.userinfo = res.data.data
                    this.userinfo.prviewPhotoList = res.data.data.userPicUrls
                    this.userinfo.userPicUrls = res.data.data.userPicUrls.slice(0, 3)
                    this.userinfoload = true
                } else {
                    this.userinfoLen = 0
                    this.$router.push({ path: '/' })
                }
            }).catch(error => {
                console.log(`error: ${error}`)
            })
        },
        gotoPage: function (name) {
            switch (name) {
                case 'postList':
                    this.$router.push({ name: name, params: { postType: 4 }, query: { userId: this.userinfo.id } })
                    break;
                case 'Hquestion' || 'usertags':
                    this.$router.push({ name: name, params: { uid: this.$route.params.uid } })
                    break;
                default:
                    this.$router.push({ name: name })
                    break;
            }
        },
        gotoChat: function () {
            this.$router.push({ name: 'chat', query: { userId: this.userinfo.id, toUserName: this.userinfo.name } })
        }
    }
}
</script>
<style lang="less" scoped>
.other_user_info {
    .flex {
        display: flex;
        align-items: center;
        align-content: center;
    }
    .avatar-box {
        width: 98px;
        height: 98px;
        border-radius: 33.33%;
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
        margin-top: 15px;
        .care-item {
            width: 50%;
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
        padding: 0 15px;
        font-size: 16px;
        color: #666;
        margin-top: 20px;
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
        padding: 0 15px;
        margin-top: 15px;
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
    .chat-btn {
        width: 60px;
        height: 30px;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
    }
    .no-data {
        font-size: 16px;
        text-align: center;
    }
}
</style>
