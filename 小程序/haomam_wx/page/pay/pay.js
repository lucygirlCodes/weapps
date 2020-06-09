const app = getApp();
Page({
  data:{

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.data){
      that.setData(JSON.parse(options.data));
    } else {
      var JSON_GOODS_ITEM = options.JSON_GOODS_ITEM;
      var CART_TYPE= options.CART_TYPE;
      var _data = {
        JSON_GOODS_ITEM:JSON_GOODS_ITEM,
        CART_TYPE:CART_TYPE,
        CLIENT_TOKEN:app.CLIENT_TOKEN()
      };
      app.requestAuthor('api/Cart/checkOutLists',_data,function(data){
        if (data.BRAND_CART) {
            data.BRAND_ARR = [];
            for(var brand in data.BRAND_CART){
                var brandBean={brand:brand,selected:true};
                data.BRAND_ARR.push(brandBean);
                var arr = data.BRAND_CART[brand];
                for(var i=0, cartItem;cartItem=arr[i++];){
                    data.BRAND_CART[brand][i-1].selected=true;
                }
            }
        }
        that.setData(data);
      });
      that.setData(_data);
    }
  },
  // 去选址地址
  goChooseAddress:function(){
    var that = this;
    var CART_TYPE = that.data.CART_TYPE;
    wx.navigateTo({ url: '../address/addressList',success:function(){
      wx.setStorageSync('isPay', 1);
    }});
  },
  onShow:function(){
    this.setData({ADDRESS:wx.getStorageSync('ADDRESS')});
    console.log('aaaa'+new Date());
  },
  goPay:function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var ADDRESS = this.data.ADDRESS;
    var data = {
      JSON_GOODS_ITEM:this.data.JSON_GOODS_ITEM, 
      PAY_TYPE:4,
      OPEN_ID:wx.getStorageSync('openId'),
      UUID:this.data.CLIENT_TOKEN,
      DELIVERY_ADDRESS_ID:ADDRESS.DELIVERY_ADDRESS_ID,
      RECEIVER_PHONE:ADDRESS.CONSIGNEE,
      RECEIVER_NAME:ADDRESS.MOBILE,
      RECEIVER_ADDRESS:
      ADDRESS.REGION_PROVINCE+
                ADDRESS.REGION_COUNTRY+
                ADDRESS.REGION_CITY+
                ADDRESS.ADDRESS
    }
    app.requestAuthor('api/order/pay',data,function(data){
      console.log(data);
      wx.hideToast();
      var SIGN_PAY_STR = data.SIGN_PAY_STR;
      wx.requestPayment({
        'timeStamp': SIGN_PAY_STR.timeStamp+'',
        'nonceStr': SIGN_PAY_STR.nonceStr,
        'package': SIGN_PAY_STR.package,
        'signType': 'MD5',
        'paySign': SIGN_PAY_STR.paySign,
        'success':function(res){
          console.log(res);
        },
        'fail':function(res){
            console.log(res);
        }
      })
    });
    
  }
})