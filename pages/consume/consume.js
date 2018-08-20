var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumeList: [],//消费记录列表
    norecord: false,//暂无记录
    page: 1, //下一个页码
    page_count: 0, //总页码数
    page_num: 8, //每页显示条数
    is_switch: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.consumeList(1, page.data.page, page.data.page_num);
    wx.onNetworkStatusChange(function (res) {
      page.setData({
        isConnected: res.isConnected
      })
    })
  },

  /**
   * 消费记录跳转到详情链接
   */
  detailTap: function (e) {

    var that = this;

    var idx = e.currentTarget.dataset.idx;

    var list = that.data.consumeItem

    wx.navigateTo({

      url: '/pages/consume/detail/detail?id=' + list[idx].id,

    })

  },

  /**
   * 消费记录列表接口获取
   */
  consumeList: function (func, page, page_num) {
    //参数func,等于1加载第一页，等于2刷新当前页，等于3加载下一页
    var that = this;
    // if (func == 2) {
    //     wx.showToast({
    //         title: '正在刷新',
    //         icon: 'loading'
    //     })
    // }
    if (func == 3) {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
    }
    var data = {
      token: app.storage.getAuth().token,
      page: page,
      page_num: page_num
    }
    var extraParams = {
      func: func,
      page: page,
      page_num: page_num
    }
    app.crmApi(
      app.apiService.crm.consumeList,
      data,
      that.consumeListSuccess,
      that.consumeListFail,
      extraParams
    )
  },

  /**
   * 消费记录列表接口获取 成功
   */
  consumeListSuccess: function (res, param) {
    var that = this;
    var func = param.func;
    var page = param.page;
    var page_num = param.page_num;
    var info = res.data.data;
    wx.hideToast();
    // 总条数为0或者未定义时
    if (info.records == 0 || !info.records) {
      that.setData({
        norecord: true,
      })
      return
    }
    // 计算出的总页码，Math.ceil向上取整
    var page_count = Math.ceil(info.records / page_num)
    var newData = res.data.data.data
    // 页码数大于计算出的页码数和没有数据的情况
    if (page > page_count || !newData) {
      wx.showModal({
        title: '',
        content: '没有更多数据了',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确认',
        confirmColor: '',
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
        var oldData = that.data.consumeItem

        that.setData({
          consumeItem: oldData.concat(newData)
        })
      } else {
        // 
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          consumeItem: newData
        })
      }
    } else {

    }
  },

  /**
   * 消费记录列表接口获取 失败
   */
  consumeListFail: function () {
    var that = this;
    if (!that.data.isConnected) {
      wx.showToast({
        title: '网络错误',
        image: '/images/wrong-net.png'
      })
    } else {
      wx.showToast({
        title: '加载出错！',
        image: '/images/wrong-load.png'
      })
    }
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
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
    that.setData({
      is_switch: true
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
    var that = this;
    that.consumeList(2, 1, that.data.page_num);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page + 1
    that.consumeList(3, page, that.data.page_num);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})