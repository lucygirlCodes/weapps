// pages/book/book.js
// require 引入外部数据
var  util = require("../../utils/util.js")
var data = require("../../utils/data.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址源的数据  类型
    addrArray:util.replacePhone(data.userData().addrs,true),
    // 默认地址索引
    addrIndex:0,
    //默认的日期
    date:"2020-02-05",
    // 时间
    time:"12:00"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindAddrPickerChange:function(e){

    console.log(e.detail.value);
    this.setData({
      addrIndex: e.detail.value
    })

  },
  bindDateChange:function(e){
    console.log(e.detail.value);
    this.setData({
      date: e.detail.value
    })

  },

  bindTimeChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      time: e.detail.value
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})