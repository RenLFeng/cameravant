<template>
    <div class="feedback user_list">
        <van-tabs v-model="tabUserTypeSelected" color="#0091fa" @change="tabChange" v-if="Object.keys(userTypes).length>0">
            <van-tab v-for="(item,index) in userTypes" :title="item.userType">
                <div class="ul_container">
                    <ul class="feedback_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                        infinite-scroll-distance="50" v-if="Object.keys(userList).length>0">
                        <!-- <li class="flex" v-for="(item,index) in userList" v-swipeleft="{fn:deleteUser,item:item}" :class="item.canDelete?'translate':''"
                            :key="index" @click="edit(item)"> -->
                        <li class="flex" v-for="(item,index) in userList" :class="item.canDelete?'translate':''"
                            :key="index" @click="edit(item)">
                            <div class="left">
                                <img :src="item.user_pic+'?w=264&h=264'" alt="">
                            </div>
                            <div class="middle">
                                <span class="name ellipsis">{{item.user_name}}　</span>
                                <span style="color:#6C7B8A">{{item.user_type}}</span>
                                <span style="color:#999" class="time ellipsis">{{item.user_phone}}</span>
                            </div>
                            <span style="font-size:24px;" class="iconfont icon-records"><van-icon name="records" /></span>
                        </li>
                    </ul>
                    <empty v-else>
                        <span>暂无此类型用户，先去<span class="blue" @click="goUserAdd">添加用户</span>吧~</span>
                    </empty>
                </div>
            </van-tab>
        </van-tabs>
        <empty v-else>
            <span>暂无此用户，先去<span class="blue" @click="goUserAdd">添加用户</span>吧~</span>
        </empty>
        <van-popup v-model="popEdit" class="pop_detail" :modal="false" v-if="Object.keys(editItem).length>0">
            <userEdit :item="editItem" @editSuc="listUpdate"></userEdit>
        </van-popup>
    </div>
</template>

