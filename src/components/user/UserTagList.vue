<template>
    <div class="user-tag-wrap">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 标签 </x-header>
        </div>
        <div class="tag-list-box body-wrap">
            <ul v-if="!noData"  class="tag-list flex-wrap">
                <li v-for="tag in tags" :key="tag.id" > <p> {{ tag.name }} </p></li>
            </ul>
            <p v-if="noData" class="no-data">他还没有添加标签哦~ </p>
        </div>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import { XHeader } from 'vux'
import vTabbar from '../common/Tabbar.vue'
import api from '@/service/index'
import { mapState } from 'vuex'

export default {
    components: {
        XHeader,
        vTabbar
    },
    data() {
        return {
            tags: [],
            loaded: false,
            noData: false
        }
    },
    computed: mapState({
        token: state => state.token
    }),
    created() {
        this.getTagList()
    },
    methods: {
        getTagList: function() {
            const uid = this.$route.params.uid
            api.userTagList({
                token: this.token,
                otherUserId: uid
            }).then(result => {
                if(result.data.code === 0) {
                    const tagList = result.data.data
                    if( tagList.length > 0 ) {
                        this.tags = tagList
                    } else {
                        this.noData = true
                    }
                    this.loaded = true
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.user-tag-wrap {
    .tag-list-box {
        width: 90%;
        margin: 20px auto;
    }
    .tag-list {
        display: flex;
        flex-wrap: wrap;
        li {
            padding: 5px 10px;
            color: #999;
            font-size: 13px;
            border: 1px solid #f5f5f5;
            border-radius: 5px;
            margin-right: 5px;
            margin-bottom: 10px;
        }
    }
    .no-data {
        color: #666;
        text-align: center;
    }
}
</style>

