<template>
  <div class="device">
    <div :class="{'device_wrap':1,'act':showDeviceList}" v-show="showDeviceList">
      <ul>
        <li @click="selectTypeFn(item,index)" :class="item.child?'child':item.tit?'device_tit':index==0?'all_device_my':index==4?'all_device_enjoy':''" v-for="(item,index) in MydevicetypeList" :key="index"><span :class="{'act':item.isAct,'cir_small':item.device} "></span>{{item.device_inst_addr}}</li>
      </ul>
    </div>
    <topNav>
      <!-- <van-tabs v-model="tabDeviceSelected" color="#0091fa" @click="deviceSelectedChange">
        <van-tab v-for="item in tabDeviceType" :title="item.text">
        </van-tab>
      </van-tabs> -->
      <p class="all_device_init" @click="showDeviceListFn()">全部设备<i class="delta"></i></p>
    </topNav>
    <!-- <div class="input_container flex" @click='deviceSelectPop=true'><span class="input_label">设备名称：</span><span class="input_shape">{{selectedDevice.device_inst_addr?selectedDevice.device_inst_addr:'全部'}}</span>
      </div> -->
    <!-- <div class="input_container flex" @click='timeTypeSelectPop=true'><span class="input_label">时间选择：</span><span class="input_shape">{{timetype.value==='4'?selectedDateTime[0]+'至'+selectedDateTime[1]:timetype.text}}</span>
      </div> -->
    <van-tabs v-model="tabRangeTypeSelected" type="card" color="#0091fa" @change="timeTypeSelectConfirm">
      <van-tab v-for="(item,index) in rangeTypes" :title="item.text" :key="index">
      </van-tab>
    </van-tabs>
    <!-- 性别区分 -->
    <div class="circle_box">
      <ul class="sex_contect">
         <li :class="index==1?'margin_top':''" v-for="(item,index) in circleData.sexs" :key="index">
         <van-circle
        v-model="item['currentRateSex'+index]"
        :color="item.sex?'#22CED4':'#FD3FB2'"
        fill="#fff"
        :rate="item.rate"
        size="60px"
        layer-color="#E0E4EB"
        :speed="100"
        :stroke-width="80"
       :text="item['currentRateSex'+index].toFixed(0) + '%'"
      /><span>{{item.sex?'男':'女'}}</span>
      </li>
  </ul>
<!-- 年龄区分 -->
      <ul class="age_content">
          <li :class="index>2?'margin_top':''" v-for="(item,index) in circleData.ages" :key="index">
         <van-circle
       v-model="item['currentRateAge'+index]"
        :color="index==0?'#4049EF':index==1?'#FB8C87':index==2?'#414AEF':index==3?'#15D2B9':index==4?'#685CFF':index==5?'#FF9E76':index==6?'':''"
        fill="#fff"
        :rate="item.rate"
        size="60px"
        layer-color="#E0E4EB"
        :speed="100"
        :stroke-width="80"
       :text="item['currentRateAge'+index].toFixed(0) + '%'"
      /><span>{{item.age}}</span> 
    </li> 
      </ul>
    </div>
     <div class="itme-box device_chart">
      <p class="tit">
        <i class="i"></i>客流量分析曲线
      </p>
      <canvas  id="myChart" width height="255px"></canvas>
      <span class="not-data" v-if="drw1Data==''">暂无数据...</span>
    </div>
 <!-- <button @click="click">click</button> 
