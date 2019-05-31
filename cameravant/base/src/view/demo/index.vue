<template>
  <div class="device device_box">
    
    <van-tabs v-model="tabRangeTypeSelected" type="card" color="#0091fa" @change="timeTypeSelectConfirm">
      <van-tab v-for="(item,index) in rangeTypes" :title="item.text" :key="index">
      </van-tab>
    </van-tabs>
    <!-- 性别区分 -->
    <div class="circle_box">
      <ul class="sex_contect">
      <li class="person_item">
        <span class="person_tit">总人数</span>
        <span class="person_all" style="">{{circleData.sexs[0].sum?circleData.sexs[0].sum:'0'}}</span>
        </li>
      <li class="sex_icon_box sex_item">
        <ul class="">
          <li>
             <span class="man iconfont iconnan1"></span>
            <span class="nb">{{circleData.sexs[0].img_sum}}<i class="fen">%</i></span>
          </li>
        </ul>
         <ul>
          <li>
             <span class="gir iconfont iconnv1"></span>
         <span class="nb">{{circleData.sexs[1].img_sum}}<i class="fen">%</i></span>
          </li>
        </ul>
      </li>
  </ul>
<!-- 年龄区分 -->
    <div class="age_content bar">
       <p class="tit">
        <!-- <i class="i"></i> -->
       客户年龄分布
      </p>
      <canvas id="mountNode"></canvas>
    </div>
 </div>
    <!-- 客流分析曲线 -->
     <div class="itme-box device_chart" id="canvas3-box">
      <p class="tit">
        <!-- <i class="i"></i> -->
        客流分析曲线
      </p>
      <canvas  :id="`myChart3${concut}`" width height="200px">
        
      </canvas>
      <span class="not-data" v-if="!drw1Data.length && showCanvas">暂无分析数据...</span>
    </div>
 <div class="swipe_container">
   <van-swipe ref="sp" :autoplay="3000"  class="swipe" v-if="imgListShow && tabRangeTypeSelected==0">
      <van-swipe-item :key="index" v-for="(image, index) in imgList">
        <div @click="compileFn(item)" class="img_container" v-for="(item,itmIndex) in image" :key="itmIndex" v-if="item.img_md5">
          <img :src="item.img_md5+'?w=400&h=400'" class="img" />
          <p class="note">
            <span v-if="item.user_name" style="display:block">{{item.user_name.length>=5?strFn(item.user_name):item.user_name}}({{item.user_type}})</span>
            <span v-if="!item.user_name" style="display:block">{{item.user_type}}</span>
            {{item.img_sex?'男':'女'}}　{{item.img_age}}岁
            <!-- <span>{{item.datetime.replace(/(\S)*\s/,"")}}</span> -->
            <span style="display:block">{{item.datetime | formatDate}}</span>
          </p>
        </div>
      </van-swipe-item>
    </van-swipe>
</div>
    <!-- <empty class="grey" v-else>
      <span>暂无图片数据</span>
    </empty> -->
  </div>
</template>

