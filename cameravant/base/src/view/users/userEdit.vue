<template>
    <div class="feedback user_add">
        <div class="field flex">
            <div class="scan" @click="picListPop=true">
                <img :src="imgUrl?imgUrl:emptySrc" alt="">
            </div>
            <div class="type flex">
                <van-field v-model="userType.userType" placeholder="请选择用户类型" size="large" required readonly @click="userTypeSelectPop=true"
                />
                <van-field v-model="userName" placeholder="请输入姓名" size="large" required />
                <van-field v-model="phone" placeholder="请输入手机号码" size="large" />
            </div>
        </div>
        <div class="btn_container">
            <van-button type="info" size="large" @click="userAdd" class="btn">修改</van-button>
        </div>
        <div class="btn_container">
            <van-button type="danger" size="large" @click="deleteUser" class="btn" style="margin-top:0;">删除</van-button>
        </div>
        <van-popup v-model="picListPop" position="right" class="whole_pop">
            <picList :childOpenid="openid" @receivePicInfo="showPic"></picList>
        </van-popup>
        <van-popup v-model="userTypeSelectPop"   class="pop_p100 top_nav" position="top">
            <van-picker show-toolbar title="" :columns="userTypes" value-key="userType" :default-index="0" @cancel="userTypeSelectCancel"
                @confirm="userTypeSelectConfirm" />
        </van-popup>
    </div>
</template>

<script>
    import picList from '@/view/common/picList'
    import {
        Popup,
        Button,
        Field,
        Picker,
        Dialog
    } from 'vant';
    export default {
        components: {
            picList,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Picker.name]: Picker,
            [Dialog.name]: Dialog,
        },
        name: 'userAdd',
        props: {
            item: {
                type: Object,
                default: {},
            },
        },
         watch:{
          "$route":{
              handler(route){
                const that=this;
                    that.imgUrl = that.item.user_pic;
                    that.pic = that.item.user_pic_md5;
                    that.phone = that.item.user_phone;
                    that.userName = that.item.user_name;
              }
          }  
        },
        data() {
            return {
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                userId: '',
                popEdit: false,
                picListPop: false,
                emptySrc: require('../../../public/avatar.png'),
                pic: "",
                imgUrl: "",
                userName: '',
                phone: '',
                verificationCode: null,
                userTypeSelectPop: false,
                userTypes: [],
                userType: {
                },
                index:1
            }
        },
        created() {
            //   console.log(this.item);
            this.getAiUsertype();
        },
        mounted() {
          console.log(this.$route.query);
            this.imgUrl = this.item.user_pic;
            this.pic = this.item.user_pic_md5;
            this.phone = this.item.user_phone;
            this.userName = this.item.user_name;
        },
        methods: {
            userAdd() {
                const that = this;
                const phone = this.phone;
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
                if (!this.pic) {
                    this.$toast('请选择图片！');
                    return;
                }
                let data = {
                    userId: this.item.user_id,
                    userName: this.userName,
                    userTypeId: this.userType.id,
                }
                if (this.phone) {
                    data.userPhone = this.phone;
                }
                this.axios.post(this.api.aiUpdateuser, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.$toast('修改成功');
                        that.$emit('editSuc');
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            deleteUser() {
                const that = this;
                // this.$set(item.item.canDelete,true);
                function beforeClose(action, done) {
                    if (action === 'confirm') {
                        console.log(JSON.stringify(that.item));
                        that.axios.post(that.api.aiDeleuser, {
                            data: {
                                id: that.item.user_id
                            }
                        }).then(res => {
                            if (res.result === "true") {
                                that.$toast('删除成功');
                                that.$emit('editSuc');
                            } else {
                                that.$toast(res.message);
                            }
                        }).catch(err => {
                            window.console.log(err);
                        });
                        done();
                    } else {
                        done();
                    }
                }

                Dialog.confirm({
                    title: '删除用户',
                    message: '您确认删除该用户吗？',
                    beforeClose
                });
            },
            showPic(data) {
                this.pic = data.img_md5;
                this.imgUrl = data.img;
                this.picListPop = false;
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
            getAiUsertype() {
                this.axios.get(this.api.aiUsertype, {
                }).then(res => {
                    if (res.result === 'true') {
                        this.userTypes = res.content;
                        this.userType = res.content[this.item.user_type_id - 1];
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
        background-color: #eee;
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
            transform: none;
              transform: translate3d(-10%, 20px, 11px);
            box-shadow:2px 2px 18px rgba(0,0,0,0.3);
        }
    }
</style>
<style>
.user_add .van-cell {
    background: #F5F7F9;
    margin-top: 6px;
}
.user_add .field .scan img[data-v-57c4ebfd]{
    border-radius: 15px;
}
</style>
