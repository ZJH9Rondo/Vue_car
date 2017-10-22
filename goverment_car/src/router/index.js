import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Signin from '@/components/signIn'
import Signup from '@/components/signUp'
import Drive from '@/components/drive'
import User from '@/components/user'
import Carlist from '@/components/carList'
import Addcar from '@/components/addCar'
import Changepwd from '@/components/changePwd'

Vue.use(Router)

// 配置axios的http拦截
axios.interceptors.request.use(function (config){
  if(window.localStorage.getItem('user_token')){
    config.headers.token = window.localStorage.getItem('user_token');  
  }else{
    router.push('/signin');
  }
  return config;
});

Vue.prototype.axios = axios;

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'drive',
      meta: {
        requireoAuth: true
      },
      component: Drive
    },{
      path: '/signin',
      name: 'signIn',
      component: Signin,
    },{
      path: '/changePwd',
      name: 'changePwd',
      component: Changepwd,
    },{
      path: '/signup',
      name: 'signUp',
      component: Signup
    },{
      path: '/user',
      name: 'user',
      meta: {
        requireoAuth: true
      },
      component: User
    },{
      path: '/carlist',
      name: 'carlist',
      component: Carlist
    },{
      path: '/addcar',
      name: 'addCar',
      meta: {
        requireoAuth: true
      },
      component: Addcar
    }
  ]
});

// router　权限拦截认证
router.beforeEach(function (to,from,next){
  if(to.meta.requireoAuth){
    axios({
      method: 'get',
      url: '/checktoken'
    }).then(function (response){
        if(response.data.status){
          next();
        }else{
          next({
            path: '/signin',
            query: {redirect: to.fullPath}
          });
        }
    })
  }else{
    next();
  }
});

export default{
  router: router,
  axios: axios
};