// page/myOrder/logistics/logistics.js
const app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var WL_NO = options.WL_NO;
    var ORDER_NO = options.ORDER_NO;
    console.log(WL_NO);
    console.log(ORDER_NO);
    app.requestAuthor('api/wl_info',{ORDER_NO:ORDER_NO,WL_NO:WL_NO},function(data){
        that.setData({data:data})
    });
  },
})