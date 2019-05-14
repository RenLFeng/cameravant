<template>
  <div id="check">
    <topNav></topNav>
    <div class="itme-box">
      <p class="tit">
        <i class="i"></i>今日考勤信息
      </p>
      <canvas  id="myChart" width height="255px"></canvas>
      <span class="not-data" v-if="drw1Data==''">暂无数据...</span>
    </div>
    <div class="itme-box">
      <p class="tit">
        <i class="i i1"></i> 今日活跃度
      </p>
      <canvas id="myChart2" width height="255px"></canvas>
      <span class="not-data" v-if="drw2Data==''">暂无数据...</span>
    </div>
    <div class="itme-box" id="canvas3-box">
      <p class="tit">
        <i class="i i2"></i> 当月考勤信息
        <span style="position:relative" @click="selet" class="selet">
          {{seleed}}
          <van-icon name="arrow-down"/>
        </span>
      </p>
      <canvas :id="`myChart3${concut}`" class="canvas3"  width height="255px"></canvas>
      <span class="not-data" v-if="drw3Data==''">暂无数据...</span>
    </div>
    <van-actionsheet v-model="show" :actions="person" cancel-text="取消" @select="onSelect"/>
    <!-- <van-picker
  show-toolbar
  title="标题"
  :columns="person"
  @cancel="onCancel"
  @confirm="onConfirm"
