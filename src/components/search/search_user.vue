<template>
  <div class="search_index">
    <div class="top_header">
      <x-header class="header_bar" :left-options="{backText:''}">
        <span v-text="title"></span>
      </x-header>
    </div>
    <div class="body-wrap">
      <search @on-submit="onSubmit" :auto-fixed="autoFixed" @on-focus="onFocus" ref="search" v-model="key"  @on-cancel="onCancel"></search>
      <div id="postIndex">
        <ul class="post-list">
            <li class="ui-panel" v-if="user.nickyName" v-for="user in userList" :key="user.id">
              <div class="top-box ui-whitespace">
                <div class="avatar-box">
                  <div class="ui-avatar" @click="gotoCent(user.id)" :style="user.avatarUrl | style">
                  </div>
                </div>
                <div class="top-box-info">
                  <div class="ui-title vux-label" @click="gotoMsg(user.id,user.nickyName)"
                       v-text="user.nickyName"></div>
                  <div class="extra-box">
                    <span v-text="user.logicId"></span>
                  </div>
                </div>
                <span v-show="user.isFriend==0">
                  <x-icon type="plus" class="cell-x-icon" @click="addFridendOnConfirm(user)"></x-icon>
                </span>
              </div>
            </li>
        </ul>
        <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
      </div>
    </div>
    <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
  </div>
</template>
<script>
  import { Search, Toast,XHeader } from 'vux'
  import vTabbar from '../common/Tabbar.vue';
  import api from '@/service/index'
  import {  mapState } from 'vuex';
  import More from '@/components/common/MoreV.vue'
  import {normalCache} from '@/utils/storage'

  export default {
    components: {
      XHeader,
      Search,
      Toast,
      'v-more': More,
      'v-tabbar': vTabbar
    },
    data() {
      return {
        userList: [],
        addFridend: {
          show: false,
          content: "",
          friendId: ""
        },
        oldKey: '',
        key: '',
        page: 1,
        size: 10,
        pageCount: 1,
        title: '精确搜索',
        toastType: 'warn',
        tipsMsg: '',
        toast: false,
        autoFixed: false,
        loading: {
          show: false
        },
        scroll: true,
        id:0
      }
    },
    computed: mapState({
      token: state => state.token,
      user: state => state.user
    }),
    created() {
      var token = this.token;
    },
    activated(){
      this.$refs.search.setFocus();
    },
    methods: {
      addFridendOnConfirm(data) {
        let param = {
          "friendId": data.id,
          token: this.token
        }
        api.addFriend(param).then(res => {
          // 登录请求处理
          if (res.data.code == 0) {
            this.toast = !this.toast
            this.tipsMsg = "添加成功";
            this.toastType = 'success';
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
            this.searchUser();
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
      onSubmit() {
        this.page = 1;
        this.scroll=true;
        this.loading.show = true;
        this.$refs.loadingMore.loadingStatus('loading')
        this.getSearchUser();
      },
      getSearchUser() {
        this.userList = [];
        this.searchUser()
      },
      searchUser() {
        api.searchUser({
          keyword: this.key,
          page: this.page,
          size: this.size,
          token: this.token
        }).then(res => {
          this.scroll = true;
          this.loading.show = true;
          if (res.data.code != 0) {
            this.toast = !this.toast
            this.$data.toastType = 'warn';
            this.$data.tipsMsg = '搜索失败';
          } else {
            this.scroll = true;
            this.loading.show = true;
            if (res.data.data.records.length == 0 && this.page == 1) {
              this.$data.toast = !this.$data.toast;
              this.$data.toastType = 'text';
              this.$data.tipsMsg = '暂无相关用户';
              this.$refs.loadingMore.loadingStatus('loaded')
            } else {
              this.$data.pageCount = Math.ceil(res.data.data.total / this.size)
              parseUser(res.data.data.records, this)

            }
          }
        });
      },
      onFocus() {
      },
      onCancel() {
        this.userList=[];
        this.loading.show=false;
       window.history.go(-1);
      }
    }
  }
  function parseTag(data, self) {
    self.$data.tagLists = [];
    for (let i = 0; i < data.length; i++) {
      self.$data.tagLists.push({
        key: data[i].id,
        value: data[i].name
      })
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
    top: 95px;
    left: 0;
    right: 0;
    bottom: 0;
    /*margin-bottom: 60px;*/
    background-color: #fff;
    overflow: scroll;
    .post-list {
      padding-top: 0px;
      margin-bottom: 0px;
    }
  }

  .search_index {
    font-size: 17px;
    .ui-type {
      background-color: #fff;
    }
  }

  .ui-button {
    margin-top: 5px;
  }

  .search_index .weui-label {
    width: 2em;
  }

  .search-list .weui-cell {
    margin-top: 5px;
  }

  .flex-demo {
    text-align: center;
    color: @theme-color;
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
