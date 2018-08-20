var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponItem: [],//优惠券列表
    norecord: false,//暂无记录
    page: 1, //下一个页码
    page_count: 0, //总页码数
    page_num: 30, //每页显示条数
    nomore: false,//已加载所有
    actTabs: ['active', '', '', ''],
    addr_url_type: '',
  },

  totalPrice: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    if (options.type == 1) {

      that.setData({

        addr_url_type: 1,

      })

      that.totalPrice = parseFloat(options.total)

    }

  },

  /**
   * 优惠券二维码兑换跳转
   */
  exchangeTap: function (e) {

    var that = this;

    var idx = e.currentTarget.dataset.idx;

    var info = that.data.couponItem;

    var couponInfo = info[idx]

    if (that.data.addr_url_type == 1) {

      var pagelist = getCurrentPages();

      if (pagelist.length > 1) {
        //获取上一个页面实例对象
        var prePage = pagelist[pagelist.length - 2];

        prePage.getCouponData(couponInfo);

        wx.navigateBack({

          delta: 1

        })

      }

    } else {

      var data = {}

      wx.navigateTo({

        url: '/pages/userCenter/coupon/detail/detail?code=' + couponInfo.coupon_code

      })
    }

  },
  /**
   * 优惠券列表接口获取
   */
  couponList: function (func, page, page_num) {
    //参数func,等于1加载第一页，等于2刷新当前页，等于3加载下一页
    var that = this;
    var data = {
      token: app.storage.getToken(),
      page: page,
      page_num: page_num
    }
    var extraParams = {
      func: func,
      page: page,
      page_num: page_num
    }
    app.crmApi(
      app.apiService.crm.couponList,
      data,
      that.couponListSuccess,
      that.couponListFail,
      extraParams
    )
  },
  /**
   * 优惠券列表接口获取 成功
   */
  couponListSuccess: function (res, param) {

    var that = this;
    /**
     * 去除日期的时分秒
     */
    var newData = []
    var start_time = []
    var end_time = []
    var money = []

    if (that.data.addr_url_type == 1) {

      res.data.data.list.forEach(cd => {

        if (cd.at_least < that.totalPrice ) {

          newData.push(cd)

        }

      })

    } else {

      newData = res.data.data.list

    }

    if (newData.length == 0) {

      wx.showToast({

        icon: 'none',

        title: '无可用优惠券！'

      })

      return

    }

    for (var i = 0; i < newData.length; i++) {

      money[i] = parseInt(newData[i].money)

      newData[i].money = money[i];

      if (newData[i].start_time) {
        start_time[i] = newData[i].start_time;
        var startTime = start_time[i].substr(0, 10);
        newData[i].start_time = startTime;
      }

      if (newData[i].end_time) {
        end_time[i] = newData[i].end_time;
        var endTime = end_time[i].substr(0, 10);
        newData[i].end_time = endTime;
      }
    }

    var func = param.func;
    var page = param.page;
    var page_num = param.page_num;
    var info = res.data.data

    // 总条数为0或者未定义时
    if (info.total == 0 || !info.total) {
      that.setData({
        couponItem: false
      })
      return
    }
    // 计算出的总页码，Math.ceil向上取整
    var page_count = Math.ceil(info.total / page_num)

    // 页码数大于计算出的页码数和没有数据的情况
    if (page > page_count || !newData) {
      that.setData({
        nomore: true
      })
      return
    }
    // 接口成功的时候重新赋值
    if (res.data.ret == 200) {
      that.setData({
        page: page,
        page_count: page_count
      })
      // 加载
      if (func == 3) {
        var oldData = that.data.couponItem
        that.setData({
          couponItem: oldData.concat(newData)
        })
      } else {
        // 
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          couponItem: newData
        })
      }
    }
  },
  /**
   * 优惠券列表接口获取 失败
   */
  couponListFail: function () {
    var that = this;
    wx.showToast({
      title: '加载出错！',
      image: '/images/wrong-load.png'
    })
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
      page: 1,
      nomore: false
    })
    that.couponList(1, that.data.page, that.data.page_num);
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
    that.couponList(2, 1, that.data.page_num);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page + 1;
    that.couponList(3, page, that.data.page_num);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  touchTap(el) {
    var actives = ['', '', '', '']
    actives[el.currentTarget.dataset.seq] = 'active'
    this.setData({
      actTabs: actives
    })
  }
})
