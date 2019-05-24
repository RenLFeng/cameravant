<template>
  <div id="check">
     <div :class="{'device_wrap':1,'act':showDeviceList}">
      <ul>
        <li :class="index!=deviceList.length-1?'border':''" @click="seleDeviceListFn(item,index)" v-for="(item,index) in deviceList" :key="index"><span :class="{'act':item.isact,'cir_small':1} "></span>{{item.nickname}}</li>
      </ul>
    </div>
    <topNav> <p class="all_device_init" @click="openDeviceListFn()">{{deviceListEnd}}<i class="delta"></i></p></topNav>
    <div class="itme-box">
      <p class="tit">
        <!-- <i class="i"></i> -->
        今日考勤信息
      </p>
      <canvas  id="myChart" width height="255px"></canvas>
      <span class="not-data" v-if="drw1Data==''">暂无数据...</span>
    </div>
    <div class="itme-box">
      <p class="tit">
        <!-- <i class="i i1"></i>  -->
        今日活跃度
      </p>
      <canvas id="myChart2" width height="255px"></canvas>
      <span class="not-data" v-if="drw2Data==''">暂无数据...</span>
    </div>
    <div class="itme-box" id="canvas3-box">
      <p class="tit">
        <!-- <i class="i i2"></i>  -->
        当月考勤信息
        <span style="position:relative" @click="selet" class="selet">
          {{seleed}}
          <van-icon name="arrow-down"/>
        </span>
      </p>
      <canvas :id="`myChart3${concut}`" class="canvas3"  width height="255px"></canvas>
      <span class="not-data" v-if="drw3Data==''">暂无数据...</span>
    </div>
    <van-actionsheet v-model="show" :actions="columns" cancel-text="取消" @select="onSelect"/>
 <!-- <van-popup v-model="show">
 <van-picker
  show-toolbar
  title="请选择员工"
  :columns="columns[user_name]"
  @cancel="onCancel"
  @confirm="onSelect"
/>
 </van-popup> -->
 

  </div>
</template>

