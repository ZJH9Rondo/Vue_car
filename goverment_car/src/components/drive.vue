<template>
    <div class="drive-page">
        <h2>用车登记</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="margin-top: 10px">
            <FormItem label="拍照：" style="margin-top: 10px" prop="carImage">
                <div class="canvas-container">
                    <img id="photo-icon" src="../assets/camera.png">
                    <canvas id="drive_canvas"></canvas>
                </div>
                <Button type="warning" @click="takePhoto" style="width: 90%;font-size: 14px;margin-top: 10px;margin-left: -26px">启动摄像头</Button>
            </FormItem>
            <FormItem label="时间段：">
                <Row>
                   <Col span="12">
                     <DatePicker v-model="formValidate.useTime" type="daterange" :options="options2" placement="top-end" placeholder="用车时间" style="width: 200px"></DatePicker>
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
#photo-icon{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0; 
    right: 0; 
    margin: auto;
}
#drive_canvas{
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
                carImage: [
                    { required: true, message: '请拍摄照片并上传', trigger: 'blur' }
                ],
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
            options1: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                return new Date();
                            },
                            onClick: (picker) => {
                                this.$Message.info('点击了今天');
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                return date;
                            },
                            onClick: (picker) => {
                                this.$Message.info('点击了昨天');
                            }
                        },
                        {
                            text: '一周前',
                            value () {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                return date;
                            },
                            onClick: (picker) => {
                                this.$Message.info('点击了一周前');
                            }
                        }
                    ]
                },
                options2: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近三个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                }
        }
    },
    methods:{
        takePhoto() {
            var _cameraInput = document.createElement('input');
            var _this = this;

            _cameraInput.id = 'drive_camera';
            _cameraInput.type = 'file';
            _cameraInput.accept = 'image/*';
            _cameraInput.capture = 'camera';
            
            _cameraInput.addEventListener('change',function (event){
                var _canvas = document.getElementById('drive_canvas'),
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
                                _this.formValidate.carImage = _canvas.toDataURL();
                            }
                    }catch(e){
                        try{
                            var fileReader = new fileReader();

                                fileReader.onload = function (event){
                                    var e = event || window.event;

                                    img.src = e.target.result;
                                    _canvas.getContext('2d').drawImage(img,0,0,350,150);
                                    _this.$Message.success('照片提交成功！');                                    
                                    _this.formValidate.carImage = _canvas.toDataURL();
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
                    console.log('111');
                    if(window.localStorage.getItem('userNumber')){
                        this.axios({
                        method: 'post',
                        url: '/drive',
                        data: {
                            carImage: this.formValidate.carImage,
                            userNumber: window.localStorage.getItem('userNumber'),
                            useTime: [this.formValidate.useTime[0],this.formValidate.useTime[1]],
                            userLocation: _userlocation,
                            carNumber: this.formValidate.carNumber,   
                            task: this.formValidate.task,
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
