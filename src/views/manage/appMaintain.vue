<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appMaintain">
        <div class="top-bar">
            APP维护
        </div>
        <div class="manage-content">
            <div class="content">
                <h3>APP版本分布概况</h3>
                <div class="charts clearfix">
                    <div class="fl">
                        <div id="appVersion"></div>
                    </div>
                    <div class="fr">
                        <ul class="appVersionLegend">
                            <li v-for="item in versions">
                                <b class="icon" :style="{background:item.color}"></b>版本号{{item.version}}
                                <i class="percent">{{item.percent}}</i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content">
                <h3>用户画像</h3>
                <div class="charts clearfix">
                    <div class="fl posR">
                        <h4>性别分布</h4>
                        <div id="sexDistribution"></div>
                        <ul class="sexDistributionLegend">
                            <li v-for="item in sexDistributionData">
                                <Icon :type="item.name=='男性'?'man':'woman'" :color="item.color" class="genderIcon"></Icon>
                                <p class="gender">{{item.name}}</p>
                                <p class="percent">{{(item.value*100/(sexDistributionData[0].value+sexDistributionData[1].value)).toFixed(2)}}%</p>
                            </li>
                        </ul>
                    </div>
                    <div class="fr">
                        <h4>年龄分布</h4>
                        <div id="ageDistribution"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "appMaintain",
        data() {
            return {
                versions: this.mockVersions(),
                appVersion: null,
                sexDistributionData: this.mocksexDistribution(),
                sexDistribution: null,
                ageDistributionData: this.mockageDistribution(),
                ageDistribution: null
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "appMaintain");
        },
        mounted() {
            console.log(this.versions);
            var _this = this;
            //基于准备好的dom，初始化echarts实例
            this.appVersion = echarts.init(document.getElementById('appVersion'));
            this.sexDistribution = echarts.init(document.getElementById('sexDistribution'));
            this.ageDistribution = echarts.init(document.getElementById('ageDistribution'));
            let appVersionData = [];
            for (var i in this.versions) {
                appVersionData[i] = {
                    value: this.versions[i].num,
                    name: this.versions[i].version
                }
            };
            this.appVersion.setOption({
                color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
                title: {
                    text: '',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a}{b} : {c} ({d}%)"
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    left: 'left',
                    data: ['', '', '', '', '']
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        data: appVersionData,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                    }
                ]
            });
            this.sexDistribution.setOption({
                color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
                title: {
                    text: '',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a}<br />{b} : {c} ({d}%)"
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    left: 'left',
                    data: ['', '']
                },
                series: [
                    {
                        name: '性别分布',
                        type: 'pie',
                        radius: ['60%', '70%'],
                        avoidLabelOverlap: false,
                        data: _this.sexDistributionData,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                    }
                ]
            });
            let ageDistributionName = [], ageDistributionVal = [];
            for (var i in this.ageDistributionData) {
                ageDistributionName.push(this.ageDistributionData[i].name);
                ageDistributionVal.push(this.ageDistributionData[i].value);
            };
            this.ageDistribution.setOption({
                color: ['#2D8CF0'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{b}:{c}%'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ageDistributionName,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#aaa"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: "transparent"
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '60%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}%'
                            }
                        },
                        data: ageDistributionVal
                    }
                ]
            });
        },
        methods: {
            mockVersions() {
                let data = [],
                    colors = ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
                    percentlist = [30, 40, 5, 65, 88],
                    all = 0;
                percentlist.map(function (item, index, array) { all += item; console.log(all); });
                for (let i = 0; i < 5; i++) {
                    data.push({
                        color: colors[i],
                        version: 'V' + (i + 10) + '.6',
                        percent: (percentlist[i] * 100 / all).toFixed(2) + '%',
                        num: percentlist[i]
                    });
                }
                return data;
            },
            mocksexDistribution() {
                let data = [],
                    sex = ['男性', '女性'],
                    colors = ['#2D8CF0', '#2DE2C5'];
                for (let i = 0; i < 2; i++) {
                    data.push({
                        value: (Math.random()).toFixed(4) * 10000,
                        name: sex[i],
                        color: colors[i]
                    });
                }
                return data;
            },
            mockageDistribution() {
                let data = [],
                    age = ['<19岁', '19-25岁', '26-35岁', '36-45岁', '46-55岁', '>55岁'],
                    colors = ['#2D8CF0'];
                for (let i = 0; i < age.length; i++) {
                    data.push({
                        value: parseInt(Math.random().toFixed(2) * 100),
                        name: age[i],
                        color: colors[0]
                    });
                }
                return data;
            }
        }
    };
</script>
<style lang="less" scoped>
    .appMaintain {
        .content {
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
            border-radius: 2px;
            h3 {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(23, 35, 61, 0.10);
                font-weight: normal;
                font-size: 16px;
                color: #17233D;
            }
            h4 {
                padding: 20px 24px;
                font-size: 14px;
                color: rgba(28, 36, 56, 0.80);
                font-weight: normal;
            }
            #appVersion,
            #sexDistribution {
                margin-top: 10px;
                width: 80%;
                height: 224px;
            }
            #ageDistribution {
                margin-top: 10px;
                width: 100%;
                height: 224px;
            }
            .fl {
                float: left;
                width: 50%;
                box-sizing: border-box;
            }
            .fr {
                width: 50%;
                float: right;
                box-sizing: border-box;
            }
            .posR {
                position: relative;
            }
            .charts>.fr {
                width: 49%;
                border-left: 1px solid rgba(23, 35, 61, 0.10);
            }
            .appVersionLegend {
                padding: 10px 27px 22px;
                list-style-type: none;
                li {
                    padding: 12px 4px 12px 4px;
                    border-bottom: 1px solid rgba(28, 36, 56, 0.08);
                    font-size: 14px;
                    color: rgba(28, 36, 56, 0.80);
                    .icon {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 12px;
                        background: #2D8CF0;
                        border-radius: 2px;
                        vertical-align: middle;
                    }
                    .percent {
                        float: right;
                        font-style: normal;
                        font-size: 14px;
                        color: rgba(28, 36, 56, 0.56);
                    }
                }
            }
            .sexDistributionLegend {
                position: absolute;
                width: 20%;
                left: calc(~'70% - 45px');
                top: 110px;
                list-style-type: none;
                li {
                    position: relative;
                    padding-left: 28px;
                    margin: 14px 0;
                    .genderIcon {
                        position: absolute;
                        top: 5px;
                        left: 0;
                        font-size: 44px;
                    }
                    .gender {
                        font-size: 14px;
                        color: #495060;
                    }
                    .percent {
                        font-size: 20px;
                        color: #495060;
                    }
                }
            }
        }
    }
</style>