/> -->
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
// const F2 = require('@antv/f2/lib/index'); // 引入 F2
// require('@antv/f2/lib/interaction/pan'); // 引入图表平移交互
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
      drw3Data: [],
      init:true,
      concut:1
    };
  },
  computed: {},
  created() {},
  mounted() {
      //  this.drw(this.openid);
      //   this.drw2(this.openid);
      //   this.drw3(this.openid);
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
      // let data = { openId: "ooiMn1pH2LsgHSeKcwRjprA9e300" };
      let data={};
        if (openid) {
        data.openId = openid;
      } else {
        data.openId = window.sessionStorage.getItem('openid');
      }
      this.axios
        .post(this.api.analysisDay, { data })
        .then(res => {
          if (res.result === "true") {
            this.drw1Data = res.content;
//              this.drw1Data=[
//               {type: "上班", value: 12, userName: '测试1'},

//  {type: "上班", value: 9.5, userName: '测试2'},

//    {type: "下班", value: 14.08, userName: '测试1'},
//   {type: "下班", value: 18.4, userName: '测试2'},
//             ];
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
                ticks:[0,2,4,6,8,10,12,14,16,18,20,22,24],
                tickCount: 25,
                max: 24,
                min: 0,
                formatter: function formatter(ivalue) {
                  console.log(ivalue)
                return ivalue>=10?ivalue+':00':'0'+ivalue+':00'
                //  return ivalue%2?'':ivalue>=10?ivalue+':00':'0'+ivalue+':00'

                  // return ivalue
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
             chart.tooltip({
              showCrosshairs: true,
              onShow: function onShow(ev) {
                // console.log(ev);
                var items = ev.items;
                let arrTime1=items[0].value.split(':');
                let arrTime2=items[1].value.split(':');           
                let time1="";
                 let time2="";
                  time1=(arrTime1[0]=="00")?arrTime1[1]:arrTime1[0]; 
                  time2=(arrTime2[0]=="00")?arrTime2[1]:arrTime2[0]; 
                   if(time1.length=='4'){
                      time1=time1+'0';
                  }else if(time1.length=='2'){
                      time1=time1+'.00';
                  }
                     if(time2.length=='4'){
                      time2=time2+'0';
                  }else if(time2.length=='2'){
                      time2=time2+'.00';
                  }
                  time1=time1.split(".").join(":");   
                  time2= time2.split(".").join(":");                  
                    items[0].value = time1;
                    items[1].value =time2;                               
              }
            });
            // chart.area().position('name*value').color('type').shape('')
            // chart
            //   .line()
            //   .position("userName*value")
            //   .color("type")
            //   .shape("type", function(type) {
            //     if (type === "上班") {
            //       return "#f25e87";
            //     }
            //     if (type === "下班") {
            //       return "#f25e87";
            //     }
            //   });
              chart.line().position('userName*value').color('type', function(val) {
      if (val === '上班') {
        return '#4acdd6';
      }else{
        return '#4acdd6'
      }
    });
              // chart.interaction('pan');
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
      // let data = { openId: "ooiMn1pH2LsgHSeKcwRjprA9e300" };
      let data={};
        if (openid) {
        data.openId = openid;
      } else {
        data.openId = window.sessionStorage.getItem('openid');
      }
      this.axios
        .post(this.api.analysisTime, { data })
        .then(res => {
          if (res.result) {
            this.drw2Data = res.content;
            //  this.drw2Data=[
            //   {value: 15.1, userName: '张三1'},
            //   { value: 18.48, userName: '张2'},
            //   // {type: "下班", value: 18.4, userName: 'yi1'},
            //   // {type: "下班", value: 19.55, userName: 'yi2'}
            // ];
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
                     chart2.line().position('userName*value').color('type', function(val) {
      if (val === '上班') {
        return '#8968ff';
      }else{
        return '#8968ff'
      }
      //  return '#8968f'
    });
            // chart2
            //   .line()
            //   .position("userName*value")
            //   .color("l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF")
            //   .shape("smooth", function() {});
            // chart2
            //   .area()
            //   .position("userName*value")
            //   .shape("smooth")
            //   .color("l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF");
            chart2.render();
          } else {
          }
        }).catch(err => {
          console.log(err);
        });
    },
    // 当月考勤信息
    drw3(openid) {
      // let data = {
      //   openId: "ooiMn1pH2LsgHSeKcwRjprA9e300",
      //   type: 1
      // };
        let data={type:1};
        if (openid) {
        data.openId = openid;
      } else {
        data.openId = window.sessionStorage.getItem('openid');
      }
      this.axios
        .post(this.api.aiUserlist, { data })
        .then(res => {
          if (res.result) {
            let temp = res.content;
            for (var i = 0; i < temp.length; i++) {
              this.person.push({
                name: temp[i].user_name,
                id: temp[i].user_id,
              });
            }
            this.drw3Init(this.person[0].id);
            this.seleed = this.person[0].name;
          } else {
          }
        }).catch(err => {});
    },
    //选择员工button
    selet() {
      this.show = true;
    },
    //选择员工
    onSelect(item) {
      this.show = false;
      this.seleed = item.name;
      this.init=false;
            let canvas3Box=document.querySelector("#canvas3-box");
            let remoEl=document.querySelector('#myChart3'+this.concut);
            canvas3Box.removeChild(remoEl);
            let el= document.createElement('canvas');
             this.concut+=1;
            el.id = 'myChart3'+this.concut;
          canvas3Box.appendChild(el);
      this.drw3Init(item.id);
      
    },
      drw3Init(id) {
      let data = { userId: id };
      this.axios.post(this.api.analysisUser, { data })
        .then(res => {
          if (res.result) {
            this.drw3Data =res.content;  
          let ticks=[];
          for(var i=0;i<this.drw3Data.length;i++){
            ticks[i]=this.drw3Data[i].day
          }
        const chart3 = new F2.Chart({
              id: "myChart3"+this.concut,
              // syncY:true,
              pixelRatio: window.devicePixelRatio
            });
            chart3.source(this.drw3Data, {
      day: {
                  //type: 'timeCat',
                   //mask: "MM:DD:hh:mm",
                 //range: [0, 1],
                //   tickCount: 31,
                //  max: 31,
                //  min:1,
                 ticks: ticks
              },
           value: {
                 // type: 'timeCat',
                 //mask: "hh:mm",
                // range: [0, 1],
                  ticks:[0,2,4,6,8,10,12,14,16,18,20,22,24],
                 tickCount: 25,
                 max: 24,
                 min: 0,
                 formatter: function formatter(ivalue) {
                   return ivalue>=10?ivalue+':00':'0'+ivalue+':00'
                    //  return ivalue
                 }
               }
    });
      chart3.tooltip({
              showCrosshairs: true,
              onShow: function onShow(ev) {
                // console.log(ev);
                let items = ev.items;
                let arrTime1=items[0].value.split(':');
                let arrTime2=items[1].value.split(':');           
                let time1="";
                 let time2="";
                  time1=(arrTime1[0]=="00")?arrTime1[1]:arrTime1[0]; 
                  time2=(arrTime2[0]=="00")?arrTime2[1]:arrTime2[0]; 
                  //   console.log('time1',time1)
                  // console.log('time2',time2); 
                   if(time1.length=='4'){
                      time1=time1+'0';
                  }else if(time1.length=='2'){
                      time1=time1+'.00';
                  }
                     if(time2.length=='4'){
                      time2=time2+'0';
                  }else if(time2.length=='2'){
                      time2=time2+'.00';
                  }
                  time1=time1.split(".").join(":");   
                  time2= time2.split(".").join(":");    
                             
                    items[0].value = time1;
                    items[1].value =time2;                               
              }
            });
      //chart3.tooltip({
      //custom: true, // 自定义 tooltip 内容框
      // onChange: function onChange(obj) {
      //   var legend = chart3.get('legendController').legends.top[0];
      //   var tooltipItems = obj.items;
      //   var legendItems = legend.items;
      //   var map = {};
      //   legendItems.map(function(item) {
      //     map[item.name] = _.clone(item);
      //   });
      //   tooltipItems.map(function(item) {
      //     var name = item.name;
      //     var value = item.value;
      //     if (map[name]) {
      //       map[name].value = value;
      //     }
      //   });
      //   legend.setItems(_.values(map));
      // },
      // onHide: function onHide() {
      //   var legend = chart3.get('legendController').legends.top[0];
      //   legend.setItems(chart3.getLegendItems().country);
      // }
    //});
    chart3.line().position('day*value').color('type', function(val) {
      if (val === '上班') {
        return '#f25e87';
      }else{
        return '#f25e87'
      }
    });
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
    position: relative;
    width: 90%;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0px 3px 29px 0px rgba(59, 74, 116, 0.14);
    background: #fff;
    margin-bottom: 20px;
    padding-top: 15px;
    .not-data{
      position: absolute;
    width: 100px;
    height: 30px;
    font-size: 16px;
    color:#999;
    left: 50%;
    margin-left: -50px;
    top: 50%;
    }
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