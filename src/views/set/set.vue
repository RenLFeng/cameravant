<template>
  <div class="home-main">
    <!-- 头部导航 -->
    <div class="main-header">
      <div class="breadcrumb">
        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
      </div>
      <top-timeline :cur-step="1" />
      <div class="action">
        <Button type="primary" @click="pageToNext">下一步</Button>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="main-content">
      <!-- 左侧信息 -->
      <left-info :product-info="productInfo" />
      <!-- 右侧具体内容 -->
      <div class="content">
        <div class="home-set-con">
          <h3 style="margin:24px 0;">功能设置
            <Button icon="plus" @click="modelAddSet = true" style="margin-left:10px;">添加</Button>
          </h3>
          <Table :columns="functionColumns" :data="tableFunctionList" class="table01"></Table>
          <h3 style="margin:24px 0;">触发器设置
            <Button icon="plus" @click="modelAddSet = true" style="margin-left:10px;">添加</Button>
          </h3>
          <table class="mytable">
            <thead>
              <tr>
                <th>DPID</th>
                <th>触发器名称</th>
                <th>触发功能点</th>
                <th>触发方式</th>
                <th>触发结果</th>
                <th>关联功能点</th>
                <th>控制方式</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,index) in tableTriggerList">
                <tr>
                  <td :rowspan="item.control.length+1">{{item.setId}}</td>
                  <td :rowspan="item.control.length+1">{{item.tirggerName}}</td>
                  <td :rowspan="item.control.length+1">{{item.triggerFunction}}</td>
                  <td>{{item.triggerType}}</td>
                  <td>{{item.triggerResult}}</td>
                  <td>{{item.associate}}</td>
                  <td>{{item.controlType}}</td>
                  <td :rowspan="item.control.length+1">{{item.note}}</td>
                  <td :rowspan="item.control.length+1">
                    <a href="javascript:void(0)" @click="editTriggerItem(item.id)" style="marign-right:5px;">编辑</a>
                    <a href="javascript:void(0)" @click="delTriggerItem(item.id, index)" style="marign-right:5px;">删除</a>
                  </td>
                </tr>
                <tr v-for="control in item.control">
                  <td>{{control.triggerType}}</td>
                  <td>{{control.triggerResult}}</td>
                  <td>{{control.associate}}</td>
                  <td>{{control.controlType}}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 增加功能点/集/触发器弹窗 -->
    <Modal v-model="modelAddSet" class="modal" title="功能添加" @on-ok="okAddSet" @on-cancel="cancelAddSet">
      <Tabs value="name1">
        <TabPane label="功能点" name="name1">
          <span v-for="item in tabOneList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked" :key="item.value">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的功能点，去自定义一个吧。
            <a href="javascript:void(0)" @click="addFunDotItem">自定义功能点</a>
          </div>
        </TabPane>
        <TabPane label="功能集" name="name2">
          <span v-for="item  in tabTwoList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked"
            :key="item.value">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的功能集，去自定义一个吧。
            <a href="javascript:void(0)" @click="addFunGroupItem">自定义功能集</a>
          </div>
        </TabPane>
        <TabPane label="触发器" name="name3">
          <span v-for="item in tabThreeList" class="check_a" :class="item.checked?'checked':''" @click="item.checked=!item.checked"
            :key="item.value">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          <div style="margin-top:20px;">
            没有找到合适的触发器，去自定义一个吧。
            <a href="javascript:void(0)" @click="addTriggerItem">自定义触发器</a>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
    <!-- 自定义功能点弹窗 -->
    <Modal v-model="modelCustomFunDot" class="modal" title="自定义功能点" @on-ok="okCustomFunDot">
      <Row class="mtb15">
        <Col class="label" span="5">功能点名称</Col>
        <Col span="19">
        <Input v-model="customFunDotData.funName" placeholder="请输入功能点名称..." size="large"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">数据点名称</Col>
        <Col span="19">
        <Input v-model="customFunDotData.dataName" placeholder="请输入数据点名称..." size="large"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">数据类型</Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.dataValue">
          <Radio class="check_a" v-for="(item,index) in customFunDotData.dataList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">读写类型</Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.readValue">
          <Radio class="check_a" v-for="(item,index) in customFunDotData.readList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue==='整数'||customFunDotData.dataValue==='浮点数'">
        <Col class="label" span="5">上下限</Col>
        <Col span="19">
        <InputNumber :max="10" :step="0.1" v-model="customFunDotData.min" placeholder="请输入..."></InputNumber>　至
        <InputNumber :min="customFunDotData.min" :step="0.1" v-model="customFunDotData.max" placeholder="请输入..."></InputNumber>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue==='浮点数'">
        <Col class="label" span="5">小数位数</Col>
        <Col span="19">
        <Select v-model="customFunDotData.decimal" style="width:200px">
          <Option v-for="(item,index) in customFunDotData.decimalList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mtb15" v-show="customFunDotData.dataValue==='浮点数'">
        <Col class="label" span="5">小数点传输</Col>
        <Col span="19">
        <RadioGroup v-model="customFunDotData.transValue">
          <Radio class="check_a" v-for="(item,index) in customFunDotData.transList" :label="item.label" :key="index">
            <span>{{item.label}}</span>
          </Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">备注</Col>
        <Col span="19">
        <Input v-model="customFunDotData.remark" placeholder="请输入备注..." size="large"></Input>
        </Col>
      </Row>
    </Modal>
    <!-- 自定义功能集弹窗 -->
    <Modal v-model="modelCustomFunGroup" class="modal" title="自定义功能集" @on-ok="okCustomFunGroup">
      <Row class="mtb15">
        <Col class="label" span="5">功能集名称</Col>
        <Col span="19">
        <Input v-model="customFunGroupData.groupName" placeholder="请输入功能集名称..." style="width:260px;margin-right:5px;"></Input>
        <Button class="create" type="success" icon="plus" style="color:#fff;border-color:transparent;" @click="addFunDotToGruup">创建功能点</Button>
        </Col>
      </Row>
      <div v-for="(dotItem, dotIndex) in customFunGroupData.dotList" :key="dotIndex">
        <Row class="mtb15">
          <Col class="label" span="5">功能点00{{dotIndex+1}}</Col>
          <Col span="19">
          <Input v-model="dotItem.funName" placeholder="请输入功能点名称..." style="width:260px;margin-right:5px;"></Input>
          <Button type="ghost" shape="circle" icon="edit" @click="dotItem.show = !dotItem.show" style="margin-right:5px;border-color:#ccc;color:#ccc;"></Button>
          <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="customFunGroupData.dotList.splice(dotIndex,1)" style="border-color:#ccc;color:#ccc;"></Button>
          </Col>
        </Row>
        <div v-show="dotItem.show" class="collapse">
          <Row class="mtb15">
            <Col class="label" span="5">数据点名称</Col>
            <Col span="19">
            <Input v-model="dotItem.dataName" placeholder="请输入数据点名称..." size="large"></Input>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">数据类型</Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.dataValue" on-change="consoletest">
              <Radio class="check_a" v-for="item in dotItem.dataList" :label="item.label" :key="item.label">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">读写类型</Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.readValue">
              <Radio class="check_a" v-for="item in dotItem.readList" :label="item.label" :key="item.label">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue==='整数'||dotItem.dataValue==='浮点数'">
            <Col class="label" span="5">上下限</Col>
            <Col span="19">
            <InputNumber :max="10" :step="0.1" v-model="dotItem.min" placeholder="请输入..."></InputNumber>　至
            <InputNumber :min="dotItem.min" :step="0.1" v-model="dotItem.max" placeholder="请输入..."></InputNumber>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue==='浮点数'">
            <Col class="label" span="5">小数位数</Col>
            <Col span="19">
            <Select v-model="dotItem.decimal" style="width:200px">
              <Option v-for="item in dotItem.decimalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
          <Row class="mtb15" v-show="dotItem.dataValue==='浮点数'">
            <Col class="label" span="5">小数点传输</Col>
            <Col span="19">
            <RadioGroup v-model="dotItem.transValue">
              <Radio class="check_a" v-for="(item,index) in dotItem.transList" :label="item.label" :key="index">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row class="mtb15">
            <Col class="label" span="5">备注</Col>
            <Col span="19">
            <Input v-model="dotItem.remark" placeholder="请输入备注..." size="large"></Input>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
    <!-- 自定义触发器弹窗 -->
    <Modal v-model="modelCustomTrigger" class="modal" title="自定义触发器" @on-ok="okCustomTrigger">
      <Row class="mtb15">
        <Col class="label" span="5">触发器名称</Col>
        <Col span="19">
        <Input v-model="customTriggerData.triggerName" placeholder="请输入触发器名称..." style="width:260px;margin-right:5px;"></Input>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">触发功能点</Col>
        <Col span="19">
        <Select v-model="customTriggerData.dotValue" style="width:260px">
          <Option v-for="item in customTriggerData.dotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class="mtb15">
        <Col class="label" span="5">报警触发</Col>
        <Col span="19">
        <Button type="primary" icon="plus" :disabled="customTriggerData.alarmList.length>0" @click="addTriggerAlarm">创建</Button>
        </Col>
      </Row>
      <div v-for="(alarmItem, alarmIndex) in customTriggerData.alarmList" :key="alarmIndex">
        <Row class="mtb15">
          <Col class="label" span="5">报警00{{ alarmIndex+1 }}</Col>
          <Col span="19">
          <span class="check_a" :class="alarmItem.allChecked?'checked':''" @click="choseAllAlarm(alarmItem)">
            <Icon :type="alarmItem.allChecked?'android-checkbox':'android-checkbox-outline'" :color="alarmItem.allChecked?'#008CF8':''"
              class="check_a_icon"></Icon>按钮全选</span>
          </Col>
        </Row>
        <Row class="mtb15">
          <Col class="label" span="5">警报方式</Col>
          <Col span="19">
          <span v-for="(item,index) in alarmItem.typeList" class="check_a" :class="item.checked?'checked':''" @click="alarmChecked(alarmItem,item,index)"
            :key="item.value">
            <Icon :type="item.checked?'android-checkbox':'android-checkbox-outline'" :color="item.checked?'#008CF8':''" class="check_a_icon"></Icon>{{item.label}}</span>
          </Col>
        </Row>
        <div v-for="item in alarmItem.typeList" :key="item.value">
          <template v-if="item.checked">
            <Row class="mtb15">
              <Col class="label" span="5">{{ item.name }}</Col>
              <Col span="19">
              <Input v-model="item.number" :placeholder="item.place" style="width:260px;margin-right:5px;"></Input>
              </Col>
            </Row>
            <Row class="mtb15">
              <Col class="label" span="5">验证码</Col>
              <Col span="19">
              <Input v-model="item.code" placeholder="请输入验证码" style="width:260px;margin-right:5px;"></Input>
              <Button type="primary" :disabled="item.hasSend" @click="getCode(item)">{{ item.hasSend?'剩余 '+item.time+' s':'发送验证码' }}</Button>
              </Col>
            </Row>
          </template>
        </div>
      </div>
      <Row class="mtb15">
        <Col class="label" span="5">控制触发</Col>
        <Col span="19">
        <Button type="primary" icon="plus" @click="addTriggerControl">创建</Button>
        </Col>
      </Row>
      <div v-for="(ctrlItem,ctrlIndex) in customTriggerData.controlList" :key="ctrlItem.id">
        <Row class="mtb15">
          <Col class="label" span="5">控制00+{{ ctrlIndex+1 }}</Col>
          <Col span="19">
          <Input v-model="ctrlItem.name" placeholder="请输入功能点名称" style="width:260px;margin-right:5px;"></Input>
          <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="customTriggerData.controlList.splice(ctrlIndex,1)" style="border-color:#ccc;color:#ccc;"></Button>
          </Col>
        </Row>
        <Row class="mtb15">
          <Col class="label" span="5">控制方式</Col>
          <Col span="19">
          <RadioGroup v-model="ctrlItem.directValue">
            <Radio class="check_a" v-for="(item,index) in ctrlItem.directList" :label="item.label" :key="item.label">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
          </Col>
        </Row>
      </div>
      <Row class="mtb15">
        <Col class="label" span="5">备注</Col>
        <Col span="19">
        <Input v-model="customTriggerData.remark" type="textarea" :rows="4" placeholder="请输入备注..."></Input>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import expandRow from "./set_table.vue";
  import breadcrumbNav from "../main-components/breadcrumb-nav.vue";
  import topTimeline from "../my-components/top-timeline";
  import leftInfo from "../my-components/left-info";
  export default {
    name: "home_set",
    components: {
      expandRow,
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
        functionColumns: [
          {
            type: "expand",
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row["functionPoint"]
                }
              });
            }
          },
          {
            title: "DPID",
            key: "setId"
          },
          {
            title: "功能类型",
            key: "setType"
          },
          {
            title: "名称",
            key: "setName"
          },
          {
            title: "数据点",
            key: "data"
          },
          {
            title: "数据类型",
            key: "dataType"
          },
          {
            title: "读写特性",
            key: "readWrite"
          },
          {
            title: "上下限",
            key: "maxMin"
          },
          {
            title: "小数点数",
            key: "decimal"
          },
          {
            title: "是否传输小数",
            key: "ifDecimal"
          },
          {
            title: "备注",
            key: "note"
          },
          {
            title: "操作",
            key: "operate",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        // 点击编辑，用index拿到这个功能集的id，然后请求后台把这个功能集数据加载进弹窗
                        const index = params.index;
                        this.editFunGroupItem(
                          this.tableFunctionList[index].setId
                        );
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        // 删除理论上也要调接口
                        const index = params.index;
                        this.delFunGroupItem(
                          this.tableFunctionList[index].setId,
                          index
                        );
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        tableFunctionList: [],
        tableTriggerList: [],
        modelAddSet: false,
        tabOneList: [],
        tabTwoList: [],
        tabThreeList: [],
        modelCustomFunDot: false,
        modelCustomFunGroup: false,
        modelCustomTrigger: false,
        customFunDotData: {},
        customFunGroupData: {},
        customTriggerData: {}
      };
    },
    computed: {
      currentPath() {
        return this.$store.state.app.currentPath; // 当前面包屑数组
      }
    },
    created() {
      // 获取功能设置表格列表数据
      this.getTableFunctionList();
      // 获取触发器设置表格列表数据
      this.getTableTriggerList();
      // 获取功能点的选项列表
      this.getTabOneList();
      // 获取功能集的选项列表
      this.getTabTwoList();
      // 获取触发器的选项列表
      this.getTabThreeList();
      // 获取原始自定义功能点数据
      this.getCustomFunDotData();
      // 获取原始自定义功能集数据
      this.getCustomFunDotData();
      // 获取原始自定义触发器数据
      this.getCustomTriggerData();
    },
    mounted() { },
    methods: {
      // 获取功能设置表格列表数据
      getTableFunctionList() {
        // 模拟生成，实际要读接口
        let data = [];
        for (let i = 0; i < 5; i++) {
          data.push({
            setId: i + 1,
            setType: "功能集",
            setName: "GPS功能集" + i,
            data: "smart_1",
            dataType: "浮点型",
            readWrite: "可读",
            maxMin: "12" - i,
            decimal: "两位小数" + i,
            ifDecimal: "传输",
            note: "开发中",
            functionPoint: [
              {
                setId: "0" + (i + 1),
                setType: "功能点",
                setName: "GPS功能集",
                data: "smart_" + i,
                dataType: "浮点型",
                readWrite: "可读",
                maxMin: "12" - i,
                decimal: "两位小数",
                ifDecimal: "传输",
                note: "开发中"
              },
              {
                setId: "0" + (i + 2),
                setType: "功能点",
                setName: "GPS功能集",
                data: "smart_" + i + 1,
                dataType: "浮点型",
                readWrite: "可读",
                maxMin: "12" - i - 1,
                decimal: "两位小数",
                ifDecimal: "传输",
                note: "开发中"
              }
            ]
          });
        }
        this.tableFunctionList = data;
      },
      // 获取触发器设置表格列表数据
      getTableTriggerList() {
        let data = [];
        for (let i = 0; i < 5; i++) {
          data.push({
            setId: i + 1,
            tirggerName: "烟雾报警0" + (i + 1),
            triggerFunction: "温度",
            triggerType: "报警",
            triggerResult: "电话",
            associate: "湿度",
            controlType: "正向" + i,
            note: "开发中",
            control: []
          });
          for (let j = 0; j < 2; j++) {
            data[i].control.push({
              triggerType: "报警",
              triggerResult: "电话" + j,
              associate: "湿度",
              controlType: "正向" + i
            });
          }
        }
        this.tableTriggerList = data;
      },
      // 获取功能点的选项列表
      getTabOneList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabOneList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      // 获取功能集的选项列表
      getTabTwoList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabTwoList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      // 获取触发器的选项列表
      getTabThreeList() {
        const data = [
          "高度",
          "方向",
          "速度",
          "温度",
          "电压",
          "转速",
          "角度",
          "浓度",
          "电流",
          "风速",
          "照度",
          "时间",
          "数量",
          "湿度",
          "压力",
          "压强",
          "亮度",
          "功率",
          "扭矩",
          "开关",
          "阀门",
          "油耗"
        ];
        data.forEach((val, index) => {
          this.tabThreeList.push({
            value: index,
            label: val,
            checked: false
          });
        });
      },
      // 确定增加功能点/集、触发器
      okAddSet() {
        // 功能点方面（保存为模板，实际上要存储到后台）
        this.$Message.info("添加成功！");
      },
      // 取消增加功能点/集、触发器
      cancelAddSet() {
        this.tabOneList.forEach(val => {
          val.checked = false;
        });
        this.tabTwoList.forEach(val => {
          val.checked = false;
        });
        this.tabThreeList.forEach(val => {
          val.checked = false;
        });
      },
      // 获取原始自定义功能点数据
      getCustomFunDotData() {
        this.customFunDotData = {
          funName: "",
          dataName: "",
          dataValue: "",
          dataList: [
            { label: "布尔数", value: "布尔数", checked: false },
            { label: "整数", value: "整数", checked: false },
            { label: "浮点数", value: "浮点数", checked: false }
          ],
          readValue: "",
          readList: [
            { label: "可读", value: "可读", checked: false },
            { label: "可写", value: "可写", checked: false }
          ],
          max: null,
          min: null,
          decimalValue: "",
          decimalList: [
            { label: "一位小数", value: "一位小数" },
            { label: "二位小数", value: "二位小数" },
            { label: "三位小数", value: "三位小数" },
            { label: "四位小数", value: "四位小数" }
          ],
          transValue: "",
          transList: [
            { label: "传输", value: "传输", checked: false },
            { label: "不传输", value: "不传输", checked: false }
          ],
          remark: ""
        };
      },
      // 自定义功能点
      addFunDotItem() {
        // 重置一下初始数据
        this.getCustomFunDotData();
        this.modelAddSet = false;
        this.modelCustomFunDot = true;
      },
      // 保存功能点数据
      okCustomFunDot() {
        this.$Message.info("已保存");
      },
      // 获取原始自定义功能集数据
      getCustomFunGroupData() {
        this.customFunGroupData = {
          groupName: "",
          dotList: [
            {
              show: false,
              funName: "",
              dataName: "",
              dataValue: "",
              dataList: [
                { label: "布尔数", value: "布尔数", checked: false },
                { label: "整数", value: "整数", checked: false },
                { label: "浮点数", value: "浮点数", checked: false }
              ],
              readValue: "",
              readList: [
                { label: "可读", value: "可读", checked: false },
                { label: "可写", value: "可写", checked: false }
              ],
              max: null,
              min: null,
              decimalValue: "",
              decimalList: [
                { label: "一位小数", value: "一位小数" },
                { label: "二位小数", value: "二位小数" },
                { label: "三位小数", value: "三位小数" },
                { label: "四位小数", value: "四位小数" }
              ],
              transValue: "",
              transList: [
                { label: "传输", value: "传输", checked: false },
                { label: "不传输", value: "不传输", checked: false }
              ],
              remark: ""
            },
            {
              show: false,
              funName: "",
              dataName: "",
              dataValue: "",
              dataList: [
                { label: "布尔数", value: "布尔数", checked: false },
                { label: "整数", value: "整数", checked: false },
                { label: "浮点数", value: "浮点数", checked: false }
              ],
              readValue: "",
              readList: [
                { label: "可读", value: "可读", checked: false },
                { label: "可写", value: "可写", checked: false }
              ],
              max: null,
              min: null,
              decimalValue: "",
              decimalList: [
                { label: "一位小数", value: "一位小数" },
                { label: "二位小数", value: "二位小数" },
                { label: "三位小数", value: "三位小数" },
                { label: "四位小数", value: "四位小数" }
              ],
              transValue: "",
              transList: [
                { label: "传输", value: "传输", checked: false },
                { label: "不传输", value: "不传输", checked: false }
              ],
              remark: ""
            }
          ]
        };
      },
      // 自定义功能集
      addFunGroupItem() {
        // 重置一下初始数据
        this.getCustomFunGroupData();
        this.modelAddSet = false;
        this.modelCustomFunGroup = true;
      },
      // 编辑功能集
      editFunGroupItem(id) {
        // 通过id读取到这个功能集的所有信息（用assign会有bug，出现不能及时新增和删除数据。 估计是最开始customFunGroupData不能定位{}而应该定null）
        this.customFunGroupData = {
          groupName: "功能集4",
          dotList: [
            {
              show: false,
              funName: "功能点1",
              dataName: "没有",
              dataValue: "布尔数",
              dataList: [
                { label: "布尔数", value: "布尔数", checked: true },
                { label: "整数", value: "整数", checked: false },
                { label: "浮点数", value: "浮点数", checked: false }
              ],
              readValue: "可读",
              readList: [
                { label: "可读", value: "可读", checked: true },
                { label: "可写", value: "可写", checked: false }
              ],
              max: 10,
              min: 1,
              decimalValue: "一位小数",
              decimalList: [
                { label: "一位小数", value: "一位小数" },
                { label: "二位小数", value: "二位小数" },
                { label: "三位小数", value: "三位小数" },
                { label: "四位小数", value: "四位小数" }
              ],
              transValue: "不传输",
              transList: [
                { label: "传输", value: "传输", checked: false },
                { label: "不传输", value: "不传输", checked: true }
              ],
              remark: "嘿嘿哈"
            },
            {
              show: false,
              funName: "功能点7",
              dataName: "没有",
              dataValue: "整数",
              dataList: [
                { label: "布尔数", value: "布尔数", checked: false },
                { label: "整数", value: "整数", checked: true },
                { label: "浮点数", value: "浮点数", checked: false }
              ],
              readValue: "可读",
              readList: [
                { label: "可读", value: "可读", checked: true },
                { label: "可写", value: "可写", checked: false }
              ],
              max: null,
              min: null,
              decimalValue: "二位小数",
              decimalList: [
                { label: "一位小数", value: "一位小数" },
                { label: "二位小数", value: "二位小数" },
                { label: "三位小数", value: "三位小数" },
                { label: "四位小数", value: "四位小数" }
              ],
              transValue: "传输",
              transList: [
                { label: "传输", value: "传输", checked: true },
                { label: "不传输", value: "不传输", checked: false }
              ],
              remark: "忘记了"
            }
          ]
        };
        this.modelCustomFunGroup = true;
      },
      // 在功能集弹窗里增加一项功能点
      addFunDotToGruup() {
        this.customFunGroupData.dotList.push({
          show: false,
          funName: "",
          dataName: "",
          dataValue: "",
          dataList: [
            { label: "布尔数", value: "布尔数", checked: false },
            { label: "整数", value: "整数", checked: false },
            { label: "浮点数", value: "浮点数", checked: false }
          ],
          readValue: "",
          readList: [
            { label: "可读", value: "可读", checked: false },
            { label: "可写", value: "可写", checked: false }
          ],
          max: null,
          min: null,
          decimalValue: "",
          decimalList: [
            { label: "一位小数", value: "一位小数" },
            { label: "二位小数", value: "二位小数" },
            { label: "三位小数", value: "三位小数" },
            { label: "四位小数", value: "四位小数" }
          ],
          transValue: "",
          transList: [
            { label: "传输", value: "传输", checked: false },
            { label: "不传输", value: "不传输", checked: false }
          ],
          remark: ""
        });
      },
      // 删除功能集列表的一项
      delFunGroupItem(id, index) {
        this.$Modal.confirm({
          title: "删除提示",
          content: "是否删除功能集以及其中的所有功能点？",
          onOk: res => {
            // 这里要调接口，删除这个产品（通过id删除）
            this.tableFunctionList.splice(index, 1);
          }
        });
      },
      // 保存功能集数据
      okCustomFunGroup() {
        this.$Message.info("已保存");
      },
      // 获取原始自定义触发器数据
      getCustomTriggerData() {
        this.customTriggerData = {
          triggerName: "",
          dotValue: "功能点一",
          dotList: [
            { label: "功能点一", value: "功能点一" },
            { label: "功能点二", value: "功能点二" },
            { label: "功能点三", value: "功能点三" }
          ],
          alarmList: [],
          controlList: [],
          remark: ""
        };
      },
      // 自定义触发器
      addTriggerItem() {
        // 重置一下初始数据
        this.getCustomTriggerData();
        this.modelAddSet = false;
        this.modelCustomTrigger = true;
      },
      // 编辑触发器
      editTriggerItem(id) {
        // 通过id读取到这个触发器的所有信息
        this.customTriggerData = {
          triggerName: "xxx控制器",
          dotValue: "功能点三",
          dotList: [
            { label: "功能点一", value: "功能点一" },
            { label: "功能点二", value: "功能点二" },
            { label: "功能点三", value: "功能点三" }
          ],
          alarmList: [
            {
              allChecked: true,
              typeList: [
                {
                  label: "短信",
                  value: "短信",
                  checked: true,
                  name: "手机号码",
                  place: "请输入手机号码",
                  number: "131234414",
                  hasSend: false,
                  time: 60,
                  code: ""
                },
                {
                  label: "电话",
                  value: "电话",
                  checked: true,
                  name: "电话",
                  place: "请输入电话号码",
                  number: "0624234234",
                  hasSend: false,
                  time: 60,
                  code: ""
                },
                {
                  label: "邮箱",
                  value: "邮箱",
                  checked: true,
                  name: "邮箱",
                  place: "请输入邮箱",
                  number: "152352@qq.com",
                  hasSend: false,
                  time: 60,
                  code: ""
                }
              ]
            }
          ],
          controlList: [
            {
              id: 71,
              name: "触发器名字",
              directValue: "正向",
              directList: [
                { label: "正向", value: "正向", checked: true },
                { label: "负向", value: "负向", checked: false }
              ]
            }
          ],
          remark: "没什么"
        };
        this.modelCustomTrigger = true;
      },
      // 创建报警触发项
      addTriggerAlarm() {
        this.customTriggerData.alarmList = [
          {
            allChecked: false,
            typeList: [
              {
                label: "短信",
                value: "短信",
                checked: false,
                name: "手机号码",
                place: "请输入手机号码",
                number: "",
                time: 60,
                hasSend: false,
                code: ""
              },
              {
                label: "电话",
                value: "电话",
                checked: false,
                name: "电话",
                place: "请输入电话号码",
                number: "",
                time: 60,
                hasSend: false,
                code: ""
              },
              {
                label: "邮箱",
                value: "邮箱",
                checked: false,
                name: "邮箱",
                place: "请输入邮箱",
                number: "",
                time: 60,
                hasSend: false,
                code: ""
              }
            ]
          }
        ];
      },
      // 创建控制触发项
      addTriggerControl() {
        this.customTriggerData.controlList.push({
          id: this.customTriggerData.controlList.length,
          name: "",
          directValue: "",
          directList: [
            { label: "正向", value: "正向", checked: false },
            { label: "负向", value: "负向", checked: false }
          ]
        });
      },
      // 删除控制触发项
      delTriggerControl(id, index) {
        this.customTriggerData.controlList.splice(index, 1);
      },
      // 删除触发器表格里一项
      delTriggerItem(id, index) {
        this.$Modal.confirm({
          title: "删除提示",
          content: "是否删除该触发器？",
          onOk: res => {
            // 这里要调接口，删除这个产品（通过id删除）
            this.tableTriggerList.splice(index, 1);
          }
        });
      },
      // 全选报警方式
      choseAllAlarm(alarmItem) {
        alarmItem.typeList.forEach(val => {
          val.checked = alarmItem.allChecked ? false : true;
        });
        alarmItem.allChecked = !alarmItem.allChecked;
      },
      // 单个选择报警方式
      alarmChecked(alarmItem, item, index) {
        if (item.checked) {
          item.checked = false;
          alarmItem.allChecked = false;
        } else {
          item.checked = true;
          alarmItem.allChecked = alarmItem.typeList.every(val => {
            return !!val.checked;
          });
        }
      },
      // 倒计时函数
      countDownTime(item) {
        let fnCount = () => {
          let count = setTimeout(() => {
            if (item.time <= 0) {
              clearTimeout(count);
              item.hasSend = false;
              item.time = 60;
            } else {
              item.time -= 1;
              fnCount();
            }
          }, 1000);
        };
        fnCount();
      },
      // 点击发送验证码按钮获取验证码
      getCode(item) {
        item.hasSend = true;
        this.countDownTime(item);
      },
      // 保存触发器数据
      okCustomTrigger() {
        this.$Message.info("已保存");
      },
      // 跳下一步骤页面
      pageToNext() {
        this.$router.push("/home/setapp");
      }
    }
  };
</script>
<style lang="less" scoped>
  .content {
    .ivu-btn {
      border-color: #57a3f3;
      color: #57a3f3;
    }
    .home-set-con {
      padding: 1px 20px 10px;
      background-color: #fff;
    }
  }

  .table {
    width: 100%;
  }

  .table01 th {
    width: calc(~"(100% - 50px) / 11");
  }

  .table02 th {
    width: calc(~"(100% - 50px) / 9");
  }

  .modal {
    .label {
      line-height: 34px;
      font-size: 14px;
      color: rgba(29, 36, 54, 0.8);
      font-weight: bold;
      text-align: center;
    }
    .collapse .label {
      font-weight: normal;
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
      }
    }
    .check_a_icon {
      vertical-align: middle;
      color: #ddd;
    }
  }

  .mytable {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e0e0e0;
    th {
      padding: 5px 3px;
      height: 40px;
      background: #f8f8f9;
    }
    th,
    td {
      text-align: center;
    }
    td {
      height: 35px;
      padding: 3px;
      border: 1px solid #e0e0e0;
    }
  }
</style>