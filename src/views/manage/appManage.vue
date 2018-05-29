<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appManage">
        <div class="top-bar">
            APP管理
        </div>
        <div class="manage-content">
            <ul class="appManageUl clearfix">
                <li>
                    <span>APP用户总量</span>
                    <b class="num">540,000,000</b>
                </li>
                <li>
                    <span>APP活跃用户量</span>
                    <b class="num">68,000,000</b>
                </li>
                <li>
                    <span>APP绑定产品数量</span>
                    <b class="num">3,560,000</b>
                </li>
                <li>
                    <span>APP解绑产品数量</span>
                    <b class="num">230,000</b>
                </li>
            </ul>
            <div class="content">
                <h3>APP解绑用户原因</h3>
                <div class="charts clearfix">
                    <div class="fl">
                        <div id="appVersion"></div>
                    </div>
                    <div class="fr">
                        <ul class="appVersionLegend">
                            <li v-for="item in versions">
                                <b class="icon" :style="{background:item.color}"></b>{{item.reason}}
                                <i class="percent">{{item.percent}}</i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content">
                <h3>用户反馈信息
                    <ButtonGroup shape="circle" class="feedbackSelect">
                        <Button v-for="item in feedbackTypes" :key="item.value" type="ghost" :class="item.selected?'selected':''" @click="toggleSelect(item)">{{item.text}}</Button>
                    </ButtonGroup>
                </h3>
                <table class="mytable">
                    <thead>
                        <tr>
                            <th width="10%">标记</th>
                            <th width="15%">用户帐号</th>
                            <th width="25%">反馈内容</th>
                            <th width="20%">反馈时间</th>
                            <th width="20%">绑定产品名称／ID</th>
                            <th width="10%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in feedBackData" :key="index">
                            <td v-if="item.ifCollectioned">
                                <Icon type="ios-star" color="#f5a624"></Icon>
                            </td>
                            <td v-else>
                                <Icon type="ios-star-outline" color="#c5c8ce"></Icon>
                            </td>
                            <td>{{item.rdCnt}}</td>
                            <td class="feedbackCon">{{item.articleTitle}}</td>
                            <td>{{item.upTime}}</td>
                            <td>{{item.articleUrl}}</td>
                            <td>
                                <Icon type="trash-b" size="20" color="#2d8cf0" @click.native="deleteData(item, index)"></Icon>
                                <a href="javascript:void(0)" @click="modalDetail=true">详情</a>
                                <Modal v-model="modalDetail" title="用户反馈详情" class="modal">
                                    <Row class="mtb15">
                                        <Col class="label" span="5">用户帐号</Col>
                                        <Col span="19"> 15603019892
                                        </Col>
                                    </Row>
                                    <Row class="mtb15">
                                        <Col class="label" span="5">反馈时间</Col>
                                        <Col span="19"> 2018.02.20 12:00:00
                                        </Col>
                                    </Row>
                                    <Row class="mtb15">
                                        <Col class="label" span="5">产品ID</Col>
                                        <Col span="19"> DSFAJDFHS2389OL
                                        </Col>
                                    </Row>
                                    <Row class="mtb15">
                                        <Col class="label" span="5">反馈内容</Col>
                                        <Col span="19"> 用户反馈内容，列表内最多显示20个字，其余省略用户反馈内容，列表内最多显示其余省略...
                                        </Col>
                                    </Row>
                                </Modal>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Page :total="pageData.total" :page-size="pageData.pageSize" @on-change="changePage" style="margin-top:20px;float: right;"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "appManage",
        data() {
            return {
                versions: this.mockVersions(),
                appVersion: null,
                feedbackTypes: [
                    { text: "已读", selected: false, value: 1 },
                    { text: "未读", selected: false, value: 2 },
                    { text: "标记", selected: false, value: 3 },
                ],
                // 把所有参数都默认设置一下（这里的字段，可以跟参数一样，然后直接把pageData扔进axios里，也可以不一样，然后一个一个取。我偏向于一个一个取，因为我不喜欢下划线）
                pageData: {
                    type: 1, // 默认的类型
                    pageNo: 1, // 默认第一页
                    pageSize: 2, // 默认一页取2条（一般来讲这里是按需求固定不变的。我设为2条好看效果，因为接口数据不多）
                    gradeId: 1, // 这是另一个参数（这条接口要用，但是桃桃你项目里没有按钮来切换，我就定死了）
                    total: 0 // 这个配合翻页用，默认为0，读接口拿到之后，跟着变
                },
                feedBackData: [],
                modalDetail: false
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "appManage");
        },
        created() {
            // 初次加载获取默认数据
            this.getFeedBack();
        },
        mounted() {
            var _this = this;
            //基于准备好的dom，初始化echarts实例
            this.appVersion = echarts.init(document.getElementById('appVersion'));
            let appVersionData = [];
            for (var i in this.versions) {
                appVersionData[i] = {
                    value: this.versions[i].num,
                    name: this.versions[i].reason
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
        },
        methods: {
            // 获取意见反馈表格数据
            getFeedBack() {
                const pageData = this.pageData;
                // 接口一般需要验证身份，有的开发喜欢放在头部headers里，有的喜欢以参数形式。这条接口是以参数形式。
                this.axios.get(this.api.feedBack + '?login_no=13812345678&access_token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5dWVkdS1hcHAtc2VjdXJpdHkiLCJzdWIiOiIxMzgxMjM0NTY3OCIsImF1ZCI6InVzZXIiLCJleHAiOjE1MzEyNzQyMDEsImlhdCI6MTUyNjA5MDIwMSwianRpIjoiMS4xIn0.gFtetEhLHdO0bG9-mZJAeq19g-pH69rjTiojv2cUt84', {
                    // headers: {
                    //     userid: '1011200069',
                    //     access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5dWVkdS1hcHAtc2VjdXJpdHkiLCJzdWIiOiIxMDExMjAwMDY5IiwiYXVkIjoidXNlciIsImV4cCI6MTUzMjE2MzEwMSwiaWF0IjoxNTI2OTc5MTAxLCJqdGkiOiIxLjEifQ.IRSThisAyRUNqMZqwvQ8OxSh7oehoFJ5tqYqDhyfbqk'
                    // },
                    params: {
                        type: pageData.type,
                        page_no: pageData.pageNo,
                        page_size: pageData.pageSize,
                        grade_id: pageData.gradeId
                    }
                }).then(res => {
                    const resData = res.data;
                    // code 的错误一般是数据出错了。错误处理：UI设计得合理的话可以在页面放个错误提示，简单粗暴的话，就直接弹个窗好了
                    if (resData.code !== 100) {
                        this.feedBackData = [];
                        this.$Modal.error({
                            title: '错误',
                            content: '数据获取失败'
                        });
                        return;
                    }
                    const arrData = resData.data.records || [];
                    // 没有数据的提示
                    if (arrData.length === 0) {
                        this.feedBackData = [];
                        this.$Modal.warning({
                            title: '提示',
                            content: '没有数据'
                        });
                        return;
                    }
                    // 到这里那就是有数据了（只是做案例的话，我就不处理数据，直接赋值了哈）
                    // 先改变翻页的总数，再赋值数组
                    this.pageData.total = resData.data.total;
                    this.feedBackData = arrData;
                    console.log(arrData);
                }).catch(res => {
                    // 这里的错误大多是服务器挂了或者接口挂了（你的js写错了也会进这里，所以以后有空要去axios的封装函数那里区分一下）
                    this.feedBackData = [];
                    this.$Modal.error({
                        title: '错误',
                        content: '网络请求错误，数据未获取'
                    });
                });
            },
            // 点击切换类型并更新数据
            toggleSelect(data) {
                // 已经选中了就啥都别做（很多时候都要这么判断一下，免得重复加载，多余动作）
                if (data.selected) {
                    return;
                }
                // 变换样式
                this.feedbackTypes.forEach(obj => {
                    obj.selected = false;
                });
                data.selected = true;
                // 变完样式后变参数
                this.pageData.type = data.value;
                // 然后重新获取数据（这里就要看需求了，切换类型的时候，需不需要把当前页面回到1.大部分情况下是需要的）
                this.pageData.pageNo = 1;
                this.getFeedBack();
            },
            // 点击翻页更新数据
            changePage(num) {
                // num是翻页插件返回的页码，就赋给我们的参数
                this.pageData.pageNo = num;
                // 然后再读接口拿最新数据啦（一般需求是 翻页的时候不改变上面的类型的）
                this.getFeedBack();
            },
            // 删除一条数据（麻蛋，小图标组件的click事件还要加.native）
            deleteData(item, index) {
                // 一般来讲，删除列表数据都是要读接口，然后参数是这条数据的id
                const id = item.id;
                // 我这条接口没有删除功能，就不做了哈
                this.axios.post('接口', { params: '参数' }).then(res => {
                    // 删除成功后搞个弹窗提醒
                    this.$Message.success('删除成功！');
                    // 如果数据都不会更新太快的，就手动干掉这条
                    this.feedBackData.splice(index, 1); // 你要是做全面一点，还可以判断你是否把页面显示的全都删光了，删光了就往后翻页或者往前翻页
                    // 否则的话，就再刷新一遍数据就好（简单省事）
                    this.getFeedBack();
                }).then(res => {
                    // 删除失败的报错
                    //XXXX
                });
            },
            mockVersions() {
                let data = [],
                    colors = ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
                    percentlist = [30, 40, 5, 65, 88],
                    reasons = ['系统崩溃', '功能失灵', '设备故障', '更换手机设备', '闲置设备'],
                    all = 0;
                percentlist.map(function (item, index, array) { all += item; console.log(all); });
                for (let i = 0; i < 5; i++) {
                    data.push({
                        color: colors[i],
                        reason: reasons[i],
                        percent: (percentlist[i] * 100 / all).toFixed(2) + '%',
                        num: percentlist[i]
                    });
                }
                return data;
            }
        }
    };
</script>
<style lang="less" scoped>
    .appManage {
        .appManageUl {
            list-style-type: none;
            li {
                float: left;
                width: calc(~"25% - 11px");
                margin: 0px 14px 22px 0;
                padding: 22px 25px;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
                box-sizing: border-box;
                &:last-child {
                    margin-right: 0;
                }
                span {
                    font-size: 14px;
                    color: #80848f;
                }
                .num {
                    display: block;
                    font-size: 24px;
                    color: #1c2438;
                    font-weight: normal;
                }
            }
        }
        .content {
            background: #ffffff;
            box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
            border-radius: 2px;
            .mytable {
                width: 100%;
                th {
                    padding: 12px 2px;
                    background: rgba(20, 35, 63, 0.04);
                    font-size: 12px;
                    color: #17233d;
                    text-align: left;
                    &:first-child,
                    &:last-child {
                        text-align: center;
                    }
                }
                td {
                    padding: 5px 2px;
                    font-size: 14px;
                    color: rgba(28, 36, 56, 0.8);
                    &.feedbackCon {
                        display: inline-block;
                        width: 98%;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                    }
                    &:first-child,
                    &:last-child {
                        text-align: center;
                    }
                }
            }
            h3 {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(23, 35, 61, 0.1);
                font-weight: normal;
                font-size: 16px;
                color: #17233d;
                .feedbackSelect {
                    float: right;
                    margin-top: -4px;
                    .selected {
                        color: #2d8cf0;
                    }
                }
            }
            h4 {
                padding: 20px 24px;
                font-size: 14px;
                color: rgba(28, 36, 56, 0.8);
                font-weight: normal;
            }
            #appVersion {
                margin-top: 10px;
                width: 80%;
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
            .appVersionLegend {
                padding: 10px 27px 22px;
                list-style-type: none;
                li {
                    padding: 12px 4px 12px 4px;
                    border-bottom: 1px solid rgba(28, 36, 56, 0.08);
                    font-size: 14px;
                    color: rgba(28, 36, 56, 0.8);
                    .icon {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 12px;
                        background: #2d8cf0;
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
        }
    }

    .modal {
        .label {
            padding-left: 10px;
            color: #17233D;
        }
    }
</style>