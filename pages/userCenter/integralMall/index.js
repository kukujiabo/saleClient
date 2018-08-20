const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    accountInfo: { intergral: 0 },

    couponItem: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getCouponAllTypeList()

    this.getAcctInfo()

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

  getCouponAllTypeList() {

    var that = this

    wx.showLoading({})

    app.crmApi(

      app.apiService.crm.getAllCouponType,

      { token: app.storage.getToken() },

      res => {

        wx.hideLoading()

        if (res.data.ret == 200) {

          that.setData({

            couponItem: res.data.data

          })

        }

      }

    )

  },

  getAcctInfo() {

    const that = this

    app.crmApi(

      app.apiService.crm.acctInfo,

      {

        token: app.storage.getToken()

      },

      res => {

        if (res.data.ret == 200) {

          var accountInfo = {

            intergral: res.data.data.intergral ? res.data.data.intergral : 0,

            coupons: res.data.data.coupons ? res.data.data.coupons : 0

          }

          that.setData({

            accountInfo: accountInfo

          })

        }

      }

    )

  },

  exchangeTap(evt) {

    const that = this

    var coupon = this.data.couponItem[evt.currentTarget.dataset.idx]

    var avaInt = this.data.accountInfo.intergral

    if (avaInt < coupon.money * 10) {

      wx.showModal({

        title: '提示',

        content: '抱歉您的积分不足，无法兑换，需要积分：' + coupon.money * 10

      })

      return

    }

    wx.showModal({
      title: '提示',
      content: '确定使用' + (coupon.money * 10) + '积分？',
      success: res => {

        if (res.confirm) {

          wx.showLoading()

          app.crmApi(

            app.apiService.crm.exchangeCoupon,

            { coupon_type_id: coupon.coupon_type_id, token: app.storage.getToken() },

            res => {

              wx.hideLoading()

              if (res.data.ret == 200 && res.data.data > 0) {

                that.getAcctInfo()

                wx.showModal({

                  title: '恭喜！',

                  content: '您已成功领取一张优惠券',

                  confirmText: '立即查看',

                  cancelText: '我知道了',

                  success: function (res) {

                    if (res.confirm) {

                      wx.navigateTo({

                        url: '/pages/userCenter/coupon/coupon'

                      })

                    }

                  }

                })

              }

            }

          )

        }

      }

    })

  }

})