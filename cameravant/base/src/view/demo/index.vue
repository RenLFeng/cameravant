<template>
  <div class="device">
    <!-- <div class="input_container flex" @click='deviceSelectPop=true'><span class="input_label">设备名称：</span><span class="input_shape">{{selectedDevice.device_inst_addr?selectedDevice.device_inst_addr:'全部'}}</span>
      </div> -->
    <!-- <div class="input_container flex" @click='timeTypeSelectPop=true'><span class="input_label">时间选择：</span><span class="input_shape">{{timetype.value==='4'?selectedDateTime[0]+'至'+selectedDateTime[1]:timetype.text}}</span>
      </div> -->
    <van-tabs v-model="tabRangeTypeSelected" type="card" color="#0091fa" @change="timeTypeSelectConfirm">
      <van-tab v-for="item in rangeTypes" :title="item.text">
      </van-tab>
    </van-tabs>
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
    <!-- <div id="myChart" :style="{width: '300px', height: '300px'}"></div> -->
  </div>
</template>
<script>
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
         currentRate: 0,
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
        rangeTypes: [{
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
        deviceIds: [1],
        maleNum: null,
        genderAll: null,
        percent: '',
        legendNameArr: [['本周', '上周'], ['本月', '上月'], ['本年', '上年']]
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
      }
    },
    created() {
    //   this.getOpenId();
    this.getPageData(this.deviceIds);
    },
    mounted() {
     
    },
    methods: {
      //拿openid
      getOpenId() {
        this.getCode(this.api.server + '/#/device').then(resolve => {
          this.openid = resolve;
          this.getDeviceList(resolve);
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
            // console.log(res);
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
      goDeviceSearch() {
        //跳转设备搜索页面
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
    font-size: 14px;
    padding-top:10px;
    padding-bottom: 20px;
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