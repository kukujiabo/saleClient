var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    imgUrl: '',

    path: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    app.crmApi(

      app.apiService.crm.getMiniQrCode,

      { token: app.storage.getToken() },

      res => {

        if (res.data.ret == 200) {

          var imgUrl = 'https://images.xinxingtianxia.com/' + res.data.data

          that.setData({

            imgUrl: imgUrl

          })

          wx.getImageInfo({

            src: imgUrl,

            success(res) {

              that.setData({

                path: res.path

              })

            }

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

  saveImage(evt) {

    wx.saveImageToPhotosAlbum({

      filePath: this.data.path,

      success(res) {

        wx.showToast({
          title: '保存成功！',
        })

      }

    })

  }

})