var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    clientHeight: 0,
    orderItem: [],//订单列表
    norecord: false,//暂无记录
    page: 1, //下一个页码
    page_count: 0, //总页码数
    page_num: 6, //每页显示条数
    isConnected: true,//网络状态
    nomore: false,//已加载所有
    orderId: '',//订单id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var page = this;

    page.loadingWave = page.selectComponent('#wave')
    
    page.dialog = page.selectComponent('#dialog')

    //  获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          clientHeight: res.windowHeight
        });
      }
    });

  },
  /**
   * 去付款button
   */
  toPay: function (e) {

    var that = this;

    var orderId = e.currentTarget.dataset.id;//订单id

    var orderSn = e.currentTarget.dataset.sn;//订单sn

    that.setData({

      orderId: e.currentTarget.dataset.id

    })

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
    if (res.data.ret == 200) {
      var info = res.data.data
      
      wx.requestPayment({
        'timeStamp': info.timeStamp.toString(),
        'nonceStr': info.nonceStr,
        'package': info.package,
        'signType': info.signType,
        'paySign': info.paySign,
        'success': function (res_two) {
          var order_id = that.data.orderId
          wx.navigateTo({
            url: '/pages/takeout/order/detail/detail?orderId=' + order_id,
          })
        },
        'fail': function (res_two) {
          
          var order_id = that.data.orderId
          // wx.navigateTo({
          //   url: '/pages/takeout/order/detail/detail?orderId=' + order_id,
          // })
        }
      })
    } else {
      that.dialog.showDialog({
        'type': 'warning',
        'title': res.data.ret,
        'content': res.data.msg
      })

    }
  },

  /**
   * 外卖订单支付接口获取  失败
   */
  orderPayFail: function (res) {

    var that = this;

  },
  /**
   * 详情链接跳转
   */
  detailTap: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.id;//订单id
    
    wx.navigateTo({
      url: '/pages/takeout/order/detail/detail?orderId=' + order_id,
    })
  },

  /**
    * 订单列表接口获取
    */
  orderList: function (func, page, page_num, status) {
    //status 订单状态：0 - 返回全部 1- 待支付 2- 已接单 3- 配送中 4- 已完成
    var that = this;
    //that.loadingWave.showLoading()
    var data = {
      token: app.storage.getAuth().token,
      page: page,
      page_num: page_num,
      status: status
    }
    var extraParams = {
      func: func,
      page: page,
      page_num: page_num,
      status: status
    }
    app.takeoutApi(
      app.apiService.takeout.getOrderList,
      data,
      that.orderListSuccess,
      that.orderListFail,
      extraParams
    )
  },
  /** 
   * 订单列表接口获取 成功
   */
  orderListSuccess: function (res, param) {
    var that = this;
    var func = param.func;
    var page = param.page;
    var page_num = param.page_num;
    var status = param.status;
    var info = res.data.data;

    that.loadingWave.hideLoading()

    // 总条数为0或者未定义时
    if (info.records == 0 || !info.records) {
      that.setData({
        orderItem: false,
      })
      return
    }

    // 计算出的总页码，Math.ceil向上取整
    var page_count = Math.ceil(info.records / page_num)
    var newData = res.data.data.data
    // 页码数大于计算出的页码数和没有数据的情况
    if (!newData || page > page_count) {
      that.setData({
        nomore: true
      })
      return
    }
    // 接口成功的时候重新赋值
    if (res.data.ret = 200) {
      that.setData({
        page: page,
        page_count: page_count
      })
      // 加载
      if (func == 3) {
        var oldData = that.data.orderItem
        that.setData({
          orderItem: oldData.concat(newData)
        })
      } else {
        that.setData({
          orderItem: newData
        })
      }
    }
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 订单列表接口获取 失败
   */
  orderListFail: function () {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    var that = this;
    that.hideLoading()
    if (!that.data.isConnected) {
      that.dialog.showDialog({
        title: '出错了！',
        content: '网络错误，请检查您的网络！'
      })
    } else {

    }
  },

  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    var status = parseInt(e.detail.current)
    that.setData({
      currentTab: status,
      orderItem: [],
      nomore: false
    });
    that.orderList(1, 1, that.data.page_num, status);//调用接口
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    var status = parseInt(e.target.dataset.current)
    that.setData({
      currentTab: status,
      orderItem: [],
      nomore: false
    })
    that.orderList(1, 1, that.data.page_num, status);//调用接口
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
    var that = this;
    that.orderList(1, that.data.page, that.data.page_num, 0);
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
    var that = this;
    that.orderList(2, 1, that.data.page_num, 0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.nomore == true) {
      return
    }
    var page = that.data.page + 1;
    that.orderList(3, page, that.data.page_num, that.data.currentTab);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})