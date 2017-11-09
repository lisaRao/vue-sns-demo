<template>
    <div id="postIndex">
        <x-header class="header_bar" :left-options="{backText:'',showBack:  true}"> {{toUserName}} </x-header>
        <alert v-model="alertSshow" :title="alertTitle" :content="alertContent" @on-hide="onHide">
        </alert>
        <div class="chat body-wrap" v-bind:style="{ height: windowHeight + 'px' }" id="user-chat">
            <div id="user-chat-content">
                <load-more :show-loading="loadingShow" :tip="text" background-color="#EBEBEB"></load-more>
                <div v-for="item in chatHistory" v-bind:class="item.toUserId == toUseId? 'chat-right':'chat-left'" class="chat-item">
                    <div v-if="item.showTime" class="chat-item-time">
                        <span>{{item.addDate}}</span>
                    </div>
                    <div class="chat-item-box">
                        <div class="chat-img " @click="gotoUserInfo(item.fromUserId)">
                            <img v-show="item.headerUrl" :src="item.headerUrl" />

                        </div>
                        <div class="chat-detail">
                            <div v-if="item.type == 0">{{item.content}}</div>
                            <div v-if="item.type == 1">
                                <!-- <img :src="item.content" /> -->
                                <!--<v-userphoto :photolist="[item.content]" :previewPhoto="[item.content]" :token="token" :hasUploadOpt="false"></v-userphoto>-->
                                <v-userphoto  :photolist="[{'url':item.content}]" :previewPhoto="[{'url':item.content}]" :token="token" :hasUploadOpt="false" :canDel="false" classname="other-photolist" :compress="compressOption"></v-userphoto>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="chat-input">
            <div class="voice">
                <x-icon slot="right" type="ios-plus-outline" size="31"></x-icon>
            </div>
            <div class="input">
                <!-- <input type="text" v-model="sendMsgData" @focus="inputFoucs()"> -->
                <textarea name="chatInput"  class="chat-ipt" v-model="sendMsgData" @focus="inputFoucs()"></textarea>
            </div>
            <div class="chat-input-right">

                <div class="chat-input-enty">
                    <div class="button" @click="sendMsg()">发送</div>
                </div>
            </div>
            <div>
                <div class="up-file">
                    <v-upload v-on:uploaded-success = "uploadedSuccess"
                    ref="uploadChild"
                    classname="chat-upload"
                    :token="token"
                    :isShowDelBtn="false"
                    :isPreview="false"
                    :chatPage = "false"
                    uploadType="0"></v-upload>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    XButton,
    WechatEmotion as Emotion,
    LoadMore,
    Alert,
    XHeader
} from 'vux';
import api from '@/service/index';
import {
    mapState
} from 'vuex';
import vUploadImg from '@/components/common/UploadImage';
//引入websock
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import vUserPhoto from '../user/UserPhoto'
import { Config } from '@/service/config'
export default {

    components: {
        XButton,
        Emotion,
        LoadMore,
        Alert,
        'v-upload': vUploadImg,
        XHeader,
        'v-userphoto': vUserPhoto,
    },

    data() {
        return {
            chatHistory: '',
            toUseId: '',
            //   userImg: '',
            msgId: '',
            windowHeight: '',
            sendMsgData: '',
            sessionId: '',
            isShowTool: false, // 展示输入辅助工具
            total: '', // 总数据条数
            loadingShow: true,
            text: '正在努力加载中...',
            page: 1, // 已经加载到第几页数据
            alertSshow: false,
            alertTitle: '提示',
            alertContent: '',
            currentPage: false,
            networkIsConnect: true,
            toUserName: '',
            testConnect: '',   // 记录定时器
            compressOption: {
                width: 720,
                quality: 0.65
            }
        }
    },
    computed: mapState({
        token: state => state.token,
        user: state => state.user
    }),
    activated() {
        let me = this;
        
        window.messageState = false;
        this.currentPage = true;
        
        let userId = this.$route.query.userId;
        let msgId = this.$route.query.msgId;
        let toUserName = this.$route.query.toUserName;
        // this.userImg = this.$route.query.userImg;
        this.windowHeight = window.innerHeight - 60;
        this.toUseId = userId;
        this.msgId = msgId;
        this.toUserName = toUserName;
        // 获取聊天记录
        this.getChatList(userId);
        // 更新聊天状态为已读
        // console.log(msgId);
        if (msgId) {
            this.upDataMsgState(msgId, 1);
        }


        let scrollEle = document.getElementById('user-chat');
        scrollEle.addEventListener('scroll', this.handleScroll);
        
        // 清除心跳检查
        this.testConnect = null;
        // 心跳检测接口：/chat/sendHeartBeat
        this.testConnect = setInterval(function() {
            if (me.currentPage) {
              me.networkIsConnect = false;
              let msg = {};
                msg['toUserId'] = me.toUseId;
                msg['fromUserId'] = me.user.id;
                msg['content'] = '心跳检测';
                msg['type'] = 2;
                // console.log('心跳检测');
                stompClient.send("/chat/sendHeartBeat", {}, JSON.stringify(msg));
                setTimeout(function(){
                    if(!me.networkIsConnect){
                      me.alertSshow = true;
                      me.alertContent = '网络错误，请更换网络环境，或刷新浏览器';
                      // 并重新建立连接
                      // console.log('重新建立连接');
                        let url = '/api/community_chat';
                        // let socket = new SockJS("http://112.74.171.157:8080" + url);
//                       let socket = new SockJS(`${Config.websocketApi}`);
                       let socket = new SockJS(url);
                        let stompClient = Stomp.over(socket);
                        window.stompClient = stompClient;
                        stompClient.connect({}, () => {
                            me.stompClientSubscribe();
                        });

                    }else{
                      me.alertSshow = false;
                    }
                },5000)
            }
        }, 25000);
    },
    // 组件销毁
    deactivated() {
            window.messageState = false;
            this.currentPage = false,
            this.chatHistory = '',
            this.toUseId = '',
            //  this.userImg = '',
            this.msgId = '',
            this.windowHeight = '',
            this.sendMsgData = '',
            this.sessionId = '',
            this.isShowTool = false, // 展示输入辅助工具
            this.total = '', // 总数据条数
            this.loadingShow = true,
            this.text = '正在努力加载中...',
            this.page = 1, // 已经加载到第几页数据
            this.alertSshow = false,
            this.alertTitle = '提示',
            this.alertContent = '',
            this.networkIsConnect = true,
            this.toUserName = '';

            window.clearInterval(this.testConnect); // 取消检测
            this.testConnect = '';
    },
    created() {
        let me = this;
        window.onresize = function(){
            if(me.currentPage){
                me.windowHeight = window.innerHeight - 60;
            }
        }
        setTimeout(function() {
            // 订阅聊天消息
            // let token = this.token;

            if (window.stompClient) {
                me.stompClientSubscribe();
            } else {
                // console.log('重新建立连接');
                let url = '/api/community_chat';
                // let socket = new SockJS("http://112.74.171.157:8080" + url);
//                let socket = new SockJS(`${Config.websocketApi}`);
                let socket = new SockJS(url);
                let stompClient = Stomp.over(socket);
                window.stompClient = stompClient;
                stompClient.connect({}, () => {
                    me.stompClientSubscribe();
                });
            }
        }, 1000);

    },
    methods: {
        // 获取聊天记录
        getChatList(userId) {
            if (userId) {
                api.getReadMsgList({
                    token: this.token,
                    page: this.page,
                    size: 10,
                    friendId: userId
                }).then(res => {
                    let recordsData = res.data.data.records;
                    let random;
                    let records = recordsData.map(v => {
                        
                        if(v.fromUserId != this.user.id){
                            if(v.state == 0){
                                this.upDataMsgState(v.id, 1);                            
                            }
                        }
                        v.showTime = true;
                        return v;
                    });
                    // console.log(records);
                    if (this.page === 1) {
                        this.chatHistory = records.reverse();
                        this.total = res.data.data.total;
                        if (this.total < 10) {
                            this.loadingStatus('loaded');
                        };
                        if (records.length > 0) {
                            this.sessionId = res.data.data.records[0].sessionId;
                        }

                        // 滚动条滚到最底部
                        // this.scrollBottom();
                        setTimeout(this.scrollBottom, 400);

                    } else {
                        records.forEach((v) => {
                            this.chatHistory.unshift(v);
                        })
                    }

                })
            }
        },
        uploadedSuccess: function(data){
            const uploadImageUrl = data[0].url

            if(data.length === 1) {
                const sendContentData = {
                    toUserId: this.toUseId,
                    fromUserId: this.user.id,
                    content: uploadImageUrl,
                    type: 1
                }
                stompClient.send("/chat/sendMsg", {}, JSON.stringify(sendContentData))
                return false
            } else if(data.length > 1){
                // 不做多张 处理
                this.alertSshow = true
                this.alertContent = '一次只能发送一张图片'
            }

        },
        // 发送消息
        sendMsg(userId) {

            if (this.sendMsgData) {
                let msg = {};
                msg['toUserId'] = this.toUseId;
                msg['fromUserId'] = this.user.id;
                msg['content'] = this.sendMsgData;
                msg['type'] = 0;
                stompClient.send("/chat/sendMsg", {}, JSON.stringify(msg));
            }
            if (!this.sendMsgData) {
                if (images.length === 0) {
                    this.alertSshow = true,
                    this.alertContent = '消息为空！';
                }
            }
        },
        onHide() {
            this.sendMsgData = ''
            this.$refs.uploadChild.images = []
        },
        // 更新msg状态为已读
        upDataMsgState(msgId, state) {
            api.upDataState({
                token: this.token,
                status: state,
                msgId: msgId
            })
        },
        // 展示辅助工具
        showTool(type) {
            this.isShowTool = true;
        },
        // 输入框获取焦点，隐藏辅助工具
        inputFoucs() {
            this.isShowTool = false;
        },
        // 滚动到最底部
        scrollBottom() {
            let scrollEle = document.getElementById('user-chat');
            if (scrollEle) {
                let scrollHeight = scrollEle.scrollHeight;
                scrollEle.scrollTop = scrollHeight;
            };
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
        // 滚动事件
        handleScroll: function() {
            let scrollEle = document.getElementById('user-chat');
            if (scrollEle.scrollTop === 0) {
                if (this.page * 10 < this.total) {
                    this.page++;
                    // 加载上一页数据
                    this.getChatList(this.toUseId);

                    setTimeout(function() {
                        scrollEle.scrollTop = 60;
                    }, 200);
                } else {
                    this.loadingStatus('loaded');
                }
            }

        },
        stompClientSubscribe: function() {

            // let token = this.token;
            let userId = this.user.id;  // --------修改token
            let me = this;
            stompClient.subscribe('/queue/chat/sendMsg/' + userId, (greeting) => {
                if(!me.currentPage){
                    return ;
                }

                let repData = JSON.parse(greeting.body);
                if (!repData.sessionId) {
//                    console.log(repData)
                    if(repData.type == 2){
                        this.networkIsConnect = true;
//                        console.log('true-----------------------')
                        return ;
                    }
                    this.alertSshow = true;
                    this.alertContent = repData.content;
                    return;
                } else {
                    // console.log(this.toUseId);
                    // console.log(repData.toUserId);
                    if (repData.toUserId == this.toUseId) {
                        this.sendMsgData = '';
                        this.$refs.uploadChild.images = [];
                        this.isShowTool = false;
                    }else{
                        this.upDataMsgState(repData.id, 1);

                    }
                };
                // 当没有一条信息的时候
                if (!this.sessionId) {
                    this.sessionId = repData.sessionId;
                }

                if (repData.sessionId == me.sessionId) {
                    // let random = Math.random() * 10;
                    // if (random < 2.5) {
                        repData.showTime = true;
                    // } else {
                    //     repData.showTime = false;
                    // }
                    if (me.chatHistory) {
                        me.chatHistory.push(repData);
                    }
                    // console.log('订阅。。。。。。。。。。。。。。。。。。。。');
                    // console.log(repData.)
                    // this.upDataMsgState(repData.id, 1);
                };
                // 滚动到最底部
                setTimeout(this.scrollBottom, 100);
            });
        },
        gotoUserInfo(userId){
            // console.log(userId);
            // console.log(this.user.id);
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
        }
    }
}
</script>
<style lang="less" scoped>
.chat {
    font-size: 14px;
    padding: 0 6px;
    // padding-bottom: 60px;
    background-color: #EBEBEB;
    * {
        box-sizing: border-box;
    }
}

.chat-left {
    overflow: hidden;
    padding: 12px 0;
    width: 100%;
}

.chat-right {
    overflow: hidden;
    padding: 12px 0;
    width: 100%;
}

.chat-img {
    height: 42px;
    width: 42px;
    overflow: hidden;
    // border: 1px solid #dedede;
}

.chat-left .chat-img {
    float: left;
}

.chat-right .chat-img {
    float: right;
}

.chat-detail {
    margin: 0 54px;
    color: #3E3E3E;
    position: relative;
    // overflow:hidden;
}

.chat-left .chat-detail:before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border: none;
    border-left: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    position: absolute;
    left: -5px;
    top: 14px;
    transform: rotate(45deg);
    background: #fff;
}

