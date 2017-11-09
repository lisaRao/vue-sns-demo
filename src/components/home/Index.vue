<template>
  <div class="home_index">
    <div class="top_header">
      <x-header class="header_bar" :left-options="{backText:'',showBack: false}">
        <span>家</span>
      </x-header>
    </div>
    <div class="home-container body-wrap">
      <div class="home-main">
        <group>
          <div class="setting-box" v-for="(setting, index) in settings" :key="index">
            <cell v-if="setting.type === 'default'" is-link :title="setting.title" :link="setting.url">
              <i slot="icon" class="icon iconfont cell-icon" :class="setting.icon"></i>
            </cell>
            <cell v-else :title="setting.title" @click.native="clickHandle(setting.type, setting.url)">
              <i slot="icon" class="icon iconfont cell-icon" :class="setting.icon"></i>
            </cell>
          </div>
        </group>
      </div>
      <v-tabbar></v-tabbar>
      <toast v-model="toast" :type="toasType" is-show-mask :time="1000">{{tipsMsg}}</toast>
      <div v-transfer-dom>
        <alert v-model="showAlert" :title="alertTitle" :content="alertContent"></alert>
      </div>
    </div>
  </div>
</template>
<script>
import { XHeader, Toast, Alert, Cell, Group, TransferDomDirective as TransferDom } from 'vux'
import vTabbar from '../common/Tabbar.vue'
import { mapActions } from 'vuex'
import { USER_DEL_TOKEN } from '@/store/token';
import { mapState } from 'vuex';
import api from '@/service/index'; 

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Toast,
    Alert,
    Cell,
    Group,
    'v-tabbar': vTabbar
  },
  data() {
    return {
      toast: false,
      toasType: 'success',
      tipsMsg: '',
      showAlert: false,
      alertTitle: '下载提示',
      alertContent: 'app正在制造中',
      settings: [{
        title: '微店',
        url: 'http://wwww.qq.com',
        icon: 'icon-shangdian',
        type: 'default'
      }, {
        title: '淘宝店铺',
        url: 'http://wwww.qq.com',
        icon: 'icon-shangdian',
        type: 'default'
      }, {
        title: '下载',
        url: '',
        icon: 'icon-xiazai',
        type: 'download'
      }, {
        title: '联系我们',
        url: '/contactUs',
        icon: 'icon-lianxiwomen',
        type: 'default'
      }, {
        title: '服务条款',
        url: '/agreement',
        icon: 'icon-fuwutiaokuan',
        type: 'default'
      }, {
        title: '公告版',
        url: '',
        icon: 'icon-gonggaolanguanli',
        type: 'notice'
      }, {
        title: '退出登陆',
        url: '',
        icon: 'icon-signout',
        type: 'loginout'
      }]
    }
  },
  computed: mapState({
    token: state => state.token,
    user: state => state.user
  }),
  created() {
    this.getCellUrl()
  },
  methods: {
    ...mapActions(['USER_DEL_TOKEN', 'USER_INFO_DEL']),
    userSignout: function() {
      // 删除 存储信息
      this.USER_DEL_TOKEN()
      this.USER_INFO_DEL()
      api.userloginout({token: this.token}).then((res)=> {
          window.location.href = `/login`
      })
    },
    getCellUrl: function() {
      api.homePage({
        token: this.token
      }).then(res => {
        if (res.data.code == 0) {
          const data = res.data.data
          this.settings[0].url = data.weiDianShop
          this.settings[1].url = data.taoBaoShop
          this.settings[2].url = data.download
        } else {
          this.toast = !this.toast;
          this.toasType = 'warn';
          this.tipsMsg = '网络错误';
        }
      })
    },
    getNoticeContent: function() {
      api.getPicTextArea({
        name: 'board'
      }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data;
          this.showAlert = !this.showAlert
          this.alertTitle = '公告提示'
          if (!data.content) {
            this.alertContent = '暂无公告'
          } else {
            this.alertContent = data.content
          }
        } else {
          this.showAlert = !this.showAlert
          this.alertContent = '获取公告栏失败'
        }
      })
    },
    clickHandle: function(type, url) {
      switch (type) {
        case 'download':
          if (!url) {
            this.showAlert = !this.showAlert
            this.alertTitle = '下载提示'
            this.alertContent = 'app正在制造中'
          } else {
            window.location.href = url
          }
          break;
        case 'loginout':
          this.userSignout()
          break;
        case 'notice':
          this.getNoticeContent()
          break;
        default:
          // code
          break;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header-icon {
  fill: #fff;
  position: relative;
  top: -3px;
  left: -3px;
}

.cell-icon {
  width: 1.5rem;
  height: 100%;
  display: block;
}

.vux-demo {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px
}

.box1 {
  height: 100px;
  position: relative;
  width: 1490px;
}

li {
  list-style: none;
}

.box1 .box_li {
  width: 60px;
  float: left;
  padding: 20px 10px 0 10px;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}

.box1 .box_li p {
  font-size: 0.7rem;
}

.box1-item {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #ccc;
  display: block;
  float: left;
  text-align: center;
}

.box1-item:first-child {
  margin-left: 0;
}

.setting-box {
  border-bottom: 1px solid #f5f5f5;
}

.home-container {
  .weui-cells.home-main {
    &::before {
      border-top: 0 none;
    }
    &::after {
      border-bottom: 0 none;
    }
  }
}
</style>
