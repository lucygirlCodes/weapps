const app = getApp();
Page({
  data:{
    cartMAP:{},
    TOTAL_PRICE:0,
    TOTAL_NUM:0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  saoCode:function(){
    var that = this;
    wx.scanCode({
      success: (res) => {
        var GOODS_SKU_ID = res.result;
        var bean = that.data.cartMAP[GOODS_SKU_ID];
        if( bean ){
          bean.GOODS_NUM=bean.GOODS_NUM+1;
          that.setData(that.data);
        } else {
          app.request('api/goods_info',{GOODS_SKU_ID:GOODS_SKU_ID},function(data){
            data.GOODS_NUM=1;
            that.data.cartMAP[GOODS_SKU_ID]=data;
            that.setData(that.data);
          });
        }
        that.calcTotalPrice();        
      }
    })
  },
  bindMinus: function(e) {
        //减号
        var that = this;
        var brand = e.currentTarget.dataset.brand;
        var index = e.currentTarget.dataset.index;
        var GOODS_NUM = this.data.cartMAP[index].GOODS_NUM;
        var GOODS_ID = this.data.cartMAP[index].GOODS_ID;
        if (this.data.cartMAP[index].GOODS_NUM > 1) {
            this.data.cartMAP[index].GOODS_NUM = GOODS_NUM -1;
            this.setData(this.data);
        }
        this.calcTotalPrice();
    },
    bindPlus: function(e) {
        // 加号
        var that = this
        var brand = e.currentTarget.dataset.brand;
        var index = e.currentTarget.dataset.index;
        var GOODS_NUM = this.data.cartMAP[index].GOODS_NUM;
        this.data.cartMAP[index].GOODS_NUM = GOODS_NUM +1;
        this.setData(this.data);
        this.calcTotalPrice();
    },
    calcTotalPrice:function(){
        var totalNum = 0,totalPrice = 0;
        for(var o in this.data.cartMAP){
            if(!this.data.cartMAP[o].selected) continue;
            totalNum += this.data.cartMAP[o].GOODS_NUM;
            totalPrice += this.data.cartMAP[o].GOODS_PRICE * this.data.cartMAP[o].GOODS_NUM;
        }

        this.setData({
            TOTAL_PRICE:totalPrice,
            TOTAL_NUM:totalNum
        });
    },
    // 单选
    bindCheckbox: function(e) {
        var data = e.currentTarget.dataset;
        var index = data.index;
        var cartItem = this.data.cartMAP[index]; 
    
        this.data.cartMAP[index].selected=!cartItem.selected;
        this.calcTotalPrice();
        this.setData(this.data);
    },
    //跳转订单页面
    setPayment:function(){
        if(this.data.TOTAL_NUM){
            var cart = this.data.cartMAP;
            console.log(cart);
            var JSON_GOODS_ITEM = [];
            for(var brand in cart){
                var cartItem = cart[brand];
                if(cartItem.selected){
                    JSON_GOODS_ITEM.push(cartItem);
                }
            }
            wx.navigateTo({ url: '../pay/pay?JSON_GOODS_ITEM='+JSON.stringify(JSON_GOODS_ITEM)+"&CART_TYPE="+2});
        }
    },
    //删除单个商品
    delCarsGoods:function(e){
        var that = this;
        
        var del = e.currentTarget.dataset.del;
        console.log(del);
        wx.showModal({
            title: '提示',
            content: '确定删除当前商品吗？',
            success: function(res) {
                if (res.confirm) {
                    app.requestAuthor('api/Cart/deleteOne',{GOODS_ID : del,CART_TYPE:2},function(data){
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
    },
})