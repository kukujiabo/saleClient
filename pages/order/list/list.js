// pages/order/list/list.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    tabs: [
      { tab_name: '全部', active: 'active' },
      { tab_name: '待付款', active: '' },
      { tab_name: '待发货', active: '' },
      { tab_name: '待收货', active: '' },
      { tab_name: '已完成', active: '' },
      { tab_name: '退款', active: '' }
    ],

    orders: [],

    query: {},

    page: 1,

    page_size: 100

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.index) {

      this.setTabActive(options.index)

    } else {

      this.queryList({})

    }

  },

  inputSearch(evt) {

    var value = evt.detail.value

    var query = this.data.query

    query.keyword = value

    this.setData({

      query: query

    })

  },

  search(evt) {

    var query = this.data.query

    query.keyword = evt.detail.value.trim()

    if (query.keyword) {

      this.setData({

        query: query

      })

      this.queryList(query)

    }

  },

  setTabActive(index) {

    var tabs = this.data.tabs

    tabs.forEach(tab => {

      tab.active = ''

    })

    tabs[index].active = 'active'

    this.setData({

      tabs: tabs

    })

    var query = this.data.query

    if (index) {

      query.order_status = index % 5

    } else {

      query.order_status = ''

    }

    this.setData({

      query: query

    })

    this.queryList(query)

  },

  chooseTab(evt) {

    var index = evt.target.dataset.idx

    this.setTabActive(index)

  },

  queryList(query) {

    query.token = app.storage.getToken()

    const that = this

    app.crmApi(

      app.apiService.crm.orderList,

      query,

      res => {

        if (res.data.ret == 200) {

          if (Array.isArray(res.data.data.list)) {

            res.data.data.list.forEach(el => {

              switch (el.order_status) {

                case 1:

                  el.order_status_str = '待支付'

                  break;

                case 2:

                  el.order_status_str = '待发货'

                  break;

                case 3:

                  el.order_status_str = '待收货'

                  break;

                case 4:

                  el.order_status_str = '已完成'

                  break;

                case 0:

                  el.order_status_str = '已取消'

                  break;

                default:

                  el.order_status_str = '已取消'

                  break;

              }

            })

          }

          that.setData({

            orders: res.data.data.list,

            page: res.data.data.page

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

    this.queryList(this.data.query)

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

  confirmReceived(evt) {

    var that = this

    wx.showModal({

      title: '提示',

      content: '您确认已收到商品？',

      complete: result => {

        if (result.confirm) {

          var orderId = evt.currentTarget.dataset.order_id

          app.crmApi(

            app.apiService.crm.confirmReceived,

            { token: app.storage.getToken(), order_id: orderId },

            res => {

              if (res.data.ret == 200 && res.data.data == 1) {

                that.queryList(that.data.query)

              }

            }

          )

        }

      }

    })

  },


  toDetail(evt) {

    var order_id = evt.currentTarget.dataset.id

    wx.navigateTo({

      url: '/pages/order/detail/detail?order_id=' + order_id,

    })

  },

  removeOrder(evt) {

    var orderId = evt.currentTarget.dataset.order_id

    var that = this

    wx.showModal({

      title: '提示',

      content: '订单删除将不可恢复，您确认删除？',

      complete: res => {

        if (res.confirm) {

          app.crmApi(

            app.apiService.crm.removeOrder,

            { token: app.storage.getToken(), order_id: orderId },

            res => {

              if (res.data.ret == 200 && res.data.data == 1) {

                that.queryList(that.data.query)

              }

            }

          )

        }

      }

    })

  },

  cancelOrder(evt) {

    var sn = evt.currentTarget.dataset.sn

    wx.navigateTo({

      url: '/pages/order/returnOrder/returnOrder?sn=' + sn

    })

  },

  mapTrans(evt) {

    const that = this

    var orderId = evt.currentTarget.dataset.order_id

    app.crmApi(

      app.apiService.crm.getFirstMapLocation,

      { token: app.storage.getToken(), order_id: orderId },

      res => {

        if (res.data.ret == 200) {

          var location = res.data.data.list[0]

          var point = that.BdmapEncryptToMapabc(location.lat, location.lon)

          wx.navigateTo({

            url: '/pages/order/mapOrder/mapOrder?longitude=' + point.lng + '&latitude=' + point.lat + '&orderId=' + orderId

          })

        }

      }

    )

  },

  /**
   * 百度坐标转换腾讯坐标
   */
  BdmapEncryptToMapabc(bd_lat, bd_lon) {
    var point = new Object();
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = new Number(bd_lon - 0.0065);
    var y = new Number(bd_lat - 0.006);
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var Mars_lon = z * Math.cos(theta);
    var Mars_lat = z * Math.sin(theta);
    point.lng = Mars_lon;
    point.lat = Mars_lat;
    return point;
  },

  rebuyOrder(evt) {

    wx.showModal({

      title: '提示',

      content: '重新新下单将购买与原订单相同的商品，由于区域价格的调整，总金额可能会有所不同，并会清空当前购物车，确认下单吗？',

      complete: res => {

        if (res.confirm) {

          var orderId = evt.currentTarget.dataset.order_id

          var location = app.storage.getLocation()

          app.crmApi(

            app.apiService.crm.rebuyOrder,

            { order_id: orderId, token: app.storage.getToken(), city_code: location.city_code },

            res => {

              if (res.data.ret == 200) {

                if (res.data.data == 0) {

                  wx.showModal({

                    title: '错误！',

                    content: '部分商品已下架，无法再次购买！'

                  })

                } else {

                  wx.switchTab({

                    url: '/pages/cart/cart',

                  })

                }

              } else {

                wx.showModal({

                  title: '网络错误！',

                  content: '请检查您的网络！'

                })

              }

            }

          )

        }

      }

    })

  }

})