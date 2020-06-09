const app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var data = {STORE_INFO_ID:options.STORE_INFO_ID};
    var that = this;
    app.request('api/store_info',data,function(data){
      that.setData(data);
      that.setData({markers:[{
        title:data.STORE_NAME,
        latitude:data.LATITUDE,
        longitude:data.LONGITUDE
      }]});
      wx.setNavigationBarTitle({
        title: data.STORE_NAME
      })
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})