<template>
    <div class="feedback">
        <div class="scan">
            <h4>我的账号二维码</h4>
            <div id="qrcode" ref="qrcode" class="qrcode img"></div>
        </div>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2';//二维码生成
    import { Popup } from 'vant';
    import { Button } from 'vant';
    import { Field } from 'vant';
    export default {
        components: {
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
        },
        name: 'shareAccount',
        data() {
            return {
                appid: window.sessionStorage.getItem('appid'),
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                qrText: '',
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
                this.getCode(this.api.server + '/#/shareAccount').then(resolve => {
                    this.openid = resolve;
                    this.shareAccount(resolve);
                });
            },
            shareAccount(resolve) {
                this.qrText = resolve;
                this.generateQrcode();
                /*不需要从接口获取二维码信息了，直接使用openid作为二维码信息；
                const that = this;
                let data = {
                    openId: resolve,
                }
                this.axios.post(this.api.userSharecode, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.qrText = res.content;
                        that.generateQrcode();
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                }); */
            },
            //页面二维码
            generateQrcode() {
                document.querySelector("#qrcode").innerHTML = '';
                this.$nextTick(function () {
                    this.qrcode();
                });
            },
            qrcode() {
                let qrcode = new QRCode('qrcode', {
                    width: 200,  // 设置宽度 
                    height: 200, // 设置高度
                    text: this.qrText
                })
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
        overflow: hidden;
        background-color: #eee;
        padding-bottom: 10px;
        box-sizing: border-box;
        .scan {
            position: relative;
            margin: 43px auto 150px;
            text-align: center;
            .img {
                display: block;
                width: 220px;
                height: 220px;
                padding:10px;
                box-sizing:border-box;
                margin: 15px auto;
                background:#fff;
            }
            h4 {
                font-size: 16px;
                color: @darkl;
                line-height: 24px;
            }
            p {
                font-size: 14px;
                color: @darkl;
                line-height: 22px;
            }
        }
    }
</style>