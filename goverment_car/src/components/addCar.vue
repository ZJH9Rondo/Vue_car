<template>
  <div class="addcar-page">
    <Form :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="车辆拍照">
            <div class="canvas-container">
                <img id="photo-icon" src="../assets/camera.png">
                <img id="compress_IMG">
            </div>
            <div style="width: 90%;margin-top: 10px;position: relative">
                <Button type="warning" style="width: 100%;font-size: 14px">启动摄像头</Button>
                <input type="file" accept="image/*" id="photo" @click="useCamera">
            </div>
        </FormItem>
        <FormItem label="车牌号：" prop="carNumberCheck">
            <Input v-model="formItem.carNumber" type="text" placeholder="公车车牌"></Input>
        </FormItem>
        <FormItem label="车牌号(新)：" prop="carNumberCheck">
            <Input v-model="formItem.newCarNumber" type="text" placeholder="更改车牌"></Input>
        </FormItem>
    </Form>
    <Button type="primary" @click="submitCar" style="width: 95%;font-size: 15px;letter-spacing: 3px">注册车辆</Button>
    <Button type="primary" @click="updateCar" style="width: 95%;font-size: 15px;margin-top: 10px;letter-spacing: 3px">更新车辆</Button>
    <Button type="error" @click="removeCar" style="width: 95%;font-size: 15px;margin-top: 10px;letter-spacing: 3px">删除车辆</Button>
    <Modal v-model="updateTipe"  :closable="false" :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>提交更改</span>
        </p>
        <div style="text-align:center">
            <p class="tipsContent">请确定您已填写原车牌号，新车牌号，以及需要更新的车辆照片信息，如确认无误您即可提交更新信息！</p>               
        </div>
        <div slot="footer">
            <Button type="success" size="large" long @click="update" style="letter-spacing: 5px;font-size: 16px">确定</Button>
        </div>
    </Modal> 
    <Modal v-model="removeTipe"  :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除车辆</span>
        </p>
        <div style="text-align:center">
            <p style="text-align: left;font-size: 14px;margin-top: 10px;margin-bottom: 10px;">请输入待删除车牌号：</p>
            <Input v-model="formItem.removeCarNumber" type="text" placeholder="待删除车牌号" prop="carNumberCheck"></Input>        
        </div>
        <div slot="footer">
            <Button type="warning" size="large" long @click="remove" style="letter-spacing: 5px;font-size: 16px">确定提交</Button>
        </div>
    </Modal>       
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
.tipsContent{
    text-align: left;
    font-size: 14px;
    text-indent: 20px;
    letter-spacing: 1px;
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
          updateTipe: false,
          removeTipe: false,
          formItem: {
              carImage: '',
              carNumber: '',
              newCarNumber: '',
              removeCarNumber: ''
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

           if(this.formItem.carNumber === '' || this.formItem.carImage === ''){
               _this.$Message.error('请上传车辆照片并填写车牌号！');
           }else{
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
            });
           }
        }, 
        updateCar() {
            this.updateTipe = true;
        },
        update() {
            let _this = this;
            _this.updateTipe = false;

            if(this.formItem.carImage === '' || this.formItem.carNumber === '' || this.formItem.newCarNumber === ''){
                _this.$Message.error('请填写必要信息！');
            }else{
                this.axios({
                    method: 'post',
                    url: '/updatecar',
                    data: {
                        carImage: _this.formItem.carImage,
                        carNumber: _this.formItem.carNumber,
                        newCarNumber: _this.formItem.newCarNumber
                    }
                }).then(function (response){
                    switch (response.data.status) {
                        case 1:
                            _this.$Message.success('车辆信息更改成功！');
                            setTimeout(function (){
                                _this.$router.push('/');
                            },500);
                            break;
                        case 0:
                            _this.$Message.error('车辆信息更改失败，请重试！');
                            setTimeout(function (){
                                _this.$router.push('/user');
                            },500);
                            break;
                        case -1:
                            _this.$Message.error('车辆不存在！请确认车牌填写无误。');
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        removeCar() {
            this.removeTipe = true;
        },
        remove() {
            let _this = this;

            this.removeTipe = false;

            if(_this.formItem.removeCarNumber === ''){
                _this.$Message.error('请填写待删除车牌号！');
            }else{
                var _url = '/removecar?removeCarNumber=' + _this.formItem.removeCarNumber;
                this.axios({
                    method: 'get',
                    url: _url
                }).then(function (response){
                    switch (response.data.status) {
                        case 1:
                             _this.$Message.success('删除车辆成功！');
                            setTimeout(function() {
                                _this.$router.push('/');    
                            }, 500);
                            break;
                        case 0:
                            _this.$Message.error('车牌号错误，车辆不存在！');
                            break;
                        case -1:
                            _this.$Message.error('删除失败，请重试！');  
                            break;                                                      
                        default:
                            break;
                    }
                });
            }
        }
  }
}
</script>
