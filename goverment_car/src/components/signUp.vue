<template>
    <div class="signup-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="政务编号" prop="number">
                <Input v-model="formValidate.number" placeholder="请输入政务编号"></Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入政务编号"></Input>
            </FormItem>
            <FormItem label="介绍" prop="desc">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
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
    export default {
        data () {
            return {
                formValidate: {
                    name: '',
                    number: '',
                    phone: '',
                    desc: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: '编号不能为空', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                        this.$router.push('/');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
