// 订单下单失败都会回到首页

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    urlOptions: {},
    orderTotal: '',//商品总价
    orderTotal2: '', //订单总价
    boxFee: 0,
    takeFee: 0,
    Total: '',// 应付金额
    orderItem: [],//订单
    address_id: '',//地址ID
    cart_list: '',
    addr: [], //地址
    order: {
      carriage: '',
      message: ''
    },
    cartList: '',//购物车列表
    orderId: '',//订单id
    shop_id: '',//店铺id
    cart_id: [],//购物车id
    is_cart: 1,
    coupon: '',
    useableCoupon: '',
    buyer_message: '',//留言
    lat: 0,
    lon: 0,
    shop_id: 0,
    checked: true, // 可用余额选中状态
    disabled: false, // 可用余额可选状态
    money: '0.00', // 可用余额
    accountInfo:[],
    noUserable:true, // 券默认不能用
    balanceAvailable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.dialog = that.selectComponent('#dialog')

    that.loadingWave = that.selectComponent('#wave')

    var accountInfo = app.storage.getAccount()

    that.setData({
      lat: options.lat,
      lon: options.lon,
      shop_id: options.shop_id,
      accountInfo: accountInfo,
      money: accountInfo.balance.toFixed(2),
      // checked: accountInfo.balance > 0 ? true : false,
      checked: false,
      disabled: accountInfo.balance <= 0 ? true : false,
    })

    that.setData({

      urlOptions: options

    })

    if (options.skuInfo) {
      var skuInfo = JSON.parse(options.skuInfo)//商品规格内容
      var orderItem = that.data.orderItem;
      var info_goods = skuInfo.goodsSelected
      var info_sku = skuInfo.info_sku
      info_goods['quantity'] = skuInfo.quantity
      if (info_sku.sku_id) {
        info_goods['name'] += "（" + info_sku.sku_name + "）"
        info_goods['price'] = info_sku.price
      }
      var cart = []
      cart[0] = info_goods
      var total = (skuInfo.quantity * parseFloat(info_goods['price'])).toFixed(2)
      if (that.data.disabled == false && that.data.checked == true && that.data.money > 0) {
        total = (parseFloat(total) - parseFloat(that.data.money)).toFixed(2)
        if (total <= 0) {
          total = '0.00'
        }
      }
      that.setData({
        orderItem: cart,
        orderTotal: (parseFloat(skuInfo.quantity) * parseFloat(info_goods['price'])).toFixed(2),
        is_cart: 2,
        shop_id: skuInfo.shop_id,
        goods_id: skuInfo.goods_id,
        sku_id: skuInfo.sku_id,
        quantity: skuInfo.quantity,
        Total: total
      })

      var param = {
        type: 2,
        goods_id: skuInfo.shop_id,
        sku_id: skuInfo.sku_id,
        num: skuInfo.quantity
      }

      that.getUseable(param)//可用优惠券接口

    }
    if (options.data) {
      var cart = JSON.parse(options.data)//购物车内容
      var goods = cart.goods;//购物车商品
      var orderItem = that.data.orderItem;
      for (var i = 0; i < goods.length; i++) {
        for (var j = 0; j < orderItem.length; j++) {
          if (orderItem[j].id == goods[i].id) {
            orderItem[j].quantity = goods[i].quantity
          }
        }
      }
      var total = cart.cartTotal
      if (that.data.disabled == false && that.data.checked == true && that.data.money > 0) {
        total = (parseFloat(total) - parseFloat(that.data.money)).toFixed(2)
        if (total <= 0) {
          total = '0.00'
        }
      }
      
      that.setData({
        orderTotal: cart.cartTotal,
        orderItem: goods,
        shop_id: cart.shop_id,
        is_cart: 1,
        Total: total
      })

      that.getCart(cart.shop_id);//购物车接口

    }

    //配送地址
    that.default_addr()

  },

  /**
   * 优惠券的回调函数
   */
  getCouponData: function (e) {

    var that = this;

    if (e.percentage > 0) {

      e.money = (parseFloat(1 - e.percentage / 100) * parseFloat(that.data.orderTotal)).toFixed(2)
      
    }

    that.setData({

      c_money: parseFloat(e.money).toFixed(2),

      coupon_id: e.coupon_id

    })

    that.Calculation()

  },
  /**
   * 留言
   */
  messTap: function (e) {
    var that = this;
    that.setData({
      buyer_message: e.detail.value
    })
  },
  /**
   * 收货地址的回调函数
   */
  getBackData: function (e) {
    var that = this;
    that.setData({
      addr: e,
      address_id: e.address_id,
    })
  },

  /**
   * 可用优惠券列表接口获取
   */
  getUseable: function (e) {
    var that = this;
    var data = {
      token: app.storage.getAuth().token,
      shop_id: that.data.shop_id,
      type: e.type,
    }
    if (e.cart_id) {
      data.cart_id = e.cart_id
    }
    if (e.goods_id) {
      data.goods_id = e.goods_id
    }
    if (e.sku_id) {
      data.sku_id = e.sku_id
    }
    if (e.num) {
      data.num = e.num
    }
    app.crmApi(
      app.apiService.crm.userableCoupon,
      data,
      that.getUseableSuccess,
      that.getUseableFail,
    )
  },

  /**
   * 可用优惠券列表接口获取 成功
   */
  getUseableSuccess: function (res) {
    var that = this;

    if (res.data.ret == 200) {
      if (res.data.data.length == 0) {
        that.setData({
          noUserable: true
        })
      }
      else {
        var list = res.data.data
        for (var i in list) {
          list[i].qr_code = ''
        }
        that.setData({
          noUserable: false,
          useableCoupon: res.data.data
        })
      }
    }
  },

  /**
   * 多规格立即购买下单接口 获取
   */
  purchase: function () {
    var that = this;
    var data = {
      token: app.storage.getAuth().token,
      address_id: that.data.address_id,
      shop_id: that.data.shop_id,
      goods_id: that.data.goods_id,
      quantity: that.data.quantity
    }

    if (that.data.disabled == false && that.data.checked == true && that.data.money > 0) {

      data.user_money = that.data.money

    }

    if (that.data.sku_id) {

      data.sku_id = that.data.sku_id

    }

    if (that.data.coupon_id) {

      data.coupon_id = that.data.coupon_id

    }
    if (that.data.buyer_message) {

      data.buyer_message = that.data.buyer_message

    }

    app.takeoutApi(
      app.apiService.takeout.getPurchase,
      data,
      that.purchaseSuccess,
      that.purchaseFail
    )
  },

  /**
   * 多规格立即购买下单接口获取 成功
   */
  purchaseSuccess: function (res) {
    var that = this

    if (res.data.ret == 200) {
      that.setData({
        orderId: res.data.data.id
      })
      if (that.data.Total <= 0) {
        var order_id = that.data.orderId
        wx.redirectTo({
          url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
        })
        return
      }
      that.orderPay(res.data.data.sn) //调用支付接口    
    } else {
      if (res.data.ret == 401001) {
        // 储值卡余额不足
        this.dialog.showDialog({
          'type': 'blanaer',
          'title': '余额不足！',
          'content': '会员余额不足，请充值～'
        })
      }

      wx.navigateTo({
        url: '/pages/index/index',
      })

    }

  },
  /**
   * 多规格立即购买下单接口获取 失败
   */
  purchaseFail: function (res) {

    that.dialog.showDialog({

      title: '网络错误！',

      content: '支付失败，请重新尝试～',

      dialogStyle: 'primary'

    }, function () {

      wx.redirectTo({

        url: '/pages/takeout/shop/shop'

      })

    }, function () {

    })

  },

  /**
  * 购物车列表接口获取
  */
  getCart: function () {
    var that = this;
    var data = {
      token: app.storage.getAuth().token,
      shop_id: that.data.shop_id
    }
    app.takeoutApi(
      app.apiService.takeout.getCart,
      data,
      that.getCartSuccess,
      that.getCartFail
    )
  },

  /**
   * 购物车列表接口获取  成功
   */
  getCartSuccess: function (res) {
    var that = this;
    var cartList = res.data.data.goods;
    if (res.data.ret == 200) {
      var cart_id = [];//购物车id
      for (var n in cartList) {
        var id = cartList[n].cart_id
        cart_id.push(id)
      }

      cart_id = String(cart_id);

      that.setData({
        cart_id: cart_id,
        orderItem: cartList
      })

      var param = {
        type: 1,
        cart_id: cart_id
      }
      that.getUseable(param)//可用优惠券接口
    }


  },

  /**
   * 外卖订单支付接口获取
   */
  orderPay: function (order_sn) {

    var that = this;

    try {

      var device_info = wx.getSystemInfoSync()

    } catch (e) {
      // Do something when catch error
    }
    var data = {
      token: app.storage.getAuth().token,
      order_sn: order_sn,//订单id
      device_info: device_info.model//设备信息
    }
    app.takeoutApi(
      app.apiService.takeout.pay,
      data,
      that.orderPaySuccess,
      that.orderPayFail
    )
  },

  /**
   * 外卖订单支付接口获取  成功
   */
  orderPaySuccess: function (res) {
    var that = this;
    if (res.data.ret == 200) {
      var info = res.data.data
      if (info === true) {
        var order_id = that.data.orderId
        wx.redirectTo({
          url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
        })
        return
      }
      wx.requestPayment({
        'timeStamp': info.timeStamp.toString(),
        'nonceStr': info.nonceStr,
        'package': info.package,
        'signType': info.signType,
        'paySign': info.paySign,
        'success': function (res_two) {
          var order_id = that.data.orderId
          wx.redirectTo({
            url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
          })
        },
        'fail': function (res_two) {
          var order_id = that.data.orderId
          wx.redirectTo({
            url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
          })
        }
      })
    } else {

      if (res.data.ret == 401001) {
        // 储值卡余额不足
        this.dialog.showDialog({
          'type': 'blanaer',
          'title': '余额不足！',
          'content': '会员余额不足，请充值～'
        })
        wx.navigateTo({
          url: '/pages/index/index',
        })
        return
      }

      var order_id = that.data.orderId
      if (order_id) {
        wx.navigateTo({
          url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
        })
      } else {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    }
  },

  /**
   * 外卖订单支付接口获取  失败
   */
  orderPayFail: function (res) {

    var that = this;

    that.loadingWave.hideLoading()

    that.dialog.showDialog({

      title: '网络错误！',

      content: '支付失败，请重新尝试～',

      dialogStyle: 'primary'

    }, function () {

      wx.redirectTo({

        url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay'

      })

    }, function () {

    })

  },

  /**
   * 默认地址接口获取
   */
  default_addr: function () {
    var that = this;
    var data = {
      token: app.storage.getAuth().token,
      default: true,
      shop_id: that.data.shop_id
    }
    app.crmApi(
      app.apiService.crm.getAddressDetail,
      data,
      that.defaultAddrSuccess,
      that.defaultAddrFail
    )
  },
  /**
  * 默认地址接口获取 成功
  */
  defaultAddrSuccess: function (res) {
    var that = this
    if (res.data.ret = 200) {
      if (res.data.data.is_out_of_range == 2) {
        that.setData({
          addr: res.data.data,
          address_id: res.data.data.address_id,
        })
      }
    }
  },
  /**
 * 默认地址接口获取 失败
 */
  defaultAddrFail: function (res) {

  },

  /**
   * 选择优惠券
   */
  couponTap: function () {

    var that = this;

    var useableCoupon = JSON.stringify(that.data.useableCoupon)

    wx.navigateTo({

      url: '/pages/coupon/useable/useable?useableCoupon=' + useableCoupon

    })

  },

  /**
   * 订单提交按钮(下单按钮)
   */
  paySubmit: function (e) {

    var that = this;
    
    if (!that.data.address_id) {

      wx.showToast({

        title: '请添加收货地址',

        image: '/images/wrong-load.png',

        duration: 1000

      })

      that.loadingWave.hideLoading()

      return;

    }

    if (that.data.checked) {

      that.dialog.showDialog({

        title: '余额使用提示',

        content: '你确定使用余额 ¥ ' + that.data.orderTotal2 + ' 支付订单吗？',

        showCancel: true,

        dialogStyle: 'primary'

      }, function () {

        that.loadingWave.showLoading()

        if (that.data.is_cart == 1) {

          that.orderSubmit() //订单提交接口

        } else {

          that.purchase() //多规格立即购买

        }

      }, function () {

      })

    } else {

      that.loadingWave.showLoading()

      if (that.data.is_cart == 1) {

        that.orderSubmit()//订单提交接口

      } else {

        that.purchase()//多规格立即购买

      }

    }

  },

  /**
   * 订单提交接口获取
   */
  orderSubmit: function () {

    var that = this;

    var orderInfo = that.data.orderItem

    var data = {

      token: app.storage.getAuth().token,

      address_id: that.data.address_id,

      shop_id: that.data.shop_id,

      cart_id: that.data.cart_id,

    }

    if (that.data.disabled == false && that.data.checked == true && that.data.money > 0) {

      data.user_money = that.data.money

    }

    if (that.data.coupon_id) {

      data.coupon_id = that.data.coupon_id

    }

    if (that.data.buyer_message) {

      data.buyer_message = that.data.buyer_message

    }

    app.takeoutApi(

      app.apiService.takeout.orderSubmit,

      data,

      that.orderSubmitSuccess,
      
      that.orderSubmitFail

    )
  },

  /**
   * 订单提交接口获取 成功
   */
  orderSubmitSuccess: function (res) {
    
    var that = this;

    if (res.data.ret == 200) {
      that.setData({
        orderId: res.data.data.id
      })
      if (that.data.Total <= 0) {
        var order_id = that.data.orderId
        wx.redirectTo({
          url: '/pages/takeout/order/detail/detail?orderId=' + order_id + '&test=pay',
        })
        return
      }
      that.orderPay(res.data.data.sn) //调用支付接口    
    } else {

      if (res.data.ret == 401001) {

        this.dialog.showDialog({
          'type': 'blanaer',
          'title': '余额不足！',
          'content': '会员余额不足，请充值～'
        })

      }

      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },
  /**
  * 订单提交接口获取 失败
  */
  orderSubmitFail: function (res) {

    wx.navigateTo({
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

    this.loadingWave.showLoading()

    app.crmApi(

      app.apiService.crm.acctDetail,

      {

        token: app.storage.getAuth().token

      },

      res => {

        this.loadingWave.hideLoading()

        if (res.data.ret == 200 && res.data.data) {

          this.setData({

            accountInfo: res.data.data

          })

          app.storage.setAccount(res.data.data)

          var accountInfo = app.storage.getAccount()

          this.setData({
            accountInfo: accountInfo,
            money: accountInfo.balance.toFixed(2),
            checked: false,
            disabled: accountInfo.balance <= 0 ? true : false,
          })

          this.Calculation()

        }

      }

    )

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

  // 重计算订单支付价格
  Calculation: function () {

    var that = this

    var orderTotal2

    var c_money = that.data.c_money

    if (!c_money) {

      c_money = 0

    }

    var orderTotal = orderTotal2 = that.data.orderTotal

    var total = parseFloat(orderTotal - c_money).toFixed(2)

    var checked = that.data.checked

    /**
     * 订单总价添加餐盒费，外送费
     */

    orderTotal2 += that.data.boxFee + that.data.takeFee

    if (checked) {

      var money = that.data.money

      total = parseFloat(total - money).toFixed(2)

    }

    if (total <= 0) {

      total = '0.00'

    }

    if (parseFloat(total) > parseFloat(that.data.money)) {

      that.setData({

        balanceAvailable: false,

        checked: false

      })

    } else {

      that.setData({

        balanceAvailable: true,

        checked: true

      })

    }

    that.setData({

      Total: total,

      orderTotal2: parseFloat(orderTotal2).toFixed(2)

    })

  },

  /**
   * 去充值
   */
  balanceRecharge() {

    var url = '/pages/balance/recharge/recharge'

    wx.navigateTo({

      url: url
    
    })

  },

  changePayType() {

    var that = this

    if (that.data.balanceAvailable) {

      that.setData({

        checked: !that.data.checked

      })

    }

  }

})
