// pages/order/detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    order: '',

    process: [
      'process',
      'process',
      'process'
    ],

    status: [
      '/images/order-pay.png',
      '/images/wait-dispatch.png',
      '/images/wait-receive.png',
      '/images/order-complete.png'
    ],

    returnGood: {},

    returnNum: '',

    showReturnBox: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getOrderDetail(options.order_id)
  
  },

  inputReturnNum(evt) {

    this.setData({

      returnNum: evt.detail.value

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

  returnGoods(evt) {

    var idx = evt.currentTarget.dataset.idx

    this.setData({

      showReturnBox: true,

      returnGood: this.data.order.goods_list[idx]

    })

  },

  returnOperation() {

    var returnNum = this.data.returnNum

    var that = this

    if (!returnNum) {

      wx.showModal({
        title: '提示',
        content: '退货数量需要大于0！',
      })

    }

    if (returnNum > this.data.returnGood.return_num) {

      wx.showModal({
        title: '提示',
        content: '退货数量不能大于剩余可退数量！',
      })

    }

    app.crmApi(

      app.apiService.crm.orderAfterSale,

      {
        sn: this.data.order.sn.trim(),

        sku_id: this.data.returnGood.sku_id,

        num: returnNum

      },

      res => {

        if (res.data.ret == 200) {

          if (res.data.data.status == 0) {

            wx.showToast({
              title: '退货成功！',
            })
             
          } else {

            wx.showModal({
              title: '错误',
              content: '退货失败，请联系管理员！',
            })

          }

          that.setData({

            showReturnBox: false

          })

        }

      }

    )

  },

  hideReturnGood() {

    this.setData({

      showReturnBox: false

    })

  },

  getOrderDetail(orderId) {

    const that = this

    app.crmApi(

      app.apiService.crm.orderDetail,

      { token: app.storage.getToken(), order_id: orderId },
      
      res => {

        if (res.data.ret == 200) {

          var status = that.data.status

          var process = that.data.process

          switch(res.data.data.order_status) {

            case 1:

              res.data.data.status_str = '待支付'
              
              status[0] = '/images/order-payed.png'

            break;

            case 2:

              res.data.data.status_str = '待发货'

              status[0] = '/images/order-payed.png'

              status[1] = '/images/wait-dispatched.png'

              process[0] = 'active-process' 

            break;

            case 3:

              res.data.data.status_str = '待收货'

              status[0] = '/images/order-payed.png'

              status[1] = '/images/wait-dispatched.png'

              status[2] = '/images/wait-recived.png'

              process[0] = 'active-process'

              process[1] = 'active-process' 

            break;

            case 4:

              res.data.data.status_str = '已完成'

              status[0] = '/images/order-payed.png'

              status[1] = '/images/wait-dispatched.png'

              status[2] = '/images/wait-recived.png'

              status[4] = '/images/order-completed.png'

              process[0] = 'active-process'

              process[1] = 'active-process' 

              process[1] = 'active-process'

            break;

          }

          var order = res.data.data

          order.goods_list.forEach(good => {

            good.sku_name = good.sku_name.replace(good.goods_name, '')

            good.return_num = good.num

            order.goods_list.forEach(ig => {

              if (good.sku_id == ig.sku_id && good.id != ig.id) {

                good.return_num += ig.num

              }

            })

          })

          that.setData({

            order: order,

            status: status,

            process: process

          })

        }

      }

    )

  }

})