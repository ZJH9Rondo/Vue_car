<template>
  <div class="sign-page">
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
         <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button class="sign-button" type="primary" @click="handleSubmit('formInline')">登录</Button>
      </FormItem>
    </Form>
    <p class="signup-box">
      <router-link to="/signup">
        <a>还没有账号？去注册</a>
      </router-link>
    </p>
  </div>
</template>

<style scoped>
  .sign-page{
    width: 80%;
    height: 300px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .sign-input{
    height: 50px;
  }
  .sign-button{
    width: 100%;
    height: 40px;
  }
  .signup-box{
    height: 20px;
  }
</style>

<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('登录成功!');
                    } else {
                        this.$Message.error('请查证账号密码后登录!');
                    }
                })
            }
        }
    }
</script>
