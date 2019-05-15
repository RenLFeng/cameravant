<template>
    <div class="feedback user_add">
        <div class="field flex">
            <div class="scan" @click="picListPop=true">
                <img :src="imgUrl?imgUrl:emptySrc" alt="">
            </div>
            <div class="type flex">
                <van-field v-model="userType.userType" placeholder="请选择用户类型" size="large" required readonly @click="selectUserType"
/>
                <van-field v-model="userName" placeholder="请输入姓名" size="large" required />
                <van-field v-model="phone" placeholder="请输入手机号码" size="large" />
            </div>
        </div>
        <div class="btn_container">
            <van-button type="info" size="large" @click="userAdd" class="btn">添加</van-button>
        </div>
        <van-popup v-model="picListPop" position="right" class="whole_pop">
            <picList :childOpenid="openid" @receivePicInfo="showPic"></picList>
        </van-popup>
        <van-popup v-model="userTypeSelectPop" class="pop_p100 top_nav" position="bottom">
            <van-picker show-toolbar title="" :columns="userTypes" value-key="userType" :default-index="0" @cancel="userTypeSelectCancel"
                @confirm="userTypeSelectConfirm" />
        </van-popup>
    </div>
</template>

<script>
    import picList from '@/view/common/picList';
    import {
        Icon,
        Popup,
        Button,
        Field,
        Picker,
        Tab,Tabs
    } from 'vant';
    export default {
        components: {
            picList,
            [Icon.name]:Icon,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Picker.name]: Picker,      
            [Tab.name]: Tab,
            [Tabs.name]:Tabs
        },
        name: 'userAdd',
        data() {
            return {
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
                userTypeSelectPop: false,
                userTypes: [],
                userType: {
                },
            }
        },
        created() {
            this.getOpenId();
            this.getAiUsertype();
        },
        mounted() {
        },
        methods: {
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/userAdd').then(resolve => {
                    this.openid = resolve;
                });
            },
            userAdd() {
                const that = this;
                const phone=this.phone;
                if (!this.userType.id) {
                    this.$toast('请选择用户类型！');
                    return;
                }
                if (!this.userName) {
                    this.$toast('请输入姓名！');
                    return;
                }
                /* if (!phone) {
                    this.$toast('请输入手机号！');
                    return;
                } */
                if (phone && !this.regPhone(phone)) {
                    this.$toast("请输入正确格式的手机号码");
                    return;
                }
                /* if (!this.verificationCode) {
                    this.$toast('请输入验证码！');
                    return;
                } */
                if (!this.pic) {
                    this.$toast('请选择图片！');
                    return;
                }
                let data = {
                    openId: window.sessionStorage.getItem('openid'),
                    name: this.userName,
                    pic: this.pic,
                    type:this.userType.id,
                }
                if (this.phone) {
                    data.phone = this.phone;
                }
                this.axios.post(this.api.aiAdduser, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.$toast('添加成功');
                        // that.popEdit=true;
                        //跳转提交反馈页面
                        this.$router.push({
                            name: 'userList',
                            query: {
                                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                            }
                        })
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
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
                this.axios.get(this.api.userApplyCode, {
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
            // 倒计时函数
            countDownTime() {
                const cutDown = this.cutDown;
                const fnCount = () => {
                    const count = setTimeout(() => {
                        if (cutDown.time <= 0) {
                            clearTimeout(count);
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
            userTypeSelectConfirm(value) {
                let tmp = JSON.stringify(this.userType);
                if (tmp !== JSON.stringify(value)) {
                    this.userTypeSelectPop = false;
                    this.userType = value;
                }
                this.userTypeSelectPop = false;
            },
            userTypeSelectCancel() {
                this.userTypeSelectPop = false;
            },
            selectUserType(){
                //alert('191' +JSON.stringify(this.userTypes[0]));
                if(this.userTypes[0]){
                    this.userTypeSelectPop=true;
                }else{
                this.axios.get(this.api.aiUsertype, {
                }).then(res => {
                    if (res.result === 'true') {
                        this.userTypeSelectPop=true;
                    } else {
                        this.$toast(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
                }
            },
            getAiUsertype() {
                this.axios.get(this.api.aiUsertype, {
                }).then(res => {
                    if (res.result === 'true') {
                        this.userTypes = res.content;
                    } else {
                        this.$toast(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            }
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
        background-color: #fff;
        padding-bottom: 10px;
        .field {
            padding: 0 16px;
            align-items: center;
            .scan {
                margin: 10px 5px 30px 0;
                width: 105px;
                height: 119px;
                /* 264*300 */
                /* background:url(../../../public/avatar.png) no-repeat top/contain; */
                background: #fff;
                padding: 14px 12px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                color: #fff;
                font-weight: normal;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                }
                .iconfont {
                    display: block;
                    font-size: 90px;
                    color: #0091fa;
                }
            }
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
        .top_nav {
            top: 45px;
            width: 55%;
            height:260px;
            transform: none;
              transform: translate3d(-10%, 20px, 11px);
            box-shadow:2px 2px 18px rgba(0,0,0,0.3);
        }
        .van-button--info{
            background:rgba(90,122,239,1);
            border-radius:15px;
        }
    
    }
</style>
<style>
.user_add .van-cell--large{
            background: #F5F7F9;
            margin-top: 10px;
        }
</style>
