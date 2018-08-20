var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    cons: [],

    layoutIds: '',

    measure: '',

    sid: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

      layoutIds: options.ids,

      measure: options.m,

      sid: options.sid

    })

    this.getConstructType()
  
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

  getConstructType() {

    app.crmApi(

      app.apiService.crm.getConsAll,

      {},

      res => {

        if (res.data.ret == 200) {

          var cons = res.data.data

          cons.forEach(con => {

            con.attrs.forEach(attr => {

              attr.selected = true

            })

          })

          this.setData({

            cons: res.data.data

          })

        }

      }

    )

  },

  tapItem(evt) {

    var idx1 = evt.currentTarget.dataset.cidx

    var idx2 = evt.currentTarget.dataset.aidx

    var dataSet = this.data.cons

    dataSet[idx1].attrs[idx2].selected = !dataSet[idx1].attrs[idx2].selected

    this.setData({

      cons: dataSet

    })

  },

  toNext() {

    var selectedAttrs = []

    this.data.cons.forEach(con => {

      con.attrs.forEach(attr => {

        if (attr.selected) {

          selectedAttrs.push(attr.id)

        }

      })

    })

    var selectedAttrStr = selectedAttrs.join(',')

    var url = '/pages/order/smartGoods/smartGoods?selectAttr=' + selectedAttrStr + '&layoutIds=' + this.data.layoutIds + '&measure=' + this.data.measure + '&sid=' + this.data.sid 

    wx.navigateTo({

      url: url
      
    })

  }

})