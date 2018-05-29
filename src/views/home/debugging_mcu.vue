<template>
	<div class="home-main"> 
		<div class="main-header-con">
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
		</div>
		<div class="main-content">
			<left-info :product-info="productInfo" />
			<div class="content">
				<div class="home-debugging-con">
					<h3>MCU开发</h3>
					<div class="img_container">
						<img :src="mcuUrl" alt="" />
					</div>
		        	<div class="tc">
		        		<Button type="primary" size="large">MCU功能包下载</Button>
		        	</div>
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
	name: 'home_mcu',
	components: {
    breadcrumbNav,
    "top-timeline": topTimeline,
    "left-info": leftInfo
	},
	data () {
		return {
      productInfo: {
        id: 23446,
        name: "智能冷暖白光灯1(CW)",
        avator:
          "http://test.www.yuedujiayuan.com/activity-ui/spring-reading/images/act-student.jpg"
      },
	  mcuUrl: require("../../images/mcu.jpg")
	  };
	},
	computed: {
	    currentPath() {
	      return this.$store.state.app.currentPath; // 当前面包屑数组
	    }
	},
	created () {
	},
	mounted () {
	},
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
.home-debugging-con{
	font-size:14px;
	padding:25px 2%;
	background:#fff;
	.img_container{
		width:520px;
		margin:60px auto;
		text-align: center;
		img{
			display:inline-block;
			width:100%;
		}
	}
	.tc{
		text-align:center;
	}
}
</style>