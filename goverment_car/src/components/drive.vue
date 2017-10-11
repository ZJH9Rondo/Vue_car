<template>
    <div class="drive-page">
        <Card style="width:100%"　:bordered="false">
            <div style="text-align:center">
                <img src="" alt="">
                <h3>用车登记</h3>
            </div>
        </Card>
        <Form :model="formItem" :label-width="80">
            <FormItem label="车辆拍照：">
                <Modal title='拍照' v-model="videoflag" @on-ok="ok" @on-cancel="cancel" ok-text="拍照">
                    <video id="drive_video" autoplay></video>
                </Modal>
                <canvas id="drive_canvas"></canvas>
                <Button type="warning" @click="useCamera" style="width: 75%">启动摄像头</Button>
            </FormItem>
            <FormItem label="日期控件：">
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
                <Input v-model="formItem.userlocation" icon="location" style="width: 80%"></Input>
                <i-switch v-model="formItem.switch"　@on-change="getlocation">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <FormItem label="出行任务：">
                <Input v-model="formItem.task" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请输入公车出行任务..."></Input>
            </FormItem>
        </Form>
        <Button type="primary" @click="submitDrive">提交</Button>
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
}
#drive_video{
    width: 100%;
    height: 250px;
}
#drive_canvas{
    width: 90%;
    height: 150px;
    margin-left: 35px;
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
                useTime: [],
                carNumber: '',                
                userlocation: '经度：0，纬度：0',
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
        ok() {
            var aVideo=document.getElementById('drive_video');
            var aCanvas=document.getElementById('drive_canvas');
            var ctx=aCanvas.getContext('2d');

            ctx.drawImage(aVideo, 0, 0,200,150);//将获取视频绘制在画布上
            this.formItem.carImage = aCanvas.toDataURL('image/png').substr(22);           
        },
        cancel() {
            this.videoflag = false;
        },
        useCamera() {
            var aVideo=document.getElementById('drive_video');
            var aCanvas=document.getElementById('drive_canvas');
            var ctx=aCanvas.getContext('2d');
            var _this = this;

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
                _this.$Message.success('摄像头成功打开！');
                };
            }
            function noStream(err) {
                _this.$Message.error(err);
            }
        },
        getlocation() {
            var _this = this;

            if(navigator.geolocation && _this.formItem.switch){
                _this.$Message.success('定位功能已打开！');                
                navigator.geolocation.getCurrentPosition(function (position){
                    alert(position.coords);
                    _this.formItem.userlocation = '经度：'+position.coords.longitude+'，纬度：'+position.coords.latitude;
                });
            }else{
                _this.$Message.error('定位功能已关闭！');
            }
        },
        submitDrive() {
            let _this = this;
            if(window.localStorage.getItem('userNumber')){
                this.axios({
                method: 'post',
                url: '/drive',
                data: {
                    carImage: this.formItem.carImage,
                    userNumber: window.localStorage.getItem('userNumber'),
                    useTime: [this.formItem.useTime[0],this.formItem.useTime[1]],
                    userLocation: this.formItem.userLocation,
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
