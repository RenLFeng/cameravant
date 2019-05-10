<template>
    <div class="empty">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            tip: {
                type: String,
                default: '暂无内容'
            },
        },
        data() {
            return {
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
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
    .empty {
        width:80%;
        margin:40px auto;
        height:calc(~'(100vh - 168px)/3');
        background:url(../../assets/empty.png) top center no-repeat;
        background-size:120px;
        padding-top:120px;
        font-size:14px;
        color:@darkm;
        text-align:center;
        .blue{
            color:#2d8cf0;
        }
    }
</style>