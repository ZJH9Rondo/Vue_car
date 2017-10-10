<template>
  <div class="addcar-page">
    <Form :model="formItem" :label-width="80">
        <FormItem label="车辆拍照">
            <video id="drive_video" autoplay></video>
            <canvas id="drive_canvas"></canvas>
            <Button type="warning" @click="useCamera">启动摄像头</Button>
            <Button type="primary" @click="getPhoto">拍照</Button>
        </FormItem>
        <FormItem label="车牌号：">
            <Input v-model="formItem.carNumber" type="text" placeholder="公车车牌" style="width: 80%"></Input>
        </FormItem>
    </Form>
    <Button type="primary" @click="submitCar">提交</Button>
  </div>
</template>

<style scoped>
.addcar-page{
    width: 95%;
    height: auto;
    min-height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0 !important;
    margin-bottom: 80px;
}
#drive_video{
    width: 100%;
    height: 150px;
    border: 1px solid #cccccc;
}
#drive_canvas{
    width: 90%;
    height: 150px;
    margin-left: 35px;
}
</style>

<script>
export default {
  data() {
      return {
          formItem: {
              carImage: '',
              carNumber: ''
          }
      }
  },methods: {
      useCamera() {
            var aVideo=document.getElementById('drive_video');
            var aCanvas=document.getElementById('drive_canvas');
            var ctx=aCanvas.getContext('2d');
            
            navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;//获取媒体对象（这里指摄像头）
            navigator.getUserMedia({video:true}, gotStream, noStream);//参数1获取用户打开权限；参数二成功打开后调用，并传一个视频流对象，参数三打开失败后调用，传错误信息
            
            function gotStream(stream) {
                aVideo.src = URL.createObjectURL(stream);
                aVideo.onerror = function () {
                stream.stop();
                };
                stream.onended = noStream;
                aVideo.onloadedmetadata = function () {
                this.$Message.success('摄像头成功打开！');
                };
            }
            function noStream(err) {
                this.$Message.error(err);
            }
        },
        getPhoto() {
            var aVideo=document.getElementById('drive_video');
            var aCanvas=document.getElementById('drive_canvas');
            var ctx=aCanvas.getContext('2d');

            ctx.drawImage(aVideo, 0, 0,200,150);//将获取视频绘制在画布上
            this.formItem.carImage = aCanvas.toDataURL('image/png').substr(22);            
        },
        submitCar(){
            let _this = this;

            this.axios({
                method: 'post',
                url: '/addcar',
                data: {
                    carImage: _this.formItem.carImage,
                    carNumber: _this.formItem.carNumber
                }
            }).then(function(response) {
                if(response.data.status){
                    _this.$Message.success('注册车辆成功！');
                    setTimeout(function (){
                        _this.$router.push('/');
                    },1000);
                }else{
                    _this.$Message.error('注册车辆失败,请确认用户登录信息无误！');
                    setTimeout(function (){
                        _this.$router.push('/user');
                    },1000);
                }
            })
        }
  }
}
</script>
