// page/find/shopList.js
const app = getApp();
Page({
  data:{
    array: ['北京市', '高碑店市'],
    objectArray: [
      {
        id: 0,
        name: '北京市'
      },
      {
        id: 1,
        name: '高碑店市'
      },
    ],
    index: 0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.request('api/store_list',{AREA_NAME:'北京市'},function(data){
      that.setData({shopList:data});
    })
    // app.request('api/area_list',{REQ_TYPE:03},function(data){
    //   that.setData({city:data});
    // })
  },
  bindPickerChange: function(e) {
    var that = this;
    that.setData({
      index: e.detail.value
    });
    var index = this.data.index
    if(index==0){
        that.setData({AREA_NAME: "北京市"})
    }else{
        that.setData({AREA_NAME: "高碑店市"})
    }
    app.request('api/store_list',{AREA_NAME:this.data.AREA_NAME},function(data){
      that.setData({shopList:data});
    })
  },
  GPS:function(){
    //wx.getLocation可以获取到经纬度
    //调用腾讯地图API来获取经纬度对应的城市
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({gps:res})
        console.log(res);
      },
    })
    
  }
})