<template>
    <div class="signup-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
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
                <Button type="primary" @click="handleSubmit()">提交</Button>
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
    export default {
        data () {
            return {
                formValidate: {
                    name: '',
                    password: '',
                    number: '',
                    phone: '',
                    department: '',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        {required: true, message: '姓名不能为空', trigger: 'blur' }
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
            handleSubmit () {
                let _this = this;
                _this.axios({
                    method: 'post',
                    url: '/register',
                    data: {
                        'name': _this.formValidate.name,
                        'password': _this.formValidate.password,
                        'phone': _this.formValidate.phone,
                        'number': _this.formValidate.number,
                        'department': _this.formValidate.department
                    }
                }).then(function (response){
                    _this.$Message.success('注册成功');
                    setTimeout(function() {
                        _this.$router.push('/'); 
                    }, 1000);
                }).catch(function (error){
                    console.log(error);
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
