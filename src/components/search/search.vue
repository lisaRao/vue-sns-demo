<template>
  <div class="search_index">
    <div class="top_header">
      <x-header class="header_bar" :left-options="{backText:'',showBack: false}">
        <span>搜索</span>
      </x-header>
    </div>
    <div class="body-wrap" id="postIndex">
      <search :auto-fixed="true" @on-focus="onFocus" ref="search"></search>
      <div class="ui-type">
        <flexbox class="flex-box">
          <flexbox-item>
            <div @click="getSearchType(1)" class="flex-demo">精确搜索</div>
          </flexbox-item>
          <flexbox-item>
            <div @click="getSearchType(2)" class="flex-demo">兴趣推荐</div>
          </flexbox-item>
          <flexbox-item>
            <div @click="getSearchType(3)" class="flex-demo">兴趣论坛</div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <v-tabbar></v-tabbar>
    <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
  </div>
</template>
<script>
  import { Search, Flexbox, FlexboxItem, Toast, XHeader } from 'vux'
  import vTabbar from '../common/Tabbar.vue'
  import api from '@/service/index'
  export default {
    components: {
      XHeader,
      Search,
      Flexbox,
      FlexboxItem,
      Toast,
      'v-tabbar': vTabbar
    },
    data() {
      return {
        toast: false,
        tipsMsg: '',
        toastType: 'success'
      }
    },
    methods: {
      onFocus() {
        this.$router.push({
          name: 'searchUser'
        })
      },
      getSearchType(type) {
        if (type === 1) {
          this.$router.push({
            name: 'searchUser'
          })
        } else if (type === 2) {
          this.$router.push({
            name: 'searchInerest'
          })

        } else {
          this.$router.push({
            name: 'searchPost'
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
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
    position: absolute;
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