<button @click="click2">click2</button>  -->


    <van-popup v-model="deviceSelectPop" class="pop_p100" position="bottom">
      <van-picker show-toolbar title="" :columns="deviceSeletedList" value-key="device_inst_addr" :default-index="0" @cancel="deviceSelectCancel"
        @confirm="deviceSelectConfirm" />
    </van-popup>
    <van-popup v-model="timeTypeSelectPop" class="pop_p100" position="bottom">
      <van-picker show-toolbar title="" :columns="rangeTypes" value-key="text" :default-index="0" @cancel="timeTypeSelectCancel"
        @confirm="timeTypeSelectConfirm" />
    </van-popup>
    <van-popup v-model="dateTimePop" class="pop_p100" position="bottom" @close="confirmDateTime">
      <inlineCalendar @change="dateTimeChange" mode="during" />
    </van-popup>
    <!-- <div class="two_chart">
          <canvas id="genderPie" class="half_chart"></canvas>
          <canvas id="agePie" class="half_chart"></canvas>
        </div> -->
    <div class="two_charts flex" :class="agePieShow?'':'naught'">
      <div style="width:20%;">
        <!-- <div class="one_chart" :class="genderPieShow?'':'naught'">
            <canvas id="genderPie" style="width:0;"></canvas>
          </div> -->
        <div class="column_container" :class="genderPieShow?'':'naught'">
          <div class="male_data" :style="{height:percent,}"><span class="num">男 {{maleNum?maleNum:0}}</span></div>
          <div class="female_data" :style="{height:1-percent,}"><span class="num">女 {{(genderAll-maleNum)?(genderAll-maleNum):0}}</span></div>
        </div>
      </div>
      <div style="width:80%;">
        <div class="one_chart" :class="agePieShow?'':'naught'">
          <canvas id="agePie"></canvas>
        </div>
      </div>
    </div>
    <empty class="grey" v-if="!agePieShow">
      <span>客户性别年龄分布暂无数据</span>
    </empty>
    <div class="one_chart" :class="customerCountShow?'whole_chart':'naught'">
      <div id="customerCount" class="whole_chart"></div>
    </div>
    <empty class="grey" v-if="!customerCountShow">
      <span>客流量分析曲线暂无数据</span>
    </empty>
    <div class="one_chart" :class="imgstatPerhourShow?'':'naught'">
      <div id="imgstatPerhour" class="whole_chart"></div>
    </div>
    <empty class="grey" v-if="!imgstatPerhourShow">
      <span>分时客流量分析暂无数据</span>
    </empty>
    <van-swipe :autoplay="3000" class="swipe" v-if="imgListShow">
      <van-swipe-item :key="index" v-for="(image, index) in imgList" v-if="index===0">
        <div class="img_container">
          <img :src="imgList[0].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[0].imgSex?'男':'女'}}　{{imgList[0].imgAge}}<br>{{imgList[0].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[1].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[1].imgSex?'男':'女'}}　{{imgList[1].imgAge}}<br>{{imgList[1].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[2].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[2].imgSex?'男':'女'}}　{{imgList[2].imgAge}}<br>{{imgList[2].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item :key="index" v-for="(image, index) in imgList" v-if="index===3">
        <div class="img_container">
          <img :src="imgList[3].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[3].imgSex?'男':'女'}}　{{imgList[3].imgAge}}<br>{{imgList[3].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[4].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[4].imgSex?'男':'女'}}　{{imgList[4].imgAge}}<br>{{imgList[4].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[5].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[5].imgSex?'男':'女'}}　{{imgList[5].imgAge}}<br>{{imgList[5].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item :key="index" v-for="(image, index) in imgList" v-if="index===6">
        <div class="img_container">
          <img :src="imgList[6].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[6].imgSex?'男':'女'}}　{{imgList[6].imgAge}}<br>{{imgList[6].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[7].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[7].imgSex?'男':'女'}}　{{imgList[7].imgAge}}<br>{{imgList[7].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
        <div class="img_container">
          <img :src="imgList[8].imgMd5+'?w=400&h=400'" class="img" />
          <p class="note">{{imgList[8].imgSex?'男':'女'}}　{{imgList[8].imgAge}}<br>{{imgList[8].imgDatetime.replace(/(\S)*\s/,"")}}</p>
        </div>
      </van-swipe-item>
    </van-swipe>
    <empty class="grey" v-else>
      <span>暂无图片数据</span>
    </empty>
  </div>
</template>

