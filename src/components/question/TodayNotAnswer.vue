<template>
    <div class="question-page" id="postIndex">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 今日答题 </x-header>
        </div>
        <div class="question-content body-wrap">
            <ul class="question-list">
                <li class="list-item">
                    <h4 class="question-title">{{questionInfo.title}}</h4>
                    <p class="question-desc">{{questionInfo.content}}</p>
                    <div class="opt-box" v-if="questionInfo.optionsKeyCount > 0 && questionInfo.type === 'single'">
                        <checker v-model="answer" default-item-class="answer-itme-default" selected-item-class="answer-itme-selected">
                            <checker-item :value="item.key" v-for="(item, index) in questionInfo.options" :key="index">{{item.key}}   {{item.value}}</checker-item>
                        </checker>
                    </div>
                    <div class="opt-box" v-if="questionInfo.optionsKeyCount > 0 && questionInfo.type === 'multi'">
                          <checklist :max="1" :options="questionInfo.options" v-model="answer" @on-change="getOptions"></checklist>  
                    </div>                    
                    <div class="commit-answer">
                        <x-button type="primary" class="vux_commit_button" @click.native="commitAnswer(questionInfo.id)" > 提交</x-button>
                    </div>
                </li>
            </ul>
        </div>
        <v-tabbar></v-tabbar>
        <toast v-model="toast" :type="toastType" is-show-mask :time="1000">{{tipsMsg}}</toast>
    </div>
</template>
<script>
import { XHeader, Panel, Checklist, Checker, CheckerItem, XButton, Icon, Toast } from 'vux'
import vTabbar from '../common/Tabbar.vue';
import api from '@/service/index'
import { mapState } from 'vuex'
import { jsonToArray } from '@/utils/libs'

export default {
    components: {
        XHeader,
        Panel,
        Checklist,
        Checker,
        CheckerItem,
        XButton,
        Icon,
        'v-tabbar': vTabbar,        
        Toast
    },
    data() {
        return {
            demos: true,
            questionInfo: {
                id: 0,
                title: '',
                desc: '',
                options: ['A', 'B', 'C'],
                optionsKeyCount: 0,
                type: ''
            },
            answer: '',
            toast: false,
            tipsMsg: '',
            toastType: 'warn'
        }
    },
    computed: mapState({ token: state => state.token }),
    activated() {
        this.getquestion()
    },
    methods: {
        getquestion() {
            api.todayNotAnswerQuestion({ token: this.token }).then((res) => {
                if (res.data.code === 0 && res.data.data.length > 0) {
                    this.questionInfo = res.data.data[0]
                    const options = JSON.parse(res.data.data[0].options)
                    this.questionInfo.options = jsonToArray(res.data.data[0].options)           
                    this.questionInfo.optionsKeyCount = Object.keys(options).length
                } else {
                    this.toast = true
                    this.tipsMsg = `${res.data.msg}`
                }
            })
        },
        getOptions: function (value) {
            // 用于多选
            // console.log(value)
        },
        commitAnswer: function (id) {
            let answerArr = [];
            answerArr.push(this.answer)
            if(this.answer === '' || !id ) {
                this.toast = true
                this.tipsMsg = '请选择题目答案!'
                return;
            }
            api.answerQuestion({
                token: this.token,
                questionID: id,
                answer: `["${this.answer}"]`
            }).then((res) => {
                if(res.data.code === 0) {
                    this.toastType = 'success'
                    this.toast = true
                    this.tipsMsg = `答题成功`   
                    setTimeout(function() {
                        window.location.href = '/'
                    }, 1000);                    
                } else {
                    this.toast = true
                    this.tipsMsg = `${res.data.msg}`                
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.question-page {
    .list-item {
        padding: 10px 12px;
    }
    .question-title {
        font-weight: normal;
        font-size: 18px;
        padding-bottom: 10px;
    }
    .question-desc {
        font-size: 13px;
        padding-bottom: 10px;
        border-bottom: 1px solid #c9c9c9;
    }
    .vux-checker-item {
        font-size: 14px;
    }
    .answer-itme-default {
        display: block;
        padding: 10px 15px 10px 30px;
        position: relative;
        &:before {
            content: '';
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 1px solid #c9c9c9;
            position: absolute;
            top: 12px;
            left: 7px;
        }
    }
    .answer-itme-selected {
        &:before {
           content: '';
           border: 1px solid #09bb07;
        }
        &:after {
            content: '';;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #09bb07;
            position: absolute;
            top: 18px;
            left: 13px;
        }
    }
    .vux_commit_button {
        margin-top: 15px;
    }
}

</style>
