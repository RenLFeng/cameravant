<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appUser">
        <div class="top-bar clearfix">
            APP用户管理
            <div class="fr">
                <Select v-model="productModel" style="width:160px" placeholder="产品类型">
                    <Option v-for="item in productModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input class="search" v-model="searchId" icon="ios-search" placeholder="用户帐号..." style="width: 160px"></Input>
                <Select v-model="productCondition" style="width:160px" placeholder="产品版本">
                    <Option v-for="item in productConditionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        </div>
        <div class="manage-content">
            <div class="content">
                <h3>用户列表
                    <Button type="ghost" class="ghost-blue fr">密码复位</Button>
                </h3>
                <table class="mytable">
                    <thead>
                        <tr>
                            <tr>
                                <th width="5%">
                                    <!-- <Checkbox v-model="tableData.allChecked" @on-change="checkAll(tableData)"></Checkbox> -->
                                    <input type="checkbox" v-model="tableData.allChecked" @change="checkAll()" />
                                </th>
                                <th width="12.5%">序号</th>
                                <th width="12.5%">用户账号</th>
                                <th width="17%">地区</th>
                                <th width="12.5%">手机品牌</th>
                                <th width="12.5%">APP版本</th>
                                <th width="20%">注册时间</th>
                                <th width="8%">绑定产品数量</th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tableData.rows" :key="index">
                            <td>
                                <!-- <Checkbox v-model="item.checked" @on-change="check(tableData,item,index)"></Checkbox> -->
                                <input type="checkbox" v-model="item.checked" @change="check(item)" />
                            </td>
                            <td>{{item.no}}</td>
                            <td>{{item.account}}</td>
                            <td>{{item.city}}</td>
                            <td>{{item.mobile}}</td>
                            <td>{{item.version}}</td>
                            <td>{{item.regisetrTime}}</td>
                            <td>{{item.num}}</td>
                        </tr>
                    </tbody>
                </table>
                <Page :total="100" :page-size="10" :current="1" @on-change="changePage" class="page"></Page>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "appUser",
  data() {
    return {
      // 第一步： 定义初始数据的时候，如果vue里面要用到这个数据的属性，那最好属性也先写出来
      // 因为 在下面的created执行之前，rows还没被赋值为属性时，vue里面就已经在找tableData.rows了，这个时候找不到，是空的 undefined 页面就会空渲染。
      // 如果 以后有三级属性tableData.rows.name 这样，直接写页面，那还会报错
      // 所以如果初始化写好了，就不会啦，是个空数组
      // 当然也不是不可以tableData: {}这样定， 这样定的话，你要在上面的vue上写上  v-if="tableData.rows && tableData.rows.length>0 "这样就不会出错
      //   tableData: {},
      tableData: {
        allChecked: false,
        rows: []
      },
      productModel: "",
      productModelList: {},
      searchId: "",
      productCondition: "",
      productConditionList: {}
    };
  },
  beforeCreate() {
    // 传值给父级main.vue（第二个导航）
    this.$emit("set-manage-menu", "appUser");
  },
  mounted() {
    this.mockTableData();
    this.mockproductModelListData();
    this.mockproductConditionListData();
  },
  methods: {
    mockTableData() {
      // let data = [];
      // data.allChecked = false;
      // data.rows = [];
      // for (let i = 0; i < 10; i++) {
      //     data.rows.push({
      //         checked: false,
      //         no: "00" + (i + 1),
      //         account: parseInt(Math.random().toFixed(10) * 10000000000),
      //         city: "深圳",
      //         mobile: "18677888787 ",
      //         version: "2.0.0 ",
      //         regisetrTime: "2018.02.23 12:00:00 ",
      //         num: parseInt(Math.random() * 100)
      //     });
      // }
      // this.tableData = data;

      // 第二步，bug关键在这里。 data是数组，数组是不能这样定义的 data.allChecked = falase.  你应该是想要定义为 {} 吧？

      for (let i = 0; i < 10; i++) {
        this.tableData.rows.push({
          checked: false,
          no: "00" + (i + 1),
          account: parseInt(Math.random().toFixed(10) * 10000000000),
          city: "深圳",
          mobile: "18677888787 ",
          version: "2.0.0 ",
          regisetrTime: "2018.02.23 12:00:00 ",
          num: parseInt(Math.random() * 100)
        });
      }
    },
    changePage() {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
      this.mockTableData();
    },
    mockproductModelListData() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          label: "产品型号" + (i + 1),
          value: "产品型号" + (i + 1)
        });
      }
      this.productModelList = data;
    },
    mockproductConditionListData() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          label: "产品状态" + (i + 1),
          value: "产品状态" + (i + 1)
        });
      }
      this.productConditionList = data;
    },
    check(item) {
      //   console.log(this.tableData.allChecked);
      //   let vm = this;
      //   let selectedData = vm.tableData.filter(val => {
      //     return val.checked == true;
      //   });
      //   if (selectedData.length == vm.tableData.length) {
      //     vm.tableData.allChecked = true;
      //   } else {
      //     vm.tableData.allChecked = false;
      //   }
      // 这里用vue的方法哈，当然用JQ的也是可以的（上面的filter要针对数组去用哈，vm.tableData 依然是个对象）
      const tableData = this.tableData;
      // every 就是如果里面的循环，每个都满足条件，就返回true，而只要有一个不满足，就返回false。正好给全选用
      const isAllChecked = tableData.rows.every(val => {
        return val.checked === true;
      });
      tableData.allChecked = isAllChecked;
    },
    checkAll() {
      // 这里用this就好，不用vm来代替，没关系的
      console.log(this.tableData.allChecked);
      let vm = this;
      vm.tableData.rows.forEach(val => {
        val.checked = vm.tableData.allChecked;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.appUser {
  .fr {
    float: right;
  }
  .content {
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
    border-radius: 2px;
    .feedbackSelect {
      float: right;
      .selected {
        color: #2d8cf0;
      }
    }
    .mytable {
      width: 100%;
      th {
        padding: 12px 2px;
        background: rgba(20, 35, 63, 0.04);
        font-size: 12px;
        color: #17233d;
        text-align: left;
        &:first-child,
        &:last-child {
          text-align: center;
        }
      }
      td {
        padding: 5px 2px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.8);
        &.feedbackCon {
          display: inline-block;
          width: 98%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        &:first-child,
        &:last-child {
          text-align: center;
        }
      }
    }
    .page {
      margin-top: 20px;
      float: right;
    }
    h3 {
      padding: 16px 24px;
      border-bottom: 1px solid rgba(23, 35, 61, 0.1);
      font-weight: normal;
      font-size: 16px;
      color: #17233d;
    }
    h4 {
      padding: 20px 24px;
      font-size: 14px;
      color: rgba(28, 36, 56, 0.8);
      font-weight: normal;
    }
    .posR {
      position: relative;
    }
  }
}
</style>