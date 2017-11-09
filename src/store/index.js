import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import token from './token'
import message from './message'
import interest from './interest'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		user,
		token,
		message,
    	interest
	}
});
