<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right msg">
        <div class="top-bar clearfix">
            APP消息推送
            <div class="fr">
                <Select v-model="pushType" style="width:160px" placeholder="推送类型">
                    <Option v-for="item in pushTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="auditCondition" style="width:160px" placeholder="审核状态">
                    <Option v-for="item in auditConditionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 240px"></DatePicker>
                <Button class="create" type="primary" icon="plus" @click="modalAddPush = true">新增推送</Button>
                <Modal v-model="modalAddPush" title="新增推送" @on-ok="handleSubmit('formValidate')">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left" :label-width="76">
                        <FormItem label="消息题目" prop="title">
                            <Input v-model="formValidate.title" placeholder="请消息题目"></Input>
                        </FormItem>
                        <FormItem label="推送类型" prop="pushType">
                            <Select v-model="formValidate.pushType" placeholder="请选择">
                                <Option v-for="item in pushTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>                            
                            </Select>
                        </FormItem>
                        <FormItem label="推送版本" prop="version">
                            <RadioGroup v-model="formValidate.version">
                                <Radio label="全部版本">全部版本</Radio>
                                <Radio label="female">除去最新</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="推送时间">
                            <Row>
                                <Col span="12">
                                <FormItem prop="date">
                                    <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem prop="time">
                                    <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                                </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="消息内容" prop="desc">
                            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入消息内容…"></Input>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        </div>
        <div class="manage-content">
            <div class="content">
                <h3>消息列表
                    <Button type="ghost" class="ghost-blue fr">撤销审核</Button>
                </h3>
                <table class="mytable">
                    <thead>
                        <tr>
                            <tr>
                                <th width="3%">
                                    <Checkbox v-model="tableData.allChecked" @on-change="checkAll(tableData)"></Checkbox>
                                    <!-- <input type="checkbox" v-model="tableData.allChecked" @change="checkAll(tableData)" /> -->
                                </th>
                                <th width="5%">序号</th>
                                <th width="10%">推送类型</th>
                                <th width="12%">编辑时间</th>
                                <th width="12%">推送时间</th>
                                <th width="10%">题目</th>
                                <th width="12%">内容</th>
                                <th width="13%">审核状态</th>
                                <th width="8%">审核备注</th>
                                <th width="8%">接受APP设备</th>
                                <th width="7%">操作人员</th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tableData.rows" :key="index">
                            <td>
                                <Checkbox v-model="item.checked" @on-change="check(tableData,item,index)"></Checkbox>
                                <!-- <input type="checkbox" v-model="item.checked" @change="check(tableData,item,index)" /> -->
                            </td>
                            <td>{{item.no}}</td>
                            <td>{{item.pushType.label}}</td>
                            <td>{{item.editTime}}</td>
                            <td>{{item.pushTime}}</td>
                            <td>{{item.msgTitle}}</td>
                            <td>{{item.msgCon}}</td>
                            <td>
                                <i :class="dotClass(item.auditProgress.label)"></i>{{item.auditProgress.label}}</td>
                            <td>{{item.auditNote}}</td>
                            <td>{{item.appId}}</td>
                            <td>{{item.operator}}</td>
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
        name: "msg",
        data() {
            return {
                tableData: {
                    allChecked: false,
                    rows: []
                },
                pushType: '',
                pushTypeList: [
                    { label: "系统消息", value: "systemMsg" },
                    { label: "升级消息", value: "upgradeMsg" },
                    { label: "活动消息", value: "eventMsg" }
                ],
                auditCondition: "",
                auditConditionList: [
                    { label: "审核中", value: "aduiting" },
                    { label: "审核未通过", value: "aduitFaild" },
                    { label: "审核成功", value: "aduitSuc" },
                    { label: "审核撤销", value: "aduitRevoke" }
                ],
                modalAddPush:false,
                formValidate: {
                    title: '',
                    pushType: '',
                    version: '',
                    date: '',
                    time: '',
                    desc: ''
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '消息题目不能为空', trigger: 'blur' }
                    ],
                    pushType: [
                        { required: true, message: '请选择推送类型', trigger: 'change' }
                    ],
                    version: [
                        { required: true, message: '请选择推送版本', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入消息内容…', trigger: 'blur' },
                        { type: 'string', min: 10, message: '消息内容不能少于10个字', trigger: 'blur' }
                    ]
                }
            };
        },
        beforeCreate() {
            // 传值给父级main.vue（第二个导航）
            this.$emit("set-manage-menu", "msg");
        },
        mounted() {
            this.mockTableData();
        },
        methods: {
            mockTableData() {
                for (let i = 0; i < 10; i++) {
                    this.tableData.rows.push({
                        no: "00" + (i + 1),
                        pushType: this.pushTypeList[Math.floor(Math.random() * 3)],
                        editTime: "2018.5.10",
                        pushTime: "2018.5.12 ",
                        msgTitle: "母亲节",
                        msgCon: "母亲节内容 ",
                        auditProgress: this.auditConditionList[Math.floor(Math.random() * 3)],
                        auditNote: "全部版本",
                        appId: "15603018537",
                        operator: "汉尼拔"
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
        }
    };
</script>
<style lang="less" scoped>
    .msg {
        .fr {
            float: right;
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