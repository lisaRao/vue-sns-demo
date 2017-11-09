<template>
    <div class="horoscope-header">
        <h3 class="horoscope-title">{{horoscope}}运势</h3>
        <div class="table-nav">
            <button-tab v-model="currentIndex">
                <button-tab-item :selected="$route.name === 'TodayLuck'" @on-item-click="horoscopShow()"> 今日 </button-tab-item>
                <button-tab-item :selected="$route.name === 'TomorrowLuck'" @on-item-click="horoscopShow()"> 明日 </button-tab-item>
                <button-tab-item :selected="$route.name === 'TheWeekLuck'" @on-item-click="horoscopShow()"> 本周 </button-tab-item>
            </button-tab>    
        </div>
    </div>    
</template>
<script>
import { ButtonTab, ButtonTabItem } from 'vux'
export default {
    components : {
        ButtonTab,
        ButtonTabItem
    },
    props: ['horoscope'],
    data() {
        return {
            currentIndex: 0
        }
    },
    methods: {
        horoscopShow() {
            const pathnameArray = ['TodayLuck', 'TomorrowLuck', 'TheWeekLuck']            
            this.$router.replace({ name: `${pathnameArray[this.currentIndex]}` })
        }
    }

}
</script>
<style lang="less" scoped>
    .horoscope-title {
        padding: 20px 0;
    }
    .table-nav {
        width: 90%;
        margin: 0 auto;
    }
</style>

