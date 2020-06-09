// page/address/edit.js
const app = getApp();
Page({
  data: {
    ADDRESS_1_STR: null,
    ADDRESS_2_STR: null,
    goNewAdd:"goNewAdd",
    selected:false
  },
  onLoad: function (options) {
    var that = this;
    if(options.ADDRESS){
      var ADDRESS = JSON.parse(options.ADDRESS);
      if(ADDRESS.IS_DEFAULT==1){
          that.setData({selected:true})
      }
      this.setData(ADDRESS);
      var data = {
              goNewAdd:'reviseAdd',
              ADDRESS_1_STR:ADDRESS.REGION_PROVINCE+ADDRESS.REGION_CITY+ADDRESS.REGION_COUNTRY
          };
      this.setData(data);
    }
  },
  bingAddressTap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        var REGION_PROVINCE = [];
        var addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };
        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          var addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
          console.log(addxress);
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        that.setData({
          ADDRESS_1_STR:
          addressBean.REGION_PROVINCE + " "
          + addressBean.REGION_CITY + ""
          + addressBean.REGION_COUNTRY
        });
        that.setData(addressBean);
      }
    })
  },
  bingAddressBlur: function () {
    var that = this;
    var addressBean = this.data;
    that.setData({
      ADDRESS_1_STR:
      addressBean.REGION_PROVINCE + " "
      + addressBean.REGION_CITY + ""
      + addressBean.REGION_COUNTRY
    });
  },
  //新增地址
  getName:function(e){
      var that = this;
      var CONSIGNEE = e.detail.value;
      that.setData({CONSIGNEE:CONSIGNEE})
  },
  getPhone:function(e){
      var that = this;
      var MOBILE = e.detail.value;
      that.setData({MOBILE:MOBILE})
  },
  getDateilAdd:function(e){
      var that = this;
      var ADDRESS = e.detail.value;
      that.setData({ADDRESS:ADDRESS})
  },
  goNewAdd: function () {
    var that  = this;
    var CONSIGNEE = this.data.CONSIGNEE;
    var ADDRESS = this.data.ADDRESS;
    var MOBILE = this.data.MOBILE;
    var REGION_COUNTRY = this.data.REGION_COUNTRY;
    var REGION_PROVINCE = this.data.REGION_PROVINCE;
    var REGION_CITY = this.data.REGION_CITY;
    var CART_TYPE = this.data.CART_TYPE;
    var IS_DEFAULT = this.data.IS_DEFAULT;
    app.requestAuthor('api/addMemberAddress', {CONSIGNEE:CONSIGNEE,ADDRESS:ADDRESS,MOBILE:MOBILE,REGION_COUNTRY:REGION_COUNTRY,REGION_PROVINCE:REGION_PROVINCE,REGION_CITY:REGION_CITY,IS_DEFAULT:IS_DEFAULT,CLIENT_TOKEN:app.CLIENT_TOKEN()}, function (data) {
        wx.setStorageSync('_address_edit_status',1);
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
        });
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        });
    })
  },
  reviseAdd:function(){
      var CONSIGNEE = this.data.CONSIGNEE;
      var ADDRESS = this.data.ADDRESS;
      var MOBILE = this.data.MOBILE;
      var REGION_COUNTRY = this.data.REGION_COUNTRY;
      var REGION_PROVINCE = this.data.REGION_PROVINCE;
      var REGION_CITY = this.data.REGION_CITY;
      var DELIVERY_ADDRESS_ID = this.data.DELIVERY_ADDRESS_ID;
      var CART_TYPE = this.data.CART_TYPE;
      var IS_DEFAULT = this.data.IS_DEFAULT;
      var that  = this;
      if (!(/^1\d{10}$/.test(MOBILE))){
        wx.showToast({
          title: '手机号码不正确',
          icon: 'clear',
          duration: 700
        })
        return;
      }
      var d_dada = {
        CONSIGNEE:CONSIGNEE,
        ADDRESS:ADDRESS,
        MOBILE:MOBILE,
        REGION_COUNTRY:REGION_COUNTRY,
        REGION_PROVINCE:REGION_PROVINCE,
        REGION_CITY:REGION_CITY,
        IS_DEFAULT:IS_DEFAULT,
        DELIVERY_ADDRESS_ID:DELIVERY_ADDRESS_ID,                CLIENT_TOKEN:app.CLIENT_TOKEN()
      }
      app.requestAuthor('api/updateMemberAddress',d_dada,function(){
        wx.setStorageSync('_address_edit_status',1);
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        });
      });
    },
    clickIcon:function(){
        var selected = this.data.selected
        var that = this
        that.setData({
             selected:!this.data.selected    
        })
        if(this.data.selected==false){
            that.setData({IS_DEFAULT:0})
        }else{
            that.setData({IS_DEFAULT:1})
        }
    }
});

// 获取uuid CLIENT_TOKEN:app.CLIENT_TOKEN()