<template>
    <div class="history-question-page" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar"> 历史答题 </x-header>
        </div>
        <div class="history-question-content body-wrap">
            <!-- <panel header="历史答题列表" :list="historyList" :type="showType"></panel> -->
            <div class="weui-panel weui-panel_access">
                <div class="weui-panel__hd">历史答题列表</div>
                <div class="weui-panel__bd" v-show="historyList.length > 0" v-scroll="loadMore">
                    <div class="weui-media-box weui-media-box_text" v-for="(item, index) in historyList" :key="index">
                        <h3 class="question-time">{{item.updateDate}} 答了下面题目 </h3>
                        <h4 class="weui-media-box__title">{{item.question.title}} </h4>
                        <p class="weui-media-box__desc">{{item.question.content}}</p>
                        <h5 class="question-options">选项有</h5>
                        <ul class="weui-media-box__info">
                            <li v-for="(option, idx) in optionList[index]['op']" :key="idx" class="weui-media-box__info__meta">{{option.key}} {{option.value}}</li>
                        </ul>
                        <ul class="weui-media-box__info">
                            <!-- <li class="weui-media-box__info__meta">正确答案是:{{item.answer | string2Array}} </li> -->
                            <li class="weui-media-box__info__meta">选择的答案是: {{item.answer | string2Array }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-data-box" v-show="historyList.length == 0">
            <p class="no-data">暂无答题</p>
        </div>
        <toast v-model="toast" type="warn" is-show-mask :time="1000">{{tipsMsg}}</toast>
        <v-tabbar></v-tabbar>
    </div>
</template>
<script>
import { XHeader, Panel, Toast } from 'vux'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import { mapState } from 'vuex'
import { jsonToArray } from '@/utils/libs'
import more from '@/components/common/More'

export default {
    components: {
        XHeader,
        Panel,
        Toast,
        'v-tabbar': vTabbar,
        'v-more': more
    },
    data() {
        return {
            showType: '4',
            historyList: [],
            optionList: [],
            page: 1,
            pageSize: 10,
            toast: false,
            tipsMsg: '',
            loading: {
                show: false
            },
            scroll: true,
            scrollDisable: false,
            noResult: false,
            pageCount: 1
        }
    },
    computed: mapState({
        token: state => state.token,
        user: state => state.user
    }),
    created: function () {
        this.getList()
    },
    directives: {
        scroll: {
            bind: function (el, binding) {
                window.addEventListener('scroll', () => {
                    if (document.body.scrollTop + window.innerHeight >= el.clientHeight) {
                        binding.value.call(this)
                    }
                })
            }
        }
    },
    methods: {
        getList: function () {
            api.answerHistory({
                token: this.token,
                page: this.page,
                size: this.pageSize,
                otherUserId: this.$route.params.uid
            }).then((res) => {
                if (res.data.code === 0) {
                    const records = res.data.data.records;
                    this.pageCount = Math.ceil(res.data.data.total / res.data.data.size)
                    const currentPage = res.data.data.pages;
                    if (currentPage == 0) {
                        this.historyList = records;
                    } else {
                        let questionData = records,
                            currentData = this.historyList,
                            countData = currentData.concat(questionData);
                        this.historyList = countData;
                    }
                    // no result
                    if (this.historyList.length === 0) {
                        this.noResult = true
                    }
                    for (var i = 0; i < records.length; i++) {
                        const optionlist = records[i].question.options
                        this.optionList.push({
                            op: jsonToArray(optionlist)
                        })
                    }
                } else {
                    this.toast = true
                    this.tipsMsg = `${res.data.msg}`
                }
            })
        },
        loadMore: function () {
            if (!this.scrollDisable) {
                this.scrollDisable = true
                if(this.page < this.pageCount) {
                    this.getList()
                    this.scrollDisable = false
                } else {
                    console.log('已加载完')
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.weui-media-box__title {
    font-size: 16px;
    white-space: normal;
    line-height: 1.5;
    margin-bottom: 15px;    
}
.weui-media-box__desc {
    font-size: 13px;
    color: #666;
    -webkit-line-clamp: inherit;
    line-height: 1.5;
    margin-bottom: 15px; 
}
.weui-media-box__info {
    color: #666;
}
.weui-media-box__info__meta {
    line-height: 1.5;
    margin-bottom: 10px;
}
.weui-panel .weui-cell:first-child:before {
    display: block;
}

.history-question-page {
    .question-options {
        // font-weight: normal;
        font-size: 12px;
        color: #666;
        margin-top: 10px;
    }
}

.question-time {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 10px;
}

._v-container {
    position: relative;
}

.no-data {
    font-size: 14px;
    color: #999;
    text-align: center;
}
</style>
