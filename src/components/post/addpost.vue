<template>
    <div class="post_add" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <x-button mini slot="right" type="default" @click.native="onSubmit">发布</x-button>
            </x-header>
        </div>
        <div class="body-wrap">
            <group>
                <xaddress v-on:getaddress="getAddressName"></xaddress>
                <selector title="类型" placeholder="请选择类型" :options="tagList" direction="left" v-model="param.tagId"></selector>
                <selector title="主题" placeholder="请选择主题" :options="list" direction="left" v-model="param.type"></selector>
                <x-input title="标题" :max="20" placeholder="请输入帖子标题" v-model="param.title"></x-input>
            </group>

            <vue-html5-editor class="needsclick"
            :content="content"
            :height="300"
            :zIndex="100"
            :show-module-name="showModuleName"
            @change="updateData"
            ref="editor">
            </vue-html5-editor>
        </div>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1500">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    XHeader,
    XButton,
    XInput,
    Group,
    Selector,
    XTextarea,
    ChinaAddressV3Data,
    Actionsheet,
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
console.log()

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
    name: 'ed',
    components: {
        XHeader,
        XButton,
        XInput,
        Group,
        XTextarea,
        Selector,
        xaddress,
        Actionsheet,
        // editor,
        Toast,

        'v-tabbar': vTabbar
    },
    data() {
        return {
            showModuleName: false,
            content: '',
            param: {
                regionId: '',
                tagId: '',
                title: '',
                content: "",
                type: '',
                token: ''
            },
            isChange: false,
            list: [{
                key: 1,
                value: '活动帖子'
            }, {
                key: 2,
                value: '普通帖子'
            }],
            tagList: [],
            toastType: 'warn',
            tipsMsg: '',
            toast: false,

        }
    },
    created() {
        var self = this;
        api.tagList({
            token: this.token
        }).then(res => {

            if (res.data.code != 0) {
                self.$data.toast = true;
                self.$data.tipsMsg = '获取主题失败';
            } else {
                self.parseTag(res.data.data, self)
            }
        });
        console.log(this.$refs)
        // alert(2)
    },

    computed: mapState({
        token: state => state.token
    }),
    mounted() {
        console.log(this.$refs.editor)
        // editor.customConfig.onchange = (html) => {
        //     // this.editorContent = html
        //     console.log(html)
        // }

    },
    methods: {
        updateData(data) {
            let self = this;
            console.log(data)

            self.$data.param.content = data;
            if (data) {
                self.$data.isChange = true;
            }

        },
        fouce() {
            this.$refs.editor.focus()

        },
        getAddressName(data) {
            // 获取已选城市
            this.param.region = data.replace(' ', '_');
        },

        parseTag(data) {
            var self = this;

            self.$data.tagList = [];
            for (let i = 0; i < data.length; i++) {
                self.$data.tagList.push({
                    key: data[i].id,
                    value: data[i].name
                })
            }
        },
        onSubmit() {
            var self = this,
                data;
            self.$data.param.token = self.token;

            if (!self.$data.isChange) {
                self.$data.param.content = '';
                self.content = '';
            }
            self.$data.param.regionId = 1;
            data = self.$data.param;

            if (data.tagId == '' || data.content == '' || data.title == '' || data.type == '' || data.token == '') {
                self.$data.toast = !self.$data.toast;
                self.$data.toastType = 'text';
                if (data.tagId == '') {
                    self.$data.tipsMsg = '请选择类型';
                    return;
                }
                if (data.type == '') {
                    self.$data.tipsMsg = '请选择主题';
                    return;
                }
                if (data.title == '') {
                    self.$data.tipsMsg = '请填写标题';
                    return;
                }
                if (data.content == '') {
                    self.$data.tipsMsg = '请填写内容';
                    return;
                }

            } else {

                api.addPost(data).then(res => {
                    if (res.data.code != 0) {
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'warn';
                        self.$data.tipsMsg = '发布失败';

                    } else {
                        self.$data.param.tagId = '';
                        self.$data.param.content = '';
                        self.content = '';

                        self.$data.param.title = '';
                        self.$data.param.type = '';
                        self.$data.toast = !self.$data.toast;
                        self.$data.toastType = 'success';
                        self.$data.tipsMsg = '发布成功';
                        setTimeout(function() {
                            self.$router.push({
                                name: 'postList',
                                params: {
                                    postType: 4
                                }
                            })

                        }, 1000)

                    }

                })
            }


            // if (self.$data.param) {}
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
