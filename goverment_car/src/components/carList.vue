<template>
  <div class="carlist-page">
      <div class="carlist-item" v-for="(item,index) in carShowlist" :key="index">
          <div class="item-image">
              <img :src="item.carImage" alt="公车图片" />
          </div>
          <div class="item-content">
              <p>姓名：{{item.userName}}</p>
              <p>手机：{{item.userPhone}}</p>
              <p class="content">状态：在用</p>
          </div>
          <div class="clear"></div>
      </div>
      <BackTop :bottom="70">
          <div class="top">返回顶端</div>
      </BackTop>
  </div>
</template>

<style scoped>
.carlist-page{
    width: 98%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 55px; 
}
.carlist-item{
    margin-top: 10px;
}
.item-image{
    width: 30%;
    height: 82px;
    float: left;
}
.item-image>img{
    width: 120%;
    height: 100%;
}
.item-content{
    width: 70%;
    height: 100%;
    float: right;
    text-align: left;
    margin-top: 3px;
}
.content{
    min-height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-align: left;
    margin-top: 3px;
}
.clear{
    clear: both;
}
.top{
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
}
</style>

<script>
export default {
    data() {
      return {
           carShowlist: []
        }
    },
    created() {
        let _this = this;             
        this.axios({
            method: 'get',
            url: '/carlist',
        }).then(function (response){        
            _this.carShowlist = response.data.carlist;
            console.log(_this.carShowlist);                  
            for(var i = 0; i<_this.carShowlist.length;i++){
                _this.carShowlist[i].carImage = 'data:image/png;base64,' + _this.carShowlist[i].carImage;
            }
        }).catch(function (error){
            if(error){
                throw error;
            }
        })
    }
}
</script>
