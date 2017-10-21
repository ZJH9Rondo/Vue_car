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
        <Button class="sign-button" type="primary" @click="handleSubmit()">登录</Button>
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
    import crypto from 'crypto'

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
            handleSubmit() {
              let _this = this;
              let sha1 = crypto.createHash('sha1');
              
              if(this.formInline.user && this.formInline.password){
                    this.axios({
                    method: 'post',
                    url: '/login',
                    data: {
                      user: this.formInline.user,
                      password: sha1.update(_this.formInline.password).digest('hex')
                    }
                  }).then(function (response){
                    _this.$Message.success('登录成功!');
                    window.localStorage.setItem('user_token',response.data.token);
                    window.localStorage.setItem('userNumber',_this.formInline.user);
                    setTimeout(function (){
                        _this.$router.push('/');
                    },1000); 
                  }).catch(function (error){
                    _this.$Message.error('登录失败！');
                  });
                }else{
                  _this.$Message.error('请填写用户名和密码！');
                }
            }
        }
    }
</script>
