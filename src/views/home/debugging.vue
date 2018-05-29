<template>
	<div class="home-main">
		<div class="main-header">
			<div class="breadcrumb">
				<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
			</div>
			<top-timeline :cur-step="3" />
			<div class="action">
				<Button type="ghost" style="margin-right:5px;border-color:#008CF8;color:#008CF8;" @click="pageToPrev">上一步</Button>
				<Button type="primary" @click="pageToNext">下一步</Button>
			</div>
		</div>
		<div class="main-content">
			<left-info :product-info="productInfo" />
			<div class="content">
				<div class="home-debugging-con">
					<h3>虚拟设备调试流程图</h3>
					<div class="step-1">
						<h4>1.用户通过APP控制硬件</h4>
						<p class="img_container"><img :src="step1Url" alt="" class="img" /></p>
						<h4>2.硬件数据传输到用户APP中</h4>
						<p class="plr60">
							<span class="inline-title">虚拟设备调试：</span>我们通过模拟硬件设备，做了一个虚拟的设备环境，构成从APP到云到硬件的一个闭循环，可以模拟和检验设备的数据并上传日志，以便用户的更改和完善。</p>
					</div>
					<h3>打开TD-APP扫码启动虚拟设备</h3>
					<p class="img_container"><img :src="step2Url" alt="" class="img" /></p>
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
  name: "home_debug",
  components: {
    breadcrumbNav,
    "top-timeline": topTimeline,
    "left-info": leftInfo
  },
  data() {
    return {
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
  created() {},
  mounted() {},
  methods: {
    // 跳上一步骤页面
    pageToPrev() {
      this.$router.go(-1);
    },
    // 跳下一步骤页面
    pageToNext() {
      this.$router.push("/home/release");
    }
  }
};
</script>
<style lang="less" scoped>
.home-debugging-con {
  padding: 25px 2%;
  background: #fff;
  font-size: 14px;
  .step-1 {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(23, 35, 61, 0.1);
    margin-bottom: 25px;
    .img_container{
      margin-top:0;
    }
    h4 {
      padding: 30px 0;
      text-align: center;
      font-size: 16px;
      color: #14233f;
    }
    .plr60{
      width:758px;
      margin:0 auto;
      .inline-title{
        color:rgba(11,17,-2147483648,0.80);
        font-weight:bold;
      }
    }
  }
  .img_container {
    margin-top:70px;
    text-align: center;
    .img {
      display: inline-block;
      width: 70%;
    }
  }
}
</style>