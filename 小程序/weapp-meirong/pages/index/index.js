//index.js
//获取应用实例
const app = getApp()
// require 获取 本机   其他js 文件  并保存变量
var  data = require("../../utils/data.js")

Page({
  data: {
    // 轮播图  banner初始化数据
    banner_url: data.getBannerData(),
    // 导航栏数据
    navTopItems: data.getIndexNavData(),
    // 导航栏 tab  当前的id
    curNavId:1,
    // 导航栏 tab  当前的索引 小标
    curIndex:0 ,
    // 文字颜色切换的 数组,
    colors:["red","orange","yellow","green","purple"],
    // 导航栏列表内容数据
    navSection: data.getIndexNavSectionData()
  
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 当小程序 页面 被加载的时候  执行的时间
  onLoad: function () {

     // 重新在data 对象内创建  新的属性  list
     this.setData({
       list:this.data.navSection
     })
   
  },
 // 对应的 导航切换的函数
  switchTab:function(e){
   
   //let  定义局部变量

   //  parseInt  把字符串  转化为 整型
    let id = parseInt(e.currentTarget.dataset.id) ;
    let index =parseInt(e.currentTarget.dataset.index);

    this.setData({
      curNavId:id,
      curIndex: index

    })

  },
// 跳转到详情页面

  navagateDetail:function(){
// 路由跳转
  wx.navigateTo({
    url: '../detail/detail',
  })


 },
  booTap:function(){

    wx.navigateTo({
      url: '../book/book',
    })
  },
  getUserInfo: function(e) {
   
  }
})
