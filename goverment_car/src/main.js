// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import iView from 'iview'
import 'mint-ui/lib/style.css'
import 'iview/dist/styles/iview.css'
import App from './App'
import config from './router'
import store from './store/userstate'

Vue.config.productionTip = false
Vue.use(MintUI)
Vue.use(iView)

var router = config.router;
var axios = config.axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  template: '<App/>',
  components: { App }
});
