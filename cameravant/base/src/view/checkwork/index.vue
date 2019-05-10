<template>
  <div id="check">
    <topNav></topNav>
    <div class="itme-box">
      <p class="tit">
        <i class="i"></i>今日考情信息
      </p>
      <canvas id="myChart" width height="255px"></canvas>
    </div>
    <div class="itme-box">
      <p class="tit">
        <i class="i i1"></i> 今日活跃度
      </p>
      <canvas id="myChart2" width height="255px"></canvas>
    </div>
    <div class="itme-box">
      <p class="tit">
        <i class="i i2"></i> 当月考情信息
        <span style="position:relative" @click="selet" class="selet">
          {{seleed}}
          <van-icon name="arrow-down"/>
        </span>
      </p>
      <canvas id="myChart3" width height="255px"></canvas>
    </div>
    <van-actionsheet v-model="show" :actions="person" cancel-text="取消" @select="onSelect"/>
  </div>
</template>

<script>
import {
  Actionsheet,
  Cell,
  Toast,
  Swipe,
  SwipeItem,
  Picker,
  Popup,
  DatetimePicker,
  Field,
  Tab,
  Tabs,
  Icon
} from "vant";
// import echarts from "echarts";
import F2 from "@antv/f2/lib/index-all";
import topNav from "@/view/common/top_nav.vue";
import empty from "@/view/common/empty";
import { Search } from "vant";

