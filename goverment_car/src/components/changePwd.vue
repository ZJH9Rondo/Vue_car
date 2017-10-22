<template>
  <div class="change-page">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="政务编号" prop="number">
                <Input v-model="formValidate.number" placeholder="请填写账号"></Input>
            </FormItem>
            <FormItem label="原密码" prop="old_password">
                <Input v-model="formValidate.old_password" type="password" placeholder="请输入原密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="new_password">
                <Input v-model="formValidate.new_password" type="password" placeholder="请输入新密码"></Input>
            </FormItem>
            <FormItem class="submit-button">
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
  </div>
</template>

<style scoped>
.change-page {
  width: 90%;
  height: 350px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.submit-button {
  margin-left: -80px !important;
}
</style>

<script>
import crypto from "crypto"; // 加密模块

export default {
  data() {
    let _this = this;
    /*
    *   校验政务编号
    */
    var checkUserNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入政务编号"));
      } else {
        var partern = /^\d{8}$/;
        if (!partern.test(_this.formValidate.number)) {
          callback(new Error("编号格式错误"));
        } else {
          callback();
        }
      }
    };
    return {
      formValidate: {
        number: "",
        old_password: "",
        new_password: ""
      },
      ruleValidate: {
        number: [{ validator: checkUserNumber, trigger: "blur" }],
        old_password: [{ required: true, message: "请填写原密码", trigger: "blur" }],
        new_password: [{ required: true, message: "请填写新密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      let _this = this;
      let _oldSHA1 = crypto.createHash("sha1"),
          _newSHA1 = crypto.createHash("sha1");

      this.$refs[name].validate(valid => {
        if (valid) {
          _this
            .axios({
              method: "post",
              url: "/changePwd",
              data: {
                number: _this.formValidate.number,
                oldPassword: _oldSHA1
                  .update(_this.formValidate.old_password)
                  .digest("hex"),
                newPassword: _newSHA1
                  .update(_this.formValidate.new_password)
                  .digest("hex")
              },
              transformRequest: [
                function(data) {
                  let ret = "";
                  for (let it in data) {
                    ret +=
                      encodeURIComponent(it) +
                      "=" +
                      encodeURIComponent(data[it]) +
                      "&";
                  }
                  return ret;
                }
              ],
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8"
              }
            })
            .then(function(response) {
              switch (response.data.status) {
                case 1:
                  _this.$Message.success("密码修改成功，请使用新密码登录");
                  window.localStorage.setItem(
                    "user_token",
                    response.data.token
                  );
                  setTimeout(function() {
                    _this.$router.push("/signin");
                  }, 1000);
                  break;
                case -1:
                  _this.$Message.warning("原密码错误！请更改后重新提交。");
                  break;
                case 0:
                  _this.$Message.error("账号不存在，请修正后提交！");
                  break;
                default:
                  break;
              }
            })
            .catch(function(error) {
              throw error;
            });
        } else {
          _this.$Message.error("请确认表单填写完整且格式无误！");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
