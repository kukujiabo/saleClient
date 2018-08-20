var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    addrList: [],
    address_id: [],
    default: true,
    addrNo: false,
    addr_url_type: 0,
    addr_list: undefined,
    is_switch: true,//开关
    shop_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.dialog = that.selectComponent('#dialog')

    if (options.type) {

      that.setData({

        addr_url_type: options.type

      })

    }

  },

  //外卖和提领券兑换获取地址
  callbackTap: function (e) {

    var that = this

    if (that.data.addr_url_type) {

      var location = app.storage.getLocation()

      if (location.city_code != e.currentTarget.dataset.code) {

        wx.showModal({

          title: '提示',

          content: '地址与定位不在同一个城市，不可使用！'

        })

        return

      }

      var list = that.data.addrList //addrList中的值

      var idx = e.currentTarget.dataset.idx //当前索引值

      var pages = getCurrentPages()

      var page = pages[pages.length - 2]

      switch (that.data.addr_url_type) {

        case '1':

          page.setAddress(list[idx])

          break;

      }

      wx.navigateBack({

        delta: 1

      })

    }

  },

  /**
   * 地址列表接口
   */
  address: function () {

    var that = this;

    const params = {

      token: app.storage.getToken(),

      shop_id: that.data.shop_id,

      page_size: 10000

    }

    app.crmApi(

      app.apiService.crm.getAddressList,

      params,

      res => {

        var addr_list = res.data.data.data

        if (res.data.data.records == 0 || !res.data.data.records) {

          that.setData({

            addrNo: true,

          })

          return

        }

        if (res.data.ret == 200) {

          that.setData({

            addrList: addr_list

          })
        }

      }
    )
  },

  //删除地址接口
  addressDel: function (addressid) {
    var that = this;
    const params = {
      token: app.storage.getToken(),
      address_id: addressid
    }
    app.crmApi(
      app.apiService.crm.addrDel, params,
      res => {
        if (res.data.ret = 200) {
        }
      }
    )
  },
  //删除地址
  addrDeleTap: function (e) {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否删除该地址',
      success: function (res) {
        if (res.confirm) {
          var currentid = e.currentTarget.dataset.addressid//data-addressid
          /**** 查找唯一索引，删除**** */
          var idx = e.currentTarget.dataset.idx
          var list = that.data.addrList
          list.splice(idx, 1)
          that.setData({
            addrList: list
          })
          that.addressDel(currentid)
        }
      }
    })
  },
  //编辑地址
  addrEditTap: function (e) {
    var that = this
    var list = that.data.addrList//addrList中的值
    var idx = e.currentTarget.dataset.idx//当前索引值
    var data = JSON.stringify(list[idx])  //JSON.stringify()从一个对象中解析出字符串

    wx.navigateTo({
      url: '/pages/address/edit/edit?address=' + data
    })

  },
  /**
   * 添加新地址链接跳转
   */
  addAddrTap: function () {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    })
  },
  //单选按钮判断
  radioCheck: function (e) {
    var that = this
    var list = that.data.addrList//addrList中的值
    for (var i = 0; i < list.length; i++) {
      list[i].default = false
      if (e.currentTarget.dataset.idx == i) {
        list[i].default = true
      }
    }
    that.setData({
      addrList: list
    })
    that.set_default(e.currentTarget.id);
  },
  //设为默认接口
  set_default: function (addressid) {

    var that = this;

    var data = {

      token: app.storage.getToken(),

      address_id: addressid

    }
    app.crmApi(

      app.apiService.crm.addrDefault,

      data,

      that.balanceListSuccess,

      that.balanceListFail,

      extraParams

    )

  },

  balanceListSuccess: function (res) {

    var that = this;

    var info = res.data

    if (info.qw == 200) {

    } else {

    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

    var that = this

    var address_list = wx.getStorageSync('address_list')

    var addrNos = wx.getStorageSync('addrNo')

    if (address_list) {

      that.setData({

        addrList: address_list,

        addrNo: addrNos

      })

    }

    that.address()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  confirmInput(evt) {



  },

  searchAllEvent(evt) {

    this.setData({

      addrList: evt.detail

    })

  }

})
