// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'

import App from './App'
import routes from './router'
import store from './store'
import filters from './filters'

// 全局公共样式设置

import './config/common.less'
import './libs/awesome/css/font-awesome.min.css';

import { sessionCache, cookieCache } from '@/utils/storage'
// import { cookie } from 'vux'

FastClick.attach(document.body)

Vue.config.productionTip = false

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// router
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

// Vue.use(LoadingPlugin)
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
