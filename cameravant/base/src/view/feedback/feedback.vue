<template>
    <div class="feedback">
        <ul class="ul">
            <li class="li">
                <!-- <h3>反馈类型</h3>
                <ul class="feedback_type clearfix">
                    <li v-for="item in feedbackType" :class="item.id==feedbackId?'active':''" @click="feedbackId=item.id">{{item.name}}</li>
                </ul> -->
                <div class="field_container">
                    <van-field label="问题描述" placeholder="请详细说明问题，以便我们定位与解决" type="textarea" rows="8" v-model="issue" class="field" :attr="{}"></van-field>
                </div>
                <div class="field_container">
                    <div @click="upload" v-if="Object.keys(tempFilePaths).length<3" class="upload"><span class="iconfont icon-fujianguanli-xuanzetupian"></span>上传图片</div>
                    <div class="img_container flex">
                        <div v-for="(item,index) in tempFilePaths" v-if="Object.keys(tempFilePaths).length>0" class="img_single" :key="index">
                            <img :src="item" alt="" class="img">
                            <span class='dele_item' @click="dele_image(index)">&times;</span>
                        </div>
                    </div>
                </div>
            </li>
            <li class="li">
                <div class="field_container">
                    <van-field label="联系方式" placeholder="请输入邮箱或手机号码" v-model="contact"></van-field>
                </div>
            </li>
        </ul>
        <div class="btn_contaienr">
            <van-button type="info" size="large" class="btn" @click="submit">提交</van-button>
            <div class="next">
                <span @click="goMyFeedback" class="blue">
                    我的反馈
                </span>
            </div>
        </div>
    </div>
    
</template>

