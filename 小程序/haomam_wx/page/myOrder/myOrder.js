//获取应用实例  
const app = getApp();
Page( {  
  data: {  
    /** 
        * 页面配置 
        */  
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,
    actionSheetHidden:true,
    array: ['我不想要了', '东西运输时出现破损', '物品在保修期内出现问题','其他问题'],
    objectArray: [
      {
        id: 0,
        name: '我不想要了'
      },
      {
        id: 1,
        name: '东西运输时出现破损'
      },
      {
        id: 2,
        name: '物品在保修期内出现问题'
      },
      {
        id: 3,
        name: '其他问题'
      },
    ],
    index:0
  },  
  onLoad: function() {  
    var that = this;  
  
    /** 
     * 获取系统信息 
     */  
    wx.getSystemInfo( {  
  
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }  
    });
    app.requestAuthor('api/order/order_list',{ORDER_STATUS:3},function(data){
      that.setData({orders: data});
    });
    app.requestAuthor('api/order/order_list',{ORDER_STATUS:4},function(data){
      that.setData({orders_delivers: data});
    });
    app.requestAuthor('api/order/order_list',{ORDER_STATUS:5},function(data){
      that.setData({orders_refunds: data});
    });
    app.requestAuthor('api/order/order_list',{ORDER_STATUS:8},function(data){
      that.setData({orders_suc: data});
    });
  },  
  /** 
     * 滑动切换tab 
     */  
  bindChange: function( e ) {  
  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  
  },  
  /** 
   * 点击tab切换 
   */  
  swichNav: function( e ) {  
  
    var that = this;  
  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      })  
    }  
  },

  //联系客服
  makePhone:function(){
      wx.makePhoneCall({
        phoneNumber: '400-0656-555'
      })
  },

  //确认收货按钮
  ok:function(e){
      var that = this; 
      var index = e.currentTarget.dataset.index;
      var ORDER_NO = this.data.orders_delivers[index].ORDER_NO;
      wx.showModal({
          title: '提示',
          content: '确认收货？',
          success: function(res) {
              if (res.confirm) {
                  app.requestAuthor('api/order/sure_receive',{ORDER_NO:ORDER_NO,CLIENT_TOKEN:app.CLIENT_TOKEN()},function(data){
                       wx.showToast({
                        title: '确认收货成功',
                        icon: 'success',
                        duration: 2000
                      });
                      that.onLoad(); 
                  });   

              }
          }
      })
  },
  //申请退款按钮
  applicationRefund:function(e){
      var index = e.currentTarget.dataset.index;
      var ORDER_NO = this.data.orders_refunds[index].ORDER_NO;
      this.setData({
        actionSheetHidden:!this.data.actionSheetHidden,
        ORDER_NO:ORDER_NO
      });
  },
  actionSheetbindchange:function(){
      this.setData({
        actionSheetHidden:!this.data.actionSheetHidden
      })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  rtnVal:function(e){
      var val = e.detail.value;
      this.setData({val:val})
  },

  //申请退款弹层按钮  
  oktt:function(e){
      var arr = this.data.array[this.data.index];
      var that = this;
      
      if(this.data.index==3){
          var APPLY_REASON = arr + this.data.val
          that.setData({APPLY_REASON:APPLY_REASON})
      }else{
          var APPLY_REASON = arr;
          that.setData({APPLY_REASON:APPLY_REASON})
      }
      var APPLY_REASON = this.data.APPLY_REASON;
      var ORDER_NO = this.data.ORDER_NO;
      app.requestAuthor('api/order/apply_after_sale',{APPLY_REASON:APPLY_REASON,CLIENT_TOKEN:app.CLIENT_TOKEN(),SERVICE_TYPE:'5',ORDER_NO:ORDER_NO},function(data){
          wx.showModal({
          title: '提示',
          content: '确认收货？',
          success: function(res) {
              if (res.confirm) {   
                  wx.showToast({
                    title: '申请退款成功',
                    icon: 'success',
                    duration: 2000
                  });
                  that.setData({actionSheetHidden:!this.data.actionSheetHidden})
                  that.onLoad(); 
              }
          }
      })

          
      });
  },
  //查看物流
  logistics:function(e){
      var that = this; 
      var index = e.currentTarget.dataset.index;
      var WL_NO = this.data.orders_delivers[index].SEND_NUMBER;
      var ORDER_NO = this.data.orders_delivers[index].ORDER_NO;
      console.log(WL_NO);
      console.log(ORDER_NO);
      wx.navigateTo({url: 'logistics/logistics?WL_NO='+WL_NO+'&ORDER_NO='+ORDER_NO})
  }
})