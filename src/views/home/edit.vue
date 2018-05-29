<template>
  <div class="home-main">
    <div class="main-header">
      <div class="breadcrumb">
        <span class="back" @click="$router.go(-1)">
          <Icon type="arrow-left-c"></Icon> 编辑产品信息</span>
      </div>
      <div class="action">
        <Button type="primary" @click="saveInfo">保存</Button>
      </div>
    </div>
    <div class="main-content">
      <div class="content no-left home-edit">
        <div class="home-edit-con clearfix">
          <div class="fl">
            <div class="row">
              <span class="label">产品型号</span><input type="text" placeholder="请输入产品型号名称..." value="智能冷暖白光灯1(CW)" /></div>
            <div class="row">
              <span class="label">产品型号ID</span>32154856879fdjshsdk</div>
            <div class="row">
              <span class="label">产品行业</span>智慧农业</div>
            <div class="row">
              <span class="label">连接方式</span>
              蓝牙</div>
            <div class="row">
              <span class="label">产品备注</span><input type="text" placeholder="产品备注..." value="尽快设置" /></div>
          </div>
          <div class="fr">
            <div class="row">
              <div class="row">
                <span class="label">设备图片</span>
                <Upload class="up-load" action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="ghost">上传文件</Button>
                </Upload>
              </div>
              <div class="row-pl85">
                <p class="p">支持扩展品：rar、zip、doc、docx、pdf、jpg...</p>
                <img :src="url" alt="" class="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home_edit",
  components: {},
  data() {
    return {
      url: require("../../images/product.png")
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 保存信息
    saveInfo() {
      this.$Message.info("保存成功");
      setTimeout(() => {
        this.$router.go(-1);
      }, 1500);
    }
  }
};
</script>
<style lang="less" scoped>
.back {
  cursor: pointer;
}
.home-edit {
  font-size: 14px;
  .home-edit-con {
    width: 83.3%;
    margin: 27px auto;
    padding: 50px 40px;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
    border-radius: 2px;
  }

  .fl {
    width: 50%;
    float: left;
  }
  .fr {
    width: 50%;
    float: right;
  }
  .row,
  .row-pl85 {
    padding: 5px;
    color: rgba(23, 35, 61, 0.8);
    text-align: left;
  }
  .row-pl85 {
    padding-left: 95px;
  }
  .label {
    display: inline-block;
    width: 85px;
    vertical-align: middle;
    color: rgba(29, 36, 54, 0.8);
    text-align: left;
    font-weight: bold;
  }
  input {
    width: 60%;
    height: 36px;
    line-height: 36px;
    padding: 0 3px;
    box-sizing: border-box;
    border: 1px solid #dddee1;
    border-radius: 2px;
  }
  .up-load {
    display: inline-block;
  }
  .btn {
    width: 72px;
    height: 27px;
    border: 1px solid #008cf8;
    background: #fff;
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
    color: #008cf8;
  }
  p {
    padding: 5px 0;
    font-size: 12px;
    color: rgba(28, 36, 56, 0.55);
    text-align: left;
  }
  .img {
    width: 158px;
    height: 158px;
  }
}
</style>