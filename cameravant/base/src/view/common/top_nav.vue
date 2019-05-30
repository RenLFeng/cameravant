<template>
    <div class="header_common">
        <div class="flex">
                      <div class="right"><span class="iconfont icontianjia" @click="goDeviceAdd"></span></div>
  
            <div class="middle">
                <slot></slot>
            </div>
            <div class="left">
                <span class="iconfont iconiconfontzhizuobiaozhun023130" @click="showNav"></span>
                 <!-- <span class="fenxiang" @click="showNav"></span> -->
            </div>
        </div>
        <van-popup v-model="topNavShow" position="top" class="top_nav">
            <!-- <van-cell title="设备列表" is-link to="deviceList" />
            <van-cell title="设备添加" is-link to="deviceAdd" /> -->
           
            <van-cell title="共享授权" is-link to="shareAccount" />
            <van-cell title="授权列表" is-link to="sqList" />
            <van-cell title="添加用户" is-link to="userAdd" />
            <van-cell title="用户列表" is-link to="userList" />
            <van-cell title="PC访问授权" is-link to="userAuth" />
        </van-popup>
    </div>
</template>
<script>
    import {
        Popup,
        Cell, CellGroup
    } from 'vant';
    export default {
        components: {
            [Popup.name]: Popup,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
        },
        props: {
            tip: {
                type: String,
                default: '暂无内容'
            },
        },
        data() {
            return {
                topNavShow: false,
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            showNav() {
                  //跳转提交反馈页面
                this.$router.push({
                    name: 'shareAccount',
                    query: {
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
                })
                // this.topNavShow = true;
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
        },
        computed: {
        }
    }
</script>
<style lang="less">
    .header_common {
        width: 100%;
        z-index: 2;
        padding: 0px 11px 0px;
        box-sizing: border-box;
        background: #fff;
        margin-bottom: 10px;
        /* background-image: linear-gradient(-180deg, #29bdd9 0%, #276ace 60%); */
        .flex {
            align-items: center;
           
        }
        .left,
        .right {
            width: 20px;
            padding:5px;
            box-sizing:border-box;
            text-align:left;
        }
        .left{
             .fenxiang{
                 display: inline-block;
                 width: 18px;
                 height: 18px;
                 background: url(../../assets/fenxiang.png) no-repeat;
                background-size: 100% 100%;
            }
        }
        .right{
            text-align:right;
        }
        .middle {
            width: calc(~'100% - 60px');
            margin: 0 5px;
        }
        .iconfont {
            font-size: 20px;
            color: #000;
        }
        .top_nav {
            left: 0;
            top: 45px;
            width: 55%;
            transform: translate3d(0%, 0, 0);
            box-shadow:2px 2px 18px rgba(0,0,0,0.3);
             border-radius: 15px;
        }
        .van-overlay{
            background-color:rgba(0,0,0,0);
        }
    }
</style>