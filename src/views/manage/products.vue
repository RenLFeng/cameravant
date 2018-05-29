<!-- 运维管理-产品库管理 -->
<template>
  <div class="manage-right manage-products">
    <div class="top-bar">
      产品管理库
      <div class="fr">
        <span class="txt_btn">导入产品EXCEL</span>
        <span class="txt_btn">同步账号</span>
        <Button class="create" type="primary" icon="plus" @click="ModalAddProduct = true">添加产品</Button>
        <Modal v-model="modal1" title="添加产品" @on-ok="ok" @on-cancel="cancel">
          <p>Content of dialog</p>
          <p>Content of dialog</p>
          <p>Content of dialog</p>
        </Modal>
      </div>
    </div>
    <div class="manage-content">
      <div class="content">
        <h3>我的产品库
        </h3>
        <table class="mytable">
          <thead>
            <tr>
              <th width="10%">DPID</th>
              <th width="10%">产业行业</th>
              <th width="12%">产品名称</th>
              <th width="10%">产品ID</th>
              <th width="10%">设备数量</th>
              <th width="12%">创建时间</th>
              <th width="8%">版本号</th>
              <th width="10%">连接方式</th>
              <th width="10%">故障率</th>
              <th width="8%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <td>{{item.dipid}}</td>
              <td>{{item.industry}}</td>
              <td>{{item.productName}}</td>
              <td>{{item.productId}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.createTime}}</td>
              <td>{{item.version}}</td>
              <td>{{item.connectionType}}</td>
              <td>{{item.failureRate}}</td>
              <td>
                <span class="txt_btn">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
        <Page :total="100" :page-size="10" :current="1" @on-change="changePage" class="page"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "manageProducts",
    data() {
      return {
        tableData: []
      };
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-manage-menu", "products");
    },
    methods: {
      mockTableData() {
        let data = [];
        for (let i = 0; i < 10; i++) {
          data.push({
            dipid: "00" + (i + 1),
            industry: "智能喷头",
            productName: "智慧农业",
            productId: "23476ffsdfg",
            quantity: parseInt(Math.floor(Math.random() * 10000)),
            createTime: "2018.2.11 18:11",
            version: "V1.2",
            connectionType: "蓝牙",
            failureRate: "12%"
          });
        }
        this.tableData = data;
      },
      changePage() {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.mockTableData();
      },
    }
  };
</script>
<style lang="less" scoped>
  .manage-products {
    .fr {
      float: right;
      .txt_btn {
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
        font-size: 14px;
        color: #008CF8;
        cursor: pointer;
      }
    }
    .ghost-blue {
      margin-left: 5px;
    }
    .content {
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
      border-radius: 2px;
      .feedbackSelect {
        float: right;
        .selected {
          color: #2D8CF0;
        }
      }
      .mytable {
        width: 100%;
        th {
          padding: 12px 2px;
          background: rgba(20, 35, 63, 0.04);
          font-size: 12px;
          color: #17233D;
          text-align: left;
          &:first-child,
          &:last-child {
            text-align: center;
          }
        }
        td {
          padding: 5px 2px;
          font-size: 14px;
          color: rgba(28, 36, 56, 0.80);
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
          .txt_btn {
            font-size: 14px;
            color: #008CF8;
            cursor: pointer;
          }
        }
      }
      .page {
        margin-top: 20px;
        float: right;
      }
      h3 {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(23, 35, 61, 0.10);
        font-weight: normal;
        font-size: 16px;
        color: #17233D;
      }
      h4 {
        padding: 20px 24px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.80);
        font-weight: normal;
      }
      .posR {
        position: relative;
      }
    }
  }
</style>