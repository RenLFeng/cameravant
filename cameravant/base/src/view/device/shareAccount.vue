<template>
    <div class="feedback">
        <div class="scan" @click="wxScan">
            <span class="iconfont icon-saomiao">
            </span>
            扫描二维码
        </div>
        <div class="type flex">
            <van-field v-model="deviceCode" label="二维码信息" placeholder="扫描后自动获取" size="large" required readonly @click="wxScan" />
            <!-- <van-field v-model="deviceCode" label="二维码信息" placeholder="扫描后自动获取" size="large" required @click="wxScan" /> -->
        </div>
        <div class="btn_container">
            <van-button type="info" size="large" @click="shareAccount" class="btn">共享</van-button>
        </div>
    </div>
</template>

<script>
    import wx from "weixin-js-sdk";
    import { Popup } from 'vant';
    import { Button } from 'vant';
    import { Field } from 'vant';
    import { Dialog } from 'vant';
    export default {
        components: {
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
        },
        name: 'shareAccount',
        data() {
            return {
                appid: window.sessionStorage.getItem('appid'),
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                deviceCode: '',
                value: true,
                deviceName: '',
                nickname: '',
                popEditDeviceName: false,
                devices: [],
                device: {},
                issue: '',
                contact: '',
                deviceList: [],
                popEdit: false,
                editItem: {
                    deviceInstAddr: ''
                },
                wxcofigData: {},
            }
        },
        created() {
            this.getOpenId();
        },
        mounted() {
        },
        methods: {
            getWxconfigData() {
                const wxconfigData = this.wxcofigData;
                if (wxconfigData.signature) {
                    //如果存在，直接设置
                    this.wxReady(wxconfigData);
                } else {
                    const appid = window.sessionStorage.getItem('appid') || this.$route.query['appid'];
                    this.$axios({
                        url: 'http://wx.isafeiot.com/server/wechat/jsauth' + '?appId=' + appid + '&url=' + encodeURIComponent(location.href.split('#')[0]),
                        method: 'post',
                    }).then(res => {
                        // alert(JSON.stringify(res));
                        window.sessionStorage.setItem('wxconfigData', JSON.stringify(res.data.data));
                        this.wxReady(res.data.data);
                    }).catch(err => {
                        // alert(JSON.stringify(err));
                        window.console.log(err);
                    });
                }
            },
            wxReady(wxcofigData) {
                const that = this;
                //微信初始化
                wx.config({
                    // debug: true,
                    appId: window.sessionStorage.getItem('appid') || this.$route.query['appid'],
                    timestamp: wxcofigData.timestamp,
                    nonceStr: wxcofigData.noncestr,
                    signature: wxcofigData.signature,
                    // jsApiList: ['configWXDeviceWiFi', 'onMenuShareAppMessage'],
                    jsApiList: ['scanQRCode',],
                    // beta: true,
                });
                wx.ready(function () {
                    window.console.log('可以wxscan了');
                });
                wx.error(function (res) {
                    //alert('143 ' + JSON.stringify(res));
                    that.$toast(res.err_msg);
                });
            },
            //启用微信扫描
            wxScan() {
                const that = this;
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        //alert('137 ' + JSON.stringify(res));
                        let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        that.deviceCode = result;
                    }
                });
            },
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/shareAccount').then(resolve => {
                    this.openid = resolve;
                    this.getWxconfigData(resolve);
                });
            },
            shareAccount() {
                const that = this;
                if (!this.deviceCode) {
                    this.$toast('请扫描二维码！');
                    return;
                }
                this.$dialog({
                    title: '共享账号',
                    message: '确定要共享您账号吗？',
                    showCancelButton: true,
                }).then(action => {
                    if (action == 'confirm') {
                        let data = {
                            openId: window.sessionStorage.getItem('openid'),
                            code: this.deviceCode,
                        }
                        this.axios.post(this.api.userBinduser, {
                            data
                        }).then(res => {
                            if (res.result === "true") {
                                that.$toast('添加账号分享成功');
                            } else {
                                that.$toast(res.message);
                            }
                        }).catch(err => {
                            window.console.log(err);
                        });
                    }
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
        .scan {
            width: 140px;
            height: 140px;
            margin: 40px auto 30px;
            background: rgba(25, 137, 250, 0.6);
            border-radius: 50%;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            color: #fff;
            font-weight: normal;
            .iconfont {
                display: block;
                padding: 30px 0 6px;
                font-size: 40px;
            }
        }
        .btn_container {
            padding: 0 16px;
        }
        .btn {
            margin: 20px 0;
        }
        .pop_detail {
            width: 100%;
            height: 100%;
            background-color: #fff;
            .pop_container {
                width: 70%;
                height: 100%;
                margin: 0 auto;
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
            padding: 10px;
            .type {
                margin: 10px 0 0;
            }
        }
    }
</style>