<script>
    import Utils from '@/libs/utils.js'
    import wx from "weixin-js-sdk";

    import { Field } from 'vant';
    import { Button } from 'vant';
    import {Dialog,Uploader,Icon } from 'vant';
    export default {
        components: {
              [Icon.name]: Icon,
             [Uploader.name]: Uploader,
            [Field.name]: Field,
            [Button.name]: Button,
            [Dialog.name]:Dialog,
        },
        name: 'feedback',
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
                wxconfigData: {},
                imageVideoNumber: 0,
                mediaIds: [],
                tempFilePaths: [],
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
                this.getCode(this.api.server + '/#/feedback').then(resolve => {
                    this.openid = resolve;
                    this.getWxconfigData(resolve);
                });
            },
            switchSelectedDevice(item) {
                const that = this;
                if (item.selected) {
                    return;
                }
                //设置用户当前选择的设备
                this.axios.post(this.api.selectedDevice, {
                    data: {
                        id: item.id
                    }
                }).then(res => {
                    if (res.result == "1") {
                        let openid = window.sessionStorage.getItem('openid') || that.$route.query['openid'];
                        that.getDevices(openid).then(res => {
                            that.devices = res.devices;
                            that.device = res.device;
                        });
                        setTimeout(function () { that.deviceName = false; }, 1000);
                    } else {
                        that.$toast(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            //提交
            submit() {
                const that = this;
                let data = {};
                if (!this.issue) {
                    this.$toast('请填写问题描述');
                    return;
                }
                data.content = this.issue;
                const reg = /(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)|(^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$)/;
                if (!reg.test(this.contact)) {
                    this.$toast('请准确填写联系方式');
                    return;
                }
                data.contact = this.contact;
                /* const device = JSON.parse(window.sessionStorage.getItem('device')) || {};
                if (!device) {
                    this.$toast('未绑定产品');
                    return;
                }
                data.deviceId = device.device_id;
                data.appId = window.sessionStorage.getItem('appid') || this.$route.query['appid']; */
                const openid = window.sessionStorage.getItem('openid') || this.$route.query['openid'];
                if (openid) {
                    data.clientId = openid;
                }else{
                    data.openId=window.sessionStorage.getItem('openid');
                }
                // data.type = this.feedbackId;
                /* if (Object.keys(this.mediaIds).length > 0) {
                    data.mediaIds = this.mediaIds.join(',');
                } */
                // 佳浩图片上传变了，跟之前会杰的不一样
                // alert('151  this.mediaIds  '+JSON.stringify(this.mediaIds));
                if (Object.keys(this.mediaIds).length > 0) {
                    this.mediaIds.forEach((val,index)=>{
                        if(index===0){
                            data.pic1=val;
                        }
                        if(index===1){
                            data.pic2=val;
                        }
                        if(index===2){
                            data.pic3=val;
                        }
                    });
                }
                //alert('165 '+JSON.stringify(data));
                //用回普通提交
                this.axios.post(this.api.feedbackAdd, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.issue = '';
                        that.contact = '';
                        that.imageVideoNumber = 0;
                        that.mediaIds = [];
                        that.tempFilePaths = [];
                        that.$toast('提交成功');
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    //alert('181 '+JSON.stringify(err));
                    window.console.log(err);
                });
                /* //使用$axios提交
                var formdata = new FormData();
                formdata.append('files', this.tempFilePaths); 
                formdata.append('contact', this.contact);  
                formdata.append('details', this.issue);   
                formdata.append('userId', openid);    
                formdata.append('deviceId', device.device_id);  
                formdata.append('type', this.feedbackId);   
                data.contact=this.contact;      
                data.details=this.issue;    
                this.$axios({
                    baseURL: this.api.baseURL,
                    url: this.api.feedback,
                    method: 'post',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formdata
                }).then(res => {
                    if (res.data.result === '1') {
                        this.$Message.info("保存成功");
                        this.$router.go(-1);
                    } else {
                        this.$Message.error(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                }); */
            },
            getWxconfigData() {
                const wxconfigData = this.wxconfigData;
                if (wxconfigData.signature) {
                    // alert('234 '+wxconfigData.signature)
                    //如果存在，直接设置
                    this.wxReady(wxconfigData);
                } else {
                    // alert('101  http://wx.isafeiot.com/server/wechat/jsauth' + '?appId=' + appid + '&url=' + encodeURIComponent(location.href.split('#')[0]));
                    //如果不存在，则从接口读；  
                    const appid = window.sessionStorage.getItem('appid') || this.$route.query['appid'];
                    this.$axios({
                        url: 'http://wx.isafeiot.com/server/wechat/jsauth' + '?appId=' + appid + '&url=' + encodeURIComponent(location.href.split('#')[0]),
                        // url: 'http://www.365lbs.com/iot/wechat/jsauth' + '?appId=' + appid + '&url=' + encodeURIComponent('http://iot.365lbs.com/'),
                        method: 'post',
                    }).then(res => {
                        // alert(JSON.stringify(res));
                        window.sessionStorage.setItem('wxconfigData', JSON.stringify(res.data.data));
                        this.wxReady(res.data.data);
                    }).catch(err => {
                        // alert(JSON.stringify(err));
                        window.window.console.log(err);
                    });
                }
            },
              //微信初始化
            wxReady(wxcofigData) {
                const that = this;
                wx.config({
                    // debug: true,
                    appId: window.sessionStorage.getItem('appid') || this.$route.query['appid'],
                    timestamp: wxcofigData.timestamp,
                    nonceStr: wxcofigData.noncestr,
                    signature: wxcofigData.signature,
                    // jsApiList: ['configWXDeviceWiFi', 'onMenuShareAppMessage'],
                    jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData'],
                    // beta: true,
                });
                wx.ready(function () {
                    window.console.log('wx ready');
                });
                wx.error(function (res) {
                    that.$toast(res.err_msg);
                });
            },
            // 上传图片方法=========
             upload() {
                let that = this;
                // alert('275 '+that.imageVideoNumber);
                if ((that.imageVideoNumber) < 3) {
                    //从本地相册选择图片或使用相机拍照。
                    wx.chooseImage({
                        count: 3 - (that.imageVideoNumber), // 默认9 imageVideoNumber 记录图片和视频已经上传的数量
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: res => {
                            // alert("1==localIds======"+JSON.stringify(res.localIds)+"=="+res.localIds.length)
                            let localIds = res.localIds,  // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                         arr = that.tempFilePaths;
                        //  alert("localIds===="+JSON.stringify(localIds)+"arr==="+JSON.stringify(arr))
                        //    localIds = localIds.concat(arr) //拼接数组的方法
                            that.imageVideoNumber = localIds.length;
                            //  alert("2==localIds======"+JSON.stringify(localIds))
                            // that.tempFilePaths= localIds.slice(0); //用于页面中显示的图片路径 
                            //上传微信服务器，这两段代码挺好的，测试通过了,只是暂时用不上
                            that.mediaIds =that.mediaIds||[];
                            // var i=0;
                                syncUpload(localIds);
                            function syncUpload(localIds) {
                                if (!localIds.length) {
                                    window.console.log(localIds.length);
                                } else {
                                    var localId = localIds.pop();
                                    // alert("3==localId======"+JSON.stringify(localId))
                                    // 判断终端
                                    if (Utils.browser().ios) {
                                        // alert("ios")
                                        that.getLocalImgData(localId); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                                    } else {                       
                                        //   alert("4==localId======"+JSON.stringify( that.tempFilePaths))
                                        that.tempFilePaths.push(localId);
                                        //  alert("5==localId======"+JSON.stringify( that.tempFilePaths))
                                    }
                                    //上传图片接口
                                    wx.uploadImage({
                                        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                                        isShowProgressTips: 1, // 默认为1，显示进度提示
                                        success: r => {
                                            // i++;
                                            //  alert("uploadImage==mediaIds======"+JSON.stringify( that.mediaIds))
                                            that.mediaIds.push(r.serverId);
                                            //  alert("uploadImage==mediaIds======"+JSON.stringify( that.mediaIds))
                                              syncUpload(localIds);
                                        },
                                        fail: function (res) {
                                            alert(JSON.stringify(res));
                                            window.console.log(res);
                                            alert('上传图片失败，请重试')
                                        }
                                    });
                                }
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '上传数量已达上限',
                        showCancel: false,
                        success: function (res) {
                            window.console.log(res);
                        }
                    })
                }
            },
            //获取本地图片数据
            getLocalImgData(id) {
                let that = this;
                wx.getLocalImgData({
                    localId: id, // 图片的localID
                    success(res) {
                        let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                        if (!localData.includes('data:image')) {
                            //判断是否有这样的头部
                            localData = 'data:image/jpeg;base64,' + localData
                        }
                        localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg');
                        // that.$set(that.imgData, id, {src: localData});
                        // alert("ios==localId======"+JSON.stringify( that.tempFilePaths))
                        that.tempFilePaths.push(localData);
                        //  alert("ios==localId======"+JSON.stringify( that.tempFilePaths))
                    }
                });
            },
            // 删除图片的方法
            dele_image(i) {
                let that = this;
                let tempFilePaths = that.tempFilePaths;
                let index = i;//获取当前长按图片下标
                this.$dialog({
                    title: '删除图片',
                    message: '确定要删除此图片吗？',
                    showCancelButton: true,
                }).then(action => {
                    if (action == 'confirm') {
                        tempFilePaths.splice(index, 1);
                        that.mediaIds.splice(index, 1);
                        that.tempFilePaths = tempFilePaths;
                        that.imageVideoNumber = tempFilePaths.length;
                    }
                });
            },
            goMyFeedback() {
                //跳转提交反馈页面
                this.$router.push({
                    name: 'myFeedback',
                    query: {
                        appid: window.sessionStorage.getItem('appid') || this.$route.query['appid'],
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        background-color: #eee;
        padding-bottom: 20px;
        .ul {
            .li {
                .feedback_type {
                    padding: 0 16px 0 4px;
                    li {
                        float: left;
                        background: #fff;
                        padding: 0 4px;
                        margin: 0 8px;
                        border-radius: 3px;
                        border: 1px solid @darkxs;
                        color: #333;
                        font-size: 14px;
                        line-height: 2;
                        &.active {
                            background-color: @green;
                            border-color: @green;
                            color: #fff;
                        }
                    }
                }
                .field_container {
                    /* padding: 14px 16px 0; */
                    padding: 14px 0 0;
                    font-size: 12px !important;
                    .upload {
                        margin: 10px 16px 12px;
                        padding: 10px 0;
                        height: 60px;
                        border: 1px dashed @darks;
                        background: #fff;
                        text-align: center;
                        color: @green;
                        .iconfont {
                            display: block;
                            font-size: 30px;
                        }
                    }
                    .img_container {
                        background: transparent;
                        padding: 0 5px 0 7px;
                        .img_single {
                            position: relative;
                            width: 32%;
                            padding: 0 1px;
                            img {
                                width: 100%;
                                border: 2px solid #fff;
                            }
                            .dele_item {
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 14px;
                                height: 14px;
                                background: @orange;
                                border-radius: 50%;
                                line-height: 14px;
                                color: #fff;
                                text-align: center;
                            }
                        }
                    }
                    .field {
                        .mint-cell-wrapper {
                            font-size: 12px;
                        }
                    }
                }
                h3 {
                    margin: 0;
                    font-weight: 400;
                    font-size: 14px;
                    color: #999;
                    padding: 0.58rem .2rem .24rem;
                }
                .flex {
                    padding: 0 16px;
                    background: #fff;
                    .change {
                        width: 83%;
                        padding: 10px 0;
                        box-sizing: border-box;
                        line-height: 24px;
                        position: relative;
                        background-color: #fff;
                        color: #333;
                        font-size: 14px;
                        .set {
                            display: block-block;
                            vertical-align: middle;
                            margin-right: 8px;
                            font-size: 20px;
                            color: @green;
                        }
                    }
                    .gt {
                        width: 17%;
                        text-align: right;
                        padding: 10px 0;
                        box-sizing: border-box;
                        line-height: 24px;
                        position: relative;
                        background-color: #fff;
                        color: #333;
                        font-size: 14px;
                        .set {
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 20px;
                            color: #999;
                        }
                    }
                }
            }
        }
        .btn_contaienr {
            padding: 0.64rem 16px 0;
            .btn {
                background: @green;
            }
            .next {
                margin-top: 25px;
                font-size: 14px;
                color: @darkm;
                .blue {
                    color: #2d8cf0;
                }
            }
        }
    }
</style>
<style>
    .mint-cell-wrapper {
        font-size: 14px;
    }
</style>