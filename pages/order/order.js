// pages/order/order.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: '',
    goods: [],
    sku: {},
    remark: '',
    total_price: 0,
    num: 1,
    address: false,
    payItems: [
      { value: 1, label: '微信支付', checked: true },
      { value: 2, label: '线下转账', checked: false }
    ],
    workspace: undefined,
    workspaceId: 0,
    payType: 1,
    invoice: false,
    singlePrice: 0,
    provider: 0,
    coupon: {}
  },

  waveLoading: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const that = this

    that.waveLoading = that.selectComponent('#wave')

    that.getDefaultAddress()

    that.setData({

      orderType: options.type,

      provider: app.storage.getUserInfo().provider

    })

    if (options.type == 'cart') {

      app.crmApi(

        app.apiService.crm.cartList,

        {

          token: app.storage.getToken(),

          sku_id: options.selected_id

        },

        res => {

          if (res.data.ret == 200) {

            that.setData({

              goods: res.data.data

            })

            that.calculate()

          }

        }

      )

    } else {

      app.crmApi(

        app.apiService.crm.getGoodsDetail,

        { goods_id: options.goods_id },

        res => {

          if (res.data.ret == 200) {

            var good = {

              goods_id: options.goods_id,

              goods_name: options.goods_name,

              sku_id: options.sku_id,

              sku_name: options.sku_name,

              price: options.price,

              num: options.num,

              goods_picture: res.data.data.picture,

              tax_off_price: options.tax_off_price

            }

            var goods = [good]

            that.setData({

              goods: goods

            })

            that.calculate()

          }

        }

      )

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
  onShow: function () {

    if (this.data.coupon.money) {

      wx.showToast({

        title: '已优惠券 ¥' + this.data.coupon.money

      })

    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  getDefaultAddress() {

    var that = this

    app.crmApi(

      app.apiService.crm.getDefaultAddress,

      { "token": app.storage.getToken(), "default": 1 },

      res => {

        if (res.data.ret == 200) {

          that.setAddress(res.data.data)

        }

      }

    )

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

  calculate() {

    var total = 0;

    var that = this

    this.data.goods.forEach(good => {

      total += (that.data.invoice ? (good.tax_off_price ? good.tax_off_price : good.price) : good.price) * good.num

    })

    if (this.data.coupon.money) {

      total -= this.data.coupon.money
      
    }

    this.setData({

      total_price: total.toFixed(2)

    })

  },

  calculateTotal() {

    this.setData({

      total_price: this.data.num * this.data.sku.price

    })

  },

  plus() {

    var num = this.data.num

    num++

    this.setData({

      num: num

    })

    this.calculateTotal()

  },

  minus() {

    var num = this.data.num

    num = num > 1 ? num - 1 : 1

    this.setData({

      num: num

    })

    this.calculateTotal()

  },

  checkNum(evt) {

    var value = evt.detail.value

    if (isNaN(value)) {

      this.setData({

        num: 1

      })

    } else if (value < 1) {

      this.setData({

        num: 1

      })

    }

  },

  pay() {

    var data = {

      token: wx.getStorageSync('token'),

      shop_id: 0,

      address_id: 0,

      goods_id: this.data.good.goods_id,

      sku_id: this.data.sku.sku_id,

      quantity: this.data.num

    }

    app.crmApi(

      app.apiService.crm.goodsPay,

      data,

      res => {


      }

    )

  },

  toAddressList() {

    wx.navigateTo({

      url: '/pages/address/address?type=1'

    })


  },

  /**
   * 设置地址
   */
  setAddress(address) {

    this.setData({

      address: address

    })

  },

  inputRemark(evt) {

    this.setData({

      remark: evt.detail.value

    })

  },

  /**
   * 
   */
  confirmOrder() {

    const that = this

    if (!that.data.address) {

      wx.showToast({

        title: '地址必须选择！',

        icon: ''

      })

      return

    }

    if (that.data.payType == 1 && that.data.invoice) {

      wx.showToast({

        title: '需要发票请线下支付！',

      })

      return

    }

    switch (that.data.orderType) {

      case 'buy':

        that.singlePurchase()

        break;

      case 'cart':

        that.cartPurchase()

        break;

    }

  },

  singlePurchase() {

    const that = this

    var good = that.data.goods[0]

    if (app.roleType == 2 && !that.data.workspaceId) {

      wx.showModal({

        title: '提示！',

        content: '项目经理下单必须选择工地！'

      })

      return

    }

    var data = {

      token: app.storage.getToken(),

      shop_id: 0,

      address_id: that.data.address.address_id ? that.data.address.address_id : that.data.address.id,

      goods_id: good.goods_id,

      sku_id: good.sku_id,

      quantity: good.num,

      buyer_message: that.data.remark,

      pay_type: that.data.payType,

      workspace_id: that.data.workspaceId,

      invoice: that.data.invoice ? 1 : 0

    }

    if (that.data.coupon.coupon_id) {

      data.coupon_id = that.data.coupon.coupon_id

    }

    app.crmApi(

      app.apiService.crm.singleBuy,

      data,

      res => {

        if (res.data.ret == 200) {

          if (that.data.payType == 1) {

            var payData = res.data.data

            wx.requestPayment({

              timeStamp: payData.timeStamp + '',

              nonceStr: payData.nonceStr,

              package: payData.package,

              signType: payData.signType,

              paySign: payData.paySign,

              success: function (re) {

                wx.navigateTo({

                  url: 'success/success?sn=' + payData.sn + '&order_id=' + payData.id + '&order_price=' + payData.price.toFixed(2)

                })

              },
              fail: function (re) {

                wx.showModal({

                  title: '提示',

                  content: '您已取消支付，您可在我的订单中重新选择支付！'

                })

                wx.navigateTo({

                  url: 'success/success?sn=' + res.data.data.sn + '&order_id=' + res.data.data.id + '&order_price=' + res.data.data.price.toFixed(2) + '&fail=1'

                })
              }

            })

          } else {

            wx.navigateTo({

              url: 'success/success?sn=' + res.data.data.sn + '&order_id=' + res.data.data.id + '&order_price=' + res.data.data.price.toFixed(2)

            })

          }

        }

      }

    )

  },

  pickWorkspace() {

    wx.navigateTo({

      url: '/pages/worpspace/list/list?type=1&price=' + this.data.total_price

    })

  },

  getCouponData(couponInfo) {

    this.setData({

      coupon: couponInfo

    })

    this.calculate()

  },

  cartPurchase() {

    var cart_id = ''

    const that = this

    if (app.roleType == 2 && !that.data.workspaceId) {

      wx.showModal({

        title: '提示！',

        content: '项目经理下单必须选择工地！'

      })

      return

    }

    that.data.goods.forEach(good => {

      cart_id += good.cart_id + ','

    })

    cart_id = cart_id.substr(0, cart_id.length - 1)

    var data = {

      token: app.storage.getToken(),

      cart_id: cart_id,

      shop_id: 0,

      address_id: that.data.address.address_id ? that.data.address.address_id : that.data.address.id,

      buyer_message: that.data.remark,

      workspace_id: that.data.workspaceId,

      invoice: that.data.invoice ? 1 : 0,

      pay_type: that.data.payType

    }

    if (that.data.coupon.coupon_id) {

      data.coupon_id = that.data.coupon.coupon_id

    }

    app.crmApi(

      app.apiService.crm.cartOrder,

      data,

      res => {

        if (res.data.ret == 200) {

          that.waveLoading.hideLoading()

          if (that.data.payType == 1) {

            var payData = res.data.data

            wx.requestPayment({

              timeStamp: payData.timeStamp + '',

              nonceStr: payData.nonceStr,

              package: payData.package,

              signType: payData.signType,

              paySign: payData.paySign,

              success: function (re) {

                wx.navigateTo({

                  url: 'success/success?sn=' + payData.sn + '&order_id=' + payData.id + '&order_price=' + payData.price.toFixed(2)

                })

              },
              fail: function (re) {

                wx.showModal({

                  title: '提示',

                  content: '您已取消支付，您可在我的订单中重新选择支付！'

                })

                wx.navigateTo({

                  url: 'success/success?sn=' + res.data.data.sn + '&order_id=' + res.data.data.id + '&order_price=' + res.data.data.price.toFixed(2) + '&fail=1'

                })
              }

            })

          } else {

            wx.navigateTo({

              url: 'success/success?sn=' + res.data.data.sn + '&order_id=' + res.data.data.id + '&order_price=' + res.data.data.price.toFixed(2)

            })

          }

        }

      }

    )

  },

  pickCoupon() {

    wx.navigateTo({

      url: '/pages/userCenter/coupon/coupon?type=1&total=' + this.data.total_price

    })

  },

  radioChange(evt) {

    if (evt.detail.value == 1) {

      this.setData({

        invoice: false

      })

      wx.showModal({
        title: '提示！',
        content: '需要发票请选择线下支付！',
      })

      return

    }

    this.setData({

      payType: evt.detail.value

    })

  },

  checkInvoice(evt) {

    if (this.data.payType == 1) {

      wx.showModal({

        title: '提示',

        content: '需要发票请选择线下付款！'

      })

      this.setData({

        invoice: false

      })

      return

    }

    if (evt.detail.value[0]) {

      this.setData({

        invoice: true

      })

    } else {

      this.setData({

        invoice: false

      })

    }

    this.calculate()

  },

  setWorkspace(obj) {

    this.setData({

      workspace: obj,

      workspaceId: obj.id

    })

  }

})