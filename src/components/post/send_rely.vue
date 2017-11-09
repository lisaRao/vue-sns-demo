<template>
    <div class="post_add" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
              <span v-text="'帖子详情'"></span>
              <x-button mini slot="right" type="default" @click.native="sendRely">提交</x-button>
            </x-header>
        </div>
        <div class="body-wrap">
            <vue-html5-editor class="needsclick"
            :content="content"
            :height="300"
            :zIndex="100"
            :show-module-name="showModuleName"
            @change="updateData"
            ref="editor">
            </vue-html5-editor>
        </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1000">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    XHeader,
    XButton,
    Toast

} from 'vux'
import Vue from 'vue'

import {
    mapState,
    Store
} from 'vuex';

import {
    sessionCache
} from '@/utils/storage'
import vuex from 'vuex'
import {
    UploadApi
} from '@/service/resource.js'
import VueHtml5Editor from 'vue-html5-editor'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index';
import xaddress from '@/components/common/Address'

import E from 'wangeditor'
Vue.use(VueHtml5Editor, {

    showModuleName: true,
    image: {
        sizeLimit: 4096 * 1024,
        compress: true,
        width: 500,
        height: 500,
        quality: 80
    },
    language: "zh-cn",
    visibleModules: [
        "text",
        "color",
        "font",
        "align",
        "list",
        "link",
        "unlink",
        "image",
        "eraser",
        "undo",
    ],
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 102400 * 1024,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
            url: UploadApi + "?token=" + sessionCache.get('token'),
            fieldName: "img"
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: {
            width: 800,
            quality: 70
        },
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler(response) {
            var json = JSON.parse(response)
            if (json.ok) {
                return json.data;
            } else {
                self.$data.toast = true;
                self.$data.tipsMsg = '上传图片失败';
            }
        }


    },
    modules: {
        //omit,reference to source code of build-in modules
        // console.log(1)
    }
})
export default {
    components: {
        XHeader,
      XButton,
      Toast,
        'v-tabbar': vTabbar
    },
    data() {
        return {
            showModuleName: false,
            content: '',
            param: {
                postId: '',
                content: '',
                type: 2,
                token: ''
            },
            toastType: 'warn',
            tipsMsg: '',
            toast: false,

        }
    },
    created() {
      this.param.postId = this.$route.query.post;
      this.$data.param.token = this.token;

    },

    computed: mapState({
        token: state => state.token
    }),

    methods: {
      updateData(data) {
        let self = this;
        self.$data.param.content = data;
      },
        onSubmit() {
            var self = this,
                data;
            self.$data.param.token = self.token;
            data = self.$data.param;

        },
      sendRely() {
        let self = this;
        if (self.param.content == '') {
          self.$data.tipsMsg = '请填写内容';
          return;

        } else {
          api.addComment(this.param).then(res => {
            if (res.data.code != 0 && res.data.code != -1) {
              self.$data.toast = !this.toast;
              self.$data.tipsMsg = '评论失败';

            }
            if (res.data.code == 0) {
              self.$data.toastType = 'success';
              self.$data.toast = !this.toast;
              self.$data.tipsMsg = '评论成功';


              setTimeout(()=> {
                window.location.href='/detail?post='+self.param.postId;
              }, 1000)
            }
          })
        }


      }

    }
}
</script>
<style lang="less">
.header-icon {
    fill: #fff;
    position: relative;
    top: -3px;
    left: -3px;
    font-weight: 100;
}

.post_add .weui-label {
    width: 3em;
}

.post-dec {
    padding-left: 15px;
}

.post-dec p {
    min-height: 100px;
    height: 100%;
    padding-bottom: 10px;
}

.post-footer {
    text-align: right;
    padding-bottom: 5px;
}

.post-footer span {
    padding-right: 10px;
}

.post-footer::afert {
    border-bottom: 1px solid #999;
}

.cell-x-icon {
    top: 0px;
    left: 15px;
}

.post-title .weui-cells__title {
    color: #000;
    font-size: 0.9rem;
}

.weui-cells:after {
    border-bottom: 1px solid #ddd;
}

.post_add {
    font-size: 0.75rem;
    padding-bottom: 0px;
}

.post_add .weui-cells {
    margin-top: 0px;
}

.post-num span {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background-color: #ddd;
}
</style>
