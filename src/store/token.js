import Vue from 'vue'
import { sessionCache } from '../utils/storage'

export const USER_TOKEN = 'USER_TOKEN'      // 用户 token
export const USER_DEL_TOKEN = 'USER_DEL_TOKEN'  // 删除用户 token
export default {
    state: sessionCache.get('token')|| {},
    mutations: {
        [USER_TOKEN](state, token) {
            sessionCache.set('token', token)
            state = token
        },
        [USER_DEL_TOKEN](state) {
            sessionCache.remove('token')
            Vue.delete(state, 'token')
        }
    },
    actions: {
        [USER_TOKEN]({commit}, token) {
            commit(USER_TOKEN, token)
        },
        [USER_DEL_TOKEN]({commit}) {
            commit(USER_DEL_TOKEN)
        }
    }
}