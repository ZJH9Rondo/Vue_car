<template>
  <div class="addcar-page">
    <Form :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="车辆拍照">
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
    <Button type="primary" @click="submitCar" style="width: 94%;font-size: 15px">注册车辆</Button>
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
    width: 100%;
    height: 100%;
    margin-left: 0;
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
            var _cameraInput = document.createElement('input');
            var _this = this;

            _cameraInput.id = 'drive_camera';
            _cameraInput.type = 'file';
            _cameraInput.accept = 'image/*';
            _cameraInput.capture = 'camera';
            
            _cameraInput.addEventListener('change',function (event){
                var _canvas = document.getElementById('caradd_canvas'),
                    _photoIcon = document.getElementById('photo-icon'),
                    _canvasContainer = document.getElementsByClassName('canvas-container'),
                    e = event || window.event;
                
                var files = e.target.files;
                _photoIcon.style.display = 'none';
                _canvasContainer[0].style.backgroundColor = 'white';

                if(files && files.length>0){
                    var file = files[0],
                        img = new Image();
                    
                    /*
                    * 防止浏览器不支持　fileReader方法 
                    */
                    try{
                        // get window.URL object                            
                            var URL = window.URL || window.webkitURL,
                                imgURL = URL.createObjectURL(file);
                            
                            img.src = imgURL;
                            img.onload = function (){
                                _canvas.getContext('2d').drawImage(img,0,0,350,150);
                                _this.$Message.success('照片提交成功！');                                
                                _this.formItem.carImage = _canvas.toDataURL().substr(22);
                            }
                    }catch(e){
                        try{
                            var fileReader = new fileReader();

                                fileReader.onload = function (event){
                                    var e = event || window.event;

                                    img.src = e.target.result;
                                    _canvas.getContext('2d').drawImage(img,0,0,350,150);
                                    _this.$Message.success('照片提交成功！');                                    
                                    _this.formItem.carImage = _canvas.toDataURL().substr(22);
                                }
                                fileReader.readAsDataURL(file);
                        }catch(e){
                            _this.$Message.error('浏览器不支持，请更换浏览器访问操作！');
                        }
                    }
                }
            },false);

            this.$Message.warning('正在打开摄像头...');                                    
            setTimeout(function() {
                _cameraInput.click();
            }, 1000);
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
