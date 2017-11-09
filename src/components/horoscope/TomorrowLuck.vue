<template>
    <div class="horoscope-page">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'',showBack: true}"> 星座 </x-header>
        </div>
        <div v-if="loaded" class="body-wrap">
            <v-table-button :horoscope="horoscope.name" ></v-table-button>
            <p class="today-daily">{{horoscope.datetime}}</p>
            <div class="luck-box">
                <ul class="luck-box">
                    <li>
                        整体运势: {{horoscope.all}}
                    </li>
                    <li>
                        事业学业: {{horoscope.work}}
                    </li>
                    <li>
                        健康指数: {{horoscope.health}}
                    </li>
                    <li>
                        幸运颜色: {{horoscope.color}}
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
        api.horoscope({token: this.token, type: 'tomorrow'}).then(res => {
            if(res.data.code === 0) {
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
            margin:  10px 0;
        }
        .luck-box {
            margin: 10px 0;
            li {
                font-size: 16px;
                color: #666;
                height: 2rem;
                line-height: 2rem;
                border-bottom: 1px solid #f1f1f1;
            }
        }
    }
</style>