<script>
// const format = rate => Math.min(Math.max(rate, 0), 100);
let chart=void 0;
let chart2=void 0;
  import {
    Circle ,
    Cell,
    Toast,
    Swipe, SwipeItem,
    Picker,
    Popup,
    DatetimePicker,
    Field,
    Tab, Tabs,Icon,Loading,Button
  } from 'vant';
  import echarts from "echarts";
  import F2 from "@antv/f2/lib/index-all";
  import topNav from '@/view/common/top_nav.vue'
  import empty from '@/view/common/empty'
  import { Search } from 'vant';

  export default {
    components: {
       [Button.name]: Button,
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
      [Icon.name]: Icon,
       [Loading.name]: Loading
    },

    data() {
      return {
        textarea:"",
        showWompile:false,
        customer_info:{},
        imgListIndex:0,
        imgHtmlEl:"",
        showCanvas:false,
         drw1Data: [],
         allPerson:0,
         circleData:{
           sexs:[
                {
                  currentRateSex0:0,
                  img_sum:0,
                  sex:"男"
                },
                 {
                  currentRateSex1:0,
                    img_sum:0,
                  sex:"女"
                }
           ],
          ages:[
                {
                    currentRateAge0:0,
                    agegroup: "18以下",
                    img_sum: 0
  
                },
                 {
                     currentRateAge1:0,
                      agegroup: "19-25",
                    img_sum: 0
                },
                 {
                     currentRateAge2:0,
                      agegroup: "26-35",
                    img_sum: 0
                 },
                 {
                     currentRateAge3:0,
                      agegroup: "36-45",
                    img_sum: 0

                },
                
                 {
                     currentRateAge4:0,
                      agegroup: "46以上",
                    img_sum: 0

                },
                //  {
                //      currentRateAge5:0,
                //       agegroup: "56岁以上",
                //     img_sum: 0

                // }
          ]
         }, 
         deviceidsArr2:[],
      deviceidsArr:[1],
      allDeviceListOb:[],
      deviceTypeEd:'我的设备',
      deviceselectEd:{},
      Mydevicetypes:[
          {
          device_inst_addr:'我的设备',
          device_id:[]
          },
      ],
      Ejdevicetypes:[
        {
          device_inst_addr:'共享设备',
            device_id:[]
          },
      ],
        agePie: null,
        genderPie: null,
        customerCount: null,
        imgstatPerhour: null,
        agePieShow: false,
        genderPieShow: false,
        customerCountShow: false,
        imgstatPerhourShow: false,
        imgList: [],
        imgListShow: true,
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
        }, 
        // {
        //   text: "全年",
        //   value: '3'
        // }
        ],
        timetype: {
          text: "本周",
          value: '0'
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

        showDeviceList:false,
        concut:1,
        customer:[
            [
              {
                  "currentRateAge0":0,
                  "name": "VIP",
                  "count": 0
                },
                {
                  "currentRateAge1":0,
                  "name": "新客",
                  "count": 0
                },
                {
                  "currentRateAge2":0,
                  "name": "熟客",
                  "count": 0
                }
                
            ],
            [
                  {
                    "currentRateAge0":0,
                    "name": "颜值",
                    "count": 0
                  }
            ]
   ],
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
          data.timeType = that.timetype.value || '0';
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
      this.initFn(this.tabRangeTypeSelected);
         this.newImglist()
    },
    mounted() {
    
    },
    destroyed(){
      chart.destroy();
      chart=null;
      chart2.destroy();
      chart2=null;
  },
    methods: {
      //初始化图表数据
      initFn(index){
              this.selectAgeSexFn(index);
              this.drw(index);
      },
      //get客户类型
      getCustomerFn(openid,devicesId){
        console.log(this.openid);
          let data={
              "deviceIds":devicesId ,
              "openId": openid
              }
         this.axios.post(this.api.statiUserperc, {
          data
        }).then((res)=>{
          if(res.result=="true"&&res.content.length){
            let resData=res.content;
            for(let i=0;i<resData[0].length;i++){
                this.customer[0][i].name=resData[0][i].name;
              this.customer[0][i].count=resData[0][i].count;
            }
              this.customer[1][0].name=resData[1][0].name;
              this.customer[1][0].count=resData[1][0].count;
          }else{

          }
        })
      },
      //图片编辑备注
      compileFn(item){
        this.showWompile=true
        console.log(item);
      },
      // 提交备注
      submitCompileFn(){
          if(!this.textarea){
            Toast('总得写点什么吧~~~');
            return;
          }
          Toast('谢谢，你会记得我的~~~');
           this.showWompile=false;
      },
    //展开设备列表
      showDeviceListFn(){
        this.showDeviceList=!this.showDeviceList;
      },
      //选择 '我的' 设备类型
      selectTypeMyFn(item,index){
        console.log(item)
        if(this.Mydevicetypes[index].isact) return;
          this.selectFalseFn(item);
            this.deviceTypeEd= this.Mydevicetypes[index].device_inst_addr;
         this.Mydevicetypes[index].isact=true;
         if(item.device_inst_addr=="我的设备"){
          this.deviceidsArr=item.device_id;
         }else{
          let idArr=[];
         idArr[0]= item.device_id
           this.deviceidsArr=idArr;  
         }
         this.initFn(this.tabRangeTypeSelected);
        this.getCustomerFn(this.openid, this.deviceidsArr)
      },
      //选择 '共享' 设备类型
      selectTypeEjFn(item,index){
         console.log(item)
        if(this.Ejdevicetypes[index].isact) return;
        this.selectFalseFn(item);
          this.deviceTypeEd= this.Ejdevicetypes[index].device_inst_addr;
         this.Ejdevicetypes[index].isact=true;

        if(item.device_inst_addr=="共享设备"){
          this.deviceidsArr=item.device_id;
         }else{
          let idArr=[];
         idArr[0]= item.device_id
           this.deviceidsArr=idArr;  
         }
         console.log(this.deviceidsArr);
        this.initFn(this.tabRangeTypeSelected);
        this.getCustomerFn(this.openid,this.deviceidsArr)
        // this.newImglist(this.deviceidsArr)
      },
      // 初始所有设备选中样式
      selectFalseFn(item){
        for(let i=0;i<this.Mydevicetypes.length;i++){
          this.Mydevicetypes[i].isact=false;
        }
        for(let i=0;i<this.Ejdevicetypes.length;i++){
                this.Ejdevicetypes[i].isact=false;
              }
               this.showDeviceList=false;
               this.deviceselectEd=item;
      },

//年龄数据
      selectAgeSexFn(index){
         let data={
           "deviceIds":this.deviceidsArr,
           "timeType": index
           }
        const that = this;
        // data.openId = window.sessionStorage.getItem('openid');
        // if (deviceIds) {
        //   data.deviceIds = deviceIds;
        // }
        this.axios.post(this.api.statiStatVip, {
          data
        }).then(res=>{
          if (res.result === "true") {
              let resData = res.content;
            for(let i=0;i<resData[0].length;i++){
                that.circleData.sexs[i].img_sum=resData[0][i].img_sum;
                 that.circleData.sexs[i].sex=resData[0][i].sex;
                  that.circleData.sexs[i].sum=resData[0][i].sum;

            }
             for(let i=0;i<resData[1].length;i++){
                that.circleData.ages[i].img_sum=resData[1][i].img_sum;
                 that.circleData.ages[i].agegroup=resData[1][i].agegroup;
            }
            
             
            this.sexChartFn(that.circleData.ages);
          }else{
          }

        }).catch(err => {
          console.log(err);
        });
      },

   //年龄分布图表
 sexChartFn(data){

  // var data = [{
  //   agegroup: '18岁以下',
  //   img_sum: 30
  // }, {
  //   agegroup: '19-25',
  //   img_sum: 200
  // }, {
  //   agegroup: '26-35',
  //   img_sum: 61
  // }, {
  //   agegroup: '36-45',
  //   img_sum: 145
  // },{
  //   agegroup: '56岁以上',
  //   img_sum: 145
  // }];
  if(!chart2){
   chart2 = new F2.Chart({
    id: 'mountNode',
    pixelRatio: window.devicePixelRatio
  });

  chart2.source(data, {
    img_sum: {
      tickCount: 5
    }
  });
  chart2.tooltip({
    showItemMarker: false,
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value+'人';
    }
  });
  //  chart2.guide().text({
  //       // top:true,
  //       position: ['min', 'max'],
  //       content: '客户年龄分布',
  //       style: {
  //           fill: '#6E7D8C', // 点的填充颜色
  //         textBaseline: 'middle',
  //         textAlign: 'start',
  //         fontSize:14
  //       },
  //        offsetY: -35,
  //       offsetX: -20
  //   });
  chart2.legend({
      custom:true
    })
  chart2.interval().position('agegroup*img_sum').style({
  radius:[2]
  }).color('agegroup',function(val){
       switch(val){
        case '18以下': return '#5A7BEF';
        break;
        case '19-25': return '#F15887';
        break;
        case '26-35': return '#4048EF';
        break;
        case '36-45': return '#2DC9EB';
        break;
        case '46以上': return '#FA9CBC';
        break;
        default: return '5A7BEF'
      }
  }).size(8);
  chart2.render();
  }else{
    chart2.changeData(data);
  }
},
      //客流量分析曲线
         drw(index) {
      // let data={};
      //   if (openid) {
      //   data.openId = openid;
      // } else {
      //   data.openId = window.sessionStorage.getItem('openid');
      // }
      console.log(this.deviceidsArr);
         let data={
           "deviceIds":this.deviceidsArr,
             "timeType": index
           }
      this.axios
        .post(this.api.statiStatcompareVip, { data })
        .then(res => {
          if (res.result === "true") {
            this.drw1Data = res.content;
            if(!this.drw1Data.length) this.showCanvas=true;
            let ticks=[];
          //  for(let i=0;i<this.drw1Data.length;i++){
          //    if(this.drw1Data[i].type=='今日'||this.drw1Data[i].type=='本周'||this.drw1Data[i].type=='本月'){
          //       ticks[i]=this.drw1Data[i].count;
          //    }
          //  }
            if(!chart){

            chart = new F2.Chart({
               id: "myChart3"+this.concut,
              pixelRatio: window.devicePixelRatio
            });
            chart.source(this.drw1Data, {
              count: {
                // type: 'cat',
                tickCount: 8,
                // min: 1,
                //  ticks:ticks?ticks:null,
              },
              img_sum: {
                // type: 'timeCat',
                // mask: "hh:mm",
                // range: [0, 1],
                // ticks:[0,2,4,6,8,10,12,14,16,18,20,22,24],
                // tickCount:5,
                // max: 100,
                // min: 0,
                formatter: function formatter(ivalue) {
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
              // chart.guide().text({
              //   // top:true,
              //   position: ['min', 'max'],
              //   content: '客流量分析曲线',
              //   style: {
              //      fill: '#666', // 点的填充颜色
              //     textBaseline: 'middle',
              //     textAlign: 'start'
              //   },
              //   offsetY: -35,
              //   offsetX: -15
              // });

              //图例

              chart.legend({
                align:'right',
              // position: 'right',
              itemWidth: 30,
                //  offsetY: 0,
                // offsetX: 150
            });
             chart.tooltip({
              showCrosshairs: true,
              showXTip:true,
              onShow: function onShow(ev) {
                console.log(ev);                             
              }
            });
            //陰影chart.area()
            // chart.area().position('name*value').color('type').shape('')
              chart.line().position('count*img_sum').color('type', function(val) {
      if (val === '今日'||val === '本周'||val === '本月'||val === '本年') {
        return '#4ACDD6'; 
      }else{
        return 'rgba(246,111,135,.3)';
      }
    }).shape('smooth').style({
      lineWidth:3
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
      //拿openid
      getCodeInit() {
  
      },
      onClickCart() {
        this.$router.push('cart');
      },

      sorry() {
        Toast('暂无后续逻辑~');
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


            // for(let i=0;i<resData.length;i++){
            //     that.circleData.sexs[i].img_sum=resData[i].img_sum;
            //      that.circleData.sexs[i].sex=resData[i].sex;
            // }

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

            // for(let i=0;i<resData.length;i++){
            //     that.circleData.ages[i].img_sum=resData[i].img_sum;
            //      that.circleData.ages[i].agegroup=resData[i].agegroup;
            // }

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
      newImglist() {
        const that = this;
        let data={
          "deviceIds":this.deviceidsArr,
             "timeType": 0
        }
        //获取APP使用时长
        this.axios.post(this.api.newImglist, {
          data
        }).then(res => {
          if (res.result == "true" && Object.keys(res.content).length != 0) {
            let resData = res.content;
            let lenAll=resData.length;
             let len;
            if(lenAll%4){
              len=4-lenAll%4;
              for(let i=0;i<len;i++){
                resData=[...resData,
                  {
                    imgMd5:"",
                    imgSex:"",
                    imgAge:"",
                    imgDatetime:"",
                  }
                ]
              }
          lenAll=lenAll+len;
            }
            let arrTem=new Array(lenAll/4);
            for(let i=0;i<arrTem.length;i++){
                         let arr=[];
                      for(let j=that.imgListIndex;j<that.imgListIndex+4;j++){
                        (function(){
                            arr.push(resData[j]);
                               arrTem[i]=arr;
                        })();
                      }
                      that.imgListIndex+=4;
            }
            that.imgList = arrTem || [];
            console.log(that.imgList);
            // if(that.imgList.length==9){
            //   that.imgListShow = true;
            // }else{
            //    that.imgListShow = false;
            // }
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
      //选择显示时间
      timeTypeSelectConfirm(value) {
        // alert(value)
        this.initFn(value);
        // this.newImglist();
        // this.tabRangeTypeSelected=value;
        let tmp = JSON.stringify(this.timetype);
        this.timetype = this.rangeTypes[value];
        if (tmp !== JSON.stringify(value)) {
          this.timeTypeSelectPop = false;
          if (value.value === '4') {
            this.dateTimePop = true;
          }
          // this.getPageData();
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

    },
     filters:{
        formatDate:function (val) {
            var value=new Date(val.replace(/-/g, "/"));
            var year=value.getFullYear();
            var month=value.getMonth()+1;
            var day=value.getDate();
            var hour=value.getHours();
            var minutes=value.getMinutes();
            var seconds=value.getSeconds();
              month < 10 && (month = "0" + month);
              day < 10 && (day = "0" + day);
                hour < 10 && (hour = "0" + hour);
              minutes < 10 && (minutes = "0" + minutes);
               seconds < 10 && (seconds = "0" + seconds);
            return hour+':'+minutes;
        }
   },

  };
</script>


<style lang="less">
  @import "../../../public/icon_family/icon_family.css";
  .device {
    background: #fff;
    font-size: 14px;
    padding-bottom: 20px;
    position: relative;
     margin-top: 12px;
    .van-tabs__wrap{
      top:-14px;
      padding: 8px 8px 12px 8px;
    background: #fff;
      .van-tabs__nav--card .van-tab{
        border: none;
      
      }
      .van-tabs__nav--card{
        border:none;
        margin: 0;
        .van-tab{
          color:#6C7B8A!important;
         line-height: 40px;
        }
        .van-tab.van-tab--active{
          color:#fff!important;
          height: 40px!important;
          border-radius: 35px!important;
          background:linear-gradient(315deg,rgba(64,72,239,1) 0%,rgba(90,123,239,1) 100%);
        }
      }
    }
    .circle_box{
          margin: 10px;
              height: 142px;
    margin-bottom: 30px;
          // border-radius: 15px;
          // padding: 10px;
          // box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
      .sex_contect,.bar{
        //  padding: 10px 0;
          box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
             border-radius: 15px;
             height: 100%;
             position: relative;
        li{
          text-align: center;
          span{
            display: block;
            margin-top: 5px;
            color: #6C7B8A;
            font-size: 12px;
          }
          &.margin_top{
            margin-top: 10px;
          }
        
        }
        &.bar{
          padding:0;
            padding-top: 10px;
            height: 107%;
            .tit{
                position: absolute;
                margin: 0;
                // font-size: 16px;
                color: #6e7d8c;
                padding-left: 0.53333rem;
                left: 0;
                top: 7px;
            }
          }
      }
      margin-top: 20px;
      .sex_contect{
            width: 28%;
            float: left;
            height: 110%;
            padding: 3px 0;
          //  height: 5.18rem !important;
             .sex_icon_box{
               ul{
                display: inline-block;
               }
          }
          .person_item{
            height: 40%;
                margin-top: 7px;
            .person_tit{
              font-size: 14px;
            }
            .person_all{
                  font-size: 30px;
                  font-weight: bold;
                  font-family: 'Mohave';
                  margin-top: 5px;
            }
          }
          .sex_item{
            position: absolute;
            bottom: 8px;
            width: 100%;
            height: 60%;
            margin: 0 10px;
            ul{
              position: absolute;
              bottom:0;
              li{
              span{
                 font-size: 16px;
                //  width: 30px;
                 height: 33px;
                 font-weight: bold;
                   font-family:-webkit-body;
                   margin-top: 0;
                   .fen{
                     font-size: 12px;
                   font-family: inherit;
                   }
                 &.man, &.gir{
                       font-size: 28px;
                      color: rgba(67, 207, 213,.5);
                 }
                 &.gir{
                    color:  rgba(245, 62, 179,.5);
                 }
                 &.nb{
                   line-height: 36px;
                 }
              }
            }
              &:nth-child(1){
              left:0;
            }
              &:nth-child(2){
              right:20px;
            }
           }
            
          }
      }
      .age_content{
        width: 70%;
        float: right;
        // height: 5.18rem !important;
        li{
          // float: left;
             width: 33.3%;
             display: inline-block;
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
      height: 42vh;
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
      padding:4px 0;
      text-align: center;
      width: 97%;
      height: 30vh;
    // box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
    border-radius: 15px;
    margin: 0 auto;
    text-align: left;
    .van-swipe__track::after{
      display: block;
      content: "";
      clear: both;
    }
    .van-swipe__indicator{
      background: #333;
    }
    .van-swipe__indicator--active{
     background-color: #1989fa;
    }
      .img_container {
        display: inline-block;
        width: calc(~'25.7% - 10px');
        height: 25vw;
        margin: 3px;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        .note {
    position: relative;
    bottom: 10px;
    left: 0.05333rem;
    width: 100%;
    background:rgba(239,241,245,1);
    padding: 10px 0;
    line-height:18px;
    font-size: 0.32rem;
    text-align: center;
    color: #6E7D8C;
    border-bottom-left-radius: 0.26667rem;
    border-bottom-right-radius: 0.26667rem;
    margin: 0;
    z-index: -111;
    span{
      // padding-top: 5px;
    }
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
    .customer_box{
      width: 95%;
      margin: 0 auto;
      margin-bottom: 6px;
      color: #6e7d8c;
        ul{
          display: inline-block;
          text-align: center;     
          margin: 0 auto;
          border-radius: 0.4rem;
          box-shadow: 0 0.08rem 0.77333rem 0 rgba(59, 74, 116, 0.14);
          padding:10px 0;
            li{
              display: inline-block;
              span{
                display: block;
                padding-top: 10px;
                // font-size: 16px;
                color: #6e7d8c;
              }
            }
        }
        .item_left{
            width: 72%;
            li{
              width:33.3%;
            }
          }
          .item_right{
            width: 25%;
            float: right;
          }
    }
    // 编辑弹框
    .van-popup{
      border-radius: 15px;
      width: 80%;
      height: 60%;
      padding: 0 10px 10px 10px;
      .wompile_box{
        font-family: serif;
        color:#ADADBD;
        // height: 96%;
        h3{
          text-align: center;
          font-weight: initial;
        }
        .wompile_info{
          textarea{
          width: 90%;
          background: #eff1f578;
          padding:15px;
          border: none;
          font-size: 12px;
          }
        }
        .history{
          height: 200px;
          max-height: 200px;
          overflow: scroll;
          ul{
            font-size: 12px;
            li{
              .text{
                margin-bottom: 0;
              }
              .time{
                text-align: right;
                margin-top: 5px;
              }
            }
          }

        }
      }
      .van-button--danger{
           background: #5A7AEF;
          border-radius: 0.34667rem;
          border: 0.02667rem solid #5A7AEF;
          position: absolute;
          left: 50%;
          transform: translate3d(-50%,50%,0);
          bottom: 30px;
          padding: 0 25px;
          height: 30px;
          line-height: 30px;
      }
    }
  }
</style>
<style lang="less">
.device {
  .van-circle__layer{
        transform: rotate(0deg);
  }
  .itme-box.device_chart {
    position: relative;
    width: 95%;
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0px 3px 29px 0px rgba(59, 74, 116, 0.14);
    background: #fff;
    margin-bottom: 10px;
    padding-top: 8px;
    .not-data{
      position: absolute;
    width: 150px;
    height: 30px;
    font-size: 16px;
    color:#999;
    left: 50%;
    margin-left: -75px;
    top: 50%;
    }
    p {
      position: relative;
      margin: 0;
      // font-size: 16px;
      color: #6e7d8c;
      padding-left: 20px;
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
      height: 210px !important;
    }
    #myChart {
      // width:100% !important;
    }
  }
}
</style>
<style>
.device_box .header_common{
    height: 30px;
    line-height: 15px;
}
.bac{
      background: #f0f0f0;
    height: 9px;
}
.delta{
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid;
   border-color:#999 transparent  transparent;
   margin-left: 6px;
}
#mountNode{
  width: 100% !important;
  height: 105%!important;
}
</style>
