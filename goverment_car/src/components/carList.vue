<template>
  <div class="carlist-page">
    <div class="carlist-item" v-for="(item,index) in carShowlist" :key="index" @click="showMap(item)">
        <div class="item-image">
            <img :src="item.carImage" alt="公车图片" />
        </div>
        <div class="item-content">
            <p>姓名：{{item.userName}}</p>
            <p>手机：{{item.userPhone}}</p>
            <p class="content">车辆状态：{{item.carStatus}}</p>
        </div>
        <div class="clear"></div>
    </div>
     <Modal v-model="Mapflag">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-navigate"></Icon>
            <span>车辆当前位置</span>
        </p>
        <div id="carMap"></div>
        <div slot="footer">
            <Button type="warning" long @click="closeMap" style="font-size: 16px">关闭</Button>
        </div>
    </Modal>
    <BackTop :bottom="70">
        <div class="top">返回顶端</div>
    </BackTop>
    <div class="list-refresh" @click="refresh">
        <Icon id="loading" type="load-c" size=35 class="spin-icon-load"></Icon>
        <Icon id="refresh" type="ios-refresh" :size="35" style="float: left"></Icon>
    </div>
  </div>
</template>

<style scoped>
.carlist-page{
    width: 96%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 55px; 
}
.carlist-item{
    margin-top: 10px;
    /* border-bottom: 1px solid rgba(38, 38, 38, 42); */
}
.item-image{
    width: 30%;
    height: 82px;
    float: left;
}
.item-image>img{
    width: 100%;
    height: 100%;
}
.item-content{
    width: 67%;
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
.list-refresh{
    position: fixed;
    bottom: 65px;
    right: 15px;
}
#refresh{
    display: block;
}
#loading{
    display: none;
}
.spin-icon-load{
    width: 35px;
    height: 35px;
    animation: ani-demo-spin 1s linear infinite;
}
#carMap{
    width: 100%;
    height: 250px;
    min-height: 200px;
}
/* 加载动画 */
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>

<script>
export default {
    data() {
      return {
            Mapflag: false,
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

            for(var i = 0; i<_this.carShowlist.length;i++){
                _this.carShowlist[i].carImage = 'data:image/png;base64,' + _this.carShowlist[i].carImage;
                if(_this.carShowlist[i].carStatus){
                    _this.carShowlist[i].carStatus = '可用';
                }else{
                    _this.carShowlist[i].carStatus = '忙碌';
                }
            }
        }).catch(function (error){
            if(error){
                throw error;
            }
        })
    },
    methods: {
        refresh() {
            let _this = this;
            var refreshIcon = document.getElementById('refresh');
            var loadingIcon = document.getElementById('loading');

            refreshIcon.style.display = 'none';
            loadingIcon.style.display = 'block';
            this.axios({
                method: 'get',
                url: '/carlist'
            }).then(function (response){
                refreshIcon.style.display = 'block';
                loadingIcon.style.display = 'none';
                _this.carShowlist = response.data.carlist;
                            
                for(var i = 0; i<_this.carShowlist.length;i++){
                    _this.carShowlist[i].carImage = 'data:image/png;base64,' + _this.carShowlist[i].carImage;

                    if(_this.carShowlist[i].carStatus){
                        _this.carShowlist[i].carStatus = '可用';
                    }else{
                        _this.carShowlist[i].carStatus = '忙碌';
                    }
                }
            }).catch(function (error){
                if(error){
                    throw error;
                }
            });
        },
        showMap(item) {
            let _this = this;
            console.log(item);

            if(item.carStatus === '空闲'){
                this.$Message.success('该车目前可用，无定位信息！');
            }else{
                // 调用百度地图API
                this.Mapflag = true;
                 var map, geolocation;
                //加载地图，调用浏览器定位服务
                map = new AMap.Map('carMap', {
                    resizeEnable: true
                });
                map.plugin('AMap.Geolocation', function() {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition:'RB'
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                });
            }
        },
        closeMap() {
            this.Mapflag = false;
        }
    }
}
</script>
