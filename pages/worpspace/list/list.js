// pages/worpspace/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    workspaces: [],

    callType: 1,

    orderPrice: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    that.setData({

      orderPrice: options.price

    })

    app.crmApi(

      app.apiService.crm.workspaceList,

      { token: app.storage.getToken() },

      res => {

        that.setData({

          workspaces: res.data.data

        })

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

  chooseItem(evt) {

    var id = evt.currentTarget.dataset.id

    var name = evt.currentTarget.dataset.name

    var credit = evt.currentTarget.dataset.price

    if (credit < this.data.orderPrice) {

      wx.showModal({
        title: '提示',
        content: '下单额度不能超过工地剩余额度！',
      })

      return

    }

    var pages = getCurrentPages()

    var page = pages[pages.length - 2]

    page.setWorkspace({ id: id, name: name })

    wx.navigateBack({

      delta: 1

    })

  }

})