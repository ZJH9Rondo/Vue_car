<template>
  <div class="addcar-page">
    <Form :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="车辆拍照">
            <Modal title="拍照"　v-model="videoflag" @on-ok="ok" @on-cancel="cancel" ok-text="拍照" :closable="false">
                <video id="caradd_video" autoplay></video>    
            </Modal>
            <div class="canvas-container">
                <img id="photo-icon" src="../assets/camera.png">
                <canvas id="caradd_canvas"></canvas>
            </div>
            <Button type="warning" style="width: 90%;font-size: 14px;margin-top: 10px;margin-left: -26px" @click="useCamera">启动摄像头</Button>
        </FormItem>
        <FormItem label="车牌号：" prop="carNumberCheck">
            <Input v-model="formItem.carNumber" type="text" placeholder="公车车牌"></Input>
        </FormItem>
    </Form>
    <Button type="primary" @click="submitCar" style="width: 98%;font-size: 15px">注册车辆</Button>
  </div>
</template>

<style scoped>
.addcar-page{
    width: 95%;
    height: auto;
    min-height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 70px !important;
    margin-bottom: 80px;
}
#caradd_video{
    width: 100%;
    height: 250px;
}
.canvas-container{
    width: 90%;
    height: 150px;
    position: relative;
    background-color: rgba(39, 40,34, 0.4);
    border: 1px solid #cccccc;;
    border-radius: 8px;
}
#photo-icon{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0; 
    right: 0; 
    margin: auto;
}
#caradd_canvas{
    width: 90%;
    height: 150px;
    margin-left: 35px;
}
</style>

<script>
export default {
  data() {
      let _this = this;
      var checkCarNumber = (rule,value,callback) => {
          if(value === ''){
              callback(new Error('请输入车牌号'));
          }else{
              var partern = /^[0-9a-zA-Z]{5}$/;
              if(!partern.test(_this.formItem.carNumber)){
                  callback(new Error('车牌号格式错误'));
              }else{
                  callback();
              }
          }
      };

      return {
          videoflag: false,
          formItem: {
              carImage: '',
              carNumber: ''
          },
          ruleValidate: {
              carNumberCheck: [
                  {validator: checkCarNumber , trigger: 'blur'}
              ]
          }
      }
  },methods: {
      useCamera() {
            var aVideo=document.getElementById('caradd_video');
            var aCanvas=document.getElementById('caradd_canvas');
            var ctx=aCanvas.getContext('2d');
            
            this.videoflag = true;
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
        ok() {
            var aVideo=document.getElementById('caradd_video');
            var aCanvas=document.getElementById('caradd_canvas');
            var ctx=aCanvas.getContext('2d');

            ctx.drawImage(aVideo, 0, 0,200,150);//将获取视频绘制在画布上
            this.formItem.carImage = aCanvas.toDataURL('image/png').substr(22);            
        },
        cancel() {
            this.videoflag = false;
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
