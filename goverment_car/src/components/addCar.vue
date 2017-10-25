<template>
  <div class="addcar-page">
    <Form :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="车辆拍照">
            <div class="canvas-container">
                <img id="photo-icon" src="../assets/camera.png">
                <img id="compress_IMG">
            </div>
            <div style="width: 90%;margin-top: 10px;position: relative">
                <Button type="warning" style="width: 100%">启动摄像头</Button>
                <input type="file" accept="image/*" id="photo" @click="useCamera">
            </div>
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
#photo{
    opacity: 0;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}
#photo-icon{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0; 
    right: 0; 
    margin: auto;
}
#compress_IMG{
    width: 100%;
    height: 100%;
    margin-left: 0;
}
</style>

<script>
import lrz from 'lrz'

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
  },
  methods: {
      useCamera() {
            var _this = this;
            
            document.getElementById('photo').addEventListener('change',function (){
                var _compressIMG = document.getElementById('compress_IMG'),
                    _photoIcon = document.getElementById('photo-icon'),
                    _canvasContainer = document.getElementsByClassName('canvas-container'),
                    that = this;

                _photoIcon.style.display = 'none';
                _canvasContainer[0].style.backgroundColor = 'white';
                
                if(that.files[0]){
                    _this.$Message.success('正在处理图片...');                        
                    lrz(that.files[0],{width: 500}).then(function (rst){
                        _compressIMG.src = rst.base64;
                        _this.formItem.carImage = rst.base64;
                        setTimeout(function() {
                            _this.$Message.success('照片提交成功！');  
                        }, 500);  
                    }).catch(function (e){
                        _this.$Message.error('上传失败！');
                    });
                       
                }else{
                    _this.$Message.error('获取图片失败！请重试。');
                }
            },false);

            this.$Message.warning('正在打开摄像头...');   
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
