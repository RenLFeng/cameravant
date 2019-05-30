<template>
    <div class="client_info common">
    <div class="wompile_info">
      <p class="tit_name" v-if="clientInfo.user_name">{{clientInfo.user_name}}&nbsp;({{clientInfo.user_type}}) <span>{{clientInfo.img_sex?'男':'女'}}&nbsp;{{clientInfo.img_age}}岁</span></p>
         <p class="tit_name" v-if="!clientInfo.user_name">{{clientInfo.user_type}} <span>{{clientInfo.img_sex?'男':'女'}}&nbsp;{{clientInfo.img_age}}岁</span></p>
      <div class="select_item">
            <p>  偏好:</p>
                <van-checkbox-group v-model="preferenceEd">
                    <van-checkbox
                        v-for="(item, index) in preferenceList"
                        :key="index"
                        :name="item">
                        {{ item.type }}
                </van-checkbox>
            </van-checkbox-group>
      </div>
      <div class="select_item">
            <p class="label">  行为:</p>
                <van-checkbox-group v-model="actionEd">
                    <van-checkbox
                        v-for="(item, index) in actionList"
                        :key="index"
                        :name="item">
                        {{ item.type }}
                </van-checkbox>
            </van-checkbox-group>
      </div>
      <div class="select_item">
          <van-cell-group>
            <van-field
                v-model="price"
                label="价格:"
                type="text"
                @input="priceCgange"
            />
          </van-cell-group>
      </div>
     <div class="select_item">
          <van-cell-group>
            <van-field
                v-model="classType"
                label="品类:"
                type="text"
            />
          </van-cell-group>
      </div>
      <div class="but_box">
            <van-button type="info" size="large"  class="btn add_user" @click="submit()">提交</van-button>
      </div>
    </div>
      <div class="history">
        <p class="tit">历史记录:</p>
        <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad(clientInfo.user_id)"
            :offset="-10"
            >
          <ul  v-if="historyList.length">
              <li v-for="(item,index) in historyList" :key="index">
                <p class="time">{{item.addtime}}</p>  
                <p class="text">
                    <span v-for="(prelist,index1) in item.prelist" :key="index1">{{prelist}}&nbsp;&nbsp;</span>
                    <span v-for="behList in item.behList" :key="behList">{{behList}}&nbsp;&nbsp;</span>
                    <span>{{item.price}}&nbsp;&nbsp;</span>
                    <span>{{item.detail}}</span>
                </p>
              </li>
          </ul>     
      </van-list>
       <p style="text-align: center;" v-if="!isShow">没有更多了...</p> 
       <p style="text-align: center;" v-if="isShow">暂无历史记录...</p> 
    </div>
    </div>
</template>

