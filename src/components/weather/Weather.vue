<template>
    <div class="weather-page">
        <div class="top_header">
            <x-header class="header_bar" :left-options="{backText:'', showBack: true}">   天气 </x-header>          
        </div>  
        <div class="weather-panel body-wrap" v-if="weatherDataLoaded">
            <h3 class="location"> {{weatherDeatil.basic.city}}<i class="address  icon iconfont icon-location"></i></h3>
            <div class="now-tmp-box">
                <p class="now-tmp">{{weatherDeatil.now.tmp}}°</p>
                <p class="now-tmp-txt"> {{weatherDeatil.now.cond.txt}} </p>
                <p class="today-weather-min-to-max">{{weatherDeatil.daily_forecast[0].tmp.max}}° / {{weatherDeatil.daily_forecast[0].tmp.min}}°</p>
            </div>
            <div class="today-tmp-detail">
                <div class="swiper-container">
                    <ul class="swiper-box">
                        <li class="swiper-item" v-for="(hourly, index) in weatherDeatil.hourly_forecast" :key="index">
                            <p class="tmp-time"> {{hourly.date | todayFormat }}</p>
                            <p class="tmp-img">
                                 <img :src="hourly.cond.code | weatherPic" width="55%" height="55%" :alt="hourly.cond.txt">
                            </p>
                            <p class="tmp-numer">{{hourly.tmp}}°</p>
                        </li>             
                    </ul>
                </div>
            </div> 
            <div class="week-tmp-list">
                <ul class="tmp-lists">
                    <li class="item"  v-for="(daily, index) in  weatherDeatil.daily_forecast" :key="index"> 
                        <span class="daily">{{daily.date}}</span>
                        <span class="tmp-txt">{{daily.cond.txt_d}}</span>
                        <span class="tmp-zone">{{daily.tmp.max}}° / {{daily.tmp.min}}°</span>
                    </li>                               
                </ul>
            </div>                                                
        </div> 
        <v-tabbar></v-tabbar>    
    </div>  
</template>
<script>
import { XHeader, Cell, Group,  Panel, Card , Toast} from 'vux'
import vTabbar from '@/components/common/Tabbar';
import vAddress from '@/components/common/Address'
import api from '@/service/index'
import { mapState } from 'vuex'
export default {
  components: {
    XHeader,
    Panel,
    Card,
    Toast,
    Cell,
    Group,
    'v-tabbar': vTabbar ,
    'v-address': vAddress,
  },
  data() {
      return {
        weatherDeatil: {
            basic: {},
            now: {},
            hourly_forecast: [],
            daily_forecast: []
        },
        weatherDataLoaded: false
      }
  },
  computed: mapState({ token: state => state.token }),
  activated() {
    api.weather({token: this.token}).then(res => {
        if(res.data.code === 0) {
            const data = res.data.data
            const weatherData = data.heWeather5[0]
            this.weatherDeatil = weatherData
            this.weatherDataLoaded = true
        }
    });
  }
}
</script>

<style lang="less" scoped>
.weather-panel {
    text-align: center;
    padding: 46px 15px 55px;
    // background-color: #77b1eb;
    .location {
        color:  #666;
        font-size: 28px;
        .address {
            padding-left: 8px;
        }
    }
    .now-tmp-box {
        .now-tmp {
            font-size: 5em;
            position: relative;
            left: 1rem;            
        }
        .now-tmp-txt, .today-weather-min-to-max {
            font-size: 1em;
            color: #999;
            position: relative;
            top: -1.8rem;
        }
    }
    .swiper-box {
        display: flex;
        .tmp-time, .tmp-numer {
            font-size: 16px;
            color: #999;
        }
        .tmp-img {
            img {
                background-color: #77b1eb;
            }
        }
    }
    .week-tmp-list {
        margin-top: 30px;
    }
    .tmp-lists {
        font-size: 16px;
        color: #666;
        li {
            height: 2rem;
            line-height: 2rem;
            border-top: 1px solid #f1f1f1;
            display: flex;

            .daily {
                width: 50%;
                text-align: left;
            }
            .tmp-txt {
                width: 20%;
                text-align: center;
            }
            .tmp-zone {
                width: 30%;
                text-align: right;
            }
        }
    }
}
</style>
