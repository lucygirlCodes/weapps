const app = getApp();

Page({
    data:{
        BRAND_CART:'',
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        var that = this;
        // 加载购物车商品
        app.requestAuthor('api/Cart/lists',{},function(data){
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
        })
    },
    onShow:function(){
        this.onLoad()
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
        title: '购物车', // 分享标题
        desc: '快看看我都买了些什么', // 分享描述
        path: 'path' // 分享路径
        }
    },
    bindMinus: function(e) {
        //减号
        var that = this;
        var brand = e.currentTarget.dataset.brand;
        var index = e.currentTarget.dataset.index;
        var GOODS_NUM = this.data.BRAND_CART[brand][index].GOODS_NUM;
        var GOODS_ID = this.data.BRAND_CART[brand][index].GOODS_ID;
        if (this.data.BRAND_CART[brand][index].GOODS_NUM > 1) {
            this.data.BRAND_CART[brand][index].GOODS_NUM = GOODS_NUM -1;
            this.setData(this.data);
            app.requestAuthor('api/Cart/updateNum',{CLIENT_TOKEN:app.CLIENT_TOKEN(),GOODS_NUM:this.data.BRAND_CART[brand][index].GOODS_NUM,GOODS_ID:GOODS_ID},function(data){
                wx.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 500
                })
                that.onLoad(); 
            })
        }
        
    },
    bindPlus: function(e) {
        // 加号
        var that = this
        var brand = e.currentTarget.dataset.brand;
        var index = e.currentTarget.dataset.index;
        var GOODS_NUM = this.data.BRAND_CART[brand][index].GOODS_NUM;
        this.data.BRAND_CART[brand][index].GOODS_NUM = GOODS_NUM +1;
        this.setData(this.data);
        var GOODS_ID = this.data.BRAND_CART[brand][index].GOODS_ID;
        app.requestAuthor('api/Cart/updateNum',{CLIENT_TOKEN:app.CLIENT_TOKEN(),GOODS_NUM:this.data.BRAND_CART[brand][index].GOODS_NUM,GOODS_ID:GOODS_ID},function(data){
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 500
            })
            that.onLoad(); 
        })
    },

    // 单选
    bindCheckbox: function(e) {
        var data = e.currentTarget.dataset;
        var brand = data.brand;
        var index = data.index;
        var cartItem = this.data.BRAND_CART[brand][index]; 
        if(!cartItem.selected){
            this.setData({
                TOTAL_PRICE:this.data.TOTAL_PRICE + cartItem.TOTAL_PRICE,
                TOTAL_NUM:this.data.TOTAL_NUM + cartItem.GOODS_NUM,
            });
        }else{
            this.setData({
                TOTAL_PRICE:this.data.TOTAL_PRICE - cartItem.TOTAL_PRICE,
                TOTAL_NUM:this.data.TOTAL_NUM - cartItem.GOODS_NUM,
            });
        }
        this.data.BRAND_CART[brand][index].selected=!cartItem.selected;
        this.setData(this.data);
    },

    //全选
    bindSelectAll: function(e) {
        var data = e.currentTarget.dataset;
        var brand = data.brand;
        var index = data.index;
        var brandItem = this.data.BRAND_ARR[index];
        var arr = this.data.BRAND_CART[brandItem.brand];
        if(!brandItem.selected){
            for(var i=0, cartItem;cartItem=arr[i++];){
                if (!cartItem.selected){
                    this.setData({
                        TOTAL_PRICE:this.data.TOTAL_PRICE + cartItem.TOTAL_PRICE,
                        TOTAL_NUM:this.data.TOTAL_NUM + cartItem.GOODS_NUM,
                    });
                }
                this.data.BRAND_CART[brand][i-1].selected=true;
            }
        } else {
            for(var i=0, cartItem;cartItem=arr[i++];){
                if (cartItem.selected){
                    this.setData({
                        TOTAL_PRICE:this.data.TOTAL_PRICE - cartItem.TOTAL_PRICE,
                        TOTAL_NUM:this.data.TOTAL_NUM - cartItem.GOODS_NUM,
                    });
                }
                this.data.BRAND_CART[brand][i-1].selected=false;
            }
        }
        brandItem.selected= !brandItem.selected;
        this.setData(this.data);
    },

    //支付
    setPayment:function(){
        if(this.data.TOTAL_NUM){
            var cart = this.data.BRAND_CART;
            // console.log(cart);
            var JSON_GOODS_ITEM = [];
            for(var brand in cart){
                var arr = cart[brand];
                for(var i=0, cartItem;cartItem=arr[i++];){
                    if(cartItem.selected){
                        JSON_GOODS_ITEM.push(cartItem);
                    }
                }
            }
            wx.navigateTo({ url: '../pay/pay?JSON_GOODS_ITEM='+JSON.stringify(JSON_GOODS_ITEM)+"&CART_TYPE="+1});
        }
    },

    //删除购物车商品
    delCarsGoods:function(e){
        var that = this;
        //console.log(this.data.BRAND_CART);
        var del = e.currentTarget.dataset.del;
        var brand = e.currentTarget.dataset.brand;
        
        
        wx.showModal({
            title: '提示',
            content: '确定删除当前商品吗？',
            success: function(res) {
                if (res.confirm) {
                    app.requestAuthor('api/Cart/deleteOne',{GOODS_ID : del,CART_TYPE:1},function(data){
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 2000
                        });
                        that.setData({
                            BRAND_CART:'',
                            BRAND_ARR:''
                        })
                        that.onLoad();
                    });  
                }
            }
        })
    },
    goGoodsDetail:function(){
        wx.switchTab({
            url: '/page/goodsList/goodsList'
        })
    }
})

