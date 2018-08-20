var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr: [],
    orderTotal: '',
    orderItem: [],
    order: [],
    detail: [],//订单详情
    test: false, // pay-表示支付完过来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.loadingWave = that.selectComponent('#wave')

    that.dialog = that.selectComponent('#dialog')

    that.loadingWave.showLoading()

    if (options.test) {
      that.setData({
        test: options.test
      })
    }

    if (options.orderId) {

      var id = parseInt(options.orderId)

    } else if (options.id) {

      var id = parseInt(options.id)

    }

    that.orderDetail(id)

  },

  /**
   * 订单详情接口获取
   */
  orderDetail: function (id) {

    var that = this;

    var data = {

      token: app.storage.getAuth().token,

      order_id: id

    }
    app.takeoutApi(

      app.apiService.takeout.getOrderDetail,

      data,

      that.orderDetailSuccess,

      that.orderDetailFail

    )
  },
  /**
  * 订单详情接口获取  成功
  */
  orderDetailSuccess: function (res) {
    var that = this;

    that.loadingWave.hideLoading()
    
    if (res.data.ret = 200) {

      res.data.data.Total = (parseFloat(res.data.data.user_money) + parseFloat(res.data.data.pay_money)).toFixed(2)

      that.setData({

        detail: res.data.data

      })

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
    if (this.data.test == 'pay') {
      wx.redirectTo({
        url: '/pages/takeout/order/order',
      })
    }
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

  /**
   * 去付款button
   */
  toPay: function (e) {
    var that = this;
    that.loadingWave.showLoading()
    var orderSn = e.currentTarget.dataset.sn;//订单sn
    that.orderPay(orderSn)//调用支付接口
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
    that.loadingWave.hideLoading()
    var info = res.data
    if (info.ret == 200) {
      var param = info.data
      wx.requestPayment({
        'timeStamp': param.timeStamp.toString(),
        'nonceStr': param.nonceStr,
        'package': param.package,
        'signType': param.signType,
        'paySign': param.paySign,
        'success': function (res_two) {
          var detail = that.data.detail
          detail.order_status = 2
          that.setData({
            'detail': detail
          })
        },
        'fail': function (res_two) {
          // console.log(res_two)
        }
      })
    } else {
      this.dialog.showDialog({
        'type': 'warning',
        'title': info.ret,
        'content': info.msg
      })
    }
  },

  /**
   * 订单签收
   **/
  receipted: function (e) {
    var that = this;
    that.loadingWave.showLoading()
    var order_id = e.currentTarget.dataset.id;// 订单id
    var data = {
      token: app.storage.getAuth().token,
      order_id: order_id
    }
    var extraParams = {
      order_id: order_id
    }
    app.takeoutApi(
      app.apiService.takeout.finish,
      data,
      that.finishSuccess,
      that.ofinishFail,
      extraParams
    )
  },
  finishSuccess: function (res, param) {
    var that = this;
    that.loadingWave.hideLoading()
    var info = res.data
    if (info.ret == 200) {
      if (info.data > 0) {
        var detail = that.data.detail
        detail.order_status = 3
        that.setData({
          'detail': detail
        })
      } else {
        this.dialog.showDialog({
          'type': 'warning',
          'title': '修改失败！',
          'content': '请重新请求～'
        })
      }
    } else {
      this.dialog.showDialog({
        'type': 'warning',
        'title': info.ret,
        'content': info.msg
      })
    }
  },
  ofinishFail: function () {
    var that = this;
    if (!that.data.isConnected) {
      this.dialog.showDialog({
        'type': 'warning',
        'title': '网络未链接！',
        'content': '请检查您的网络～'
      })
    } else {
      this.dialog.showDialog({
        'type': 'warning',
        'title': '加载出错！',
        'content': '请退出重新加载～'
      })
    }
  },

  // 取消订单
  cancel: function (e) {

    this.prompt()

  },

  // 售后
  customerService: function (e) {

    this.prompt()

  },
  // 提示
  prompt: function () {

    this.dialog.showDialog({
      
      'type': 'warning',

      'title': '',

      'content': '客服：17784623235'

    })

  },

})