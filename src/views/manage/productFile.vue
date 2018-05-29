<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right productFile">
        <div class="top-bar clearfix">
            产品档案管理
            <div class="fr">
                <Select v-model="productType" style="width:160px" placeholder="产品类型">
                    <Option v-for="item in productTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="location" style="width:160px" placeholder="所在区域">
                    <Option v-for="item in locationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="location" style="width:160px" placeholder="产品版本">
                    <Option v-for="(item,index) in versionsSelected" :value="item.value" :key="item.value" :selected="index == 0 ? true : false">{{ item.label }}</Option>
                </Select>
            </div>
        </div>
        <div class="manage-content">
            <div class="content">
                <h3>档案列表
                    <Button type="ghost" class="ghost-blue fr" @click="resetConfirm">复位</Button>
                    <Button type="ghost" class="ghost-blue fr" @click="shutdownConfirm">关机</Button>
                    <Button type="ghost" class="ghost-blue fr" @click="upgradeConfirm">升级</Button>
                </h3>
                <table class="mytable">
                    <thead>
                        <tr>
                            <tr>
                                <th width="5%">
                                    <Checkbox v-model="tableData.allChecked" @on-change="checkAll(tableData)"></Checkbox>
                                    <!-- <input type="checkbox" v-model="tableData.allChecked" @change="checkAll(tableData)" /> -->
                                </th>
                                <th width="7%">序号</th>
                                <th width="10%">设备ID</th>
                                <th width="10%">上线状态</th>
                                <th width="10%">定位</th>
                                <th width="10%">版本号</th>
                                <th width="10%">是否最新版</th>
                                <th width="10%">设备激活时间</th>
                                <th width="8%">是否故障</th>
                                <th width="10%">故障原因</th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tableData.rows" :key="index">
                            <td>
                                <Checkbox v-model="item.checked" @on-change="check(tableData,item,index)"></Checkbox>
                                <!-- <input type="checkbox" v-model="item.checked" @change="check(tableData,item,index)" /> -->
                            </td>
                            <td>{{item.no}}</td>
                            <td>{{item.deviceId}}</td>
                            <td>{{item.online}}</td>
                            <td>{{item.location}}</td>
                            <td>{{item.version}}</td>
                            <td>{{item.isLatest}}</td>
                            <td>{{item.activeTime}}</td>
                            <td>{{item.isBreakdown}}</td>
                            <td>{{item.reason}}</td>
                        </tr>
                    </tbody>
                </table>
                <Page :total="100" :page-size="10" :current="1" @on-change="changePage" class="page"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "productFile",
        data() {
            return {
                tableData: {
                    allChecked: false,
                    rows: []
                },
                productType: '',
                productTypeList: [{
                    label: "产品类型一", value: "systemMsg",
                    versions: [{
                        label: 'v1.1',
                        value: 'v1.1'
                    }, {
                        label: 'v2.1',
                        value: 'v2.1'
                    },
                    {
                        label: 'v3.1',
                        value: 'v3.1'
                    },
                    {
                        label: 'v4.1',
                        value: 'v4.1'
                    },]
                },
                {
                    label: "产品类型二", value: "upgradeMsg",
                    versions: [{
                        label: 'v11.1',
                        value: 'v11.1'
                    }, {
                        label: 'v12.1',
                        value: 'v12.1'
                    },
                    {
                        label: 'v13.1',
                        value: 'v13.1'
                    },
                    {
                        label: 'v14.1',
                        value: 'v14.1'
                    },]
                },
                {
                    label: "产品类型三", value: "eventMsg",
                    versions: [{
                        label: 'v21.1',
                        value: 'v21.1'
                    }, {
                        label: 'v22.1',
                        value: 'v22.1'
                    },
                    {
                        label: 'v23.1',
                        value: 'v23.1'
                    },
                    {
                        label: 'v24.1',
                        value: 'v24.1'
                    },]
                }
                ],
                location: "",
                locationList: [
                    { label: "北京", value: "beijing" },
                    { label: "上海", value: "shanghai" },
                    { label: "深圳", value: "shenzhen" }
                ],
                auditCondition: "",
                auditConditionList: [
                    { label: "审核中", value: "aduiting" },
                    { label: "审核未通过", value: "aduitFaild" },
                    { label: "审核成功", value: "aduitSuc" },
                    { label: "审核撤销", value: "aduitRevoke" }
                ],
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "productFile");
        },
        mounted() {
            this.mockTableData();
        },
        computed: {
            versionsSelected: {
                get: function () {
                    var that = this;
                    if(!!that.productType){
                        return this.productTypeList.filter(item=> {
                            return item.value == that.productType;
                        })[0].versions;
                    }
                }
            }
        },
        methods: {
            mockTableData() {
                for (let i = 0; i < 10; i++) {
                    this.tableData.rows.push({
                        no: "00" + (i + 1),
                        deviceId: parseInt(Math.floor(Math.random() * 1000)),
                        online: ["在线", "离线"][Math.floor(Math.random() * 2)],
                        location: "北京东城区",
                        version: "V2.3",
                        isLatest: ["是", "否"][Math.floor(Math.random() * 2)],
                        activeTime: "2018.2.12 18:21:21",
                        isBreakdown: ["是", "否"][Math.floor(Math.random() * 2)],
                        reason: "未知"
                    });
                }
            },
            changePage() {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.mockTableData();
            },
            check(tableData, item, index) {
                let isAllChecked = tableData.rows.every(val => {
                    return !!val.checked;
                });
                tableData.allChecked = isAllChecked;
            },
            checkAll(tableData) {
                tableData.rows.forEach(element => {
                    element.checked = tableData.allChecked;
                });
            },
            dotClass(label) {
                function checkAdult(string) {
                    return string == label;
                }
                var strings = ["审核中", "审核成功", "审核未通过", "审核撤销"];
                return 'dot dot' + strings.findIndex(checkAdult);
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            upgradeConfirm () {
                this.$Modal.confirm({
                    title: '升级',
                    content: '<p>是否确认将选中的产品将进行批量升级？</p>',
                    onOk: () => {
                        this.$Message.info('所选产品将请求app进行升级，请稍等');
                    },
                    onCancel: () => {
                        this.$Message.info('已取消升级');
                    }
                });
            },
            shutdownConfirm () {
                this.$Modal.confirm({
                    title: '关机',
                    content: '<p>是否确认将选中的产品进行批量关机？</p>',
                    onOk: () => {
                        this.$Message.info('所选产品将请求app进行关机，请稍等');
                    },
                    onCancel: () => {
                        this.$Message.info('已取消关机');
                    }
                });
            },
            resetConfirm () {
                this.$Modal.confirm({
                    title: '复位',
                    content: '<p>是否确认将选中的产品进行批量复位？</p>',
                    onOk: () => {
                        this.$Message.info('所选产品将请求app进行复位，请稍等');
                    },
                    onCancel: () => {
                        this.$Message.info('已取消复位');
                    }
                });
            },
        }
    };
</script>
<style lang="less" scoped>
    .productFile {
        .fr {
            float: right;
        }
        .ghost-blue {
            margin-left: 5px;
        }
        .content {
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
            border-radius: 2px;
            .feedbackSelect {
                float: right;
                .selected {
                    color: #2D8CF0;
                }
            }
            .mytable {
                width: 100%;
                th {
                    padding: 12px 2px;
                    background: rgba(20, 35, 63, 0.04);
                    font-size: 12px;
                    color: #17233D;
                    text-align: left;
                    &:first-child,
                    &:last-child {
                        text-align: center;
                    }
                }
                td {
                    padding: 5px 2px;
                    font-size: 14px;
                    color: rgba(28, 36, 56, 0.80);
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
                    .dot {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        margin-right: 5px;
                        vertical-align: middle;
                        &0 {
                            background: #008CF8;
                        }
                        &1 {
                            background: #38BA4C;
                        }
                        &2 {
                            background: rgba(23, 35, 61, 0.25);
                        }
                        &3 {
                            background: #ed3f14;
                        }
                    }
                }
            }
            .page {
                margin-top: 20px;
                float: right;
            }
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
            .posR {
                position: relative;
            }
        }
    }
</style>