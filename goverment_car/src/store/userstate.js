import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var store = new Vuex.Store({
    state: {
        userNumber: ''
    },
    mutations: {
        userSignIn(state,number) {
            state.userNumber = number;
        },
        userlogout(state){
            state.userNumber = '';
        }
    }
});

export default store;