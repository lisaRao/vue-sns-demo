<template>
    <div class="horoscope-page">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 星座 </x-header>
        </div>
        <div v-if="loaded" class="body-wrap">
            <v-table-button :horoscope="horoscope.name"></v-table-button>
            <p class="today-daily">{{horoscope.date}}</p>
            <div class="luck-box">
                <ul class="luck-box">
                    <li>
                       <p class="desc">{{horoscope.health}}</p> 
                    </li>
                    <li>
                        <p class="desc">{{horoscope.job}}</p>
                    </li>
                    <li>
                        <p class="desc">{{horoscope.love}}</p>
                    </li>
                    <li>
                        <p class="desc">{{horoscope.money}}</p>
                    </li>
                    <li>
                       <p class="desc"> {{horoscope.work}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { XHeader } from 'vux'
import vTableButton from './TableButton'
import api from '@/service/index'
import { mapState } from 'vuex'
export default {
    components: {
        XHeader,
        'v-table-button': vTableButton
    },
    data() {
        return {
            loaded: false,
            horoscope: {}
        }
    },
    computed: mapState({ token: state => state.token }),
    created() {
        api.thisWeekHoroscope({ token: this.token }).then(res => {
            if (res.data.code === 0) {
                this.horoscope = res.data.data
                this.loaded = true
            }
        });
    }

}
</script>

<style lang="less" scoped>
.horoscope-page {
    text-align: center;
    .today-daily {
        margin: 10px 0;
    }
    .luck-box {
        margin: 10px 0;
        li {
            text-align: left;
            font-size: 16px;
            color: #666;
            padding: 10px;
            border-bottom: 1px solid #f1f1f1;
        }
    }
}
</style>
