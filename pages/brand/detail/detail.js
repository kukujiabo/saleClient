// pages/brand/detail/detail.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    brand_id: '',

    brand: {},

    goods: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({

      brand_id: options.id

    })

    this.getBrandDetail(options.id)

    this.getGoods(options.id)

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

  getBrandDetail(id) {

    const that = this

    app.crmApi(

      app.apiService.crm.getBrandDetail,

      { id: id },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            brand: res.data.data

          })

          console.log(that.data.brand)

        }

      }

    )
  },

  toDetail(evt) {

    var id = evt.currentTarget.dataset.id

    wx.navigateTo({

      url: '/pages/goods/detail/detail?id=' + id

    })

  },

  getGoods() {

    const that = this

    app.crmApi(

      app.apiService.crm.getGoodsList,

      { brand_id: that.data.brand_id },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            goods: res.data.data.list

          })

        }

      }

    )

  }

})