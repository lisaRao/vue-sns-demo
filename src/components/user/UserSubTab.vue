<template>
  <div class="user_sub_tab">
        <div class="card-table-box">
            <ul class="card-list flex">
                <li v-on:click="gotoPage(todayQuestionCount, 0)">
                    <p class="icon iconfont icon-today-exercise"></p>
                    <p class="item-name" >今日答题 <badge v-show="todayQuestionCount != 0" :text="todayQuestionCount"></badge></p>
                </li>
                <li v-on:click="gotoPage(historyCount, 1)"  >
                    <p class="icon iconfont icon-history"></p>
                    <p class="item-name" >历史答题</p>
                </li>
                <li v-on:click="gotoPage(collectListCount, 2)">
                    <p class="icon iconfont icon-my-collect"></p>
                    <p class="item-name"  >我的收藏</p>
                </li>
                <li v-on:click="gotoPage(likeListCount, 3)" >
                    <p class="icon iconfont icon-good-post"></p>
                    <p class="item-name" >点赞帖子</p>
                </li>
            </ul>
        </div>
        <toast v-model="toast" type="warn" is-show-mask :time="1000">{{tipsMsg}}</toast>
  </div>
</template>
<script>
import { Badge, Toast } from 'vux';
export default {
    components: {
        Badge,
        Toast
    },
    props: ['todayQuestionCount', 'historyCount', 'collectListCount', 'likeListCount', 'uid'],
    data() {
        return {
            toast: false,
            tipsMsg: ''
        }
    },
    methods: {
        gotoPage: function(currentNum, type) {
            const pageName = ['Question', 'Hquestion', 'postList','postList']
            if(currentNum < 1) {
                this.toast = !this.toast
                this.tipsMsg = '您已完成今日答题，请在历史答题中查看'
                return
            }
            const routerName = pageName[type]
            switch (routerName) {
                case 'Hquestion':
                    this.$router.push({ name: routerName, params: { uid: this.uid } })
                    break;
                case 'postList' || 'postList':
                    this.$router.push({ name: `${pageName[type]}`,params:{postType: type, userId: this.uid}})
                    break;
                default:
                    this.$router.push({ name: `${pageName[type]}` })
                    break;
            }
        }
    }
}
</script>
<style lang="less">
.user_sub_tab {
    .icon {
        font-size: 20px;
    }
    .flex {
        display: flex;
        align-items: center;
        align-content: center;
    }
    .item-name {
        position: relative;
    }
    .vux-badge {
        position: absolute;
        top: -10px;
        right: 5px;
    }
    .card-list {
        li {
            width:  25%;
            font-size: 14px;
            color: #666;
            text-align: center;
            padding: 15px 0;
        }
    }
}

</style>

