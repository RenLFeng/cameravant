<template>
    <div class="feedback sq_list" v-if="Object.keys(deviceList).length>0">
          <ul class="feedback_list">
                    <!-- <li class="flex" v-for="(item,index) in myDevices" v-swipeleft="{fn:deleteDevice,item:item}" :class="item.canDelete?'translate':''"
                        :key="index"> -->
                    <li class="flex" v-for="(item,index) in myDevices" :class="item.canDelete?'translate':''"
                        :key="index">
                       
                        <div class="left">
                             <p class="user-title"> 张三 <van-tag round :class="item.user_sex?'man':'girl'">{{item.user_sex?'男':'女'}}</van-tag></p>
                            <span class="name ellipsis">{{item.device_inst_addr}}</span>
                            <!-- <span class="time ellipsis">{{item.device_code}}</span>  active: item.user_sex, 'girl': item.user_sex  -->
                        </div>
                        <div class="middle">
                            <!-- <span class="name ellipsis">{{item.devicetype_name}}</span> -->
                            <span class="time">{{item.device_addtime}} <i @click="claerBindFn(item,index)" class="jiebang"></i></span>
                        </div>
                        <!-- <span class="iconfont icon-chakan"></span> -->
                        <!-- <span class="iconfont icon-shanchu" @click="deleteDevice(item)"></span> -->
                    </li>
            </ul>
    </div>
    <empty v-else>
        <!-- <span>暂无授权用户，先去<span class="blue" @click="goDeviceAdd">添加设备</span>吧~</span> -->
             <span>暂无授权用户...</span>
    </empty>
</template>

