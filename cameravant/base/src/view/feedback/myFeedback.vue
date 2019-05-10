<template>
    <div class="feedback" v-if="Object.keys(feedbackList).length>0">
        <ul class="feedback_list">
            <li class="flex" v-for="(item,index) in feedbackList" @click="setFeedbackItem(item)" :key='index'>
                <div class="left">
                    <span class="name ellipsis">{{item.content}}</span>
                    <span class="time ellipsis">{{item.createTime}}</span>
                </div>
                <span class="link ivu-icon ivu-icon-ios-arrow-right"></span>
            </li>
        </ul>
        <van-popup v-model="popDetail" position="right" class="pop_detail" v-if="Object.keys(feedbackItem).length>0">
            <div class="pop_container">
                <div class="time">{{feedbackItem.createTime}}</div>
                <div class="type flex"><span class="title">联系人：</span>{{feedbackItem.contact}}</div>
                <div class="con flex">
                    <span class="title">反馈内容：</span>
                    <p>
                        {{feedbackItem.content}}
                    </p>
                    <div class="imgs" v-if="feedbackItem.pic1">                    
                        <img :src="feedbackItem.pic1" alt="">
                        <img :src="feedbackItem.pic2" alt="" v-if="feedbackItem.pic2">
                        <img :src="feedbackItem.pic3" alt="" v-if="feedbackItem.pic3">
                    </div>
                </div>
                <div class="btn_container">
                    <van-button type="default" size="large"  @click="popDetail=false" class="btn">返回</van-button>
                </div>
            </div>
        </van-popup>
    </div>
    <empty v-else>
        <span @click="goFeedback">暂无反馈，先去<span class="blue">提交反馈</span>吧~</span>
    </empty>
</template>

<script>
    import empty from '@/view/common/empty'
   
    import { Popup } from 'vant';
    import { Button } from 'vant';
    export default {
        components: {
            empty,
            [Popup.name]:Popup,
            [Button.name]:Button,
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
                feedbackList: [],
                popDetail: false,
                feedbackItem: {
                },
            }
        },
        created() {
        },
        mounted() {
            this.getOpenId();
        },
        methods: {
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/myFeedback').then(resolve => {
                    this.openid = resolve;
                    this.getFeedbackList(resolve);
                });
            },
            getFeedbackList(openid) {
                const that = this;
                let data = {};
                if (openid) {
                    data.clientId = openid;
                }else{
                    data.openId=window.sessionStorage.getItem('openid');
                }
                this.axios.post(this.api.feedbackList, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        this.feedbackList = res.content;
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            setFeedbackItem(item) {
                this.feedbackItem = item;
                this.popDetail = true;
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
            goFeedback(){
                //跳转提交反馈页面
                this.$router.push({
                    name: 'feedback',
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
        height:100vh;
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
                .left{
                    width: calc(~'100% - 6px');
                    &>span{
                        display: block;
                        width: 100%;
                        text-align: left;
                    }
                    .time {
                        color:@darks;
                    }
                    .name {
                    }
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
            .pop_container{
                width: 100%;
                height: 100%;
                overflow-x:hidden;
                overflow-y:scroll;
                -webkit-overflow-scrolling: touch; 
            }
            .time{
                padding:14px 16px 16px;
                color:@darkm;
                font-size:12px;
                text-align:left;
            }
            .flex{
                padding:5px 16px;
                font-size:14px;
                align-items: center;
                span{
                    width:80px;
                    color:@darkl;
                }
                p{
                    width:calc(~'100% - 85px');
                    color:@dark;
                }
                .imgs{
                    margin-top: 25px;
                    img{
                        width:100%;
                    }
                }
            }
            .btn_container{
                padding:42px 4px 10px;
                .btn{
                    /* background:@orange; */
                }
            }
        }
    }
</style>