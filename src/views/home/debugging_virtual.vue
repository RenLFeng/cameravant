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
					<h3>虚拟设备调试</h3>
					<div class="clearfix">
						<div class="fl">
							<h4>编辑数据集</h4>
							<div class="wifibtn">
								<Button type="primary" shape="circle" icon="wifi" style="background:linear-gradient(to bottom, #5DC459, #84D76D);border-color:tranparent"></Button>
								<!-- <span><Icon type="wifi"></Icon></span> -->
								<br />
								上报数据
							</div>
							<div>
								<!-- <Tree :data="data4" show-checkbox multiple></Tree> -->
							</div>
						</div>
						<div class="fr">
							<h4>通讯日志</h4>
						</div>
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
	name: 'home_virtual',
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
	  step1Url: require("../../images/debugging_step_1.png"),
	  step2Url: require("../../images/debugging_step_2.jpg")
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
  .fl {
    width: 60%;
    float: left;
    height:570px;
    border:1px solid rgba(23,35,61,0.10);
    margin-top:20px;
    padding:15px;
  }
  .fr {
  	position: relative;
    width: 40%;
    float: right;
    height:570px;
    border:1px solid rgba(23,35,61,0.10);
    border-left:none;
    margin-top:20px;
    padding:15px;
    .wifibtn{
    	position: absolute;
    	right:-5px;
    	top:50%;
    	color: rgba(23,35,61,0.25);
    }
  }
  h4{
  	padding:15px 0;
    border-bottom:1px solid rgba(23,35,61,0.10);
    font-size: 14px;
	color: #17233D;
  }
	.img_container{
		text-align: center;
		.img{
			display:inline-block;
			width:70%;
		}
	}
}
</style>