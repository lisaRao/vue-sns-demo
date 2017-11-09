<template>
  <div class="vux_tabbar">
    <tabbar class="tabbar_group">
      <tabbar-item :link="{name:'Message'}" :selected="$route.name === 'Message'" :show-dot="messageState">
        <i slot="icon" class="tab-icon icon iconfont icon-messge" @click="updataMessageState()"></i>
        <span slot="label">消息</span>
      </tabbar-item>
      <tabbar-item :link="{name:'Search'}" :selected="$route.name === 'Search'" @click.native="changeSearch()">
        <i slot="icon" class="tab-icon icon iconfont icon-search"></i>
        <span slot="label">搜索</span>
      </tabbar-item>
      <tabbar-item :link="{name:'Index'}" :selected="$route.name === 'Index'">
        <i slot="icon" class="tab-icon icon iconfont icon-user"></i>
        <span slot="label"> 我</span>
      </tabbar-item>
      <tabbar-item :link="{name:'Home'}" :selected="$route.name === 'Home'">
        <i slot="icon" class="tab-icon icon iconfont icon-home"></i>
        <span slot="label">家</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import '@/config/tabbar.less'
import { mapState } from 'vuex';
import { Config } from '@/service/config'
//引入websock
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import  { normalCache } from '@/utils/storage';
import api from '@/service/index';

export default {
  components: {
    Tabbar,
    TabbarItem
  },
  props: ['currentPage'],
  computed: mapState({
    token: state => state.token,
    user: state => state.user
  }),
  data() {
    return {
      messageState: false,
      isChange:true
    }
    
  },
  activated() {
    if(window.messageState){
      this.messageState = true;
    }else{
      this.messageState = false;
    }
    // 是否有未读消息
    if(!window.unRedMessage){
      this.loadMessage();
    }
    
  },
  created() {
    if(window.messageState){
      this.messageState = true;
    }else{
      this.messageState = false;
    }
    // 是否有未读消息
    if(!window.unRedMessage){
      this.loadMessage();
    }
    
    // this.websocketConnect();

    // 开始建立websocket 连接
    let url = '/api/community_chat';
    let socket;
    let stompClient;
    let me = this;

    if (window.chatSocket) {
      console.log("char socket exist, return")
      return
    }
    console.log("char socket not exist, create one")
    // socket = new SockJS("http://112.74.171.157:8080" + url);
//    socket = new SockJS(`${Config.websocketApi}`);
    socket = new SockJS(url);
    window.chatSocket = socket;
    stompClient = Stomp.over(socket);
    window.stompClient = stompClient;
    let userId = this.user.id;  // --------修改token
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/queue/chat/sendMsg/' + userId, function (greeting) {
        // console.log('提示...............')
        let repData = JSON.parse(greeting.body);
        if (repData.type == 2) {
          return;
        }
        // console.log(me.user);
        if (repData.toUserId == me.user.id) {
           me.messageState = true;
           window.messageState = true;
           me.$forceUpdate()

        }
      });
      // 系统消息
       stompClient.subscribe('/queue/chat/sendMsg/0', function (greeting) {
        // console.log('提示...............')
        let repData = JSON.parse(greeting.body);
        // console.log(repData);
        // if (repData.toUserId == me.user.id) {
           me.messageState = true;
           window.messageState = true;
           window.systemMessageState= true;


        // }
      });

    });


  },
  methods: {
    updataMessageState() {
      this.messageState = false;
       window.messageState = false;
    },
    changeSearch(){
        // console.log(1222222222222222)
        normalCache.remove('history');
        this.isChange=true;
        this.$emit('change','fdjsklfja')

    },
    loadMessage(){
      api.UnReadMsgCount({
        token: this.token
      })
      .then(res => {
        // console.log(res.data.data);
        let repData = res.data.data;
        // window.systemMessageState;
        repData.forEach(v => {
          if(v.fromUserId == 0 && v.count > 0){
            window.systemMessageState = true;
          }
        })
        if(repData.length == 1){
          if(repData[0].fromUserId == 0 && repData[0].count == 0){
            this.messageState = false;
            window.messageState = false;
          }else{
            this.messageState = true;
            window.messageState = true;
            window.systemMessageState = true;
          }
          return ;
        }
        if(repData.length > 0){
           this.messageState = true;
           window.messageState = true;
          
        }
      })

      window.unRedMessage = true;
    }
  }

}
</script>