<script>
    import {
        Toast ,
        Popup,
        Button,
        Field,
        Dialog,
        Tab, 
        Tabs,
        Tag,
        List,
        Checkbox,
        CheckboxGroup 
    } from 'vant';
    export default {
        components: {
               [Toast.name]: Toast,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [List.name]: List,
            [Popup.name]: Popup,
            [Button.name]: Button,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
             [Tag.name]: Tag,
        },
        name: 'clientInfo',
        data() {
            return {
                isShow:false,
                loading: false,
                finished: false,
                finishedText:"没有更多了...",
                clientInfo:{},
                preferenceEd:[],
                actionEd:[],
                preferenceList:[],
                actionList:[],
                price:null,
                classType:'',
                historyList:[],
                current:1, 
                size:10
            }
              
        },
        created() {
                this.clientInfo=this.getSession("compileData")||'';
        },
        mounted() {
            app.scrollIntoView();
        },
        methods: {
         //滚动get 历史记录
           onLoad(id){
                let data={
                    "userId":id,
                    "current":this.current,
                    "size":this.size
                    }
                    this.axios.post(this.api.getRemarkList, {
                        data
                        }).then(res=>{ 
                        if (res.result === "true"&&res.content) {
                            if(!this.preferenceList.length){
                                this.preferenceList=res.content.preference;
                                this.actionList=res.content.behaviour;
                                  if(!res.content.remark.length){
                                     this.isShow=true;
                                }
                            }
                                this.historyList=[...this.historyList,...res.content.remark]
                                this.loading = false; 
                                this.current++; 
                                if (res.content.remark.length<10) {
                                    this.finished = true; 
                                } 
                        }
                        }).catch(err=>{

                        })
                },
                //备注提交
                submit(){
                    if(!this.preferenceEd.length){
                        Toast('请选择偏好');
                        // Dialog.alert({
                        //     message: '请选择偏好'
                        //  });
                         return;
                    }
                     if(!this.actionEd.length){
                          Toast('请选择行为');
                        // Dialog.alert({
                        //     message: '请选择行为'
                        //  });
                         return;
                    }
                    let preferenceListId=[];
                    let actionListId=[];
                    for(let i=0;i<this.preferenceEd.length;i++){
                        preferenceListId[i]=this.preferenceEd[i].id
                    }
                     for(let i=0;i<this.actionEd.length;i++){
                        actionListId[i]=this.actionEd[i].id
                    }
                    let data={
                        "userId":this.clientInfo.user_id,
                        "preference":preferenceListId.join(','),
                        "behaviour":actionListId.join(','),
                        "price":parseFloat(this.price),
                        "detail":this.classType
                    }
                    console.log(data);
                 this.axios.post(this.api.setRemarkList, {
                    data
                    }).then(res=>{
                      if (res.result === "true") {
                          Dialog.alert({
                            message: '提交成功'
                            }).then(() => {
                                 let  preferenceList=[]
                                 let  actionList=[];
                                for(let i=0;i<this.preferenceEd.length;i++){
                                     preferenceList[i]=this.preferenceEd[i].type
                                    }
                                    for(let i=0;i<this.actionEd.length;i++){
                                        actionList[i]=this.actionEd[i].type
                                    }
                             let date   = new Date()
                            let year   = date.getFullYear();
                            let month  = date.getMonth()+1;
                            month=month>9?month:'0'+month
                            let day    = date.getDate();
                              day=day>9?day:'0'+day
                            let hour   = date.getHours(); 
                             hour=hour>9?hour:'0'+hour
                            let minute = date.getMinutes();
                              minute=minute>9?minute:'0'+minute
                            let second = date.getSeconds(); 
                             second=second>9?second:'0'+second
                            let temp={
                                    addtime:year+'-'+month+'-'+day+'  '+hour+':'+minute+':'+second,
                                    prelist:preferenceList,
                                    behList:actionList,
                                    price:this.price,
                                    detail:this.classType,
                            }
                                this.historyList.unshift(temp);

                                this.preferenceEd=[];
                                this.actionEd=[];
                                this.price='';
                                this.classType='';
                            });
                      }else{
                           Dialog.alert({
                            message: '提交失败'
                            }).then(() => {
                                // do something...
                            });
                      }
                    }).catch(err=>{
                    })
                },
            //价格输入限制
            priceCgange(){
                let len=this.price.length
                    for(var i=0;i<len;i++){

                        if(isNaN(this.price[i])&&this.price[i]!='.'){
                            this.price=this.price.substr(0,i);
                            return;
                         }
                     }
                         if(this.price.indexOf(".")){
                                let value=this.price;
                                let temp=value.split(".")[1];
                                if(temp.length>=2){
                                    let tempVal = parseFloat(value).toFixed(3)
                                    let realVal = tempVal.substring(0, tempVal.length - 1)
                                    return this.price=realVal
                              
                                }
                         }
            },
        },
        computed: {
        },
        filters: {

        }
    }
</script>
<style lang="less">
    @dark: #17233D;
    @darkl: rgba(23, 35, 61, 0.75);
    @darkm: rgba(23, 35, 61, 0.35);
    @darks: rgba(23, 35, 61, 0.2);
    @darkxs: rgba(23, 35, 61, 0.1);
    @darkxxs: rgba(23, 35, 61, 0.06);
    @darkxxxs: rgba(23, 35, 61, 0.03);
    @orange: #ff9900;
    @green: #46ba01;
  .client_info{
      .tit_name{
          margin: 0;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0a1;
      }
      .select_item{
            border-bottom: 1px solid #f0f0f0a1;
            padding: 15px 0;
            height: 30px;
            line-height: 30px;
          p,.van-checkbox-group{
              float: left;
          }
          .van-checkbox-group{
                width: 86%;
                padding-left: 10px;
          }
        p{
              margin: 0;
          }
          .van-checkbox-group{
              .van-checkbox{
                  display: inline-block;
                  margin-right: 10px;
                      width: 2.16667rem;
                  .van-checkbox__icon--round .van-icon{
                      border-radius: 20%;
                  }
              }
          }
          &.select_item::after{
              display: block;
              content: '';
              clear: both;
          }
          .van-cell{
              padding-left: 0;
              padding-bottom: 0;
              padding-top: 0;
            color: #758391;
            .van-field__label{
                max-width: 50px;
            }
            
          }
            .van-checkbox__label{
                  color: #758391;
              }
      }
      .history{
          margin-top: 30px;
          height: 300px;
          max-height: 300px;
          overflow: scroll;
          .tit{
              margin: 0;
              padding: 15px 0;
               border-bottom: 1px solid #f0f0f0a1;
               font-size: 16px;
          }
          .time{
              margin-bottom: -9px;
              font-size: 12px;
              color: #BBBBBB;
          }
          .text{
              font-size: 14px;
          }

      }
      .but_box{
          margin-top: 20px!important;
      }
  }
</style>