<script>
    import empty from '@/view/common/empty'

    import {
        Popup,
        Button,
        Field,
        Dialog,
        Tab, Tabs,Tag,
    } from 'vant';
    export default {
        components: {
            empty,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
             [Tag.name]: Tag,
        },
        name: 'myFeedback',
        data() {
            return {
                color:'#FC41B3',
                appid: window.sessionStorage.getItem('appid'),
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                value: true,
                deviceName: false,
                nickname: '',
                popEditDeviceName: false,
                devices: [],
                device: {},
                feedbackType: [{
                    name: '语音对话',
                    id: 'dialog'
                }, {
                    name: '听故事',
                    id: 'story'
                }, {
                    name: '产品建议',
                    id: 'suggest'
                }, {
                    name: '其他问题',
                    id: 'other'
                }],
                feedbackId: 'dialog',
                issue: '',
                contact: '',
                deviceList: [],
                popEdit: false,
                editItem: {
                },
                canDelete: false,
                myDevices: [],
                otherDevices: [],
                tabDeviceType: [{
                    text: "我的",
                    value: 0
                }, {
                    text: "分享的",
                    value: 1
                }],
                tabDeviceSelected: 0,
            }
        },
        created() {
            this.getOpenId();
        },
        mounted() {
        },
        methods: {
            //get 授权用户列表
            getDeviceList(openid) {
                const that = this;
                let data = {};
                if (openid) {
                    data.openId = openid;
                }else{
                    data.openId=window.sessionStorage.getItem('openid');
                }
                this.axios.post(this.api.wechatDevice, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.deviceList = res.content;
                        that.myDevices = res.content[0].devices;
                        
                        let dat=[
                            {
                               device_inst_addr:"sk",
                               device_addtime: "2019-04-19 15:17:52"
                            },
                             {
                               device_inst_addr:"sk2",
                               device_addtime: "2019-04-19 15:17:52"
                            },
                        ]
                        that.myDevices=that.myDevices.concat(dat);
                        console.log(that.myDevices);
                        that.otherDevices = res.content[1].devices;
                         that.otherDevices=that.myDevices.concat({
                               device_inst_addr:"sk3",
                               device_addtime: "2019-04-19 15:17:52"
                            });

                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            setEditItem(item) {
                this.editItem = Object.assign({}, item);
                this.popEdit = true;
            },
            getfeedbackName(type) {
                let name = '';
                this.feedbackType.filter(val => {
                    if (val.id == type) {
                        name = val.name;
                    }
                });
                return name;
            },
            submit() {
                const that = this;
                let data = {};
                if (!this.editItem.device_inst_addr) {
                    this.$toast('请填写设备名称');
                    return;
                }
                data.name = this.editItem.device_inst_addr;
                data.deviceId = this.editItem.device_id;
                //用回普通提交
                this.axios.post(this.api.wechatEditDevice, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.issue = '';
                        that.$toast('修改成功');
                        that.popEdit = false;
                        that.getDeviceList();
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            /* deleteDevice(item) {
                const that = this;
                // this.$set(item.item.canDelete,true);
                function beforeClose(action, done) {
                    if (action === 'confirm') {
                        this.axios.post(this.api.wechatUnbind, {
                            data: {
                                openId: window.sessionStorage.getItem('openid'),
                                deviceId: item.item.device_id
                            }
                        }).then(res => {
                            if (res.result === "true") {
                                that.$toast('删除成功');
                                that.getDeviceList();
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
                    title: '删除设备',
                    message: '您确认删除该设备吗？',
                    beforeClose
                });
            }, */
            //非左滑删除
            deleteDevice(item) {
                const that = this;
                // this.$set(item.item.canDelete,true);
                function beforeClose(action, done) {
                    if (action === 'confirm') {
                        this.axios.post(this.api.wechatUnbind, {
                            data: {
                                openId: window.sessionStorage.getItem('openid'),
                                deviceId: item.device_id
                            }
                        }).then(res => {
                            if (res.result === "true") {
                                that.$toast('删除成功');
                                that.getDeviceList();
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
                    title: '删除设备',
                    message: '您确认删除该设备吗？',
                    beforeClose
                });
            },
            goDeviceAdd() {
                //跳转提交反馈页面
                this.$router.push({
                    name: 'deviceAdd',
                    query: {
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
                })
            },
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/deviceList').then(resolve => {
                    this.openid = resolve;
                    this.getDeviceList(resolve);
                });
            },
            //解绑授权用户列表
            claerBindFn(item,index){
                   Dialog.confirm({
                    title: '解除授权',
                    message: '您确认解除该授权用户吗？',
                    // beforeClose
                }).then(()=>{
                    console.log(item);
                    this.myDevices.splice(index,1);
                }).catch(() => {
                    alert('cancle');
                    // on cancel
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        background-color: #fff;
        padding-bottom: 10px;
        .user-title{
            margin-bottom: 0;
            padding: 5px 0;
            font-size: 18px;
            .man{
                background: #22CED4 !important;
            }
            .girl{
                background:#FC41B3 !important;
            }
        }
        .feedback_list {
            li {
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                box-sizing: border-box;
                line-height: 24px;
                position: relative;
                background-color: #fff;
                border-bottom: 1px solid #e5e5e5;
                color: #333;
                font-size: 14px;
                overflow: hidden;
                &.translate {
                    transform: translate3d(-65px, 0px, 0px);
                    transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1) 0s;
                }
                .left,
                .middle {
                    &>span {
                        position: relative;
                        display: block;
                        width: 100%;
                        text-align: left;
                        .jiebang{
                            position: absolute;
                            width: 30px;
                            height: 30px;
                            background: url(../../assets/jiebang.png) no-repeat ;
                            background-size: 100%;
                            background-position: 50% 50%;                             
                            right: 0;
                            top: -2px;
                        }
                    }
                    .name {}
                }
                .left {
                    width: calc(~'50% - 60px');
                }
                .middle {
                    width: calc(~'50%');
                }
                .time {
                    color: @darks;
                    font-size: 12px;
                }
                .link {
                    width: 20px;
                    font-size: 20px;
                    color: #aaa;
                }
            }
        }
        .add_device {
            height: 50px;
            margin: 15px 16px;
            padding: 0;
            border-radius: 5px;
            box-sizing: border-box;
            background: #0091fa;
            text-align: center;
            color: #fff;
            line-height: 50px;
            font-size: 14px;
            .iconfont {
                display: none;
                font-size: 30px;
            }
        }
        .pop_detail {
            width: 100%;
            height: 100%;
            background-color: #fff;
            .pop_container {
                width: 100%;
                height: 100%;
                overflow-x: hidden;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
            }
            .time {
                padding: 14px 16px 16px;
                color: @darkm;
                font-size: 12px;
                text-align: left;
            }
            .flex {
                padding: 5px 16px;
                font-size: 14px;
                align-items: center;
                span {
                    width: 80px;
                    color: @darkl;
                }
                p {
                    width: calc(~'100% - 85px');
                    color: @dark;
                }
                .imgs {
                    margin-top: 25px;
                    img {
                        width: 100%;
                    }
                }
            }
            .btn_container {
                padding: 42px 4px 10px;
                .btn {
                    /* background:@orange; */
                }
            }
        }
        .pop_edit {
            width: 70vw;
            .type {
                margin: 10px 0;
            }
        }

    }
    
</style>
<style>
.sq_list .feedback_list li .left[data-v-f4fd47f8]{
    width: auto;
}
.sq_list .feedback_list li[data-v-fcebbbc8]{
    line-height: 13px;
}
.sq_list .van-tabs__content{
    margin-top: 50px;
}
.sq_list .van-tabs__wrap {
    padding: 10px 20px;
}
           span.name,span.time{
            color:#6C7B8A !important;
        }
.sq_list .van-tabs__line{
            display: none;
        }
 .sq_list .van-tab--active{
            background: linear-gradient(315deg,rgba(64,72,239,1) 0%,rgba(90,123,239,1) 100%);
            color: #fff;
            border-radius: 30px;
             width: 80%;
            height: 100%;
            margin: 0 auto;
        }
</style>