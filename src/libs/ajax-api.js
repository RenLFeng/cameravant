/* 接口api统一管理 */
// 接口
const ajaxUrl = {
    feedBack: '/app/all/index/get_articles.json', // 运维管理-APP管理-获取反馈信息列表
    dailyData: '/s/read/get_news_express_list.json', // 快报内容（好像无效了）  
    productList:'/product/type/dev/',//首页产品列表
    industryList:'/product/type/alltrade',//首页中产品创建弹窗中-获取产品所有行业
    connectionList:'/product/type/allconnect',//获取产品所有连接方式
    addProductType:'/product/type/edit',//首页添加产品类型以及编辑产品类型
}
// 返回模块
export default ajaxUrl;