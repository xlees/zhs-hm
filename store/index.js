import { createStore } from 'vuex';

const store = createStore({
	state: {
		count: 0,
		
		uid: null,
		isLogin: false,
		token: null
	},

	// 得到组件中的数据
	getters: {
		doubleCount: (state) => state.count * 2
	},

	// 修改state
	mutations: {
		increment(state) {
		  state.count++;
		},
		
		loginRequest(state, user) {
			state.isLogin=true;
			state.token=null;
			state.user=user;
		},
		loginSuccess(state) {
			state.isLogin=true;
			state.token=null;
			state.user=null;
		},
		loginFailure(state) {
			state.isLogin=false;
		},
	},

	// 发送请求
	actions: {
		incrementIfOdd({ state, commit }) {
		  if (state.count % 2 !== 0) {
			commit('increment');
		  }
		},
		
		login({commit}, { username, password }) {
			commit('loginRequest', { username });
		
			let result = loginService.login(username, password);
			if(result){
				commit('loginSuccess');
				console.log("login success");
				router.push('/home');
			}
		},
		logout({commit}) {
			commit('resetState');
			router.push('/');
		},
		clearState ({ commit }) {
			commit('resetState');
		},
	},
  
});

export default store;
