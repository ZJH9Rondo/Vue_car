<template>
  <div class="sign-page">
    <Tabs value="name1">
        <TabPane label="普通用户" name="name1" icon="person-stalker">
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="user">
              <Input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password" class="inputItem">
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
              <a>注册账号</a>
            </router-link>
            <span style="border: 1px solid #cccccc;width: 0px;height: 1px;margin-right: 5px"></span>
            <router-link to="/changePwd">
              <a>修改密码</a>
            </router-link>
          </p>
        </TabPane>
        <TabPane label="管理人员" name="name2" icon="person">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
              <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="政务编号">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="code" class="inputItem" style="width: 65%;float: left">
                <Input type="text" v-model="formInline.code" placeholder="验证码">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <Button type="success" @click="startCodeTime($event)" :disabled="codeGet">{{codeText}}</Button>   
              <FormItem>
                <Button class="sign-button" type="primary" @click="handleSubmit()">登录</Button>
              </FormItem>
            </Form>
        </TabPane>
    </Tabs>
  </div>
</template>

<style scoped>
.sign-page {
  width: 80%;
  height: 300px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.sign-button {
  width: 100%;
  height: 40px;
  font-size: 14px;
  letter-spacing: 5px;
}
.signup-box {
  height: 20px;
}
</style>

<script>
import crypto from "crypto";

export default {
  data() {
    return {
      codeText: '发送验证码',
      codeTime: 60,
      codeGet: false,
      formInline: {
        user: "",
        password: "",
        code: ""
      },
      ruleInline: {
        user: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { type: "string", min: 6, message: "密码长度不能小于6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请填写验证码", trigger: "blur" }          
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      let _this = this;
      let sha1 = crypto.createHash("sha1");

      if (this.formInline.user && this.formInline.password) {
        this.axios({
          method: "post",
          url: "/login",
          data: {
            user: this.formInline.user,
            password: sha1.update(_this.formInline.password).digest("hex")
          }
        })
          .then(function(response) {
            if (response.data.status) {
              _this.$Message.success("登录成功!");
              window.localStorage.setItem("user_token", response.data.token);
              window.localStorage.setItem("userNumber", _this.formInline.user);
              setTimeout(function() {
                _this.$router.push("/");
              }, 1000);
            } else {
              _this.$Message.error("密码错误！请重新登录。");
            }
          })
          .catch(function(error) {
            _this.$Message.error("登录失败！请刷新页面后重新登录。");
          });
      } else {
        _this.$Message.error("请填写用户名和密码！");
      }
    },
    startCodeTime(event) {
      var _this = this,
          _user = this.formInline.user;

      if(_user === ''){
        this.$Message.error('请填写政务编号');
      }else{
        console.log(_user);
        var e = event || window.event,
            _url = '/sendCode?user=' + _user;

        this.codeGet = true;
        e.target.style.color = 'black';
        
        var timer = setInterval(function() {
          if(_this.codeTime >= 0 ){
            _this.codeText = '(' + _this.codeTime + ')' +'已发送';
            _this.codeTime--;
          }else{
            _this.codeText = '获取验证码';
            _this.codeGet = false;
            e.target.style.color = 'white';
            clearInterval(timer);
          }
        }, 1000);

        // 发送验证码
        this.axios({
          method: 'get',
          url: _url
        }).then(function (response){
          switch (response.data.status) {
            case 1:
              _this.$Message.success('验证码已发送，请您前往您的注册邮箱查看。');
              break;
            case 0:
              _this.$Message.error('该账号非管理员账号！请更正');
            case -1:
              _this.$Message.error('验证码发送失败，请刷新后重新获取。');
            case -2:
              _this.$Message.error('服务端错误，请您稍后重试！');
            default:
              break;
          }
        });
      }
    }
  }
};
</script>
