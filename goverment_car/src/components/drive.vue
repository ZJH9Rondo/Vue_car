<template>
    <div class="drive-page">
        <h2>用车登记</h2>
        <Form :model="formItem" :label-width="80" style="margin-top: 10px">
            <FormItem label="车辆拍照：" style="margin-top: 10px">
                <div class="canvas-container">
                    <img id="photo-icon" src="../assets/camera.png">
                    <canvas id="drive_canvas"></canvas>
                </div>
                <Button type="warning" @click="takePhoto" style="width: 90%;font-size: 14px;margin-top: 10px;margin-left: -26px">启动摄像头</Button>
            </FormItem>
            <FormItem label="使用日期：">
                <Row>
                   <Col span="12">
                     <DatePicker v-model="formItem.useTime" type="daterange" :options="options2" placement="top-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                   </Col>
                </Row>
            </FormItem>
            <FormItem label="车牌号：">
                <Input v-model="formItem.carNumber" type="text" placeholder="公车车牌"></Input>
            </FormItem>
            <FormItem label="用车定位：">
                <Input v-model="formItem.userlocation" icon="location" style="max-width: 80%"></Input>
                <i-switch v-model="formItem.switch"　@on-change="getlocation">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <div class="map-container">
                    <img src="../assets/Map.png" id="location-icon">
                    <div id="driveMap"></div>
                </div>
            </FormItem>
            <FormItem label="出行任务：">
                <Input v-model="formItem.task" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请输入公车出行任务..."></Input>
            </FormItem>
        </Form>
        <Button type="primary" long style="font-size: 16px" @click="submitDrive">提交</Button>
    </div>
</template>

<style scoped>
.drive-page{
    width: 95%;
    height: auto;
    min-height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0 !important;
    margin-bottom: 80px;
    padding-top: 20px; 
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
        return {
            videoflag: false,
            formItem: {
                switch: false,
                carImage: '',
                useTime: '使用时间',
                carNumber: '',                
                userlocation: '出发位置',
                task: ''
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
                                _this.formItem.carImage = _canvas.toDataURL();
                            }
                    }catch(e){
                        try{
                            var fileReader = new fileReader();

                                fileReader.onload = function (event){
                                    var e = event || window.event;

                                    img.src = e.target.result;
                                    _canvas.getContext('2d').drawImage(img,0,0,350,150);
                                    _this.$Message.success('照片提交成功！');                                    
                                    _this.formItem.carImage = _canvas.toDataURL();
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
            var _mapContainer = document.getElementsByClassName('map-container');

            _mapContainer[0].style.border = '0';
            if(_this.formItem.switch){
                var map,
                    geolocation,
                    location_icon = document.getElementById('location-icon');

                location_icon.style.display = 'none';
                //解析定位结果
                function onComplete(data) {
                    _this.formItem.userlocation = data.position.getLng() + '；' + data.position.getLat();
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
                
            }
        },
        submitDrive() {
            let _this = this;
            let _userlocation = this.formItem.userlocation.split('；');    

            if(window.localStorage.getItem('userNumber')){
                this.axios({
                method: 'post',
                url: '/drive',
                data: {
                    carImage: this.formItem.carImage,
                    userNumber: window.localStorage.getItem('userNumber'),
                    useTime: [this.formItem.useTime[0],this.formItem.useTime[1]],
                    userLocation: _userlocation,
                    carNumber: this.formItem.carNumber,   
                    task: this.formItem.task,
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
    }
}   
</script>
