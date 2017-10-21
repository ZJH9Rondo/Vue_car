<template>
  <div id="app">
    <mt-header fixed title="政府公车管理系统" style="height: 45px;z-index:999">
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
    <mt-tabbar fixed style="z-index:999" id="tabbar">
      <!-- img=100*100.png -->
      <mt-tab-item id="公车状态">
        <img slot="icon" src="./assets/carlist.png" @click="golist()">
        公车状态
      </mt-tab-item>
      <mt-tab-item id="我要用车">
        <img slot="icon" src="./assets/drive.png" @click="godrive()">
        我要用车
      </mt-tab-item>
      <mt-tab-item id="个人中心">
        <img slot="icon" src="./assets/user.png" @click="gouser()">
        个人中心
      </mt-tab-item>
    </mt-tabbar>
    <Spin size="large" fix v-if="spinShow" style="z-index:9999">Loading...</Spin>
  </div>
</template>

<script>
import {Header,Tabbar,TabItem} from 'mint-ui'

export default {
  name: 'app',
  components: {Header,Tabbar,TabItem},
  data(){
    return {
      spinShow: false
    }
  },
  created() {
    try{
      var loadingGIF = document.getElementById('appLoading');

      document.body.removeChild(loadingGIF);
      setTimeout(function() {
        document.getElementById('app').style.display = 'block';
        
        // fix 移动端键盘弹出顶起tabbar
        (function () {
           var _height = document.documentElement.clientHeight,
               _tabbar = document.getElementById('tabbar');

           window.addEventListener('resize',function (){
             if(document.documentElement.clientHeight < _height){
                _tabbar.style.display = 'none';
             }else{
                _tabbar.style.display = 'flex';
             }
           },false);
        })();
      }, 500);
    }catch(e){
      throw e;
    }
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
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 44px;
}
</style>
