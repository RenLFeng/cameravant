<!-- 运维管理-产品销售管理 -->
<template>
  <div class="manage-right manage-sales">
    <div class="top-bar"> 产品销售管理 </div>
    <div class="manage-content">
      <div class="content">
        <div class="tags_container">
          <Tag v-for="(item,index) in tags" type="dot" :key="index" closable :color="item.color" class="tag">{{item.productName}}</Tag>
          <Button icon="ios-plus-empty" type="dashed" size="large" @click="handleAdd" @on-close="handleClose" class="btn">添加产品</Button>
        </div>
        <div class="map_container clearfix">
          <h3>产品地域分布图
            <ButtonGroup shape="circle" class="feedbackSelect">
              <Button v-for="item in rangeTypes" :key="item.value" type="ghost" :class="item.selected?'selected':''" @click="toggleSelect(item)">{{item.text}}</Button>
            </ButtonGroup>
          </h3>
          <div class="fl">
            <h4>省份分布</h4>
            <div id="provinceSales"></div>
          </div>
          <div class="fr">
            <table class="mytable">
              <thead>
                <tr>
                  <th width="10%">排名</th>
                  <th width="15%">省份</th>
                  <th width="25%">智能喷头</th>
                  <th width="25%">扫地机器人</th>
                  <th width="25%">智能机器人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in ranks">
                  <td>{{index+1}}</td>
                  <td>{{item.province}}</td>
                  <td>
                    <Progress :percent="item.product1data"></Progress>
                  </td>
                  <td>
                    <Progress :percent="item.product2data"></Progress>
                  </td>
                  <td>
                    <Progress :percent="item.product3data"></Progress>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="map_container">
          <h3>产品平均在线时间段</h3>
          <div id="onlinePeriod"></div>
        </div>
        <div class="map_container">
          <h3>产品平均在线时长</h3>
          <div id="onlineTime"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts';
  require('../home/map-data/china.js');
  export default {
    name: "manageSales",
    data() {
      return {
        tags: [{
          productName: "智能喷头",
          color: "#2D8CF0"
        }, {
          productName: "扫地机器人",
          color: " #00E6C4"
        }],
        rangeTypes: [{
          text: "省份",
          selected: false,
          value: 1
        }, {
          text: "区域",
          selected: false,
          value: 2
        }, {
          text: "城市",
          selected: false,
          value: 3
        }],
        provinceSales: null,
        ranks: [{
          province: "河北",
          product1data: 30,
          product2data: 30,
          product3data: 30
        }, {
          province: "内蒙古",
          product1data: 30,
          product2data: 30,
          product3data: 30
        }, {
          province: "河南",
          product1data: 30,
          product2data: 30,
          product3data: 30
        }, {
          province: "陕西",
          product1data: 30,
          product2data: 40,
          product3data: 50
        }, {
          province: "山西",
          product1data: 70,
          product2data: 10,
          product3data: 30
        }, {
          province: "浙江",
          product1data: 30,
          product2data: 40,
          product3data: 30
        }, {
          province: "江苏",
          product1data: 30,
          product2data: 30,
          product3data: 30
        }, {
          province: "湖南",
          product1data: 30,
          product2data: 30,
          product3data: 30
        }],
        onlinePeriod: null,
        onlineTime: null
      };
    },
    beforeCreate() {
      // 传值给父级菜单
      this.$emit("set-manage-menu", "sales");
    },
    created() {
      console.log(this.api.getBanner);
      console.log(this.axios);
    },
    mounted() {
      //基于准备好的dom，初始化echarts实例
      this.provinceSales = echarts.init(document.getElementById('provinceSales'));
      this.provinceSales.setOption({
        color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
        title: {
          show: false,
          text: '省份分布',
          x: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false,
          orient: 'vertical',
          x: 'left',
          data: ['iphone3', 'iphone4', 'iphone5']
        },
        dataRange: {
          min: 0,
          max: 2500,
          x: '20px',
          y: 'bottom',
          calculable: true,
          orient: 'horizontal',
          color: ['#2D8CF0', '#5FA8F4', '#8EC1F7', '#D7E9FC'],
        },
        toolbox: {
          show: false,
          orient: 'vertical'
        },
        roamController: {
          show: true,
          x: 'right',
          mapTypeControl: {
            'china': true
          }
        },
        series: [{
          name: 'iphone3',
          type: 'map',
          mapType: 'china',
          roam: false,
          itemStyle: {
            normal: {
              label: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          data: [{
            name: '北京',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '天津',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '上海',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '重庆',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '河北',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '河南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '云南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '辽宁',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '黑龙江',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '湖南',
            value: Math.round(Math.random() * 1000)
          }]
        }, {
          name: 'iphone4',
          type: 'map',
          mapType: 'china',
          data: [{
            name: '北京',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '天津',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '上海',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '重庆',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '河北',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '安徽',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '新疆',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '浙江',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '江西',
            value: Math.round(Math.random() * 1000)
          }]
        }, {
          name: 'iphone5',
          type: 'map',
          mapType: 'china',
          data: [{
            name: '北京',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '天津',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '上海',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '广东',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '台湾',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '香港',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '澳门',
            value: Math.round(Math.random() * 1000)
          }]
        }]
      });
      this.onlinePeriod = echarts.init(document.getElementById('onlinePeriod'));
      this.onlinePeriod.setOption({
        color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false
        },
        xAxis: [
          {
            type: 'category',
            data: ['00:00~03:00', '03:00~06:00', '06:00~09:00', '09.00~12:00', '12:00~15:00', '15:00~18:00', '18:00~21:00', '21:00~24:00'],
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
            }
          }
        ],
        series: [
          {
            name: '智能喷头',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2],
          },
          {
            name: '扫地机器人',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2],
          },
          {
            name: '智能机器人',
            type: 'bar',
            data: [4.6, 1.9, 3.0, 26.4, 28.7, 10.7, 65.6, 82.2],
          }
        ]
      });
      this.onlineTime = echarts.init(document.getElementById('onlineTime'));
      this.onlineTime.setOption({
        xAxis: {
            axisLine: {
              lineStyle: {
                color: "#aaa"
              }
            }},
        yAxis: {
            axisLine: {
              lineStyle: {
                color: "#aaa"
              }
            }},
        color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A'],
        symbolSize: 20,
        label: {
          emphasis: {
            show: true,
            formatter: function (params) {
              return params.data[2] + ':' + params.data[0];
            },
            position: 'top'
          }
        },
        series: [{
          data: [
            [10.0, 8.04, '智能喷头']
          ],
          type: 'scatter'
        }, {
          data: [
            [60.0, 15.34, '扫地机器人']
          ],
          type: 'scatter'
        },{
          data: [
            [40.0, 9.66, '智能机器人']
          ],
          type: 'scatter'
        }]
      });
    },
    methods: {
      // 点击切换类型并更新数据
      toggleSelect(data) {
        // 已经选中了就啥都别做（很多时候都要这么判断一下，免得重复加载，多余动作）
        if (data.selected) {
          return;
        }
        // 变换样式
        this.rangeTypes.forEach(obj => {
          obj.selected = false;
        });
        data.selected = true;
      },
      handleAdd() {
        var tags = [{
          productName: "智能喷头",
          color: "#2D8CF0"
        }, {
          productName: "扫地机器人",
          color: " #00E6C4"
        }, {
          productName: "智能机器人",
          color: "#FFC247"
        }]
        if (this.rangeTypes.length) {
          this.rangeTypes.push(tags[this.rangeTypes.length - 1] + 1);
        } else {
          this.rangeTypes.push(tags[0]);
        }
      },
      handleClose(event, name) {
        const index = this.rangeTypes.indexOf(name);
        this.rangeTypes.splice(index, 1);
      }
    }
  };
