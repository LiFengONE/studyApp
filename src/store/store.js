import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isSignIn : false,
    userEmail : '',
    inUserCenter : false,
    userInfo:{},
    tag:'',
    publishPostSuccess:false,
    inSearching:false
  },
  mutations: {
    setSign (state, startData){
      state.isSignIn = startData;
    },
    increment (state, startData) {
      state.count = startData;
    },
    setStartTime (state, startData){
      state.startTime = startData;
    }
  }
});

export default store
