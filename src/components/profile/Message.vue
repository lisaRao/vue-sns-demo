<template>
    <div class="message-box  body-wrap" id="message-content"  v-bind:style="{ height: windowHeight + 'px' }">
      <div class="message-header" id="postIndex">
        <x-header class="header_bar" :left-options="{backText:'',showBack: false}"> 消息通知 </x-header>
        <!--<x-header :right-options="{showMore: true}"  style="background-color:#000;" @on-click-more="showMenus = true">logo</x-header>-->
      </div>

      <!--系统用户 -->
      <swipeout-item :threshold=".5" underlay-color="#ccc" >
        <div slot="right-menu">
          <swipeout-button  background-color="#336DD6">删除</swipeout-button>
          <swipeout-button  background-color="#D23934">取消</swipeout-button>
        </div>
        <div slot="content">
          <div class="message-item-content vux-1px-tb">
            <div class="message-item">
              <!-- 头像 -->
              <!--<div class="message-item-portrait" @click="gotoUserInfo()">-->
              <div class="message-item-portrait" >
                <img src="/static/img/logo.9b488e6.png" />
              </div>
              <!--<router-link  :to="{ path: 'chat', query:{ userId: item.fromUserId, msgId: item.msgId , toUserName: item.nickyName}}">-->
              <div class="message-item-title" @click="gotoChatPage('system')">
                <div class="message-item-name">系统通知</div>
                <div class="message-item-news"></div>
              </div>
              <!--</router-link >-->
            </div>
            <div class="message-item-time" @click="gotoChatPage('system')">
              <div></div>
               <div v-if="systemBadge" ><badge></badge></div>
            </div>
          </div>
        </div>
      </swipeout-item>

       <!--系统用户 END -->





      <!-- weipeout 组件 -->
       <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="item in msgList" :key="item.msgId" >
        <div slot="right-menu">
          <swipeout-button @click.native="onDeleteMsg(item.msgId)" background-color="#336DD6">删除</swipeout-button>
          <swipeout-button  background-color="#D23934">取消</swipeout-button>
        </div>
        <div slot="content">
          <div class="message-item-content vux-1px-tb">
            <div class="message-item">
              <!-- 头像 -->
              <div class="message-item-portrait" @click="gotoUserInfo(item.fromUserId, item.toUserId)">
                <img v-show="item.avatarUrl" :src="item.avatarUrl" />
              </div>
              <!--<router-link  :to="{ path: 'chat', query:{ userId: item.fromUserId, msgId: item.msgId , toUserName: item.nickyName}}">-->
              <div class="message-item-title" @click="gotoChatPage(item.fromUserId,item.nickyName,item.msgId, item.toUserId)">
                <div class="message-item-name">{{item.nickyName}}</div>
                <div class="message-item-news" v-if="item.type == 0">{{item.content}}</div>
                <div class="message-item-news" v-if="item.type == 1">[图片]</div>
              </div>
              <!--</router-link >-->
            </div>
            <div class="message-item-time" @click="gotoChatPage(item.fromUserId,item.nickyName,item.msgId, item.toUserId)">
              <div> {{item.postDate}}</div>
              <div v-if="item.notRead" ><badge></badge></div>
            </div>
          </div>
        </div>
        <!--</router-link >-->
      </swipeout-item>
      <!-- 数据为空的情况  -->
      <load-more :show-loading="loadingShow" :tip="text" ></load-more>
      <v-tabbar :currentPage = "currentPage"></v-tabbar>
    </div>
</template>

