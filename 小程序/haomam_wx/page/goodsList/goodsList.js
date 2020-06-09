// page/goodsList/goodsList.js

// 获取全局应用程序实例对象
const app = getApp();

Page({
  data: {
    goods: null,
    maskDisplay: 'none',
    slideHeight: 0,
    slideRight: 0,
    slideWidth: 0,
    slideDisplay: 'block',
    screenHeight: 0,
    screenWidth: 0,
    slideAnimation: {},

    ballBottom: 20,
    ballRight: 30,
    ballOpacity: '.8',
    modalMsgHidden: true,
    bgColor: '#353535',
    bgColor1:'#fe5337',
    index1:'1',
    CURRENTPAGE:1
  },
  
   onReachBottom: function() {
     var that = this;
        app.request('api/goods_list', {SHOWCOUNT:10,CURRENTPAGE:this.data.CURRENTPAGE++}, function (data) {
            if(data){
              that.data.goods = that.data.goods.concat(data);
              that.setData({
                goods: that.data.goods
              });
            }
            
        })
    },
  onLoad: function (options) {
    var that = this;

    app.request('api/goods_list', {SHOWCOUNT:10,CURRENTPAGE:this.data.CURRENTPAGE}, function (data) {

      that.setData({ goods: data ,currIndex:-1});
    });
    app.request('api/goods_type_list', {}, function (data) {
      that.setData({ goods_list: data });
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          slideHeight: res.windowHeight * 2,
          slideRight: res.windowWidth,
          slideWidth: res.windowWidth * 0.7
        });
      }
    });

  },

  //浮动球点击 侧栏展开
  ballClickEvent: function () {
    slideUp.call(this);
  },

  //遮罩点击  侧栏关闭
  slideCloseEvent: function () {
    slideDown.call(this);
  },

  authorShowEvent: function () {
    this.setData({ modalMsgHidden: false });
  },

  brandsName: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var bgColor1 = that.data.bgColor1="#353535"
    app.request('api/goods_list', { GOODS_TYPE_LEVEL1: this.data.goods_list[index].GOODS_TYPE_ID },function (data) {
      that.setData({ goods: data  ,currIndex:index,bgColor1});
      
    });
  },
  allBrands: function () {
    var that = this;
    app.request('api/goods_list', {}, function (data) {
      that.setData({ goods: data,currIndex:-1});
    });
  },
})

//侧栏展开
function slideUp() {
  var animation = wx.createAnimation({
    duration: 600
  });
  this.setData({ maskDisplay: 'block' });
  animation.translateX('100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
}

//侧栏关闭
function slideDown() {
  var animation = wx.createAnimation({
    duration: 800
  });
  animation.translateX('-100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
  this.setData({ maskDisplay: 'none' });
}
