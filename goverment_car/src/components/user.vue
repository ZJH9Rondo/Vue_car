<template>
  <div class="user-page">
      <Card style="width:100%" :bordered="false">
        <div style="text-align:center">
            <img src="">
            <h3>{{userNumber}}</h3>
        </div>
     </Card>
     <Dropdown class="used-list" :transfer="true" trigger="click">
         <div style="height: 20px">
             <p style="float: left;font-size: 14px">用车记录</p>
             <Icon style="float: right" type="chevron-down" :size="20"></Icon>
         </div>
         <DropdownMenu class="item-container" slot="list">
             <div v-for="(item,index) in usedlist" :key="index" class="list-item" >
                 <div class="item-image">
                    <img :src="item.src" alt="">
                </div>
                <div class="item-content">
                    <p>姓名：{{item.name}}</p>
                    <p>联系电话：{{item.phone}}</p>
                    <p class="content">任务：{{item.content}}</p>
                </div>
             </div>
         </DropdownMenu>
     </Dropdown>
     <Dropdown class="using-list" :transfer="true" trigger="click">
         <div style="height: 20px">
             <p style="float: left;font-size: 14px">在用车辆</p>
             <Icon style="float: right" type="chevron-down" :size="20"></Icon>
         </div>
         <DropdownMenu class="item-container" slot="list">
             <div v-for="(item,index) in usinglist" :key="index" class="list-item" >
                 <div class="item-image">
                    <img :src="item.src" alt="">
                </div>
                <div class="item-content">
                    <p class="content">任务：{{item.content}}</p>
                    <Button class="use-finish" type="success" @click="drive_END(item)">结束用车</Button>
                </div>
             </div>
         </DropdownMenu>
     </Dropdown>
     <mt-button class="signout-button"　type="danger" @click="logout">注销</mt-button>
  </div>
</template>

<style scoped>
.user-page{
    width: 95%;
    height: auto;
    min-height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 60px;
}
.used-list,.using-list{
    width: 98%;
    height: 20px;
    
}
.used-list{
    margin-top: 50px;
}
.using-list{
    margin-top: 10px;
}
.item-container{
    clear: both;
    padding-top: 3px;
}
.list-item{
    clear: both;
    width: 97%;
    height: 110px;
    border-bottom: 1px solid #cccccc;
}
.item-image{
    width: 30%;
    height: 100px;
    float: left;
}
.item-content{
    float: right;
    width: 70%;
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
    margin-top: 88%;
}
</style>

<script>
import {Button} from 'mint-ui'

export default {
    conponents: {Button},
    data() {
      return {
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
        }).catch(function (error){
            throw error;
        });

        this.axios({
            method: 'get',
            url: _unfinishURL
        }).then(function (response){
            _this.usinglist = response.data.list;
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
            var drive_endURL = '/usefinish?driveId=' + item.id +'&userNumber=' + window.localStorage.getItem('userNumber');
            this.axios({
                method: 'get',
                url: drive_endURL
            }).then(function (response){
                console.log(response);
            }).catch(function (error){
                throw error;
            });
        }
    }
}
</script>

