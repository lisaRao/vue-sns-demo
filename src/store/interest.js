import Vue from 'vue'
import { sessionCache } from '../utils/storage'

export const INTEREST_INFO = 'INTEREST_INFO'    // interest info
export const INTEREST_INFO_DEL = 'INTEREST_INFO_DEL' // DELET interest INFO
export default {
  state: sessionCache.get('interest')|| {},
  mutations: {
    [INTEREST_INFO](state, interest) {
      sessionCache.set('interest', interest)
      Object.assign(state, interest)
    },
    [INTEREST_INFO_DEL](state) {
      sessionCache.remove('interest')
      Object.keys(state).forEach(k => Vue.delete(state, k))
    }
  },
  actions: {
    [INTEREST_INFO]({commit}, interest) {
      commit(INTEREST_INFO, interest)
    },
    [INTEREST_INFO_DEL]({commit}) {
      commit(INTEREST_INFO_DEL)
    }
  }
}



