// pages/order/success/success.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    sn: '',

    order_id: '',

    order: '',

    order_price: '',

    fail: undefined,

    goods: []
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

      sn: options.sn,

      order_id: options.order_id,
      
      order_price: options.order_price,

      fail: options.fail

    })

    this.getRecommendList()
  
    this.getOrderDetail()

  },

  getRecommendList() {

    var that = this

    app.crmApi(

      app.apiService.crm.getRecommendGoodsList,

      { sn: that.data.sn, page_size: 20 },

      res => {

        if (res.data.ret == 200) {

          that.setData({
            
            goods: res.data.data.list

          })

        }

      } 

    )

  },

  getOrderDetail() {

    const that = this

    app.crmApi(

      app.apiService.crm.orderDetail,

      { 

          token: app.storage.getToken(),

          order_id: '1521528411' 
          
      },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            order: res.data.data

          })

        }

      }

    )

  },

  toIndex() {

    wx.switchTab({

      url: '/pages/index/index',
    
    })

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
  
  }
})