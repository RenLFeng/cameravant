<template>
	<div class="home-main">
		<div class="main-header-con">
			<div class="main-header">
				<div class="breadcrumb">
					<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
				</div>
				<top-timeline :cur-step="4" />
				<div class="action">
					<Button type="primary" @click="pageToPrev">上一步</Button>
				</div>
			</div>
		</div>
		<div class="main-content">
			<left-info :product-info="productInfo" />
			<div class="content">
				<div class="home-debugging-con">
					<h3>发布产品
						<ul class="sub_title">
							<li>01：提交申请</li>
							<li>02：审核产品</li>
							<li>03：发布完成</li>
						</ul>
					</h3>
					<div class="clearfix">
						<div class="fl">
							<h4>个人用户发布</h4>
							<div class="list">
								<p>正式服务器</p>
								<p>设备总数限制100台</p>
								<p>API不限正式服务器</p>
								<p>无合作渠道</p>
								<p>无法查看运维及运营分析内容</p>
							</div>
							<div class="btn-container">
								<Button type="primary" size="large" style="width:120px;" @click="pageToSuc">个人发布</Button>
							</div>
							<div>
								<!-- <Tree :data="data4" show-checkbox multiple></Tree> -->
							</div>
						</div>
						<div class="fr">
							<h4>企业用户发布</h4>
							<div class="list">
								<p>正式生产服务器，独立云端运行环境</p>
								<p>不限制，具体按照购买的套餐服务稳定</p>
								<p>API不限制调用接口</p>
								<p>提供其他产品合作渠道</p>
								<p>享受运营分析和运维分析双向福利</p>
							</div>
							<div class="btn-container">
								<Button type="primary" size="large" style="width:120px;height:40px;" @click="firmRelease=true">企业发布</Button>
								<Modal width="520" v-model="firmRelease" class="modal" title="企业发布申请">
									<Row class="mtb15">
										<Col class="label" span="5">企业名称</Col>
										<Col span="19">
										<Input v-model="firmName" placeholder="请输入企业名称..." size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">联系电话</Col>
										<Col span="19">
										<Input v-model="tel" placeholder="请输入联系电话…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">行业方向</Col>
										<Col span="19">
										<Input v-model="industry" placeholder="请输入贵公司行业方向…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">公司业务</Col>
										<Col span="19">
										<Input v-model="business" placeholder="请输入贵公司业务…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">公司地址</Col>
										<Col span="19">
										<Input v-model="address" placeholder="请输入贵公司地址…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">产品品牌</Col>
										<Col span="19">
										<Input v-model="brand" placeholder="请输入贵公司产品品牌…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">产品介绍</Col>
										<Col span="19">
										<Input v-model="brand" type="textarea" placeholder="产品介绍…" size="large"></Input>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">设备图片</Col>
										<Col span="19">
										<div class="row-pl80">
											<Upload class="up-load" action="//jsonplaceholder.typicode.com/posts/">
												<Button type="ghost">上传文件</Button>
											</Upload>
											<p class="p">支持扩展品：rar、zip、doc、docx、pdf、jpg...</p>
											<img :src="url" alt="" class="img" />
										</div>
										</Col>
									</Row>
									<Row class="mtb15">
										<Col class="label" span="5">登录方式</Col>
										<Col span="19">
										<RadioGroup v-model="loginTypePadio">
											<Radio class="check_a" v-for="item in loginList" :label="item.label" :key="item.id">
												<span>{{item.label}}</span>
											</Radio>
										</RadioGroup>
										</Col>
									</Row>
								</Modal>

							</div>
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
		name: 'home_publish',
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
				firmRelease: false
			};
		},
		computed: {
			currentPath() {
				return this.$store.state.app.currentPath; // 当前面包屑数组
			}
		},
		created() {
		},
		mounted() {
		},
		methods: {
			// 跳上一步骤页面
			pageToPrev() {
				this.$router.go(-1);
			},
			// 跳提交成功页面
			pageToSuc() {
				this.$router.push("/home/releaseSuc");
			}
		}
	};
</script>
<style lang="less" scoped>
	.home-debugging-con {
		font-size: 14px;
		padding: 25px 2%;
		background: #fff;
		.fl {
			width: 50%;
			float: left;
			height: 570px;
			margin-top: 20px;
			.list p,
			.btn-container {
				background: rgba(20, 35, 63, 0.04);
			}
		}
		.fr {
			position: relative;
			width: 50%;
			float: right;
			height: 570px;
			margin-top: 20px;
		}
		h4 {
			padding: 15px 40px;
			border-bottom: 1px solid rgba(23, 35, 61, 0.10);
			font-size: 14px;
			color: #17233D;
		}
		.list {
			p {
				padding: 0 40px;
				border-bottom: 1px solid rgba(23, 35, 61, 0.10);
				line-height: 56px;
				font-size: 14px;
				color: rgba(28, 36, 56, 0.80);
			}
		}
		.btn-container {
			padding: 22px 40px;
		}
		.img_container {
			text-align: center;
			.img {
				display: inline-block;
				width: 70%;
			}
		}
		.sub_title {
			margin-left: 25px;
			display: inline-block;
			list-style-type: none;
			li {
				display: inline-block;
				margin-right: 10px;
				font-size: 12px;
				color: rgba(23, 35, 61, 0.55);
			}
		}
	}

	.modal {
		.row,
		.row-p80 {
			padding: 5px;
			color: rgba(23, 35, 61, 0.8);
			text-align: left;
		}
		.row-p80 {
			padding-left: 80px;
		}
		.label {
			display: inline-block;
			width: 85px;
			line-height: 36px;
			vertical-align: middle;
			color: rgba(29, 36, 54, 0.8);
			text-align: left;
			font-weight: bold;
		}
		.mtb15 {
			margin-top: 15px;
			margin-bottom: 15px;
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
			width: 64px;
			height: 64px;
		}
	}
</style>