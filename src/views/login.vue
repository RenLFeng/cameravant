<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <!-- <span @click="remberMe">记住我</span> -->
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
const bcrypt = require("bcryptjs");

/*const password = "123";

// Step1: Generate Hash
// salt is different everytime, and so is hash
let salt = bcrypt.genSaltSync(10); // 10 is by default
console.log(salt); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3e
let hash = bcrypt.hashSync(password, salt); // salt is inclued in generated hash
console.log(hash); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3eXlr3ns0hDxeRtlia0CPQfLJVaRCWJVS

// Step2: Verify Password
// when verify the password, get the salt from hash, and hashed again with password
let saltFromHash = hash.substr(0, 29);
console.log(saltFromHash); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3e
let newHash = bcrypt.hashSync(password, saltFromHash);
console.log(newHash); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3eXlr3ns0hDxeRtlia0CPQfLJVaRCWJVS
console.log(hash === newHash); //true

// back end compare
console.log(bcrypt.compareSync(password, hash)); //true*/
export default {
  data() {
    return {
      form: {
        userName: "iview_admin",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    lastPassword() {
      const beginPassword = this.form.password;
      if (!beginPassword) {
        return "";
      }
      // Step1: Generate Hash
      // salt is different everytime, and so is hash
      let salt = bcrypt.genSaltSync(10); // 10 is by default
      console.log(salt); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3e
      let lastPassword = bcrypt.hashSync(beginPassword, salt); // salt is inclued in generated hash
      console.log(lastPassword); //$2a$10$TnJ1bdJ3JIzGZC/jVS.v3eXlr3ns0hDxeRtlia0CPQfLJVaRCWJVS
      return lastPassword;
    }
  },
  created() {
    const loginInfo = window.localStorage.getItem("loginInfo");
    console.log(loginInfo, 1);
    if (
      loginInfo &&
      new Date().getTime() -
        JSON.parse(window.localStorage.getItem("loginInfo")).date >
        3600 * 24 * 7
    ) {
      this.form.userName = JSON.parse(loginInfo).userName;
      this.form.password = JSON.parse(loginInfo).password;
    }
  },
  methods: {
    handleSubmit() {
      if (true) {
        window.localStorage.setItem(
          "loginInfo",
          JSON.stringify({
            userName: this.form.userName,
            password:this.lastPassword,
            date: new Date().getTime()
          })
        );
      } else {
        window.localStorage.removeItem("loginInfo");
      }
      console.log(window.localStorage.getItem("loginInfo"), 2);

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          Cookies.set("user", this.form.userName);
          Cookies.set("password", this.lastPassword);
          this.$store.commit(
            "setAvator",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
          );
          if (this.form.userName === "iview_admin") {
            Cookies.set("access", 0);
          } else {
            Cookies.set("access", 1);
          }
          this.$router.push({
            name: "home_index"
          });
        }
      });
    }
  }
};
</script>

<style>
</style>