<script>
// const format = rate => Math.min(Math.max(rate, 0), 100);
let dat={
   sexs:[
                {
                  currentRateSex0:0,
                  rate:10,
                  sex:1
                },
                 {
                  currentRateSex1:0,
                  rate:20,
                  sex:0
                }
           ],
          ages:[
                {
                    currentRateAge0:0,
                  rate:0,
                  age:'17-39'
                },
                 {
                     currentRateAge1:0,
                  rate:70,
                  age:'17-39'
                },
                 {
                     currentRateAge2:0,
                  rate:70,
                  age:'17-39'
                },
                 {
                     currentRateAge3:0,
                  rate:30,
                  age:'17-39'
                },
                
                 {
                     currentRateAge4:0,
                  rate:50,
                   age:'17-39'
                },
                 {
                     currentRateAge5:0,
                  rate:90,
                  age:'17-39'
                }
          ]
}
let dat2={
   sexs:[
                {
                  currentRateSex0:0,
                  rate:30,
                  sex:1
                },
                 {
                  currentRateSex1:0,
                  rate:40,
                  sex:0
                }
           ],
          ages:[
                {
                    currentRateAge0:0,
                  rate:80,
                  age:'17-39'
                },
                 {
                     currentRateAge1:0,
                  rate:90,
                  age:'17-39'
                },
                 {
                     currentRateAge2:0,
                  rate:7,
                  age:'17-39'
                },
                 {
                     currentRateAge3:0,
                  rate:0,
                  age:'17-39'
                },
                
                 {
                     currentRateAge4:0,
                  rate:90,
                   age:'17-39'
                },
                 {
                     currentRateAge5:0,
                  rate:99,
                  age:'17-39'
                }
          ]
}

  import {
    Circle ,
    Cell,
    Toast,
    Swipe, SwipeItem,
    Picker,
    Popup,
    DatetimePicker,
    Field,
    Tab, Tabs,
  } from 'vant';
  import echarts from "echarts";
  import F2 from "@antv/f2/lib/index-all";
  import topNav from '@/view/common/top_nav.vue'
  import empty from '@/view/common/empty'
  import { Search } from 'vant';

  export default {
    components: {
      [Circle.name]: Circle,
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
    },

    data() {
      return {
         drw1Data: [],
         circleData:{
           sexs:[
                {
                  currentRateSex0:0,
                },
                 {
                  currentRateSex1:0,

                }
           ],
          ages:[
                {
                    currentRateAge0:0,
  
                },
                 {
                     currentRateAge1:0,
                },
                 {
                     currentRateAge2:0,
                 },
                 {
                     currentRateAge3:0,

                },
                
                 {
                     currentRateAge4:0,

                },
                 {
                     currentRateAge5:0,

                }
          ]
         }, 
        MydevicetypeList:[],
       EjdevicetypeList:[],


        agePie: null,
        genderPie: null,
        customerCount: null,
        imgstatPerhour: null,
        agePieShow: false,
        genderPieShow: false,
        customerCountShow: false,
        imgstatPerhourShow: false,
        imgList: [],
        imgListShow: false,
        deviceSelectPop: false,
        timeTypeSelectPop: false,
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        rangeTypes: [
          {
          text: "今日",

          value: '0'
        },
          {
          text: "本周",
          selected: false,
          value: '1'
        }, {
          text: "本月",

          value: '2'
        }, {
          text: "全年",
          value: '3'
        }],
        timetype: {
          text: "本周",
          value: '1'
        },
        tabRangeTypeSelected: 0,
        deviceList: [],
        deviceSeletedList: [],
        selectedDevice: {},
        dateTimePop: false,
        selectedDateTime: [],
        tmpDateTime: [],
        deviceSearchString: '',
        tabDeviceSelected: 0,
        tabDeviceType: [{
          text: "我的",
          value: 0
        }, {
          text: "分享的",
          value: 1
        }],
        deviceIds: [],
        maleNum: null,
        genderAll: null,
        percent: '',
        legendNameArr: [['本周', '上周'], ['本月', '上月'], ['本年', '上年']],

        showDeviceList:false
      };
    },
    computed: {
      selectData: {
        get: function () {
          let that = this,
            data = {
            };
          if (that.selectedDevice.device_id) {
            data.deviceIds = [that.selectedDevice.device_id];
          } else {
            data.deviceIds = this.deviceIds;
          }
          data.timeType = that.timetype.value || '1';
          if (this.selectedDateTime[1]) {
            window.console.log('132 ...');
            if (data.timeType === '4') {
              data.from = this.selectedDateTime[0];
              data.to = this.selectedDateTime[1];
            }
          }
          return data;
        }
      },
    //   text() {
    //   return this.currentRate.toFixed(0) + '%'
    // }
    },
    created() {
      this.getOpenId();
      this.circleData=dat;
    },
    mounted() {
    },
    methods: {
      //选择设备类型
      selectTypeFn(item,index){
     
        if(this.devicetypes[index].isAct) return;
        // for(let i=0;i<this.devicetypes.length;i++){
        //   this.devicetypes[i].isAct=false;
        // }
        this.devicetypes[index].isAct=true;
           console.log(index);
            console.log(this.devicetypes);
      },
      click(){
      // this.circleData=dat2;
      // this.circleData.sexs[0].rate= 90;
      for(let i=0;i<dat2.sexs.length;i++){
        this.circleData.sexs[i].rate=dat2.sexs[i].rate;
         this.circleData.sexs[i].sex=dat2.sexs[i].sex;
      }
       for(let i=0;i<dat2.ages.length;i++){
        this.circleData.ages[i].rate=dat2.ages[i].rate;
         this.circleData.ages[i].age=dat2.ages[i].age;
      }
      },
      click2(){
        console.log(dat.sexs[0].rate);
 this.circleData.sexs[0].rate=10;
// console.log('dat',dat.sexs[0].rate+'==='+'cir',this.circleData.sexs[0].rate);
//          for(let i=0;i<dat.sexs.length;i++){
//         this.circleData.sexs[i].rate=10+i;
//          this.circleData.sexs[i].sex=10+i;
//       }
      //  for(let i=0;i<dat.ages.length;i++){
      //   this.circleData.ages[i].rate=dat.ages[i].rate;
      //    this.circleData.ages[i].age=dat.ages[i].age;
      // }
      },
      //客流量分析曲线
         drw(openid) {
      // let data={};
      //   if (openid) {
      //   data.openId = openid;
      // } else {
      //   data.openId = window.sessionStorage.getItem('openid');
      // }
      let data={"deviceIds":[17],"timeType":2}
      this.axios
        .post('http://172.28.5.11:9081/stati/statcompare', { data })
        // .post(this.api.analysisDay, { data })
        .then(res => {
          if (res.result === "true") {
            this.drw1Data = res.content;
            // console.log(this.drw1Data);
            const chart = new F2.Chart({
              id: "myChart",
              pixelRatio: window.devicePixelRatio
            });
            chart.source(this.drw1Data, {
              count: {
                // type: 'cat',
                tickCount: 8,
                // min: 1,
                //  ticks:[0,2,4,6,8,10,12,14],
              },
              img_sum: {
                // type: 'timeCat',
                // mask: "hh:mm",
                // range: [0, 1],
                // ticks:[0,2,4,6,8,10,12,14,16,18,20,22,24],
                tickCount:3 ,
                // max: 100,
                min: 0,
                formatter: function formatter(ivalue) {
                  // console.log(ivalue)
                // return ivalue>=10?ivalue+':00':'0'+ivalue+':00'
                // //  return ivalue%2?'':ivalue>=10?ivalue+':00':'0'+ivalue+':00'

                  return ivalue
                }
              }
            });
            //   chart.scale('value', {
            //   type: 'linear', // 声明 type 字段为分类类型
            //   values: [1,20] // 重新显示的值
            // });
            chart.axis("count", {
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
                console.log(ev);                             
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
              chart.line().position('count*img_sum').color('type', function(val) {
      if (val === '本月') {
        return '#7A62FF';
      }else{
        return '#4ACDD6'
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
      //展开设备列表
      showDeviceListFn(){
        this.showDeviceList=!this.showDeviceList;
      },
      //拿openid
      getOpenId() {
        this.getCode(this.api.server + '/#/device').then(resolve => {
          this.openid = resolve;
          this.getDeviceList(resolve);
          let data={
            openId:resolve
          }
           this.axios.post(this.api.analysisDay, { data }).then(()=>{

           })
            this.drw(this.openid);
        });
      },
      onClickCart() {
        this.$router.push('cart');
      },

      sorry() {
        Toast('暂无后续逻辑~');
      },
      getPageData(deviceIds) {
        //不分顺序获取各个图表数据
        this.sexStat(deviceIds);
        this.ageStat(deviceIds);
        this.getDeviceStat(deviceIds);
        this.getImgstatPerhour(deviceIds);
        this.newImglist(deviceIds);
      },
      //获取设备下拉数据
      getDeviceList(openid) {
        const that = this;
        let data = {};
        if (openid) {
          data.openId = openid;
        } else {
          data.openId = window.sessionStorage.getItem('openid');
        }
        this.axios.post(this.api.wechatDevice, {
          data
        }).then(res => {
          if (res.result === "true") {

            this.MydevicetypeList=res.content[0].devices
            this.EjdevicetypeList=res.content[1].devices


            this.deviceList = res.content;
            this.deviceIds = res.content[0].deviceIds;
            this.getPageData(this.deviceIds);
          } else {
            that.$toast(res.message);
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      deviceSelectedChange() {
        if (this.tabDeviceSelected) {
          let tmp = this.deviceList[1];
          this.deviceSeletedList = [{ "device_id": "", "device_inst_addr": "全部" }].concat(tmp.devices);
          this.deviceIds = tmp.deviceIds;
          this.selectedDevice = {};
          this.deviceSelectPop = true;
        } else {
          let tmp = this.deviceList[0];
          this.deviceSeletedList = [{ "device_id": "", "device_inst_addr": "全部" }].concat(tmp.devices);
          this.deviceIds = tmp.deviceIds;
          this.selectedDevice = {};
          this.deviceSelectPop = true;
        }
      },
      sexStat(deviceIds) {
        const that = this;
        let data = Object.assign({}, this.selectData);
        data.openId = window.sessionStorage.getItem('openid');
        if (deviceIds) {
          data.deviceIds = deviceIds;
        }
        //获取性别统计
        this.axios.post(this.api.sexStat, {
          data
        }).then(res => {
          if (res.result === "true" && Object.keys(res.content).length !== 0) {
            const resData = res.content;
            that.genderPieShow = true;
            // that.generatePie(resData, 'sex', that.genderPie, '客户性别分布', '人');
            that.maleNum = resData[0].img_sum;
            that.genderAll = resData[0].img_sum + resData[1].img_sum;
            that.percent = that.maleNum * 100 / that.genderAll + '%';
            /* that.$nextTick(() => {
              that.generateVantPie('genderPie', resData, 'sex', 'img_sum', 'name1', 'number1');
            }); */
          } else {
            that.maleNum = 0;
            that.genderAll = 0;
            that.percent = '0%';
            that.genderPieShow = false;
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      ageStat(deviceIds) {
        const that = this;
        let data = Object.assign({}, this.selectData);
        data.openId = window.sessionStorage.getItem('openid');
        if (deviceIds) {
          data.deviceIds = deviceIds;
        }
        //获取APP使用时长
        this.axios.post(this.api.ageStat, {
          data
        }).then(res => {
          if (res.result === "true" && Object.keys(res.content).length !== 0) {
            const resData = res.content;
            that.agePieShow = true;
            // that.generatePie(resData, 'agegroup', that.agePie, '客户年龄分布', '人');
            /* let agePieInit = echarts.init(document.getElementById('agePie'));
            that.$nextTick(() => {
              that.generatePie(resData, 'agegroup', agePieInit, '客户年龄分布', '人');
            }); */
            that.$nextTick(() => {
              that.generateVantPie('agePie', resData, 'agegroup', 'img_sum', 'name2', 'number2');
            });
          } else {
            that.agePieShow = false;
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      getDeviceStat(deviceIds) {
        const that = this;
        let data = Object.assign({}, this.selectData);
        data.openId = window.sessionStorage.getItem('openid');
        if (deviceIds) {
          data.deviceIds = deviceIds;
        }
        //获取设备统计信息
        this.axios.post(this.api.statiComparestat, {
          data
        }).then(res => {
          if (res.result == "true" && Object.keys(res.content).length != 0) {
            const resData = res.content;
            that.customerCountShow = true;
            that.customerCount = echarts.init(document.getElementById('customerCount'));
            that.$nextTick(() => {
              that.generateBars(resData, this.customerCount, '客流量分析曲线', '时间', '人/次');
            });
          } else {
            that.customerCountShow = false;
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      getImgstatPerhour(deviceIds) {
        const that = this;
        let data = Object.assign({}, this.selectData);
        data.openId = window.sessionStorage.getItem('openid');
        if (deviceIds) {
          data.deviceIds = deviceIds;
        }
        data.timeType = '0';
        //获取24小时抓图数据☆
        this.axios.post(this.api.statiComparestat, {
          data: data
        }).then(res => {
          if (res.result === "true" && Object.keys(res.content).length !== 0) {
            const resData = res.content;
            that.imgstatPerhourShow = true;
            that.imgstatPerhour = echarts.init(document.getElementById('imgstatPerhour'));
            that.$nextTick(() => {
              that.generateColumns(resData, that.imgstatPerhour, '分时客流量分析', '时间', '人/次');
            });
          } else {
            that.imgstatPerhourShow = false;
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      newImglist(deviceIds) {
        const that = this;
        let data = Object.assign({}, this.selectData);
        data.openId = window.sessionStorage.getItem('openid');
        if (deviceIds) {
          data.deviceIds = deviceIds;
        }
        //获取APP使用时长
        this.axios.post(this.api.newImglist, {
          data
        }).then(res => {
          if (res.result == "true" && Object.keys(res.content).length != 0) {
            const resData = res.content;
            that.imgList = resData || [];
            if(that.imgList.length==9){
              that.imgListShow = true;
            }else{
               that.imgListShow = false;
            }
          } else {
            that.imgListShow = false;
          }
        }).catch(err => {
          window.console.log(err);
        });
      },
      //双折线图
      generateBars(data, id, name, xname) {
        let legendNum = this.timetype.value > 0 ? +this.timetype.value - 1 : 0, legendName = [];
        legendName = this.legendNameArr[legendNum];
        let label = [], value = [], oldValue = [];
        for (var i in data) {
          label.push(data[i].count);
          value.push(data[i].img_sum);
          oldValue.push(data[i].old_img_sum);
        }
        id.setOption({
          title: {
            text: name,
            textStyle: {
              fontWeight: 500,
            },
          },
          color: ['#2D8CF0', 'rgba(255,102,51,.7)'],
          legend: {
            data: legendName,
            x: 'right'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
            },
            // formatter: '{b}:{c}' + yname
            formatter: function (params) {  //数据单位格式化  
              let relVal = '';

              for (var i = 0, l = params.length; i < l; i++) {
                relVal += params[i].seriesName + ' : ' + params[i].value + '<br/>';
              }
              return relVal;
            }
          },
          grid: {
            left: '10px',
            right: '28px',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              name: xname,
              nameGap: 2,
              nameRotate: 0,
              data: label,
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
              // name: legendName[0]
            },
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
              // name: legendName[1]
            }
          ],
          series: [
            {
              name: legendName[0],
              type: 'line',
              smooth: true,
              barMaxWidth: '20',
              label: {
                normal: {
                  /* show: true,
                  position: 'top',
                  formatter: '{c}%' */
                }
              },
              data: value
            },
            {
              name: legendName[1],
              type: 'line',
              smooth: true,
              barMaxWidth: '20',
              label: {
                normal: {
                  /* show: true,
                  position: 'top',
                  formatter: '{c}%' */
                }
              },
              data: oldValue,
            }
          ]
        }, true);
      },
      //折线+柱状图
      generateColumns(data, id, name, xname) {
        let label = [], value = [], oldValue = [];
        for (var i in data) {
          label.push(data[i].count);
          value.push(data[i].img_sum);
          oldValue.push(data[i].old_img_sum);
        }
        id.setOption({
          title: {
            text: name,
            textStyle: {
              fontWeight: 500,
            },
          },
          color: ['#2D8CF0', 'rgba(255,102,51,.7)'],
          legend: {
            data: ['今日', '昨日'],
            x: 'right'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
            },
            // formatter: '{b}:{c}' + yname
            formatter: function (params) {  //数据单位格式化  
              let relVal = '';
              for (var i = 0, l = params.length; i < l; i++) {
                relVal += params[i].seriesName + ' : ' + params[i].value + '<br/>';
              }
              return relVal;
            }
          },
          grid: {
            left: '10px',
            right: '28px',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              name: xname,
              nameGap: 2,
              nameRotate: 0,
              data: label,
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
              // name: '今日'
            },
            {
              type: 'value',
              // name: '昨日',
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: {
                lineStyle: {
                  color: "#aaa"
                }
              },
            }
          ],
          series: [
            {
              name: '今日',
              type: 'bar',
              barMaxWidth: '20',
              label: {
                normal: {
                  /* show: true,
                  position: 'top',
                  formatter: '{c}%' */
                }
              },
              data: value
            },
            {
              name: '昨日',
              type: 'line',
              data: oldValue,
              smooth: true,
            }
          ]
        }, true);
      },
      //饼图      
      generatePie(data, labelName, id, name) {
        let doughnutData = [], legend = [];
        for (var i in data) {
          doughnutData[i] = {
            value: data[i].img_sum,
            name: data[i][labelName]
          }
          legend.push(doughnutData[i].name);
        }
        id.setOption({
          grid: {
            left: '45px',
            right: '56px',
            bottom: '3%',
            containLabel: true
          },
          color: ['#2D8CF0', '#7AFFAF', '#FFFF00', '#FF6633', '#2DEDF0', '#66ABF4', '#A0CBF8', '#F02D8C', '#2DF092', '#F8CDA0', '#F4B066', '#F0302D', '#2DF030', '#8CF02D', '#EDF02D', '#F0922D'],
          title: {
            text: name,
            subtext: '',
            x: 'left',
            y: 0,
            textStyle: {
              fontWeight: 500,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a}{b} : {d}%"
          },
          legend: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: '25',
            data: legend
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['65%', '50%'],
              avoidLabelOverlap: false,
              data: doughnutData,
              label: {
                normal: {
                  position: 'left',
                  show: false,
                  distantce: 0,
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '14',
                    fontWeight: 'bold'
                  },
                  formatter: "{a|{a}\n}{b|{b}}{b|:{c}}",
                  rich: {
                    a: {
                      lineHeight: 30,
                      align: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      lineHeight: 36,
                    },
                    b: {
                      color: '#333',
                      fontSize: 12,
                    }
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
            }
          ]
        }, true);
      },

      generateVantPie(id, data, name, value, idName, idNumber) {
        let chart = new F2.Chart({
          id: id,
          pixelRatio: window.devicePixelRatio,
          padding: [10, 100, 10, 0],
          forceFit: true,
        });
        let tmpData = data.sort((a, b) => {
          return b.img_sum - a.img_sum
        })
        chart.source(tmpData);
        chart.legend({
          position: 'right',
          marker: 'square',
          clickable: false,
        });
        chart.tooltip(false);
        chart.coord('polar', {
          transposed: true,
          radius: 0.95,
          innerRadius: 0.618
        });
        chart.axis(false);
        chart.interval().position([1, value]).color(name, ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']).adjust('stack').style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

        chart.guide().html({
          position: ['50%', '50%'],
          html: '<div style="text-align: center;width: 100px;height: 72px;vertical-align: middle;">' + '<p id="' + idName + '" style="font-size: 14px;margin: 10px 10px 5px;font-weight: bold;"></p>' + '<p id="' + idNumber + '" style="font-size: 12px;margin: 0;"></p>' + '</div>'
        });
        chart.render();

        chart.interaction('pie-select', {
          animate: {
            duration: 300,
            easing: 'backOut'
          },
          defaultSelected: {
            name: '机器之血',
            percent: 0.18,
            a: '1'
          },
          onEnd: function onEnd(ev) {
            var shape = ev.shape,
              data = ev.data,
              shapeInfo = ev.shapeInfo,
              selected = ev.selected;

            if (shape) {
              let idNameString = '#' + idName,
                idNumberString = '#' + idNumber;
              if (selected) {
                document.querySelector(idNameString).style.color = shapeInfo.color;
                document.querySelector(idNameString).innerHTML = data[name];
                document.querySelector(idNumberString).innerHTML = data[value];
              } else {
                document.querySelector(idNameString).innerHTML = '';
                document.querySelector(idNumberString).innerHTML = '';
              }
            }
          }
        });
      },
      deviceSelectConfirm(value) {
        let tmp = JSON.stringify(this.selectedDevice);
        this.selectedDevice = value;
        if (tmp !== JSON.stringify(value)) {
          this.getPageData();
        }
        this.deviceSelectPop = false;
      },
      deviceSelectCancel() {
        this.deviceSelectPop = false;
      },
      timeTypeSelectConfirm(value) {
        let tmp = JSON.stringify(this.timetype);
        this.timetype = this.rangeTypes[value];
        if (tmp !== JSON.stringify(value)) {
          this.timeTypeSelectPop = false;
          if (value.value === '4') {
            this.dateTimePop = true;
          }
          this.getPageData();
        }
        this.timeTypeSelectPop = false;
      },
      timeTypeSelectCancel() {
        this.timeTypeSelectPop = false;
      },
      dateTimeChange(date) {
        let tmp = [];
        tmp.push(date[0].format('YY-MM-DD'));
        window.console.log(date[0].format('YY-MM-DD HH:MM:SS'));
        if (date[1]) {
          tmp.push(date[1].format('YY-MM-DD'));
          window.console.log(date[1].format('YY-MM-DD HH:MM:SS'));
        }
        this.tmpDateTime = tmp;
      },
      confirmDateTime() {
        if (!this.tmpDateTime[0]) {
          this.$toast('时间范围为其他类型时，请选择起止时间');
          this.timetype = this.rangeTypes[0]
          return;
        }
        if (!this.tmpDateTime[1]) {
          this.$toast('时间范围为其他类型时，需同时选择起止时间');
          this.timetype = this.rangeTypes[0]
          return;
        }
        this.selectedDateTime = this.tmpDateTime;
      },
      dateTimeConfirm() {
      },
      dateTimeCancel() {
        this.deviceSelectPop = false;
      },
      onSearch() {
        this.goDeviceSearch();
      },
          //跳转设备搜索页面
      goDeviceSearch() {
    
        this.$router.push({
          name: 'deviceSearch',
          query: {
            openid: window.sessionStorage.getItem('openid') || this.$route.query['openid'],
            name: this.deviceSearchString
          }
        })
      },
    }
  };
</script>

<style lang="less">
  .device {
    background: #fff;
    font-size: 14px;
    padding-bottom: 20px;
    position: relative;
    .van-tabs__wrap{
      top:-10px;
      padding: 10px 5px;
      background: #fff;
      .van-tabs__nav--card .van-tab{
        border: none;
      }
      .van-tabs__nav--card{
        border:none;
        margin: 0;
        .van-tab{
          color:#6C7B8A!important;
        }
        .van-tab.van-tab--active{
          color:#fff!important;

          border-radius: 30px!important;
        }
      }
    }
    .circle_box{
          margin: 10px;
          // border-radius: 15px;
          // padding: 10px;
          // box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
      ul{
         padding: 10px 0;
          box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
             border-radius: 15px;
        li{
          text-align: center;
          span{
            display: block;
            margin-top: 5px;
          }
          &.margin_top{
            margin-top: 15px;
          }
        }
      }
      margin-top: 20px;
      .sex_contect{
            width: 28%;
             float: left;
         
           
      }
      .age_content{
        width: 70%;
          float: right;
        li{
          float: left;
             width: 33.3%;
        }
      }
      .age_content:after{
            display: block;
        content: "";
        clear: both;
      }
    }
    .circle_box:after{
        display: block;
        content: "";
        clear: both;
      }


    .all_device_init{
      text-align: center;
      font-size: 16px;
    }
    .device_wrap{
      position: absolute;
      background: #fff;
      z-index: 10000;
      width: 48vw;
      height: 38vh;
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
        }
        .child{
          text-indent: 26px;
        }
        }
      }
      .device_wrap.act{
          top: 45px;
      }
    .input_container {
      margin: 6px;
      padding: 0 8px;
      box-sizing: border-box;
      border: 1px solid #d2d2d2;
      border-radius: 3px;
      color: #969799;
      .input_label {
        width: 70px;
        font-size: 14px;
        line-height: 25px;
        ;
      }
      .input_shape {
        width: calc(~'100% - 85px');
        height: 25px;
        line-height: 23px;
        box-sizing: border-box;
        color: #505050;
      }
    }
    .two_chart {
      width: 100%;
      height: 60vw;
      .half_chart {
        width: 50%;
        height: 100%;
        padding: 25px 0 0;
      }
    }
    .two_charts {
      width: 100vw;
      height: 50vw;
      mrgin: 15px 0;
      .empty {
        /* background:none; */
      }
      .column_container {
        height: 122px;
        margin: 28px auto;
        background: #ff5057;
        width: 20px;
        position: relative;
        .male_data {
          position: absolute;
          top: 0;
          background: #0091fa;
          width: 100%;
          .num {
            position: absolute;
            top: 0;
            width: 60px;
            left: 30px;
            color: #0091fa;
          }
        }
        .female_data {
          position: absolute;
          top: 148px;
          width: 100%;
          .num {
            position: absolute;
            bottom: 26px;
            width: 60px;
            left: 30px;
            color: #ff5057;
          }
        }
      }
    }
    .naught {
      display: none;
    }
    .one_chart {
      width: 100%;
      padding-top: 15px;
      .whole_chart {
        width: calc(~'100vw - 32px');
        margin: 0 auto;
        height: 50vw;
        border-bottom: 1px dashed #ccc;
      }
    }
    .empty {
      height: auto;
      margin: 20px auto;
    }
    .swipe {
      padding-top: 15px;
      margin-left: -2px;
      text-align: center;
      .img_container {
        display: inline-block;
        width: calc(~'33% - 10px');
        height: 33vw;
        margin: 2px;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
        }
        .note {
          position: absolute;
          bottom: -12px;
          left: 2px;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          height: 30px;
          padding: 3px 0;
          line-height: 15px;
          font-size: 12px;
          text-align: center;
          color: #fff;
        }
      }
      .img {
        width: calc(~'50% - 4px');
        height: 50vw;
        padding: 2px;
      }
    }
    .pop_p100 {
      width: 100%;
    }
    .van-hairline--top-bottom::after {
      border-width: 0;
    }
  }
</style>
<style lang="less">
.device {
  .itme-box.device_chart {
    position: relative;
    width: 95%;
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
