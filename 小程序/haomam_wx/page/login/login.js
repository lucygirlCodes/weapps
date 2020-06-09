const app = getApp();
var intx = null;
Page({
  data:{
    defaultSize: 'mini',
    dis:false,
    sendCodeText:'获取验证码',
    CLIENT_TOKEN:app.CLIENT_TOKEN(),
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    if (!app.noLogin()){
      wx.switchTab({url: '../me/me'})
    }
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  bindTelephone: function(e){
    var telephone = e.detail.value
    this.setData({telephone:telephone});
  },
  bindCheckbox: function(e) {
      var index = parseInt(e.currentTarget.dataset.index);
      var selected = this.data.carts[index].selected;
      var carts = this.data.carts;
      
      if(!selected){
          
      }else{
          
      }
      carts[index].selected = !selected;    
      this.setData({
        carts: carts
      });
  },
  sendCode:function(e){
    var telephone = this.data.telephone;
    if (!(/^1\d{10}$/.test(telephone))){
      wx.showToast({
        title: '手机号码不正确',
        icon: 'success',
        duration: 700
      })
      return;
    }
    var that = this;
    if(that.data.curTime){
       wx.showToast({  
          title: '发送过于频繁，请稍后再试',  
          icon: 'loading',  
          duration: 700  
      });
      return false;
    }
    that.setData({curTime:60});
    var intervalSendCode = setInterval(function(){
      that.data.curTime-- ;
      if( !that.data.curTime ){
        that.setData({CLIENT_TOKEN:app.CLIENT_TOKEN()})
        clearInterval(that.data.intervalSendCode);
      }
      var txt = (!that.data.curTime)?'':'('+ that.data.curTime +')';
      that.setData({sendCodeText:'重新发送'+txt});
      that.setData({curTime:that.data.curTime});
    },1000);
    wx.showToast({  
          title: '验证码已发送至您的手机，请注意查收',  
          icon: 'success',  
          duration: 700  
      });
    that.setData({intervalSendCode:intervalSendCode})
    var data = {
      CLIENT_TOKEN:this.data.CLIENT_TOKEN,
      TYPE:1,
      USERNAME:telephone
    };
    app.request('api/sendcode',data,function(data){
      console.log(data);
    })
  },
  submitLogin:function(e){
    var formBean = (e.detail.value);
    var telephone=(formBean.telephone);
    var openId = app.globalData.openId;
    var code = formBean.code; 
    this.data.sub_flag = true;
    if (!(/^1\d{10}$/.test(telephone))){
      this.data.sub_flag = false;
      wx.showToast({
        title: '手机号码不正确',
        icon: 'success',
        duration: 700
      });
      return false;
    }
    //
    if(e.target.dataset.type && this.data.sub_flag){
      this.sendCode(e, telephone);
      return false;
    }
    if (!/^\d{6}$/.test(code) && this.data.sub_flag){
      wx.showToast({
        title: '验证码不正确',
        icon: 'success',
        duration: 2000
      })
      this.data.sub_flag = false;
      return false;
    }
    if (this.data.sub_flag){
      var data = {
        CODE:code,
        OPEN_ID:openId,
        USERNAME:telephone,
        CLIENT_TOKEN:app.CLIENT_TOKEN()
      };
      app.request('api/binding_weixin',data,function(data){
        console.log(data);
          wx.setStorageSync('userInfo', data);
          wx.switchTab({url: '../me/me'})
      })
    }
    
  }
})


