<script>
    import empty from '@/view/common/empty'
    import userEdit from '@/view/users/userEdit'

    import {
        Icon ,
        Popup,
        Button,
        Field,
        Dialog,
        Tab, Tabs,
    } from 'vant';
    export default {
        components: {
            userEdit,
            empty,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
             [Icon.name]: Icon,
        },
        name: 'myFeedback',
        data() {
            return {
                openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                value: true,
                nickname: '',
                popEditDeviceName: false,
                devices: [],
                device: {},
                userTypes: [],
                popEdit: false,
                editItem: {
                },
                canDelete: false,
                userList: [],
                otherDevices: [],
                tabUserTypeSelected: 0,
                loading: false, //为true时不会触发加载更多，false可以触发
                current: 1,
                size:10,
                index:1
            }
        },
        created() {
            this.getOpenId();
        },
        mounted() {
        },
        methods: {
            //加载更多
            loadMore() {
                this.loading = true;
                this.getUserList();
                this.current++;
            },
            submit() {
                const that = this;
                let data = {};
                if (!this.editItem.device_inst_addr) {
                    this.$toast('请填写设备名称');
                    return;
                }
                data.name = this.editItem.device_inst_addr;
                data.deviceId = this.editItem.device_id;
                //用回普通提交
                this.axios.post(this.api.wechatEditDevice, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        that.issue = '';
                        that.$toast('修改成功');
                        that.popEdit = false;
                        that.getUserList();
                    } else {
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            deleteUser(item) {
                const that = this;
                // this.$set(item.item.canDelete,true);
                function beforeClose(action, done) {
                    if (action === 'confirm') {
                        this.axios.post(this.api.aiDeleuser, {
                            data: {
                                id: item.item.user_id
                            }
                        }).then(res => {
                            if (res.result === "true") {
                                that.$toast('删除成功');
                                that.getUserList();
                            } else {
                                that.$toast(res.message);
                            }
                        }).catch(err => {
                            window.console.log(err);
                        });
                        done();
                    } else {
                        done();
                    }
                }

                Dialog.confirm({
                    title: '删除用户',
                    message: '您确认删除该用户吗？',
                    beforeClose
                });
            },
            goUserAdd() {
                //跳转提交反馈页面
                this.$router.push({
                    name: 'userAdd',
                    query: {
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
                })
            },
            //拿openid
            getOpenId() {
                this.getCode(this.api.server + '/#/userList').then(resolve => {
                    this.openid = resolve;
                    this.getOwntype(resolve);
                    this.getUserList(resolve);
                });
            },
            getOwntype(openid) {
                let data={},openId;
                openId=openid||window.sessionStorage.getItem('openid')|| this.$route.query['openid']
                data.openId=openId;
                this.axios.post(this.api.owntype, {
                    data
                }).then(res => {
                    if (res.result === 'true') {
                        this.userTypes = res.content;
                        // this.userTypes=this.userTypes.splice(1);
                        this.getUserList(openId,res.content[0].id);
                    } else {
                        this.$toast(res.msg);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            tabChange(index){
                let type=this.userTypes[index].id;
                this.getUserList('',type,1);
            },
            getUserList(openid,type,current) {
                const that = this;
                let data = {
                    type: type||this.tabUserTypeSelected + 1,
                    size:this.size,
                };
                if(current){
                    this.current=current;
                }else{
                    data.current=this.current;
                }
                if (typeof openid === 'string'&&openid) {
                    data.openId = openid;
                } else {
                    data.openId = window.sessionStorage.getItem('openid');
                }
                this.axios.post(this.api.aiUserlist, {
                    data
                }).then(res => {
                    if (res.result === "true") {
                        if (res.content[0]) {
                            if (that.current === 1) {
                                that.userList = res.content;
                            } else {
                                that.userList = ([...this.userList, ...res.content]);
                            }
                        } else {
                            if (that.current === 1) {
                                that.userList = [];
                            } else {
                                that.userList = that.userList;
                            }
                            that.loading = true;
                        }
                        if (Object.keys(res.content).length < this.size) {
                            that.loading = true;
                            return;
                        }
                        that.loading = false;
                    } else {
                        that.loading = false;
                        that.$toast(res.message);
                    }
                }).catch(err => {
                    window.console.log(err);
                });
            },
            edit(item) {
                console.log(item);
                this.editItem = item;
                this.popEdit = true;
                 this.$router.push({
                    name: '',
                    query: {
                        count:this.index++,
                        openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
                    }
                })
            },
            listUpdate() {
                this.popEdit = false;
                this.getUserList();
                this.getOwntype();
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
        background-color: #fff;
        padding-bottom: 10px;
        .ul_container {
            height: calc(~'100vh - 46px');
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
        }
        .feedback_list {
            padding-top: 8px;
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
                &.translate {
                    transform: translate3d(-65px, 0px, 0px);
                    transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1) 0s;
                }
                .left,
                .middle {
                    &>span {
                        display: block;
                        width: 100%;
                        text-align: left;
                    }
                    .name {}
                }
                .left {
                    width: 60px;
                    img {
                        width: 60px;
                        height: 60px;
                    }
                }
                .middle {
                    width: calc(~'100% - 140px');
                }
                .time {
                    color: @darks;
                    font-size: 12px;
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
            .pop_container {
                width: 100%;
                height: 100%;
                overflow-x: hidden;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
            }
            .time {
                padding: 14px 16px 16px;
                color: @darkm;
                font-size: 12px;
                text-align: left;
            }
            .flex {
                padding: 5px 16px;
                font-size: 14px;
                align-items: center;
                span {
                    width: 80px;
                    color: @darkl;
                }
                p {
                    width: calc(~'100% - 85px');
                    color: @dark;
                }
                .imgs {
                    margin-top: 25px;
                    img {
                        width: 100%;
                    }
                }
            }
            .btn_container {
                padding: 42px 4px 10px;
                .btn {
                    /* background:@orange; */
                }
            }
        }
        .pop_edit {
            width: 70vw;
            .type {
                margin: 10px 0;
            }
        }
    }
</style>
<style>
.user_list .feedback .feedback_list[data-v-487cc491]{
    padding-top: 0;
}
.user_list .van-tabs__content{
    margin-top: 10px;
}
.user_list .van-tabs__wrap{
    /* padding: 10px 0; */
    padding:10px 5px 0;
}
.user_list .van-tab--active {
    background: -webkit-linear-gradient(135deg,rgba(64,72,239,1) 0%,rgba(90,123,239,1) 100%);
    background: linear-gradient(315deg,rgba(64,72,239,1) 0%,rgba(90,123,239,1) 100%);
    color: #fff;
    border-radius: 0.8rem;
    width: 50%;
    height: 80%;
    margin: 0 auto;
    line-height: 35px;
}
.user_list .van-tabs__line{
            display: none;
        }
.user_list .feedback_list li .left img[data-v-487cc491]{
    border-radius: 10px;
        vertical-align: middle;
}
</style>
