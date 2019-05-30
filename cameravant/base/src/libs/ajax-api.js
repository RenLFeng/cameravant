/* 接口api统一管理 */
// 接口
const ajaxUrl = {
    baseURL: 'http://wx.isafeiot.com',//给特殊的接口$axios用
     server:'http://wx.isafeiot.com',
    //功能点
    // login: '/face_pic_svr/login', // 登录接口
    // logout: '/face_pic_svr/logout',//注销接口DELETE方法，而非get、post
    // //获取系统状态
    // getSysStatus:'/server/stati/sysstatus',
    // //获取设备统计信息
    // getDeviceStat:'/face_pic_svr/get_device_stat',
    // //识别结果修正
    // correctRecogn:'/face_pic_svr/correct_recogn',
    // //获取设备日志
    // getDeviceLog:'/face_pic_svr/get_device_log',
    // //获取异常日志
    // getWarnLog:'/face_pic_svr/get_warn_log',
    // //添加设备
    // addDevice:'/face_pic_svr/add_device',
    // //编辑设备
    // editDevice:'/face_pic_svr/edit_device',
    // //删除设备
    // deleteDevice:'/face_pic_svr/delete_device',
    // //查询设备
    // getDeviceList:'/face_pic_svr/get_device_list',
    // //查询设备名称列表★
    // getDeviceNameList:'/face_pic_svr/get_devicename_list',
    // //添加商家
    // addAgent:'/face_pic_svr/add_agent',
    // //编辑商家
    // editAgent:'/face_pic_svr/edit_agent',
    // //删除商家
    // deleteAgent:'/face_pic_svr/delete_agent',
    // //查询商家
    // getAgentList:'/face_pic_svr/get_agent_list',
    // //添加用户
    // addUser:'/face_pic_svr/add_user',
    // //编辑用户
    // editUser:'/face_pic_svr/edit_user',
    // //删除用户
    // deleteUser:'/face_pic_svr/delete_user',
    // //查询用户
    // getUserList:'/face_pic_svr/get_user_list',
    // //添加设备类型
    // addDevicetype:'/face_pic_svr/add_devicetype',
    // //编辑设备类型
    // editDevicetype:'/face_pic_svr/edit_devicetype',
    // //删除设备类型
    // deleteDevicetype:'/face_pic_svr/delete_devicetype',
    // //查询设备类型
    // getDevicetypeList:'/face_pic_svr/get_devicetype_list',
    // //添加AI接口
    // addAiport:'/face_pic_svr/add_aiport',
    // //编辑AI接口
    // editAiport:'/face_pic_svr/edit_aiport',
    // //删除AI接口
    // deleteAiport:'/face_pic_svr/delete_aiport',
    // //查询AI接口
    // getAiportList:'/face_pic_svr/get_aiport_list',
    // //添加操作员
    // addOperator:'/face_pic_svr/add_operator',
    // //编辑操作员
    // editOperator:'/face_pic_svr/edit_operator',
    // //删除操作员
    // deleteOperator:'/face_pic_svr/delete_operator',
    // //查询操作员
    // getOperatorList:'/face_pic_svr/get_operator_list',
    // //修改密码
    // changPassword:'/face_pic_svr/chang_password',
    // //异常处理
    // warnProcess:'/face_pic_svr/warn_process',
    // //获取24小时抓图数据☆
    // imgstatPerhour:'/face_pic_svr/imgstat_perhour',
    // //用户分类统计☆
    // usergroupStat:'/face_pic_svr/usergroup_stat',
  //查询工厂列表☆
//   getFactoryList:'/face_pic_svr/get_factory_list',




    // //获取年龄分段统计☆
    ageStat:'/stati/agestat',
    //对比统计
    newImglist:'/stati/vipimglist',
    // newImglist:'/stati/imagelist',

    //get客户信息页面标签选项
    getRemarKLabel:'/stati/remarklist',
    //get device页面备注历史记录
    getRemarkList:'/stati/remarklist',
    //set device页面备注历史记录
    setRemarkList:'/stati/addremark',
    //获取性别统计
    sexStat:'/stati/sexstat',


    /*********以下是陈佳浩的接口*********/
    feedbackList:'/feedback/list',//查询某个用户的反馈信息列表
    feedbackAdd:'/feedback/add',//添加反馈接口
    feedbackDelete:'/feedback/delete',//删除反馈信息

    wechatBind:'/wechat/bind',//用户绑定设备
    wechatDevice:'/wechat/device',//微信用户获取设备列表
    wechatUnbind:'/wechat/unbind',//用户解绑设备
    wechatEditDevice:'/wechat/edit_device',//用户解绑设备
    statiComparestat:'/stati/comparestat',//对比统计
    getCode:'/wechat/getopenid',//通过code获取用户openID

    userBinduser:'/user/binduser',//分享绑定用户
    userSharecode:'/user/sharecode',//获取用户的账户授权码
    userApplyCode:'/user/applyCode',//发送验证码
    userVerifyCode:'/user/verifyCode',//校验验证码
    userWebauth:'/user/webauth',//账户密码授权    
    getUserIsauth:'/user/isauth',// 账户密码授权查询  
    setUserCancelauth:'/user/cancelauth',// 账户密码取消授权 
    userUnbindshare:'/user/unbindshare',//  解绑授权 
    userSharelist:'/user/sharelist',//   授权 列表

    aiPiclist:'/ai/piclist',//获取图片列表
    aiAdduser:'/ai/adduser',//给设备组添加用户
    aiUsertype:'/ai/usertype',//获取用户类型
    owntype:'/ai/owntype',//根据用户openid获取用户类型
    aiUserlist:'/ai/userlist',//获取用户列表
    aiDeleuser:'/ai/deleuser',//删除用户
    aiUpdateuser:'/ai/updateuser',//更新用户
    //考勤分析接口
    analysisDay:'/analysis/day',//考勤分析
    analysisTime:'/analysis/times',//今日活跃度
    analysisUser:'/analysis/user',//考勤时间
    analysisShareuser:'/analysis/shareuser',//获取被分享的列表


    statiStat:'/stati/stat',//device性别，年龄数据
    statiStatcompare:'/stati/statcompare',//device客流量分析曲线

    // **********************VIP*****************
    statiStatVip:'/stati/vipstat',//device性别，年龄数据
    statiStatcompareVip:'/stati/vipstatcompare',//device客流量分析曲线
    statiUserperc:'/stati/userperc',//device客戶類型图(vip)
}
// 返回模块
export default ajaxUrl;
