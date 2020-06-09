// page/me/me.js
const app = getApp();
Page({
  data:{
    imgSrc:"../../resources/mePhoto.jpg",
    noLogin:app.noLogin()
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if(this.data.noLogin){
    	app.goLogin();
    }
    var wx_info = wx.getStorageSync("wx_userInfo");
    if (!wx_info) {
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync('wx_userInfo', res.userInfo);
         
        }
      })
    }
    that.setData({ wx_userInfo: wx.getStorageSync("wx_userInfo") })
  },
})