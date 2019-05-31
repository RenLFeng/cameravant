/* eslint-disable */ 
/* 自定义封装的方法，全局用 */

export default {
  install: function (Vue, options) {

    // rem自适应适配设置
    Vue.prototype.setAutoSize = function () {
      var deviceWidth = document.documentElement.clientWidth;
      if (deviceWidth > 640) {
        deviceWidth = 640;
      };
      document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    };

    //多行阶段样式（写css会被vue干掉不规则样式，导致ios无效）
    Vue.prototype.lineClamp = function (num) {
      return {
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
        'display': '-webkit-box',
        '-webkit-line-clamp': num,
        '-webkit-box-orient': 'vertical',
        'word-wrap':'break-word',
        'word-break':'break-all',
      }
    }
    //取200*200图片
    Vue.prototype.getSmallPic = function (str, endStr) {
      let newStr='',
          result='',
          index=-1;
      if(endStr){
        index=str.indexOf(endStr);
      }else{
        index=str.indexOf('!large');
        // alert('methods33 '+index);
      }
      if(index>-1){
        newStr=str.substring(0,index);
        result=newStr.concat('!200');
        return result;
      }else{
        return str;
      }
    };
    // 时间格式化
    Vue.prototype.dateFormat = function (dateNum, format) {
      var isDate = dateNum,
        result = '';
      if (typeof dateNum === 'string') { //判断格式
        var reg = /\D/g;
        if (!reg.test(dateNum)) { //如果是纯数字的字符串
          isDate = parseInt(dateNum);
        } else { //将-换成/，并且去掉最后的毫秒，以支持IE8-9
          isDate = dateNum.replace(/\-/g, '/').split('.')[0];
        }
      }
      var date = new Date(isDate),
        isFormat = format ? format.toString() : 'YYYY.MM.DD hh:mm:ss', //判断是否存在并转成字符串
        dateObj = { //定义格式
          'YYYY': date.getFullYear(),
          'MM': (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          'DD': date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          'hh': date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          'mm': date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          'ss': date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        };
      result = isFormat.replace(/(YYYY|MM|DD|hh|mm|ss)/g, function (args) { //匹配转换格式
        return dateObj[args] || args;
      });
      return result; //返回结果
    };

    // 手机号码正则验证
    Vue.prototype.regPhone = function (str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    };

    // 手机号码valid验证
    Vue.prototype.validPhone = function (rule, value, callback) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    };

    //邮箱正则验证
    Vue.prototype.regMail = function (str) { const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/; return reg.test(str); }
    //弹框阻止关闭
    Vue.prototype.changeLoading = function () {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    };
    //getUrlParam
    Vue.prototype.getUrlParam = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数  
      if (r != null) {
        return unescape(r[2]);  //返回参数值 
      } else {
        return null;
      }
    };
    //getVueUrlParam
    Vue.prototype.getVueUrlParam = function (name) {
      const after = window.location.hash.split("?")[1];
      if (after) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const r = after.match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        } else {
          return null;
        }
      }
    };
    //get sessionStorage
    Vue.prototype.getSession=function(item){
      let sObj=window.sessionStorage.getItem(item);
        return JSON.parse(sObj);
    };
     //set sessionStorage
    Vue.prototype.setSession=function(item,objet){
      window.sessionStorage.setItem(item,JSON.stringify(objet))
    };
    //get localStorage
    Vue.prototype.getLocal=function(item){
      let sObj=window.localStorage.getItem(item);
      return JSON.parse(sObj);
    };
     //set localStorage
    Vue.prototype.setLocal=function(item,objet){
      window.localStorage.setItem(item,JSON.stringify(objet))
    };
    //字符串脱敏
    Vue.prototype.strFn=function(val){
      let str='';
      let first=val.substr(0,1);
      let laist=val.substr(val.length-1,1);
      return str=first+'**'+laist;
    },
    //OpenId
    Vue.prototype.getCode = function (local) {
      const that = this;
      let pro = new Promise((resovle, reject) => {
        //appid
        let id = that.getVueUrlParam('appid');
        if (id) {
          // alert('1===getVueUrlParam()获取appid===setsessionStorage'+id)
          window.sessionStorage.setItem('appid', id);
        }
        let appid = window.sessionStorage.getItem('appid');
        if (!appid || appid === 'null') {
          // alert('get ===setsessionStorage'+appid)
          return;
        } else {
          const openid = that.getVueUrlParam('openid') || window.sessionStorage.getItem('openid') || '';
          const isVip=window.sessionStorage.getItem('isVip') || '';
          if(!openid || openid === 'null'){
            // alert('get===Param() || Storage'+openid)
            const code = that.getUrlParam('code');
            if (!code || code === 'undefined') {
              // alert('getUrlParam("code")'+code)
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
            } else {
              that.axios.post(this.api.getCode+'?code='+code,{
              }).then(res => {
                // alert('134'+JSON.stringify(res));
                if(res.result=='true'){
                  window.sessionStorage.setItem('openid', res.content.openId);
                  if(res.content.isVip){
                      window.sessionStorage.setItem('isVip',true);
                  }else{
                    window.sessionStorage.setItem('isVip',false);
                  }
                  Vue.prototype.isVip= window.sessionStorage.getItem('isVip');
                  resovle(res.content.openId);
                  // alert('135 ' + local + '?appid=' + appid+ '&openid=' + res.msg);
                }else{
                  // alert('143 ' + JSON.stringify(res));
                }
              }).catch(err => {
                // alert('144'+JSON.stringify(err));
                console.log(err);
              });
            }
          }else{
            window.sessionStorage.setItem('openid', openid);
            let vip=window.sessionStorage.getItem('isVip');
            Vue.prototype.isVip=vip;
            // window.location.href = local + '?appid=' + appid+ '&openid=' + openid;
            // alert('149 '+openid);
            resovle(openid);
          }
        }
      });
      return pro;
    };
    Vue.prototype.getDevices = function (openId) {
      // alert('158 '+openId);
      const that = this;
      const appId=window.sessionStorage.getItem('appid') || this.$route.query['appid'];
      let pro = new Promise((resovle, reject) => {
        that.axios.post(that.api.getdevices, {
          data: {
            userId: openId,
            appId,
          }
        }).then(res => {
          // alert('169'+JSON.stringify(res));
          if (res.result == "1") {
            const resData = res.data || {};
            that.$store.commit('commitDevices', resData);
            window.sessionStorage.setItem('devices', JSON.stringify(resData));
            if(Object.keys(resData).length>0){
              resData.forEach(val => {
                if (val.selected) {
                  console.log(val, '当前设备');
                  that.$store.commit('commitDevice', val);
                  window.sessionStorage.setItem('device', JSON.stringify(val));
                  // alert('178'+JSON.stringify(res.data));
                  resovle({
                    devices: resData,
                    device: val
                  });
                }
              });
            }else{
              that.$store.commit('commitDevice', {});
              window.sessionStorage.setItem('device', JSON.stringify({}));
              resovle({
                devices: resData,
                device: {}
              });
            }
          } else {
            console.log(res.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      });
      return pro;
    };    
    /* Vue.prototype.getCurrentPlay=function(){
      const that=this;
      let data = {
      }
      data.userId=window.sessionStorage.getItem('openid') || this.$route.query['openid'];
      data.deviceId=JSON.parse(window.sessionStorage.getItem('device')).device_id;
      this.axios.post(this.api.getCurrentPlay, {
          data
      }).then(res => {
          if (res.result == "1") {
              const resData = res.data||{};
              that.$store.commit('changeCurrentPlay',resData);
          } else {
              console.log(res.msg);
          }
      }).catch(err => {
          console.log(err);
      });
    }; */
  }
};