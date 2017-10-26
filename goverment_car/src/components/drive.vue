<template>
    <div class="drive-page">
        <h2>用车登记</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="margin-top: 10px">
            <FormItem label="拍照：" style="margin-top: 10px">
                <div class="canvas-container">
                    <img id="photo-icon" src="../assets/camera.png">
                    <img id="compress_IMG">
                </div>
                <div style="width: 90%;margin-top: 10px;position: relative">
                    <Button type="warning" style="width: 100%;font-size: 14px">启动摄像头</Button>
                    <input type="file" accept="image/*" id="photo" @click="takePhoto">
                </div>
            </FormItem>
            <FormItem label="还车时间：">
                <Row>
                   <Col span="12">
                        <DatePicker v-model="formValidate.useTime" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                   </Col>
                </Row>
            </FormItem>
            <FormItem label="车牌号：" prop="carNumber">
                <Input v-model="formValidate.carNumber" type="text" placeholder="公车车牌"></Input>
            </FormItem>
            <FormItem label="车辆定位：" prop="userlocation">
                <Input v-model="formValidate.userlocation" icon="location" style="max-width: 80%"></Input>
                <i-switch v-model="formValidate.switch"　@on-change="getlocation">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <div class="map-container">
                    <img src="../assets/Map.png" id="location-icon">
                    <div id="driveMap"></div>
                </div>
            </FormItem>
            <FormItem label="任务：" prop="task">
                <Input v-model="formValidate.task" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请登记公车出行任务..."></Input>
            </FormItem>
            <Button type="primary" long style="font-size: 16px" @click="handleSubmit('formValidate')">提交</Button>
        </Form>
        <Modal v-model="driveTips"  :closable="false" :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>登记使用说明</span>
            </p>
            <div style="text-align:center">
                <p class="tipsContent">1.公车使用登记时，请点击橙色按钮打开摄像头对此次使用的公务车正前方，镜头中必须出现尽可能清楚的车牌号，拍照并上传（上传：即手机拍照完后选择使用该照片即可）。</p>
                <p class="tipsContent">2.时间填写选择为本次使用的起始与截止时间段，车牌号填写公务车车牌号只填写后五位，不包括所在地。</p>
                <p class="tipsContent">3.车辆定位点击右侧滑块，即可打开，由于兼容性问题，请您务必打开手机端GPS定位，并且在用车期间保持GPS开启<span style="color: red">（非必要）</span>和移动网络畅通<span style="color: red">（必要）</span>，保证机关对该车辆的正常监管，此过程数据只关系定位功能，不涉及数据采集和隐私，请勿担心。</p>
                <p class="tipsContent">4.任务描述填写本次公务车使用的任务及前往地点，以便后期监管核查，谢谢合作。</p>                
            </div>
            <div slot="footer">
                <Button type="success" size="large" long :loading="modal_loading" @click="driveTips=false">我已阅读</Button>
            </div>
        </Modal>
    </div>
</template>

<style scoped>
.drive-page{
    width: 96%;
    height: auto;
    min-height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0 !important;
    margin-bottom: 80px;
    padding-top: 20px; 
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
    border: 1px solid #cccccc;
    background-color: rgba(39, 40,34, 0.4);
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
.map-container{
    width: 100%;
    height: 150px;
    margin-top: 5px;
    position: relative;
    border: 1px solid #cccccc;
    border-radius: 8px;
    background-color: rgba(39, 40,34, 0.2);
}
#location-icon{
   position: absolute;
    top: 0;
    left: 0;
    bottom: 0; 
    right: 0; 
    margin: auto;
}
#driveMap{
    width: 100%;
    height: 100%;
    margin-top: 5px;
}
</style>

<script>
// import compress from '../../static/js/compress'
import lrz from 'lrz'

 export default {
    data () {
        var checkCarNumber = (rule, value, callback) => {
            var _url = '/checkCarNumber?carNumber=' + value,
                _this = this;

            this.axios({
                method: 'get',
                url: _url
            }).then(function (response){
                if(!response.data.status){
                    callback(new Error('车牌号不存在，请确认！'));
                }else{
                    callback();
                }
            }).catch(function (error){
                throw error;
            });
        };
        return {
            videoflag: false,
            driveTips: true,
            formValidate: {
                switch: false,
                carImage: '',
                useTime: '使用时间',
                carNumber: '',                
                userlocation: '出发位置',
                task: ''
            },
            ruleValidate: {
                // carImage: [
                //     { required: true, message: '请拍摄照片并上传', trigger: 'blur' }
                // ],
                carNumber: [
                    { required: true, validator: checkCarNumber ,trigger: 'blur' }
                ],
                userLocation: [
                    { required: true, message: '请定位当前用车位置',trigger: 'blur' }
                ],
                task: [
                    { required: true, message: '请定位当前用车位置',trigger: 'blur' }                    
                ]
            },
        }
    },
    methods:{
        takePhoto() {
            var  _this = this;
            
            document.getElementById('photo').addEventListener('change',function () {
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
                        _this.formValidate.carImage = rst.base64;
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
        getlocation() {
            var _this = this;
            var _mapContainer = document.getElementsByClassName('map-container'),
                 location_icon = document.getElementById('location-icon');

            _mapContainer[0].style.border = '0';
            if(_this.formValidate.switch){
                var map,
                    geolocation;

                location_icon.style.display = 'none';
                //解析定位结果
                function onComplete(data) {
                    _this.formValidate.userlocation = data.position.getLng() + '；' + data.position.getLat();
                    _this.$Message.success('定位成功！');
                }
                //解析定位错误信息
                function onError(data) {
                    _this.$Message.error('定位失败！');
                }
                //加载地图，调用浏览器定位服务
                map = new AMap.Map('driveMap', {
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
                    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                });
            }else{
                _this.$Message.error('定位已关闭！');
            }
        },
        handleSubmit(name) {
            let _this = this,
                _userlocation = this.formValidate.userlocation.split('；');

            this.$refs[name].validate((valid) => {
                if(valid){
                    if(window.localStorage.getItem('userNumber')){
                        this.axios({
                            method: 'post',
                            url: '/drive',
                            data: {
                                carImage: _this.formValidate.carImage,
                                userNumber: window.localStorage.getItem('userNumber'),
                                useTime: _this.formValidate.useTime,
                                userLocation: _userlocation,
                                carNumber: _this.formValidate.carNumber,   
                                task: _this.formValidate.task,
                                useStatus: false   
                            }
                    }).then(function (response){
                            switch(response.data.status){
                                case 1 :  _this.$Message.success('登记成功！');                        
                                            setTimeout(function() {
                                                _this.$router.push('/carlist');
                                            }, 1000);
                                            break;
                                case 0 :  _this.$Message.error('登记失败！请重新登记。');
                                            setTimeout(function() {
                                                _this.$router.push('/drive');
                                            }, 1000);
                                            break;
                                case -1:  _this.$Message.error('车辆已被借用！请更换车辆或联系使用者。');
                                            setTimeout(function() {
                                                _this.$router.push('/carlist');    
                                            }, 1000);
                                            break;
                                default  :  break;
                            };
                        }).catch(function (error){
                            if(error){
                                throw error;
                            }
                        });
                    }else{
                        window.localStorage.removeItem('user_token');
                        this.$router.push('/signin');
                    }
                }
            });
        }
    }
}   
</script>
