<template>
    <div class="signup-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input v-model="formValidate.password" type="password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="passwordCheck">
                <Input v-model="formValidate.passwordCheck" type="password" placeholder="请确认密码"></Input>
            </FormItem>
            <FormItem label="政务编号" prop="number">
                <Input v-model="formValidate.number" placeholder="请输入政务编号"></Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入政务编号"></Input>
            </FormItem>
            <FormItem label="部门" prop="department">
                <Input v-model="formValidate.department" placeholder="请输入政务编号"></Input>
            </FormItem>
            <FormItem class="signup-button">
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>

<style scoped>
.signup-page{
    width: 90%;
    height: 350px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;         
}
.signup-button{
    margin-left: -80px !important;
}
</style>


<script>
    import crypto from 'crypto'

    export default {
        data () {
             let _this = this;
             var validatePass=(rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else {
                        if (_this.formValidate.passwordCheck !== '') {
                            // 对第二个密码框单独验证
                            _this.$refs.formValidate.validateField('passwordCheck');
                        }
                        callback();
                    }
                };
            var validatePassCheck=(rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== _this.formValidate.password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
            };
            return {
                formValidate: {
                    name: '',
                    password: '',
                    passwordCheck: '',
                    number: '',
                    phone: '',
                    department: '',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ],
                    number: [
                        { required: true, message: '编号不能为空', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
                    ],
                    department: [
                        { required: true, message: '请输入部门名称', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                let _this = this;
                let sha1 = crypto.createHash('sha1');

                this.$refs[name].validate((valid)=> {
                    if(valid){
                        _this.axios({
                            method: 'post',
                            url: '/register',
                            data: {
                                'name': _this.formValidate.name,
                                'password': sha1.update(_this.formValidate.password).digest('hex'),
                                'phone': _this.formValidate.phone,
                                'number': _this.formValidate.number,
                                'department': _this.formValidate.department
                            },
                            transformRequest: [function (data) {
                                // Do whatever you want to transform the data
                                let ret = ''
                                for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                }
                                return ret
                            }],
                            headers : {
                                "Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                        }).then(function (response){
                            _this.$Message.success('注册成功');
                            setTimeout(function() {
                                _this.$router.push('/'); 
                            }, 1000);
                        }).catch(function (error){
                            console.log(error);
                        });
                    }else{
                        _this.$Message.success('请确认表单信息格式正确后提交！');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
