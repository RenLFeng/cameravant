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
    
  }
};
