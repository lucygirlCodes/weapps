
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "index",
  /**
   * 页面的初始数据
   */

  data: {
      indexBanner: null,
      indicatorDots: false,  
      autoplay: true,  
      interval: 5000,  
      duration: 1000,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
      
    var that = this;
    
    app.request('api/ad_list',{AD_ZONE_ID:1},function(data){
      that.setData({indexBanner: data});
    });
  },
})

