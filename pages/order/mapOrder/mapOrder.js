const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    longitude: '',

    latitude: '',

    orderInfo: {},

    orderAddress: {}

  },

  mapCtx: undefined,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const that = this

    this.mapCtx = wx.createMapContext('myMap')

    this.mapCtx.moveToLocation()

    this.setData({

      longitude: options.longitude,

      latitude: options.latitude

    })

    app.crmApi(

      app.apiService.crm.orderDetail,

      { token: app.storage.getToken(), order_id: options.orderId },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            orderInfo: res.data.data

          })      

        }

      }

    )

    app.crmApi(

      app.apiService.crm.getOrderAddress,

      { token: app.storage.getToken(), order_id: options.orderId },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            orderAddress: res.data.data

          })

        }

      }

    )
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  makeCall() {

    wx.makePhoneCall({

      phoneNumber: this.data.orderInfo.driver_phone
    
    })

  }

})