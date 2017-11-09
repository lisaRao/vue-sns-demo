<template>
    <div class="search_index" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText: ''}">
                <span v-text="title"></span>
            </x-header>
        </div>
        <div class="search_filter body-wrap">
            <div class="checker-ui-box">
                <checker v-model="tagList" type="checkbox" default-item-class="demo5-item" selected-item-class="demo5-item-selected" :max="max">
                    <checker-item v-for="tag in tagLists" :value="tag.key" :key="tag.id" @on-item-click="onItemClick">{{tag.value}}</checker-item>
                </checker>
            </div>
            <div class="ui-button" v-on:click="addUserTag">
                <x-button type="primary" text="提交" action-type="button">确定</x-button>
            </div>
        </div>
        <v-tabbar></v-tabbar>
        <toast v-model="toast" :type="toastType" is-show-mask :time="800">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import {
    XHeader,
    XButton,
    Divider,
    Checker,
    CheckerItem,
    Toast
} from 'vux'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import {
    mapState
} from 'vuex';

export default {
    components: {
        XHeader,
        XButton,
        Divider,
        Checker,
        CheckerItem,
        Toast,
        'v-tabbar': vTabbar

    },
    data() {
        return {
            title: '选择标签',
            tagList: [],
            tagLists: [],
            toast: false,
            toastType: 'warn',
            tipsMsg: '',
          max:8

        }
    },

    computed: mapState({
        token: state => state.token
    }),
    created() {
        var token = this.token;
        var tagList = [];
        api.userTagList({
            token: token
        }).then(res => {
            if (res.data.code == 0) {
                if (res.data.data.length == 0) {
                    this.$data.tagList = [];
                } else {
                    for (var i = 0; i < res.data.data.length; i++) {
                        tagList.push(res.data.data[i].id);
                    }
                    this.$data.tagList = tagList;
                }
            } else {
                this.$data.tagList = [];
            }

        })

        api.tagList({
            token: token
        }).then(res => {
            if (res.data.code != 0) {
                this.$data.toast = !this.$data.toast;
                this.$data.tipsMsg = '获取主标签失败';
            } else {
                parseTag(res.data.data, this);
                if (this.$data.tagLists.length == 0) {
                    this.$data.toast = !this.$data.toast;
                    this.$data.tipsMsg = '没有标签';
                }
            }
        });


    },
    methods: {
      onItemClick(value,display){
        if(this.tagList.length==this.max){
          this.$data.toast = !this.$data.toast;
          this.$data.toastType = 'text'
          this.$data.tipsMsg = '最多可选8个';
        }
      },
        addUserTag() {
            api.addUserTag({
                tags: this.$data.tagList,
                token: this.token
            }).then(res => {
                if (res.data.code == 0) {
                    this.$data.toast = !this.$data.toast;
                    this.$data.toastType = 'success'
                    this.$data.tipsMsg = '标签设置成功';
                } else {
                    this.$data.toast = !this.$data.toast;
                    this.$data.toastType = 'warn'
                    this.$data.tipsMsg = '没有标签';
                }
              setTimeout(function() {
                window.location.href = '/ '
              }, 2000)

            })
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
</script>
<style lang="less" scoped>
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
    padding-bottom: 10px;
    padding-top: 10px;
}
</style>
