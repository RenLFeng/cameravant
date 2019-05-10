<template>
    <div class="pic_list">
        <div class="pick_title">选择图片
            <van-button type="primary" size="small" class="pick_confirm" disabled v-if="!selectedItem.img_md5">确定</van-button>
            <van-button type="primary" size="small" class="pick_confirm" v-else @click="sendPicInfo">确定</van-button>
        </div>
        <div class="ul_container">
            <van-list v-model="isLoading" @load="onRefresh" :loading-text="loadingText" :finished="finished" finished-text="没有更多图片了">
                <ul class="flex">
                    <li v-for="(item,index) in piclist" :key="index" @click="check(item,index)">
                        <img :src="item.img+'?w=264&h=300'" alt="">
                        <span class="iconfont icon-xuanzhong" v-if="selectedIndex===index"></span>
                    </li>
                </ul>
            </van-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import {
        Button,
        List
    } from 'vant';
    export default {
        components: {
            [Button.name]: Button,
            [List.name]: List
        },
        props: {
            childOpenid: {
                type: String,
                default: "",
            },
        },
        data() {
            return {
                selectedItem: {},
                selectedIndex: null,
                piclist: [],
                current: 1,
                isLoading: false,//控制下拉刷新的加载动画
                finished: false,
                loadingText: '加载中'
            }
        },
        created() {
        },
        mounted() {
            /* this.$nextTick(() => {
                this.getAiPiclist();
            }); */
        },
        methods: {
            check(item, index) {
                this.selectedIndex = index;
                this.selectedItem = Object.assign({}, item);
            },
            sendPicInfo() {
                this.$emit('receivePicInfo', this.selectedItem);
            },
            getAiPiclist() {
                if (this.finished) {
                    this.piclist = this.piclist;
                } else {
                    const that = this;
                    let data = {
                        size: 40,
                        current: this.current,
                    };
                    data.openId = window.sessionStorage.getItem('openid');
                    this.axios.post(this.api.aiPiclist, {
                        data
                    }).then(res => {
                        if (res.result === "true") {
                            if (that.current > 1) {
                                that.piclist = [...that.piclist, ...res.content];
                            } else {
                                that.piclist = res.content;
                            }
                            if (res.content.length < data.size) {
                                that.finished = true;
                                that.loadingText = '';
                            } else {
                                that.current++;
                                that.isLoading = false;
                            }
                        } else {
                            that.$toast(res.message);
                            that.isLoading = false;
                        }
                    }).catch(err => {
                        that.isLoading = false;
                    });
                }
            },
            //下拉刷新
            onRefresh() {
                this.getAiPiclist();
            },
            //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
            onLoad() {
                this.getAiPiclist();
            },
        },
        computed: {
        }
    }
</script>

<style lang="less" scoped>
    @dark: #17233D;
    @darkl: rgba(23, 35, 61, 0.75);
    @darkm: rgba(23, 35, 61, 0.35);
    @darks: rgba(23, 35, 61, 0.2);
    @darkxs: rgba(23, 35, 61, 0.1);
    @darkxxs: rgba(23, 35, 61, 0.06);
    @darkxxxs: rgba(23, 35, 61, 0.03);
    .pic_list {
        width: 100%;
        margin: 10px 0;
        padding-top: 40px;
        font-size: 14px;
        color: @darkm;
        text-align: center;
        .pick_title {
            position: fixed;
            top: 5px;
            width: 100%;
            height: 35px;
            padding: 0 16px;
            box-sizing: border-box;
            border-bottom: 1px solid @darks;
            text-align: left;
            color: @dark;
            line-height: 35px;
        }
        .pick_confirm {
            position: absolute;
            right: 16px;
        }
        .ul_container {
            height: calc(~'100vh - 40px');
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
        }
        ul {
            padding: 0 16px 10px;
            /* height: calc(~'100% - 120px');
            overflow: scroll;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch; */
            &.flex {
                align-items: center;
                justify-content: left;
            }
            li {
                position: relative;
                padding: 1px;
                width: 83px;
                height: 100px;
                padding: 0;
                border: 1px solid #fff;
                img {
                    width: 100%;
                    height: 100%;
                }
                .iconfont {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 24px;
                    transform: translate(-50%, -50%);
                    background: #2d8cf0;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 24px;
                    opacity: 0.9;
                }
            }
        }

    }
</style>