<script>
import { XButton, Swipeout, SwipeoutItem, SwipeoutButton, XHeader, Actionsheet, TransferDom, Badge, LoadMore} from 'vux'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index';
import { store } from '@/store';
import { mapState } from 'vuex';
export default {
  components: {
    XButton, Swipeout, SwipeoutItem, SwipeoutButton, XHeader, Actionsheet, TransferDom, Badge,
    'v-tabbar': vTabbar, LoadMore
  },
  computed: mapState({ 
    token: state => state.token, 
    user: state => state.user 
  }),
  data () {
    return {
      msgList: '',
      windowHeight:'',
      loadingShow: true,
      text: '正在努力加载中...',
      page: 1,
      total:'',
      currentPage: false,
      systemBadge: false
    }
  },
  created() {
    let me = this;
     setTimeout(function(){
      // 订阅消息，接收新消息
      stompClient.subscribe('/queue/chat/sendMsg/'+me.user.id, (greeting) => {
        if(!me.currentPage){
          return;
        }
        let repData = JSON.parse(greeting.body);
        if (repData.type == 2) {
          return;
        }else{
          me.page = 1;
          me.getmsgList();
        }
      });
    },2000);

    setTimeout(function(){
      // 订阅消息，接收新消息
      stompClient.subscribe('/queue/chat/sendMsg/0', (greeting) => {
          if(!me.currentPage){
            return;
          }
          me.systemBadge = true;
          
        });
      },2000);

  },
  activated() {
    this.currentPage = true;
    // let token = this.token;
    this.page = 1;
    // 读取消息列表
    this.getmsgList(1);
    this.windowHeight = window.innerHeight - 80 ;
    let scrollEle = document.getElementById('message-content');
    scrollEle.addEventListener('scroll', this.handleScroll);
    this.page = 1;

    if(window.systemMessageState){
      this.systemBadge = true;
    }
    
  },
  deactivated(){
    this.currentPage = false;
    window.messageState = false;
    this.systemBadge = false;
    
  },
  methods: {
    // 获取未读信息列表
    getmsgList(page){
      if(page){
        this.page = page;
      }
      let me = this;
      api.getMsgList({
        token: this.token,
        page: this.page,
        size: 10
      })
      .then(res => {
          let recordsActive = res.data.data.records;
          // console.log(records);
          let records = [];
          recordsActive.forEach((v)=>{

            if(v.state == 0 && v.fromUserId != me.user.id){
              v.notRead = true;
              records.unshift(v);
            }else if(v.state = 1){
              records.push(v);
              v.notRead = false;
            }
          });
          if(this.page === 1){

            this.msgList = records;
            this.total = res.data.data.total;
            if(this.total<10){
              this.loadingStatus('loaded');
            }


          }else{
            records.forEach((v)=>{
                this.msgList.push(v);
            })
          }
      });
    },
    // 删除信息
    onDeleteMsg(msgId){
      // console.log(msgId);
      api.upDataState({
        token: this.token,
        status: -1,
        msgId: msgId
      }).then(res => {
        // 重新加载好友列表
        this.getmsgList(1);
      })
    },
    // 数据加载状态
    loadingStatus: function (status) {
        switch(status) {
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
    handleScroll(){
        let scrollEle = document.getElementById('message-content');

        const scrollH = scrollEle.scrollHeight;
        const scrollY = scrollEle.scrollTop;
        const innerHeight = scrollEle.offsetHeight ;
        const moreHeight = 30;
              // console.log(scrollH);
              // console.log(scrollY);
              // console.log(innerHeight);
        if(scrollH < scrollY + innerHeight + moreHeight) {
                  // 加载下一页数据
                  if(this.page * 10 < this.total){
                      this.page ++;
                      // 加载上一页数据
                      this.getmsgList();
                  }else{
                      // console.log('加载完成....................');
                    this.loadingStatus('loaded');
                  }
        }

    },
    gotoUserInfo(userId, toUserId){
        // console.log(userId, toUserId , Number(this.token));
        let oppositeId ;
        if(userId == Number(this.user.id)){
          oppositeId = toUserId;
        }else{
          oppositeId = userId;
        }
        this.$router.push({
                name: 'userinfo',
                params: {
                    uid: oppositeId
                }
            })
    },
    gotoChatPage(userId,nickName,msgId, touserId){

        if(userId == 'system'){
          // console.log(userId);
           this.$router.push({
              name: 'SystemMessage',
              query: {
                  userId: userId,
                  toUserName: '系统通知',
                  msgId: 'system'
              }
          });
          window.systemMessageState = false;
          return ;
        }
        // console.log(userId,touserId,this.token);
        let chatId;
        
        if(userId == Number(this.user.id)){
          // 发给对方的消息
          chatId = touserId;
          msgId = false;
        }else{
          // 接收对方的消息
          chatId = userId;
        }
        // console.log('跳转到聊天');
        this.$router.push({
            name: 'chat',
            query: {
                userId: chatId,
                toUserName: nickName,
                msgId: msgId
            }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .message-item-content{
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 5px 10px;
    position: relative;
    &:before {
      border: 0 none;
    }
    &:after {
      border: 0 none;
    }
  }
  .message-item-content>.message-item{
    display: flex;
    font-size: 14px;
    float: left;
    // width: 86%;
    width: 100%;
  }

  .message-item-portrait{
    height: 50px;
    width: 50px;
    margin: 8px 12px 0 0;
    overflow: hidden;
    // border: 1px solid #dedede;
    flex-shrink: 0;

  }
  .message-item-title{
    height: 50px;
    margin-top: 8px;
    width: 86%;
  }
  .message-item-time{
    float: right;
    font-size: 14px;
    color: #dedede;
    position: absolute;
    top: 10px;
    right: 10px;
    height: 50px;
    text-align: right;
  }
  .message-item-news{
    white-space: nowrap;
    width: 86%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }
  .message-box{
    padding-bottom: 70px;
  }
  .message-item-name{
    color: #111;
  }
  #message-content{
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
