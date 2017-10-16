<template>
  <div class="user-page">
     <div class="user-title">
        <img class="user-front" src="../assets/userfront.png" alt="">
        <h3 class="user-number">{{userNumber}}</h3>
     </div>
     <div class="user-menu">
         <div class="choose-item" @click="usedflag = true">
            <p>
                <Icon type="clipboard" :size="24" color="#26A2FF"></Icon>
                <span style="margin-left: 5px">用车记录</span>
            </p>
            <Icon type="chevron-right" class="choose-item-icon" :size=" 16"/>
            <div></div>
         </div>
         <Modal title="用车历史记录" v-model="usedflag" :mask-closable="false"  class-name="vertical-center-modal"> 
            <div class="list-container">
                <div v-for="(item,index) in usedlist" :key="index" class="list-item" >
                <div class="item-image">
                    <img :src="item.carImage" alt="">
                </div>
                <div class="item-content">
                    <p class="content">任务：{{item.task}}</p>
                </div>
            </div>
            </div>
         </Modal>
         <div class="choose-item" @click="usingflag = true">
             <p>
                <Icon type="clock" :size="23" color="#26A2FF"></Icon>
                <span style="margin-left: 2px">在用车辆</span>    
            </p>
             <Icon type="chevron-right" class="choose-item-icon" :size=" 16"/>
             <div></div>
         </div>
         <Modal title="正在使用车辆" v-model="usingflag" :mask-closable="false"  class-name="vertical-center-modal">
             <div class="list-container">
                <div v-for="(item,index) in usinglist" :key="index" class="list-item" >
                    <div class="item-image">
                        <img :src="item.carImage" alt="">
                    </div>
                    <div class="item-content">
                        <p class="content">任务：{{item.task}}</p>
                        <Button class="use-finish" type="success" @click="drive_END(item)">结束用车</Button>
                    </div>
                </div>
             </div>
         </Modal>
     </div>
     <mt-button class="signout-button"　type="danger" @click="logout">注销</mt-button>
  </div>
</template>

<style scoped>
.user-page{
    width: 100%;
    height: auto;
    min-height: 100%;
    margin-top: 0 !important;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 60px;
}
.user-title{
    width: 100%;
    height: 180px;
    background: #26A2FF;
}
.user-number{
    font-size: 22px;
    margin-top: 10px;
    color: white;
}
.user-front{
    width: 80px;
    height: 80px;
    margin-top: 20px;
}
.user-menu{
    width: 98%;
    height: auto;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
}
.list-container{
    width: 100%;
    height: auto;
    max-height: 300px;
    overflow-y: scroll;
}
.choose-item{
    width: 100%;
    height: 40px;
}
.choose-item>p{
    float: left;
    font-size: 17px;
    padding-left: 10px;
}
.choose-item-icon{
    float: right;
    margin-right: 10px;
}
.choose-item>div{
    clear: both;
}
.list-item{
    clear: both;
    width: 97%;
    height: 110px;
}
.item-image{
    width: 40%;
    height: 100px;
    float: left;
}
.item-image>img{
    width: 100%;
    height: 100%;
}
.item-content{
    float: right;
    width: 60%;
    height: 100px;
    margin-bottom: 5px;
}
.item-content>p{
    text-align: left;
    margin-top: 3px;
    margin-left: 5px;
    height: auto;
}
.content{
    height: auto;
    min-height: 40px !important;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.use-finish{
    width: 90%;
    height: 35px;
    margin-top: 10px;
    margin-left: 5px;
}
.signout-button{
    width: 99%;
    height: 40px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60%;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
}
.vertical-center-modal>.ivu-modal{
    top: 0;
}
</style>

<script>
import {Button} from 'mint-ui'

export default {
    conponents: {Button},
    data() {
      return {
          value: '2',
          usedflag: false,
          usingflag: false,
          userNumber: window.localStorage.getItem('userNumber'),
          usedlist: [],
          usinglist: []
      }
    },
    created(){
        var _finishURL = '/finishlist?userNumber=' + window.localStorage.getItem('userNumber');
        var _unfinishURL = '/unfinishlist?userNumber=' + window.localStorage.getItem('userNumber');
        var _this = this;

        this.axios({
            method: 'get',
            url: _finishURL
        }).then(function (response){
            _this.usedlist = response.data.list;
            for(var i=0;i < _this.usedlist.length;i++){
                _this.usedlist[i].carImage ='data:image/png;base64,' + _this.usedlist[i].carImage;
            }
        }).catch(function (error){
            throw error;
        });

        this.axios({
            method: 'get',
            url: _unfinishURL
        }).then(function (response){
            _this.usinglist = response.data.list;
            for(var i=0;i <_this.usinglist.length;i++){
                _this.usinglist[i].carImage ='data:image/png;base64,' + _this.usinglist[i].carImage;  
           }
        }).catch(function (error){
            throw error;
        });
    },
    methods: {
        logout() {
            window.localStorage.removeItem('user_token');
            window.localStorage.removeItem('userNumber');
            this.$router.push('/signin');
        },
        drive_END(item) {
            console.log(item);
            var drive_endURL = '/usefinish?driveId=' + item._id +'&userNumber=' + item.userNumber;
            var _this = this;

            this.axios({
                method: 'get',
                url: drive_endURL
            }).then(function (response){
                if(response.data.status){
                    _this.$Message.success('操作成功！');
                }else{
                    _this.$Message.error('操作失败！');
                }
            }).catch(function (error){
                throw error;
            });
        }
    }
}
</script>