export default {
  components: {
    [Actionsheet.name]: Actionsheet,
    [Cell.name]: Cell,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    topNav,
    empty,
    [Search.name]: Search,
    [Field.name]: Field,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon
  },

  data() {
    return {
      seleed: "员工姓名",
      show: false,
      person: [],
      drw1Data: [],
      drw2Data: [],
      drw3Data: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getOpenId();
  },
  methods: {
    //拿openid
    getOpenId() {
      this.getCode(this.api.server + "/#/checkWork").then(resolve => {
        this.openid = resolve;
        this.drw(this.openid);
        this.drw2(this.openid);
        this.drw3(this.openid);
      });
    },
    //考勤分析
    drw(openid) {
      let data = { openId: "ooiMn1pH2LsgHSeKcwRjprA9e300" };
      // let data={};
      //   if (openid) {
      //   data.openId = openid;
      // } else {
      //   data.openId = window.sessionStorage.getItem('openid');
      // }
      this.axios
        .post(this.api.server + "/analysis/day", { data })
        .then(res => {
          if (res.result === "true") {
            this.drw1Data = res.content;
            // console.log(this.drw1Data);
            const chart = new F2.Chart({
              id: "myChart",
              pixelRatio: window.devicePixelRatio
            });
            chart.source(this.drw1Data, {
              userName: {
                // type: 'cat',
                // tickCount: 3,
              },
              value: {
                // type: 'timeCat',
                mask: "hh:mm",
                // range: [0, 1],
                tickCount: 24,
                max: 23,
                min: 0,
                formatter: function formatter(ivalue) {
                  return ivalue;
                }
              }
            });
            //   chart.scale('value', {
            //   type: 'linear', // 声明 type 字段为分类类型
            //   values: [1,20] // 重新显示的值
            // });
            chart.axis("userName", {
              line: null,
              label: function label(text, index, total) {
                var textCfg = {};
                if (index === 0) {
                  textCfg.textAlign = "left";
                } else if (index === total - 1) {
                  textCfg.textAlign = "right";
                }
                return textCfg;
              }
            });
            // chart.area().position('name*value').color('type').shape('')
            chart
              .line()
              .position("userName*value")
              .color("type")
              .shape("type", function(type) {
                if (type === "上班") {
                  return "line";
                }
                if (type === "下班") {
                  return "dash";
                }
              });
            chart.render();
          } else {
            console.log("err");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //客流分析
    drw2(openid) {
      let data = { openId: "ooiMn1pH2LsgHSeKcwRjprA9e300" };
      // let data={};
      //   if (openid) {
      //   data.openId = openid;
      // } else {
      //   data.openId = window.sessionStorage.getItem('openid');
      // }
      this.axios
        .post(this.api.server + "/analysis/times", { data })
        .then(res => {
          if (res.result) {
            this.drw2Data = res.content;
            const chart2 = new F2.Chart({
              id: "myChart2",
              pixelRatio: window.devicePixelRatio // 指定分辨率
            });
            var defs = {
              userName: {
                // range: [0, 1],
                // max: 2006
              },
              value: {
                // tickCount: 10,
                min: 0
                // max:100
              }
            };
            chart2.axis("userName", {
              label: function label(text, index, total) {
                var cfg = {
                  textAlign: "center"
                };
                if (index === 0) {
                  cfg.textAlign = "start";
                }
                if (index > 0 && index === total - 1) {
                  cfg.textAlign = "end";
                }
                return cfg;
              }
            });
            chart2.source(this.drw2Data, defs);
            chart2.tooltip({
              showCrosshairs: true,
              onShow: function onShow(ev) {
                var items = ev.items;

                items[0].name = items[0].title;
              }
            });
            chart2
              .line()
              .position("userName*value")
              .color("l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF")
              .shape("smooth", function() {});
            chart2
              .area()
              .position("userName*value")
              .shape("smooth")
              .color("l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF");
            chart2.render();
          } else {
          }
        }).catch(err => {
          console.log(err);
        });
    },
    // 当月考情信息
    drw3(openid) {
      let data = {
        openId: "ooiMn1pH2LsgHSeKcwRjprA9e300",
        type: 1
      };
      //   let data={type:1};
      //   if (openid) {
      //   data.openId = openid;
      // } else {
      //   data.openId = window.sessionStorage.getItem('openid');
      // }
      this.axios
        .post(this.api.server + "/ai/userlist", { data })
        .then(res => {
          if (res.result) {
            let temp = res.content;
            for (var i = 0; i < temp.length; i++) {
              this.person.push({
                name: temp[i].user_name,
                id: temp[i].user_id
              });
            }
            console.log(this.person);
            this.drw3Init(this.person[0].id);
            this.seleed = this.person[0].name;
          } else {
          }
        }).catch(err => {});
    },
    //选择员工button
    selet() {
      alert(true);
      // this.show = true;
    },
    //选择员工
    onSelect(item) {
      this.show = false;
      this.seleed = item.name;
      this.drw3Init(item.id);
      console.log(item);
    },
    drw3Init(id) {
      let data = { userId: id };
      this.axios.post(this.api.server + "/analysis/user", { data })
        .then(res => {
          if (res.result) {
            this.drw3Data = res.content;
            const chart3 = new F2.Chart({
              id: "myChart3",
              // syncY:true,
              pixelRatio: window.devicePixelRatio
            });
            chart3.source(this.drw3Data, {
              day: {
                // type: 'cat',
                range: [0, 1],
                tickCount: 10,
                max: 31
              },
              value: {
                // type: 'timeCat',
                mask: "hh:mm",
                // range: [0, 1],
                tickCount: 24,
                max: 23,
                min: 0,
                formatter: function formatter(ivalue) {
                  return ivalue;
                }
              }
            });
            chart3.axis("day", {
              line: null,
              label: function label(text, index, total) {
                var textCfg = {};
                if (index === 0) {
                  textCfg.textAlign = "left";
                } else if (index === total - 1) {
                  textCfg.textAlign = "right";
                }
                return textCfg;
              }
            });
            // chart3.area().position('day*value').color('type').shape('')
            chart3
              .line()
              .position("day*value")
              .color("#8968FF")
              .shape("type");

            chart3.render();
          } else {
          }
        }).catch(err => {});
    }
  }
};
</script>

<style lang="less">
#check {
  .itme-box {
    width: 90%;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0px 3px 29px 0px rgba(59, 74, 116, 0.14);
    background: #fff;
    margin-bottom: 20px;
    padding-top: 15px;
    p {
      position: relative;
      margin: 0;
      font-size: 16px;
      color: #6e7d8c;
      padding-left: 30px;
      .i {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #4acdd6;
        border-radius: 50%;
        left: 15px;
        top: 50%;
        margin-top: -5px;
      }
      .i1 {
        background: #8968ff;
      }
      .i2 {
        background: #f25e87;
      }
      .selet {
        font-size: 12px !important;
        float: right;
        width: 100px;
        height: 30px;
        background: #f5f7f9;
        margin-right: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 20px;
      }
      .van-icon-arrow-down {
        right: 0;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        margin-top: -7px;
      }
    }
    canvas {
      width: 100% !important;
      height: 255px !important;
    }
    #myChart {
      // width:100% !important;
    }
  }
}
</style>