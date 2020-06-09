
// 获取全局应用程序实例对象
const app = getApp();

Page({
  data:{
    indexBanner: null,
    indicatorDots: true,  
    autoplay: true,  
    interval: 5000,  
    duration: 1000,
    actionSheetHidden:true,
    actionSheetHidden1:true,
    menu:'',
    selectColor:'#000',
    unselectColor:'#dcdcdc',
    buyNum:1,
    GOODS_PRICE:0
  },
  onLoad:function(options){
    var that = this;
    var data = {GOODS_SKU_ID:options.GOODS_SKU_ID};
    if(options.GOODS_ID){
      data={GOODS_ID:options.GOODS_ID};
    }
    app.request('api/goods_base_info',data,function(date){
      that.setData({GOODS_PRICE:date.GOODS_BASE_INFO.GOODS_PRICE_RANGE});
      that.setData({date});
    });
  },
  actionSheetTap:function(){
    this.setData({
      actionSheetHidden:!this.data.actionSheetHidden
    });
    var that = this;
    var MAIN_GOODS_ID = this.data.date.MAIN_GOODS_ID;
    app.request('api/goods_model_info',{MAIN_GOODS_ID:MAIN_GOODS_ID},function(data){
      var colors = data.colors;
      var colorsMap = [];
      for(var i=0, color;color=colors[i++];){
        colorsMap.push({name:color,selected:false,undisabled:true});
      }
      var sizes = data.sizes;
      var sizesMap = [];
      for(var i=0, size;size=sizes[i++];){
        sizesMap.push({name:size,selected:false,undisabled:true});
      }
      that.setData({
        colorsMap:colorsMap,
        sizesMap:sizesMap
      })
      that.setData(data);
    })
  },
  actionSheetTap1:function(){
    this.setData({
      actionSheetHidden1:!this.data.actionSheetHidden1
    });
    var that = this;
    var MAIN_GOODS_ID = this.data.date.MAIN_GOODS_ID;
    app.request('api/goods_model_info',{MAIN_GOODS_ID:MAIN_GOODS_ID},function(data){
      var colors = data.colors;
      var colorsMap = [];
      for(var i=0, color;color=colors[i++];){
        colorsMap.push({name:color,selected:false,undisabled:true});
      }
      var sizes = data.sizes;
      var sizesMap = [];
      for(var i=0, size;size=sizes[i++];){
        sizesMap.push({name:size,selected:false,undisabled:true});
      }
      that.setData({
        colorsMap:colorsMap,
        sizesMap:sizesMap
      })
      that.setData(data);
    })
  },
  // 控制弹层开关
  actionSheetbindchange:function(){
    this.setData({
      actionSheetHidden:!this.data.actionSheetHidden
    })
  },
  // 控制弹层开关
  actionSheetbindchange1:function(){
    this.setData({
      actionSheetHidden1:!this.data.actionSheetHidden1
    })
  },
  itemTap:function(e){
      var that = this;
      var data = e.target.dataset;
      var item = this.data[data.type][data.index];
      // console.log(item); 获取到粉色 均码均码 ok
      if (!item.undisabled){
        return false;
      }
      // 当前选中的类型显示成 未选中状态
      var flag = item.selected;
      for(var i=0,ix; ix=this.data[data.type][i++];){
        ix.selected = false;
      }
      //选中当前
      item.selected = !flag;
      
      var key = 'mapSize';
      var xxx = 'colorsMap';
      var xxxx = 'GOODS_COLOR';
      if(data.type == xxx){
          xxxx='GOODS_SIZE';
          xxx='sizesMap';
          key='mapColor';
      }
      var arr = this.data[key][item.name];
      
      // 当前的全部设置为  
      for(var i=0, ix; ix=this.data[xxx][i++];){
        ix.undisabled = flag;
      }
      for(var i=0, ix; !flag && (ix=arr[i++]);){
        for(var ii=0, ixx;(ixx = this.data[xxx][ii++]);){
          if(ix[xxxx]==ixx.name){
            var isUp = ix.GOODS_STOCK;
            // console.log(isUp);  库存
            ixx.undisabled = isUp;
            break;
          }
        }
      }


      var colorsMap =this.data.colorsMap;
      var color = 0;
      for(var i=0, a;a=colorsMap[i++];){
        if(a.selected){
          color = a.name;
        }
      }

      var size = 0;
      var sizesMap = this.data.sizesMap;
      for(var i=0, a;a=sizesMap[i++];){
        if(a.selected){
          size = a.name;
        }
      }
      if(color && size){
        var arr = this.data.mapSize[size];
        var bean;
        for(var i=0;bean=arr[i++];){
          if(bean.GOODS_COLOR==color){
            this.setData({GOODS_PRICE:bean.GOODS_PRICE});
            break;
          }
        }
      }
      this.setData(this.data);
  },
  ok: function() {
    var that = this;
    var colorsMap =this.data.colorsMap;
    var color = 0;
    for(var i=0, a;a=colorsMap[i++];){
      if(a.selected){
        color = a.name;
      }
    }
    if (!color) {
      wx.showToast({
        title: '请选中颜色',
        icon: 'success',
        duration: 2000
      });
      return false;
    }

    var size = 0;
    var sizesMap = this.data.sizesMap;
    for(var i=0, a;a=sizesMap[i++];){
      if(a.selected){
        size = a.name;
      }
    }
    if (!size) {
      wx.showToast({
        title: '请选中尺码',
        icon: 'success',
        duration: 2000
      });
      return false;
    }

    var arr = this.data.mapSize[size];
    var bean;
    for(var i=0;bean=arr[i++];){
      if(bean.GOODS_COLOR==color){
        this.setData({GOODS_PRICE:bean.GOODS_PRICE});
        break;
      }
    }

    //bean.GOODS_STOCK
    app.requestAuthor('api/Cart/add',{GOODS_ID:bean.GOODS_ID,GOODS_NUM:this.data.buyNum},function(data){
      if(data){
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          actionSheetHidden:!that.data.actionSheetHidden
        })
      }
    });
  },
  bindMinus: function(e) {
        //减号
       if (this.data.buyNum > 1) {
           this.data.buyNum = this.data.buyNum -1;
           this.setData(this.data);
       } 
  },
  bindPlus: function(e) {
      // 加号
      this.data.buyNum = this.data.buyNum +1;
      this.setData(this.data);
  },
  go:function(){
       var GOODS_NUM = this.data.buyNum;
      //  var GOODS_ID = this.data.date.GOODS_ID;
      //  var JSON_GOODS_ITEM = [{"GOODS_ID":GOODS_ID,"GOODS_NUM":GOODS_NUM}];
      var that = this;
    var colorsMap =this.data.colorsMap;
    var color = 0;
    for(var i=0, a;a=colorsMap[i++];){
      if(a.selected){
        color = a.name;
      }
    }
    if (!color) {
      wx.showToast({
        title: '请选中颜色',
        icon: 'success',
        duration: 2000
      });
      return false;
    }

    var size = 0;
    var sizesMap = this.data.sizesMap;
    for(var i=0, a;a=sizesMap[i++];){
      if(a.selected){
        size = a.name;
      }
    }
    if (!size) {
      wx.showToast({
        title: '请选中尺码',
        icon: 'success',
        duration: 2000
      });
      return false;
    }

    var arr = this.data.mapSize[size];
    var bean;
    for(var i=0;bean=arr[i++];){
      if(bean.GOODS_COLOR==color){
        break;
      }
    }
     var JSON_GOODS_ITEM = [{"GOODS_ID":bean.GOODS_ID,"GOODS_NUM":GOODS_NUM}];
       wx.navigateTo({ url: '../pay/pay?JSON_GOODS_ITEM='+JSON.stringify(JSON_GOODS_ITEM)+"&CART_TYPE="+2});

  }
})
