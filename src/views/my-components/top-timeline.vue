<template>
    <div class="v-top-timeline">
        <ul class="top_timeline">
            <li v-for="(item,index) in progress" :class="{active:curStep>=index+1,current:curStep===index+1}" :key="index">
                <span class="timeline_icon">{{index+1}}</span>
                <br />
                <span class="timeline_text">{{item.text}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: "top-timeline",
  data() {
    return {
      stage: ["功能设置", "设置APP界面", "虚拟设备调试", "发布产品"]
    };
  },
  props: {
    curStep: Number
  },
  computed: {
    progress() {
      let data = [];
      for (let i = 0; i < this.stage.length; i++) {
        data.push({
          text: this.stage[i]
        });
      }
      return data;
    }
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.v-top-timeline {
  display: inline-block;
}
.top_timeline {
  display: inline-block;
  margin: 0 auto;
  list-style-type: none;
  text-align: center;
  overflow: hidden;
  li {
    position: relative;
    width: 160px;
    height: 54px;
    float: left;
    text-align: center;
    &:after {
      content: "";
      position: absolute;
      top: 13px;
      left: 93px;
      width: 160px;
      height: 0;
      border-top: 1px dashed rgba(23, 35, 61, 0.1);
      z-index: 0;
    }
    &:last-child:after {
      display: none;
    }
    &.active {
      & .timeline_icon {
        border-color: #008cf8;
        color: #008cf8;
      }
      &:after {
        border-color: #008cf8;
      }
    }
    &.current {
      border-bottom: 2px solid #008cf8;
      & .timeline_text {
        font-weight: bold;
        color: #008cf8;
      }
    }
  }
  .timeline_icon {
    position: relative;
    display: inline-block;
    width: 27px;
    height: 27px;
    background: #fff;
    border: 1px solid rgba(23, 35, 61, 0.25);
    border-radius: 50%;
    line-height: 27px;
    color: rgba(23, 35, 61, 0.25);
    font-family: HelveticaNeue-Medium;
    font-size: 13px;
    font-weight: bold;
  }
  .timeline_text {
    display: inline-block;
    font-size: 12px;
    color: rgba(23, 35, 61, 0.25);
    letter-spacing: 0;
    text-align: center;
    line-height: 22px;
  }
}
</style>
