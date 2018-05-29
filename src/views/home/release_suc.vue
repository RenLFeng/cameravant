<template>
    <div class="home-main">
        <div class="main-header-con">
            <div class="main-header">
                <div class="breadcrumb">
                    <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                </div>
                <top-timeline :cur-step="4" />
                <div class="action">
                    <Button type="primary" @click="pageToPrev">上一步</Button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <left-info :product-info="productInfo" />
            <div class="content">
                <div class="home-debugging-con">
                    <div class="tc">
                        <span class="span-suc">
                            <Icon type="ios-checkmark-empty" class="icon-suc"></Icon>
                        </span>
                        <h3>提交成功</h3>
                        <p>提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message 全局提示反馈即可。本文字区域可以展示简单的补充说明，如果有类似展示“单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。</p>
                        <div class="info">
                            <span class="title">智能冷暖色台灯</span>
                            <span class="detail">产品ID：20181223</span>
                            <span class="detail">账号：13489002390</span>
                            <span class="detail">审核时间：2018.02.20 12:00:00</span>
                        </div>
                        <ul class="release_timeline">
                            <li v-for="(item,index) in steps" :class="{active:cur>=index+1,current:cur===index+1}" :key="index">
                                <span class="timeline_icon">●</span>
                                <br />
                                <span class="timeline_text">{{item.step}}</span>
                                <br />
                                <span class="timeline_time">{{item.time}}</span>
                            </li>
                        </ul>
                        <div>
                            <Button type="primary" style="width:148px;height:40px;margin-right:10px;">查看产品信息</Button>
                            <Button type="primary" style="width:80px;height:40px;" @click="pageToPrint">打印</Button>
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
        name: 'home_publish',
        components: {
            breadcrumbNav,
            "top-timeline": topTimeline,
            "left-info": leftInfo
        },
        data() {
            return {
                cur: 2,
                steps: [{ step: "提交申请", time: "2016.02.20 12:00:00" }, { step: "系统审核", time: "2016.02.20 12:00:00" }, { step: "发布成功", time: "2016.02.20 12:00:00" }],
                productInfo: {
                    id: 23446,
                    name: "智能冷暖白光灯1(CW)",
                    avator:
                        "http://test.www.yuedujiayuan.com/activity-ui/spring-reading/images/act-student.jpg"
                },
                step1Url: require("../../images/debugging_step_1.png"),
                step2Url: require("../../images/debugging_step_2.jpg")
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
            // 跳提交打印预览页面
            pageToPrint() {
            this.$router.push("/home/print");
            }
        }
    };
</script>
<style lang="less" scoped>
    .home-debugging-con {
        font-size: 14px;
        padding: 25px 2%;
        background: #fff;
        .tc {
            text-align: center;
        }
        .span-suc {
            display: inline-block;
            margin: 24px 0;
            width: 48px;
            height: 48px;
            background-image: linear-gradient(-133deg, #57C257 0%, #89D970 89%);
            box-shadow: 0 4px 8px 0 rgba(90, 195, 88, 0.50);
            border-color: #fff;
            border-radius: 50%;
            text-align: center;
            .icon-suc {
                color: #fff;
                line-height: 48px;
                font-size: 48px;
            }
        }
        h3 {
            font-size: 20px;
            color: #14233F;
        }
        p {
            width: 534px;
            margin: 24px auto;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(28, 36, 56, 0.55);
            text-align: center;
            line-height: 24px;
        }
        .info {
            .title {
                font-weight: bold;
                font-size: 14px;
                color: rgba(23, 35, 61, 0.80);
            }
            .detail {
                margin-left: 33px;
                font-size: 12px;
                color: rgba(23, 35, 61, 0.80);
            }
        }
        h4 {
            padding: 15px 40px;
            border-bottom: 1px solid rgba(23, 35, 61, 0.10);
            font-size: 14px;
            color: #17233D;
        }
        .release_timeline {
            display: inline-block;
            margin: 49px auto;
            list-style-type: none;
            text-align: center;
            overflow: hidden;
            li {
                position: relative;
                width: 250px;
                height: 94px;
                float: left;
                text-align: center;
                &:before {
                    content: "";
                    position: absolute;
                    top: 11px;
                    left: -50%;
                    width: 100%;
                    height: 0;
                    border-top: 2px solid rgba(23, 35, 61, 0.35);
                    z-index: 0;
                }
                & .timeline_icon {
                    position: absolute;
                    top: 0px;
                    left: calc(~"50% - 13px");
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: #fff;
                    border: 1px solid #c0c0c0;
                    box-sizing: border-box;
                    color: rgba(23, 35, 61, 0.35);
                    font-size: 24px;
                    line-height: 22px;
                    text-align: center;
                    z-index: 1;
                }
                & .timeline_text {
                    display: inline-block;
                    padding-top: 16px;
                    font-size: 12px;
                    color: #14233F;
                }
                & .timeline_time {
                    font-size: 12px;
                    color: rgba(23, 35, 61, 0.55);
                }
                &:first-child:before {
                    display: none;
                }
                &.active,
                &.current {
                    & .timeline_icon {
                        color: #008cf8;
                    }
                    &:before {
                        border-color: #008cf8;
                    }
                }
            }
        }
    }
</style>