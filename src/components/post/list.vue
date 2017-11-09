<template>
    <div class="home_index" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar">
                <span>家</span>
                <!--<x-icon class="header-icon" slot="overwrite-left" type="android-settings" size="25" style=""></x-icon>-->
            </x-header>
        </div>
        <div class="body-wrap">
            <scroller lock-y scrollbar-x>
                <ul class="box1">
                    <template v-for="i in 7">
                        <li class="box_li">
                            <div class="box1-item">
                                <img src="" alt="">
                            </div>
                            <p>图文{{i}}</p>
                        </li>
                    </template>
                </ul>
            </scroller>
            <group title="">
                <template v-for="setting in settings">
                    <cell :title="setting.title" :link="setting.url" type="ndroid-settings" is-link>
                        <i slot="icon" class="icon iconfont cell-icon" :class="setting.icon"></i>
                    </cell>
                </template>
            </group>
        </div>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import {
    XHeader,
    Group,
    Cell,
    Panel,
    GridItem,
    Scroller
} from 'vux'
import vTabbar from '../common/Tabbar.vue';

export default {
    components: {
        XHeader,
        Cell,
        Group,
        Panel,
        GridItem,
        Scroller,
        'v-tabbar': vTabbar

    },
    data() {
        return {
            msg: 'Hello World!',
            settings: [{
                title: '商店',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            }, {
                title: '下载',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            }, {
                title: '公告版',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            }, {
                title: '联系我们',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            }, {
                title: '服务条款',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            }, {
                title: '退出登陆',
                url: 'http://wwww.baidu.com',
                icon: 'icon-home'
            },]
        }
    },
    created() {
        console.log(1)
    }
}
</script>
<style>
.header-icon {
    fill: #fff;
    position: relative;
    top: -3px;
    left: -3px;
}

.home_index {
    font-size: 0.75rem;
}

.cell-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    /*padding-right: 0.5rem;*/
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
</style>
