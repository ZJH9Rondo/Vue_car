import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/signIn'
import Signup from '@/components/signUp'
import Drive from '@/components/drive'
import User from '@/components/user'
import Carlist from '@/components/carList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: Signin
    },{
      path: '/signup',
      name: 'signUp',
      component: Signup
    },{
      path: '/drive',
      name: 'drive',
      component: Drive
    },{
      path: '/user',
      name: 'user',
      component: User
    },{
      path: '/carlist',
      name: 'carlist',
      component: Carlist
    }
  ]
})