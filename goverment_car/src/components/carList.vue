<template>
  <div class="carlist-page">
      <div class="carlist-item" v-for="(item,index) in carlist" :key="index">
          <div class="item-image">
              <img :src="item.src" alt="公车图片">
          </div>
          <div class="item-content">
              <p>姓名：{{item.name}}</p>
              <p>手机：{{item.phone}}</p>
              <p class="content">任务：{{item.content}}</p>
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
    height: 100%;
    float: left;
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
           carlist: [
              {
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              },{
                  'src': '',
                  'name': '钟嘉豪',
                  'phone': '17691159270',
                  'content': '2017年10月8日，驾车前往长安区执行公务，2017年10月8日，驾车前往长安区执行公务'
              }
          ]
        }
    }
}
</script>
