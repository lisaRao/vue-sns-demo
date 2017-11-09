
import Vue from 'vue';
import { sessionCache } from '../utils/storage';

export const MESSAGE_COUNT = 'MESSAGE_COUNT';   // 未读消息

export default {
    state: sessionCache.get('message') || {},
    mutations: {
        [MESSAGE_COUNT](state, message) {
            sessionCache.set('message', message)
            Object.assign(state, message)
        }
    },
    actions: {
        [MESSAGE_COUNT]({commit}, message) {
            commit(MESSAGE_COUNT, message)
        }
    }
}

