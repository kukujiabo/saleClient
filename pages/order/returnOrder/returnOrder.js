var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    sn: '',

    reason: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({

      sn: options.sn

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

  inputReason(evt) {

    this.setData({

      reason: evt.detail.value      

    })

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

  confirm() {

    if (!this.data.reason.trim()) {

      wx.showModal({
        title: '错误',
        content: '请填写取消原因。'
      })

      return

    }

    app.crmApi(

      app.apiService.crm.cancelOrder,

      {

        order_sn: this.data.sn, comment: this.data.reason, token: app.storage.getToken()

      },

      res => {

        if (res.data.ret == 200 && res.data.data == 1) {

          wx.showToast({
            
            title: '订单已取消！'

          })

          wx.navigateBack()

        } else {

          wx.showModal({

            title: '提示',
            content: '订单取消失败，请联系管理员！'

          })

        }

      }

    )

  }

})