</script>
<style lang="less" scoped>
  .manage-sales {
    .content {
      background: transparent!important;
      box-shadow: none!important;
      .tags_container {
        .tag {
          margin-right: 8px;
          &.ivu-tag-dot {
            height: 48px;
            line-height: 48px;
            padding: 0 32px;
          }
        }
        .btn.ivu-btn-large {
          padding: 10px 15px 12px;
        }
      }
      .map_container {
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
        border-radius: 2px;
        margin-top: 22px;
        h3 {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(23, 35, 61, 0.1);
          font-weight: normal;
          font-size: 16px;
          color: #17233d;
          .feedbackSelect {
            float: right;
            margin-top: -4px;
            .selected {
              color: #2d8cf0;
            }
          }
        }
        #provinceSales {
          width: 100%;
          height: 424px;
          margin-bottom: 37px;
        }
        #onlinePeriod,
        #onlineTime {
          width: 100%;
          height: 424px;
          margin-bottom: 37px;
        }
        .fl {
          position: relative;
          float: left;
          width: 50%;
          box-sizing: border-box;
          h4 {
            position: absolute;
            left: 24px;
            top: 24px;
            font-size: 14px;
            color: #1C2438;
          }
        }
        .fr {
          width: 50%;
          height: 460px;
          float: right;
          box-sizing: border-box;
          border-left: 1px solid rgba(23, 35, 61, 0.10);
        }
        .mytable {
          width: 100%;
          th {
            height: 40px;
            line-height: 40px;
            background: rgba(20, 35, 63, 0.04);
            padding: 0 5px;
            text-align: left;
          }
          td {
            padding: 5px;
            border-bottom: 1px solid rgba(23, 35, 61, 0.10);
            .ivu-progress-text {
              position: absolute;
              left: 0;
              margin-left: 0px;
            }
            .ivu-progress-show-info .ivu-progress-outer {
              margin-left: 3em;
            }
            .ivu-progress-inner {
              margin-top: -5px;
            }
          }
        }
      }
    }
  }
</style>