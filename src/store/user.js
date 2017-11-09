import Vue from 'vue'
import { sessionCache } from '../utils/storage'

// export const USER_SIGNIN = 'USER_SIGNIN'  // 登录成功
// export const USER_SIGNOUT = 'USER_SIGNOUT'     // 登录失败
export const USER_INFO = 'USER_INFO'    // user info
export const USER_INFO_DEL = 'USER_INFO_DEL' // DELET USER INFO
export default {
    state: sessionCache.get('user')|| {},
    mutations: {
        [USER_INFO](state, user) {
            sessionCache.set('user', user)
            Object.assign(state, user)
        },      
        [USER_INFO_DEL](state) {
            sessionCache.remove('user')
            Object.keys(state).forEach(k => Vue.delete(state, k))
        }
    },
    actions: {
        [USER_INFO]({commit}, user) {
            commit(USER_INFO, user)
        },
        [USER_INFO_DEL]({commit}) {
            commit(USER_INFO_DEL)
        }
    }
}



