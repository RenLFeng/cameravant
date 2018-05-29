<template>
    <div class="v-left-info">
        <img class="avator-img" :src="productInfo.avator" />
        <h3>{{ productInfo.name }}</h3>
        <p class="info">产品ID：{{ productInfo.id }}</p>
        <router-link :to="'/home/edit?id='+productInfo.id">编辑产品信息</router-link>
    </div>
</template>

<script>
export default {
  name: "left-info",
  data() {
    return {};
  },
  props: {
    productInfo: Object
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.v-left-info {
  float: left;
  width: 160px;
  height: 100%;
  box-sizing: border-box;
  padding: 56px 22px;
  background: #fff;
  img {
    width: 64px;
    height: 64px;
  }
  h3 {
    padding: 5px 0;
    font-size: 14px;
    color: rgba(23, 35, 61, 0.8);
    font-weight: bold;
  }
  .info {
    font-size: 12px;
    font-weight: normal;
    color: rgba(23, 35, 61, 0.55);
    line-height: 1;
  }
  a {
    display: inline-block;
    padding-top: 24px;
  }
}
</style>
