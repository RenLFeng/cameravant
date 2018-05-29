<template>
  <div class="home-main">
    <!-- 头部区 -->
    <div class="main-header">
      <ul class="ul_select clearfix">
        <li v-if="index>=1" v-for="(item,index) in productTypeList" :value="item.value" :key="item.value" :class="item.selected?'selected':''"
          @click="selectType(item)">{{ item.label }}</li>
      </ul>
      <Button class="create" type="primary" icon="plus" @click="ModalCreateProduct = true">创建新产品</Button>
      <Input class="search" v-model="searchName" icon="ios-search" placeholder="输入产品名称搜索..." style="width: 220px"></Input>
    </div>
    <!-- 主内容区 -->
    <div class="main-content">
      <div class="content no-left">
        <Row style="padding-left:60px;">
          <Col span="20">
          <Row>
            <ul class="product-ul">
              <li v-for="(item,index) in newProductList" :key="index">
                <Card>
                  <Row type="flex">
                    <Col span="16" style="padding-left:6px;">
                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                      <div>
                        <p class="name">{{item.productTypeName}}</p>
                        <p class="info">状态　{{item.status}}</p>
                        <p class="info">创建　{{dateFormat(item.createdate,'YYYY-MM-DD hh:mm')}}</p>
                        <p class="info">更新　{{dateFormat(item.changedate,'YYYY-MM-DD hh:mm')}}</p>
                      </div>
                    </Row>
                    </Col>
                    <Col span="8">
                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                      <img class="avator-img" :src="item.src" />
                    </Row>
                    </Col>
                  </Row>
                  <div class="line-gray" style="margin:10px 0;"></div>
                  <Row class="margin-top-8">
                    <router-link :to="'/home/edit?id='+item.productTypeID" style="margin-right:8px;">编辑产品</router-link>
                    <a href="javascript:void(0)" style="color: rgba(23,35,61,0.55);" @click="deleteProduct(item.productTypeID)">删除</a>
                  </Row>
                </Card>
              </li>
            </ul>
          </Row>
          </Col>
          <Col span="4" class="rightNav">
          <Row>
            <ul class="timeline">
              <li>
                <Icon type="ios-arrow-thin-down" size="18px" class="timeline_icon"></Icon>
                <br />
              </li>
              <li>
                <router-link to="/home/set" tag="span">
                  <Icon type="android-settings" size="18px" class="timeline_icon"></Icon>
                  <br />
                  <span class="timeline_text">功能设置</span>
                </router-link>
              </li>
              <li>
                <router-link to="/home/setapp" tag="span">
                  <Icon type="android-phone-portrait" size="18px" class="timeline_icon"></Icon>
                  <br />
                  <span class="timeline_text">APP界面设置</span>
                </router-link>
              </li>
              <li>
                <router-link to="/home/debug" tag="span">
                  <Icon type="android-wifi" size="18px" class="timeline_icon"></Icon>
                  <br />
                  <span class="timeline_text">虚拟设备调试</span>
                </router-link>
              </li>
              <li>
                <router-link to="/home/release" tag="span">
                  <Icon type="ios-paperplane-outline" size="18px" class="timeline_icon"></Icon>
                  <br />
                  <span class="timeline_text">申请发布</span>
                </router-link>
              </li>
            </ul>
          </Row>
          <Row style="margin-top:15px;text-align:center;">
            <a href="" style="font-size:14px;font-weight:100%:">
              <Icon type="android-arrow-dropright-circle" color="#008CF8" style="margin-right:10px;"></Icon>观看演示视频</a>
          </Row>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 创建产品弹窗 -->
    <Modal v-model="ModalCreateProduct" class="modal" title="产品创建" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Row class="mtb15">
        <Col class="label" span="5">产品行业</Col>
        <Col span="19">
        <Select placeholder="请选择产品行业..." size="large" v-model="tradeID">
          <Option v-for="item in industryList" :value="item.tradeID" :key="item.tradeID">{{item.name}}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">产品名称</Col>
        <Col span="19">
        <Input v-model="productTypeName" placeholder="请输入产品名称..." size="large"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">连接方式</Col>
        <Col span="19">
        <RadioGroup v-model="connectID">
          <Radio class="check_a" v-for="item in connectionList" :label="item.connectID" :key="item.connectID">
            <span>{{item.name}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  export default {
    name: "home_index",
    components: {},
    data() {
      return {
        url: require("../../images/product.png"),
        productType: "all",
        productTypeList: [
          { label: "全部产品", value: "all", selected: true },
          { label: "个人产品", value: "custom", selected: false },
          { label: "演示产品", value: "show", selected: false }
        ],
        searchName: "",
        productList: [],
        productTypeName: "",
        ModalCreateProduct: false,
        industryList: [],
        connectionList: [],
        connectID: "",
        tradeID: "",
        loading: true
      };
    },

    computed: {
      // 计算属性来设置产品列表（关联了下拉框跟搜索框）
      newProductList() {
        const productType = this.productType;
        const searchName = this.searchName;
        const productList = this.productList;
        let newArr = productList;
        if (productType !== "all") {
          newArr = productList.filter(val => {
            return val.productType === productType;
          });
        }
        if (searchName !== "") {
          newArr = newArr.filter(val => {
            return val.productTypeName.indexOf(searchName) >= 0;
          });
        }
        return newArr;
      },
      avatorPath() {
        return localStorage.avatorImgPath;
      }
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-active-nav", "home");
    },
    created() {
      this.getProductList();
      this.getIndustryListData();
      this.getConnectionListData();
    },
    mounted() { },
    methods: {
      changeLoading() {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
      },
      ok() {
        if (this.productTypeName && this.tradeID && this.connectID) {
          let _this = this;
          // 点击后保存产品基本信息，后台生成相应的产品ID等信息  确定后保存产品信息，进入产品创建的第一步【设置功能】页面，进行产品设置        
          this.axios.post(this.api.addProductType, {
            developerID: '1',
            productTypeName: _this.productTypeName,
            tradeID: _this.tradeID,
            connectID: _this.connectID
          }).then(res => {
            console.log(res);
            if (res.data.result == '1') {
              const resData = res.data;
              console.log(resData);
              this.$Message.info("保存成功");
              this.changeLoading();
              this.ModalCreateProduct = false;
              this.$router.push({
                name: "home_set"
              });
            } else {
              this.$Message.info('test');
            }
          });
        } else {
          this.$Message.info("请完整填写所有选项！");
          return this.changeLoading();
        }
      },
      cancel() {
        this.$Message.info("已取消");
      },

      getConnectionListData() {
        this.axios.get(this.api.connectionList, { params: {} }).then(res => {
          const resData = res.data;
          console.log(resData);
          this.connectionList = resData;
        });
      },
      getIndustryListData() {
        this.axios.get(this.api.industryList, { params: {} }).then(res => {
          const resData = res.data;
          console.log(resData);
          this.industryList = resData;
        });
      },
      formatDate(date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let hour = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        return y + "-" + m + "-" + d + " " + hour + ":" + minute;
      },
      // 模拟接口拿到所有产品列表
      getProductList() {
        let data = [], developerID = '1';
        this.axios.get(this.api.productList + developerID, { params: {} }).then(res => {
          const resData = res.data.data;
          console.log(resData);
          data = {
            productType: "custom",
            status: "开发中",
            src: this.url
          };
          for (let i = 0; i < resData.length; i++) {
            Object.assign(resData[i], data);
          }
          console.log(resData);
          this.productList = resData;
        });
      },
      // 下拉框选不同类型产品
      selectType(item) {
        this.productTypeList.forEach(
          val => {
            val.selected = false;
          }
        );
        item.selected = true;
        this.productType = item.value;
      },
      getproductTypeList() {
        console.log('postpostpost');
        util.ajax.post('/product/type/alltrade', {
        })
          .then(function (response) {
            console.log(response);
            return [
              { label: "全部产品", value: "all", selected: true },
              { label: "自定义产品", value: "custom", selected: false },
              { label: "演示产品", value: "show", selected: false }
            ]
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      // 删除一个产品
      deleteProduct(productTypeID) {
        this.$Modal.confirm({
          title: "删除提示",
          content: "确定要删除这个产品吗？",
          onOk: res => {
            // 这里要调接口，删除这个产品（通过id删除）
            //XXXXXX
            // 然后可以重新读一遍产品列表接口，也可以直接模拟干掉数组
            let index = 0;
            this.productList.forEach((val, dex) => {
              if (val.productTypeID === productTypeID) {
                index = dex;
              }
            });
            this.productList.splice(index, 1);
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .main-header {
    padding-top: 16px;
    padding-left: 80px;
    text-align: left;
    .select-type {
      width: 200px;
    }
    .search,
    .create {
      float: right;
    }
    .create {
      margin-left: 20px;
    }
    .ul_select {
      display: inline-block;
      list-style-type: none;
      li {
        float: left;
        width: 64px;
        padding-bottom: 15px;
        border-bottom: 2px solid transparent;
        margin-right: 30px;
        font-size: 16px;
        color: rgba(23, 35, 61, 0.80);
        cursor: pointer;
        &.selected {
          border-color: #008CF8;
          color: #008CF8;
        }
      }
    }
  }

  .product-ul {
    list-style-type: none;
    margin-left: -19px;
    li {
      float: left;
      width: 317px;
      height: 192px;
      margin: 10px;
    }
    .ivu-card-bordered {
      width: 100%;
      height: 100%;
    }
    .name {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 16px;
      color: #17233d;
      line-height: 26px;
    }
    .info {
      font-size: 12px;
      color: rgba(23, 35, 61, 0.7);
      line-height: 2;
    }
  }

  .rightNav {
    margin-top: -20px;
    background: #FFFFFF;
    box-shadow: 0 1px 2px 0 rgba(23, 35, 61, 0.35);
    padding-bottom: 60px;
  }

  .timeline {
    width: 100px;
    margin: 24px auto 0;
    list-style-type: none;
    text-align: center;
    cursor: pointer;
    &_icon {
      width: 27px;
      height: 27px;
      background: #fff;
      border: 1px solid rgba(23, 35, 61, 0.15);
      border-radius: 50%;
      line-height: 27px;
    }
    li:first-child .timeline_icon {
      position: relative;
      margin-bottom: 18px;
    }
    &_text {
      position: relative;
      display: inline-block;
      margin-bottom: 18px;
      font-size: 14px;
      color: rgba(23, 35, 61, 0.75);
      letter-spacing: 0;
      text-align: center;
      line-height: 22px;
    }
    &_text:after,
    li:first-child .timeline_icon:after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0px;
      height: 18px;
      border-left: 1px solid rgba(23, 35, 61, 0.1);
      z-index: 0;
    }
    li:last-child .timeline_text:after {
      display: none;
    }
  }

  .check_a {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    padding: 0 5px;
    border-radius: 3px;
    border: 1px solid #dddee1;
    margin-right: 6px;
    margin-bottom: 5px;
    font-size: 14px;
    text-align: center;
    color: rgba(23, 35, 61, 0.8);
    vertical-align: middle;
    cursor: pointer;
    &.checked {
      border-color: #008cf8;
      color: #008cf8;
    }
    &_icon {
      padding-right: 6px;
      font-size: 20px;
      vertical-align: middle;
      color: #ddd;
    }
  }

  .label {
    height: 36px;
    line-height: 36px;
  }
</style>