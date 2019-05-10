<template>
    <div class="feedback" v-if="Object.keys(deviceList).length>0">
        <ul class="feedback_list">
            <li class="flex" v-for="(item,index) in deviceList" @click="setEditItem(item)" v-swipeleft="{fn:deleteDevice,item:item}" :class="item.canDelete?'translate':''"
                :key="index">
                <div class="left">
                    <span class="name ellipsis">{{item.device_inst_addr}}</span>
                    <span class="time ellipsis">{{item.device_code}}</span>
                </div>
                <div class="middle">
                    <span class="name ellipsis">{{item.devicetype_name}}</span>
                    <span class="time">{{item.device_addtime}}</span>
                </div>
                <span class="iconfont icon-chakan"></span>
            </li>
        </ul>
        <van-popup v-model="popEdit" class="pop_edit" :modal="false" v-if="Object.keys(editItem).length>0">
            <div class="pop_container">
                <div class="type flex">
                    <van-field v-model="editItem.device_inst_addr" label="设备名称" placeholder="请输入设备名称" size="large" required />
                </div>
                <van-button type="default" size="large" @click="submit" class="btn">提交</van-button>
            </div>
        </van-popup>
    </div>
    <empty v-else>
        <span @click="goFeedback">暂无设备，先去<span class="blue" @click="goDeviceAdd">添加设备</span>吧~</span>
    </empty>
</template>

<script>
    import empty from '@/view/common/empty'

    import { Popup } from 'vant';
    import { Button } from 'vant';
    import { Field } from 'vant';
    import { Dialog } from 'vant';
    export default {
        components: {
            empty,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
        },
        name: 'myFeedback',
        data() {
            return {
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
                searchName:this.$route.query['name'],
            }
        },
        created() {
            this.getOpenId();
        },
        mounted() {
        },
        methods: {
            getDeviceList(openid) {
                const that = this;
                let data = {};
                if (openid) {
                    data.openId = openid;
                }else{
                    data.openId=window.sessionStorage.getItem('openid');
                }
                if(this.searchName){
                    data.name=this.searchName;
                }
                this.axios.post(this.api.wechatDevice, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        this.deviceList = res.content;
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
            goFeedback() {
                //跳转提交反馈页面
                this.$router.push({
                    name: 'feedback',
                    query: {
                        appid: window.sessionStorage.getItem('appid') || this.$route.query['appid'],
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
                })
            },
            submit() {
                const that = this;
                let data = {};
                if (!this.editItem.device_inst_addr) {
                    this.$toast('请填写设备名称');
                    return;
                }
                data.name = this.editItem.device_inst_addr;
                data.device_id = this.editItem.device_id;
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
            deleteDevice(item) {
                const that = this;
                // this.$set(item.item.canDelete,true);
                function beforeClose(action, done) {
                    if (action === 'confirm') {
                        this.axios.post(this.api.wechatUnbind, {
                            data: {
                                openId: window.sessionStorage.getItem('openid'),
                                device_id: item.item.device_id
                            }
                        }).then(res => {
                            if (res.result === "true") {
                                that.issue = '';
                                that.$toast('删除成功');
                                that.popEdit = false;
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
        background-color: #eee;
        padding-bottom: 10px;
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
                        display: block;
                        width: 100%;
                        text-align: left;
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