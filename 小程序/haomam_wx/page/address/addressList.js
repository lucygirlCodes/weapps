const app  = getApp();
Page({
  data:{},
  onLoad:function(options){
    var that = this;
    app.requestAuthor('api/getMemberAddresslist',{IS_DEFAULT:0}, function(data){
      that.setData({ADDRESS_LIST:data});
    });
  },
  onShow:function(){
    // 如果 新增或修改成功则 onload
    if(wx.getStorageSync('_address_edit_status')){
      wx.setStorageSync('_address_edit_status',0);
      this.setData({delta:2});
      this.onLoad();
    } 
  },
  chooseAddressToOrder:function(e){
    // 当前选中的地址传递回去
      var that = this;
      var ADDRESS =that.data.ADDRESS_LIST[e.currentTarget.dataset.index];

      if(wx.getStorageSync('isPay')){
        wx.setStorageSync('isPay',0);
        wx.setStorageSync('ADDRESS', ADDRESS);
        wx.navigateBack({
          delta: that.delta, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
            console.log(e);
          },
          fail: function(e) {
            // fail
            console.log(e)
          },
          complete: function(e) {
            // complete
            console.log(e)
          }
        })
      }
    
  },
  //新增地址
  addAddress:function(){
    var _data = this.data;
    wx.navigateTo({
      url: '../address/edit'
    });
  },
  //编辑地址
  reviseAdd:function(e){
      var DELIVERY_ADDRESS_ID = e.currentTarget.dataset.item;
      var index = e.currentTarget.dataset.index;
      var data = this.data.ADDRESS_LIST[index];
      wx.navigateTo({
          url: '../address/edit?ADDRESS='+JSON.stringify(data)
      });
  },
  //删除地址
  del:function(e){
      var that = this;
      var item = e.currentTarget.dataset.item;
      wx.showModal({
          title: '提示',
          content: '确定删除当前地址吗？',
          success: function(res) {
              if (res.confirm) {
                  app.requestAuthor('api/delete_address',{DATA_IDS:item,CLIENT_TOKEN:app.CLIENT_TOKEN()},                    function(data){
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                      });
                      that.onLoad(); 
                  });
              }
          }
      })  
    }
})