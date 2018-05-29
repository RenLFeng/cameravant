<template>
    <div class="home-main">
        <div class="main-header-con">
            <div class="main-header">
                <div class="breadcrumb">
                    <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                </div>
                <div class="action">
                    <Button type="primary" @click="pageToPrev">返回</Button>
                    <Button type="primary" @click="doPrint">打印</Button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="content no-left">
                <div class="home-debugging-con">
                    <div class="tc">
                        <h3>{{productInfo.name}}</h3>
                        <p class="info">产品ID：
                            <span class="stress">{{productInfo.id}}</span>产品行业：
                            <span class="stress">{{productInfo.industry}}</span>连接方式：
                            <span class="stress">{{productInfo.connection}}</span>
                        </p>
                        <table class="mytable">
                            <thead>
                                <tr>
                                    <th width="10%">DPID</th>
                                    <th width="15%">功能类型</th>
                                    <th width="20%">名称</th>
                                    <th width="15%">数据点</th>
                                    <th width="40%">功能点属性</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in setsdata">
                                    <td>{{item.dpid}}</td>
                                    <td>{{item.functionType}}</td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.dataPoint}}</td>
                                    <td>{{item.functionAtrr}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="mytable">
                            <thead>
                                <tr>
                                    <th width="10%">DPID</th>
                                    <th width="20%">名称</th>
                                    <th width="20%">触发功能点</th>
                                    <th width="50%">触发属性</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in setsdata">
                                    <td>{{item.dpid}}</td>
                                    <td>{{item.trigger.name}}</td>
                                    <td>{{item.trigger.function}}</td>
                                    <td>{{item.trigger.attr}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="app">
                            <img :src="qrcodeSrc" alt="" class="img">
                            <h4>APP界面</h4>
                            <p>已选择模版02，扫码预览</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import breadcrumbNav from "../main-components/breadcrumb-nav.vue";
    import topTimeline from "../my-components/top-timeline";
    import leftInfo from "../my-components/left-info";
    export default {
        name: 'home_print',
        components: {
            breadcrumbNav,
            "top-timeline": topTimeline,
            "left-info": leftInfo
        },
        data() {
            return {
                productInfo: {
                    id: 23446,
                    name: "智能冷暖白光灯1(CW)",
                    avator:
                        "http://test.www.yuedujiayuan.com/activity-ui/spring-reading/images/act-student.jpg",
                    industry: '照明行业',
                    connection: "蓝牙"
                },
                setsdata: this.mockSetsData(),
                qrcodeSrc: require("../../images/product.png")
            };
        },
        computed: {
            currentPath() {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            // 跳上一步骤页面
            pageToPrev() {
                this.$router.go(-1);
            },
            doPrint() {
                window.print();
            },
            mockSetsData() {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push({
                        dpid: '00' + i,
                        functionType: '功能集',
                        name: 'GPS功能集' + i,
                        dataPoint: 'Smart.' + i,
                        functionAtrr: '浮点型/可读/23~36/两位小数/传输',
                        trigger: {
                            name: '烟雾报警',
                            function: '温度',
                            attr: '报警／电话／控制／开关反向'
                        }
                    })
                }
                return data;
            }
        }
    };
</script>
<style lang="less" scoped>
    .home-debugging-con {
        font-size: 14px;
        padding: 25px 2%;
        background: #fff;
        h3 {
            padding-bottom: 24px;
            font-size: 16px;
            color: #17233D;
            text-align: left;
        }
        .info {
            font-size: 14px;
            color: rgba(23, 35, 61, 0.80);
            line-height: 22px;
            .stress {
                padding-right: 25px;
                font-size: 14px;
                color: #0B1100;
            }
        }
        .mytable {
            width: 100%;
            margin-top: 25px;
            th {
                height: 48px;
                line-height: 48px;
                padding: 0 10px;
                background: rgba(20, 35, 63, 0.04);
                border-bottom: 1px solid rgba(23, 35, 61, 0.10);
                font-size: 12px;
                color: #17233D;
                text-align: left;
            }
            td {
                padding: 15px 10px;
                border-bottom: 1px solid rgba(23, 35, 61, 0.10);
                font-size: 14px;
                color: rgba(28, 36, 56, 0.80);
            }
        }
        .app {
            position: relative;
            padding: 36px 0 36px 136px;
            margin-top: 43px;
            margin-bottom: 150px;
            .img {
                position: absolute;
                width: 120px;
                height: 120px;
                top: 0;
                left: 0;
            }
            h4 {
                font-size: 16px;
                color: rgba(23, 35, 61, 0.80);
                line-height: 24px;
            }
            p {
                font-size: 14px;
                color: rgba(23, 35, 61, 0.80);
                line-height: 22px;
            }
        }
    }
</style>