<template>
  <div id="app">
    <mt-header fixed title="政府公车管理系统">
      <mt-button slot="left" @click="usermenu">
        <Icon type="person" :size="24"></Icon>
      </mt-button>
      <mt-button slot="right" @click="addcar">
        <Icon type="model-s" :size="23"></Icon>
      </mt-button>      
    </mt-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <mt-tabbar fixed>
      <!-- img=100*100.png -->
      <mt-tab-item id="公车状态">
        <img slot="icon" src="" @click="golist()">
        公车状态
      </mt-tab-item>
      <mt-tab-item id="我要用车">
        <img slot="icon" src="" @click="godrive()">
        我要用车
      </mt-tab-item>
      <mt-tab-item id="个人中心">
        <img slot="icon" src="" @click="gouser()">
        个人中心
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import {Header,Tabbar,TabItem} from 'mint-ui'

export default {
  name: 'app',
  components: {Header,Tabbar,TabItem},
  data(){
    return {}
  },
  methods: {
    golist() {
      this.$router.push('/carList');
    },
    godrive() {
      this.$router.push('/');
    },
    gouser() {     
      this.$router.push('/user');
    },
    addcar() {
      this.$router.push('/addcar');
    },
    usermenu(){
      this.$router.push('/user');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