<script>
let chart=void 0;
let chart2=void 0;
let chart3=void 0;
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
// require('@antv/f2/lib/interaction/pan'); // 引入图表平移交互
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
      hideData:[],
        hideData2:[],
      openid:"",
      deviceListEnd:"",
      deviceList:[
          {
            "nickname":"我的设备",
            "share_open_id":this.openid,
            isact:true
          },
      ],
      showDeviceList:false,
      moveLeft:90,
      moveTop:0,
      seleed: "员工姓名",
      show: false,
      columns: [],
      drw1Data: [],
      drw2Data: [],
      drw3Data: [],
      init:true,
      concut:1
    };
  },
  computed: {},
  created() {
  },
  mounted() {
  this.initFn();
  },
  destroyed(){
   chart.destroy();
   chart2.destroy();
   chart3.destroy();

   chart=null;
   chart2=null;
   chart3=null;
  },
  methods: {
    //拿openid并且初始化数据
    initFn() {
      //拿openid
      this.getCode(this.api.server + "/#/checkWork").then(resolve => {
        this.openid = resolve;
        //get所有初始化数据
        this.drw(this.openid);
        this.drw2(this.openid);
        this.drw3(this.openid);
        this.getDeviceListFn( this.openid);
      });
    },
    //获取设备list
    getDeviceListFn(openid){
     let data={};
        if (openid) {
        data.openId = openid;
      } else {
        data.openId = window.sessionStorage.getItem('openid');
      }
        this.axios.post(this.api.analysisShareuser,{data})
        .then((res)=>{
          if(res.result=="true"){
              this.deviceList=[...this.deviceList,...res.content];
              this.deviceListEnd=this.deviceList[0].nickname;
          }else{
            
          }
          
        })
    },
    //打开设备下拉list
    openDeviceListFn(){
        this.showDeviceList=!this.showDeviceList;
    },
    //选择设备
    seleDeviceListFn(item,index){
      if(this.deviceList[index].isact) return;
        this.drw(item.share_open_id);
        this.drw2(item.share_open_id);
        this.drw3(item.share_open_id);
        for(let i=0;i<this.deviceList.length;i++){
          this.deviceList[i].isact=false;
        }
        item.isact=true;
        this.showDeviceList=false;
        this.deviceListEnd=item.nickname;
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
     
// this.api.analysisDay
      this.axios
        .post(this.api.analysisDay, { data })
        .then(res => {
          if (res.result === "true") {
          
            this.drw1Data = res.content;
            let drw1Data=[
              {type: "上班", value: 6, userName: '测试1'},
              {type: "上班", value: 9.5, userName: '测试2'},
              {type: "上班", value: 10, userName: '测试3'},
              {type: "上班", value: 9.5, userName: '测试4'},
              {type: "上班", value: 10, userName: '测试5'},
              {type: "上班", value: 9.5, userName: '测试6'},
              {type: "上班", value: 9, userName: '测试7'},
              {type: "上班", value: 7, userName: '测试8'},
              {type: "上班", value: 8, userName: '测试9'},
              {type: "上班", value: 9, userName: '测试10'},
              {type: "下班", value: 16.08, userName: '测试1'},
              {type: "下班", value: 18.4, userName: '测试2'},
              {type: "下班", value: 17.08, userName: '测试3'},
              {type: "下班", value: 20.4, userName: '测试4'},
              {type: "下班", value: 21.08, userName: '测试5'},
              {type: "下班", value: 19.4, userName: '测试6'},
              {type: "下班", value: 19.08, userName: '测试7'},
              {type: "下班", value: 20.4, userName: '测试8'},
              {type: "下班", value: 22.08, userName: '测试9'},
              {type: "下班", value: 23.4, userName: '测试10'},
            ];
        // this.drw1Data=[...this.drw1Data,...drw1Data]
            for(let i=0;i< this.drw1Data.length;i++){
              if(this.drw1Data[i].type=="上班"&&this.drw1Data[i].value<6){
                this.drw1Data[i].value=6;
              }
            }
            let len=this.drw1Data.length;
            if(len>5){
              for(let i =0;i<5;i++){
                if(this.drw1Data[i].type=='上班'){
                    this.hideData[i]= this.drw1Data[i].userName        
                } 
               }
            }else{
               for(let i =0;i<this.drw1Data.length;i++){
                    if(this.drw1Data[i].type=='上班'){
                    this.hideData[i]= this.drw1Data[i].userName        
                }    
               }
            }
            if(!chart){
            
                    chart = new F2.Chart({
              id: "myChart",
              pixelRatio: window.devicePixelRatio,
         
            });
            chart.source(this.drw1Data, {
              userName: {
                // tickInterval:5,
                type: 'cat',
                // tickCount: 3,
                //  min: 6,
                // max: this.drw1Data.length,
                 values:this.hideData.length?this.hideData:null,
                  //  values:this.drw1Data[0].userName,
              },
              value: {
                // type: 'timeCat',
                mask: "hh:mm",
                // range: [0, 1],
                ticks:[6,9,12,15,18,21,24],
                // tickCount: 15,
                max: 24,
                min: 6,
                formatter: function formatter(ivalue) {             
                return ivalue>=10?ivalue+':00':'0'+ivalue+':00'
                }
              },
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
               //图例
                 chart.legend(false);
            //   chart.legend({
            //     // align:'right',
            //   // position: 'right',
            //   itemWidth: 50,
            //     //  offsetY: 0,
            //     // offsetX: 150
            // });
             // 绘制 Guide.Line
              chart.guide().line({
                start: ['min', 18],
                end: ['max', 18],
                style: {
                  stroke: '#e5e5e5',
                  lineWidth: 1,
                  //lineCap: 'round'
                }
              });
               chart.guide().line({
                start: ['min', 9],
                end: ['max', 9],
                style: {
                  stroke: '#e5e5e5',
                  lineWidth: 1,
                  //lineCap: 'round'
                }
              });
          
             chart.tooltip({
              showCrosshairs: true,
              showXTip:true,
              onShow: function onShow(ev) {
                console.log(ev);
                var items = ev.items;             
                if(items.length>1){
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
                }else{
                   let arrTime1=items[0].value.split(':');
                    let time1="";
                      time1=(arrTime1[0]=="00")?arrTime1[1]:arrTime1[0]; 
                      if(time1.length=='4'){
                      time1=time1+'0';
                  }else if(time1.length=='2'){
                      time1=time1+'.00';
                  }
                   time1=time1.split(".").join(":");   
                  items[0].value = time1;
                }
                                           
              }
            });
             if(len>5){
                  chart.interaction('pan',{
                    startEvent:'touchstart',
                    onStart:function(va){
                        console.log(va);
                    }
                  });



              // 定义进度条
              chart.scrollBar({
                mode: 'x',
                xStyle: {
                  offsetY: 0
                }
              });
              }



           // chart.area().position('name*value').color('type').shape('')
              chart.line().position('userName*value').color('type', function(val) {
      if (val === '上班') {
        return '#926BFF';
      }else{
        return '#F87986'
      }
    }).shape('smooth').style('type',{ 
  //   lineWidth(val) {
  //   if (val === '上班时间'||val === '下班时间') {
  //     return 1;
  //   }
  //   // return null;
  // }
      });
            chart.render();

            }else{
              chart.changeData(this.drw1Data);
            }
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
            //   { value: 10.48, userName: '张2'},
            //     {value: 18.1, userName: '张三11'},
            //   { value: 18, userName: '张22'},
            //     {value: 10, userName: '张三111'},
            //   { value: 21, userName: '张222'},

            // ];
            let len=this.drw2Data.length;
            if(len>5){
              for(let i =0;i<5;i++){
                    this.hideData2[i]= this.drw2Data[i].userName        
               }
            }else{
               for(let i =0;i<this.drw2Data.length;i++){
                    this.hideData2[i]= this.drw2Data[i].userName          
               }
            }
            if(!chart2){
                 chart2 = new F2.Chart({
              id: "myChart2",
              pixelRatio: window.devicePixelRatio // 指定分辨率
            });
            var defs = {
              userName: {
                // range: [0, 1],
                // max: 2006,
                 values:this.hideData2.length?this.hideData2:null,
              },
              value: {
                // tickCount: 5,
                min: 1,
                // ticks:[2,3,4,5,6,8]
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
            chart2.legend(false);
              if(len>5){
                  chart2.interaction('pan',{
                 speed:5,
                           
               });
              // 定义进度条
              chart2.scrollBar({
                mode: 'x',
                xStyle: {
                  offsetY: -3
                }
              });
              }
            chart2.tooltip({
              showCrosshairs: true,
              onShow: function onShow(ev) {
                var items = ev.items;

                items[0].name = items[0].title;
              }
            });
                     chart2.line().position('userName*value').color('type', function(val) {
      if (val === '上班') {
        return '#27D0D2';
      }else{
        return '#27D0D2'
      }
      //  return '#8968f'
    }).shape('smooth');
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
            }else{
             chart2.changeData(this.drw2Data);
            }
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
            this.columns=[];
            for (var i = 0; i < temp.length; i++) {
              this.columns.push({
                name: temp[i].user_name,
                id: temp[i].user_id,
              });
            }
            this.drw3Init(this.columns[0].id);
            this.seleed = this.columns[0].name;
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
          //   let canvas3Box=document.querySelector("#canvas3-box");
          //   let remoEl=document.querySelector('#myChart3'+this.concut);
          //   canvas3Box.removeChild(remoEl);
          //   let el= document.createElement('canvas');
          //    this.concut+=1;
          //   el.id = 'myChart3'+this.concut;
          // canvas3Box.appendChild(el);
      this.drw3Init(item.id);
      
    },
     onCancel() {
      Toast('取消');
    },
      drw3Init(id) {
      let data = { userId: id };
      this.axios.post(this.api.analysisUser, { data })
        .then(res => {
          if (res.result) {
            this.drw3Data =res.content;  
          let ticks=[];
          for(var i=0;i<this.drw3Data.length;i++){
            ticks[i]=this.drw3Data[i].day;
             if(this.drw3Data[i].type=="上班"&&this.drw3Data[i].value<6){
                this.drw3Data[i].value=6;
              }
          }
          if(!chart3){
            chart3 = new F2.Chart({
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
                //  ticks: ticks
              },
           value: {
                 // type: 'timeCat',
                 //mask: "hh:mm",
                // range: [0, 1],
                    ticks:[6,9,12,15,18,21,24],
                //  tickCount: 25,
                 max: 24,
                min: 6,
                 formatter: function formatter(ivalue) {
                   return ivalue>=10?ivalue+':00':'0'+ivalue+':00'
                    //  return ivalue
                 }
               }
    });
             //图例
               chart3.legend(false);
            //   chart3.legend({
            //     // align:'right',
            //   // position: 'right',
            //   itemWidth: 50,
            //     //  offsetY: 0,
            //     // offsetX: 150
            // });
      // 绘制 Guide.Line
              chart3.guide().line({
                start: ['min', 18],
                end: ['max', 18],
                style: {
                  stroke: '#e5e5e5',
                  lineWidth: 1,
                  lineCap: 'round'
                }
              });
               chart3.guide().line({
                start: ['min', 9],
                end: ['max', 9],
                style: {
                  stroke: '#e5e5e5',
                  lineWidth: 1,
                  lineCap: 'round'
                }
              });
      chart3.tooltip({
              showCrosshairs: true,
                showXTip:true,
              onShow: function onShow(ev) {
                console.log(ev);
                let items = ev.items;
              if(items.length>1){
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
                }else{
                   let arrTime1=items[0].value.split(':');
                    let time1="";
                      time1=(arrTime1[0]=="00")?arrTime1[1]:arrTime1[0]; 
                      if(time1.length=='4'){
                      time1=time1+'0';
                  }else if(time1.length=='2'){
                      time1=time1+'.00';
                  }
                   time1=time1.split(".").join(":");   
                  items[0].value = time1;
                }


                // let arrTime1=items[0].value.split(':');
                // let arrTime2=items[1].value.split(':');           
                // let time1="";
                //  let time2="";
                //   time1=(arrTime1[0]=="00")?arrTime1[1]:arrTime1[0]; 
                //   time2=(arrTime2[0]=="00")?arrTime2[1]:arrTime2[0]; 
                //   //   console.log('time1',time1)
                //   // console.log('time2',time2); 
                //    if(time1.length=='4'){
                //       time1=time1+'0';
                //   }else if(time1.length=='2'){
                //       time1=time1+'.00';
                //   }
                //      if(time2.length=='4'){
                //       time2=time2+'0';
                //   }else if(time2.length=='2'){
                //       time2=time2+'.00';
                //   }
                //   time1=time1.split(".").join(":");   
                //   time2= time2.split(".").join(":");    
                //     items[0].value = time1;
                //     items[1].value =time2;                               
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
      // chart3.area().position('day*value').shape('smooth');
    chart3.line().position('day*value').color('type', function(val) {
      if (val === '上班时间') {
        return '#dddddd';
      }else
      if (val === '下班时间') {
        return '#dddddd';
      }else
      if (val === '上班') {
        return '#6A5CFF';
      }else{
        return '#F25C87'
      }
    }).shape('smooth').style('type',{ 
    lineWidth(val) {
    if (val === '上班时间'||val === '下班时间') {
      return 1;
    }
    // return null;
  }
});
 chart3.render();
          }else{
            chart3.changeData(this.drw3Data);
          }
        } else {
      }
        }).catch(err => {});
    }
  }
};
</script>

<style lang="less">
#check {
  .all_device_init{
        text-align: center;
    font-size: 0.42667rem;
  }
  .itme-box {
    position: relative;
    width: 90%;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0px 3px 29px 0px rgba(59, 74, 116, 0.14);
    background: #fff;
    margin-bottom: 20px;
    padding-top: 15px;
    .canvas_title{
      position: absolute;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background: rgba(0,0,0,.3);
      border-radius: 10px;

    }
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
  .van-popup{
    // transform: none;
    // bottom: 0;
    // left:0;
    // width:100%;
  }
   .device_wrap{
      position: absolute;
      background: #fff;
      z-index: 10000;
      width: 48vw;
      height: auto;
      max-height: 42vh;
      border-radius: 15px;
      transform: translate3d(0%, 0, 0);
      box-shadow:0px 3px 29px 0px rgba(59,74,116,0.14);
       top: -100%;
      left: 50%;
      margin-left: -24vw;
      color:#6C7B8A;
      padding: 10px 0;
      // transition: top .3s;
      // display: none;
      .device_tit{
        text-indent: 16px;
        font-size: 14px;
      }
      .all_device_my{
        border-bottom:1px solid #e5e5e587;
      }
      .all_device_enjoy{
        border-top:1px solid #f0f0f0d6;
         border-bottom:1px solid #f0f0f0d6;
      }
      ul{
        height: 100%;
        overflow-y: scroll;
        li{
          height: 35px;
          line-height: 35px;
          position: relative;
          font-size: 14px;
          color:#6C7B8A;
          text-indent: 14px;
           .cir_small{
                  position: absolute;
                  width: 12px;
                  height:12px;
                  border-radius: 12px;
                  border: 1px solid #DAE1E9;
                  right: 15px;
                  top:50%;
                  margin-top: -6px;

              }
            .cir_small.act{
              border-color: #4048EF;
            }
            &.border{
                 border-bottom: 1px solid #f0f0f0;
             }
        }
        
        .child{
          text-indent: 26px;
        }
        }
      }
      .device_wrap.act{
          top: 45px;
      }

}
</style>
<style>
.delta{
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid;
   border-color:#999 transparent  transparent;
   margin-left: 6px;
}
</style>
