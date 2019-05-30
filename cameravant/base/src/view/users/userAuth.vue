<template>
    <div class="feedback common">
        <div v-if="istrue">
            <p style="padding:0 16px;">此账户已授权PC访问，WEB管理平台账户为：{{phone?phone:phone2}} 网址是<a href="http://www.isafeiot.com">http://www.isafeiot.com</a></p>
            <div class="btn_container">
                <van-button type="info" size="large" @click="setChangeIsauthFn" class="btn">解绑</van-button>
            </div>
        </div>
        <div v-if="!istrue && isShow">
            <p class="note">用户需要设置好WEB登录的手机号码和密码后才能登录WEB管理平台，网址是<a href="http://www.isafeiot.com">http://www.isafeiot.com</a></p>
            <div class="field">
                <div class="type flex">
                    <van-field v-model="phone" placeholder="请输入手机号码" size="large" required />
                    <van-field v-model="verificationCode" placeholder="请输入验证码" size="large" required>
                        <van-button slot="button" size="small" type="info" :disabled="cutDown.hasSend" @click="getVerifyCode">{{cutDown.hasSend
                            ? ('剩余 '+ cutDown.time + ' s') : '发送验证码'}}</van-button>
                    </van-field>
                    <van-field v-model="password" placeholder="请输入密码" size="large" type="password" required />
                </div>
            </div>
            <div class="btn_container">
                <van-button type="info" size="large" @click="userAdd" class="btn">添加</van-button>
            </div>
            <van-popup v-model="picListPop" position="right" class="whole_pop">
                <picList :childOpenid="openid" @receivePicInfo="showPic"></picList>
            </van-popup>
        </div>
    </div>
</template>

<script>
    import picList from '@/view/common/picList'
    import {
        Popup,
        Button,
        Field,
        Dialog 
    } from 'vant';
    export default {
        components: {
            picList,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
              [Dialog.name]: Dialog,
        },
        name: 'userAdd',
        data() {
            return {
                isShow:false,
                phone2:"",
                istrue:false,
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                popEdit: false,
                picListPop: false,
                emptySrc: require('../../../public/avatar.png'),
                pic: "",
                imgUrl: "",
                cutDown: {
                    time: 60,
                    hasSend: false
                },
                userName: '',
                phone: '',
                verificationCode: null,
                password: '',
                timer:null
            }
        },
        created() {
            this.getOpenId();
        },
        mounted() {
        },
        methods: {
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/userAdd').then(resolve => {
                    this.openid = resolve;
                    let data ={
                        "openId":resolve
                    }
                    this.axios.post(this.api.getUserIsauth,{data}).then(res=>{
                        
                        if(res.result=='true'){
                            if(res.content){
                                this.istrue=true;
                                this.phone2=res.content;
                            }
                        }else{
                             this.isShow=true;
                        }
                    })
                });
            },
            //解授权
            setChangeIsauthFn(){
                let data ={
                        "openId":this.openid
                    }
                    Dialog.confirm({
                            title: '解授权',
                            message: '您确定要解除授权吗？'
                            }).then(() => {
                           this.axios.post(this.api.setUserCancelauth,{data}).then(res=>{
                        if(res.result=='true'){
                             this.$toast('解除授权成功');
                            this.istrue=false;
                             this.isShow=true;
                             this.password='';
                            this.verificationCode='';
                        }else{
                              that.$toast(res.message);
                        }
                    })
                            }).catch(() => {
                            // on cancel
                    });
                   
            },
            //授权
            userAdd() {
                const that = this;
                const phone = this.phone;
                if (!phone) {
                    this.$toast('请输入手机号！');
                    return;
                }
                if (!this.regPhone(phone)) {
                    this.$toast("请输入正确格式的手机号码");
                    return;
                }
                  if (!this.verificationCode) {
                    this.$toast('请输入验证码！');
                    return;
                }
                if (!this.password) {
                    this.$toast("请输入密码");
                    return;
                }
                this.axios.post(this.api.userVerifyCode, {
                    data: {
                        phone,
                        vcode: this.verificationCode,
                    }
                }).then(res => {
                    if (res.result === "true") {
                        userAuth();
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
                const userAuth = () => {
                    let data = {
                        openId: window.sessionStorage.getItem('openid'),
                        phone: this.phone,
                        password: this.password,
                    }
                    this.axios.post(this.api.userWebauth, {
                        data
                    }).then(res => {
                        if (res.result === "true") {
                            that.$toast('账户授权成功');
                           const cutDown = this.cutDown;
                            clearTimeout(that.timer);
                            cutDown.hasSend = false;
                            cutDown.time = 60;
                              this.istrue=true;
                        } else {
                            that.$toast(res.message);
                        }
                    }).catch(err => {
                        window.console.log(err);
                    });
                }
            },
            showPic(data) {
                this.pic = data.img_md5;
                this.imgUrl = data.img;
                this.picListPop = false;
            },
            // 获取验证码
            getVerifyCode() {
                const phone = this.phone;
                if (!this.regPhone(phone)) {
                    this.$toast("请输入正确格式的手机号码");
                    return;
                }
                this.axios.post(this.api.userApplyCode, {
                    data: {
                        phone: this.phone,
                    }
                }).then(res => {
                    if (res.result === 'true') {
                        this.cutDown.hasSend = true;
                        this.countDownTime();
                        this.$toast("验证码已发送到您的手机，请注意查收！");
                    } else {
                        this.$toast(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            // 倒计时函数 13267080205
              countDownTime() {
                  let that=this;
                const cutDown = this.cutDown;
                const fnCount = () => {
                    that.timer = setTimeout(() => {
                        if (cutDown.time <= 0) {
                            clearTimeout(that.timer);
                            cutDown.hasSend = false;
                            cutDown.time = 60;
                        } else {
                            cutDown.time -= 1;
                            fnCount();
                        }
                    }, 1000);
                };
                fnCount();
            },
            // countDownTime() {
            //     const cutDown = this.cutDown;
            //     const fnCount = () => {
            //         const count = setTimeout(() => {
            //             if (cutDown.time <= 0) {
            //                 clearTimeout(count);
            //                 cutDown.hasSend = false;
            //                 cutDown.time = 60;
            //             } else {
            //                 cutDown.time -= 1;
            //                 fnCount();
            //             }
            //         }, 1000);
            //     };
            //     fnCount();
            // },
        },
        computed: {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @dark: #17233D;
    @darkl: rgba(23, 35, 61, 0.75);
    @darkm: rgba(23, 35, 61, 0.35);
    @darks: rgba(23, 35, 61, 0.2);
    @darkxs: rgba(23, 35, 61, 0.1);
    @darkxxs: rgba(23, 35, 61, 0.06);
    @darkxxxs: rgba(23, 35, 61, 0.03);
    @orange: #ff9900;
    @green: #46ba01;
    .feedback {
        height: 100vh;
        overflow: hidden;
        background-color: #eee;
        padding-bottom: 10px;
        .note {
            padding: 10px 16px;
            font-size: 14px;
            color: @dark;
        }
        .field {
            padding: 0 16px;
            .type {
                flex: 1;
                margin: 10px 0 30px;
            }
        }
        .btn_container {
            padding: 0 16px;
        }
        .btn {
            margin: 20px 0;
        }
        .whole_pop {
            width: 100%;
            height: 100%;
        }
        .pop_p100 {
            width: 100%;
        }
    }
</style>