.chat-left .chat-detail>div {
    display: inline;
    float: left;
    border: 1px solid #dedede;
    border-radius: 4px;
    padding: 9px 6px;
    width: 100%;
    word-wrap: break-word;
    background-color: #fff;
}

.chat-right .chat-detail:after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border: none;
    position: absolute;
    right: -5px;
    top: 14px;
    transform: rotate(45deg);
    background: #a0e759;
}

.chat-right .chat-detail>div {
    display: inline;
    float: right;
    border: 1px solid #dedede;
    border-radius: 4px;
    padding: 9px 6px;
    background-color: #A0E759;
    width: 100%;
    word-wrap: break-word;
}

.chat-input {
    // height: 52px;
    border: 1px solid #dedede;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 8px 0;
    background-color: #fff;
    z-index: 100;
    position: relative;
    .voice {
        float: left;
        width: 52px;
        text-align: center;
        svg {
            position: relative;
            top: 5px;
            cursor: pointer;
        }
    }
    .chat-input-right {
        float: right;
        width: 60px;
        // height: 52px;
        // border: 1px solid #dedede;
        position: absolute;
        top: 8px;
        right: 0;
        .chat-input-face {
            width: 52px;
            // height: 100%;
            // border: 1px solid #dedede;
            float: left;
            // line-height: 52px;
            text-align: center;
            svg {
                position: relative;
                top: 5px;
                cursor: pointer;
            }
        }
        .chat-input-enty {
            width: 52px;
            height: 100%;
            // border: 1px solid #dedede;
            float: right;
            .button {
                cursor: pointer;
                font-size: 14px;
                width: 46px;
                height: 31px;
                margin-top: 6px;
                background-color: #18AE15;
                color: #fff;
                line-height: 31px;
                text-align: center;
                border-radius: 2px;
            }
        }
    }
    .input {
        margin: 0 60px;
        input {
            display: block;
            width: 100%;
            height: 42px;
            border: none;
            border-bottom: 1px solid #dedede;
        }
    }
}

.up-file {
    height: 50px;
}

#user-chat {
    overflow: auto;
     -webkit-overflow-scrolling: touch
}

#user-chat-content {
    padding-bottom: 60px;
}

.chat-item-box {
    overflow: hidden;
}

.chat-item-time {
    text-align: center;
    padding-top: 15px;
    span {
        // background-color: #D4D4D4;
        font-size: 12px;
        color: #aaa;
        padding: 2px 4px;
        border-radius: 2px;
    }
}

.chat-img {
    background-color: #fff;
}
.chat-ipt {
    display: block;
    width: 100%;
    height: 42px;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #dedede;
    overflow: auto;
    resize:none;
    outline: none;
}
</style>
