// pages/goods/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    goods: [],

    search: '',

    searching: true

  },

  search(evt) {

    var value = evt.detail.value

    this.queryGoods(value)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

      search: options.name

    })

    this.queryGoods(options.name)
  
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

  toDetail(evt) {

   var id = evt.currentTarget.dataset.id

    wx.navigateTo({
      
      url: '/pages/goods/detail/detail?id=' + id

    })

  },

  queryGoods(name) {

    const that = this

    that.setData({

      searching: true

    })

    app.crmApi(

      app.apiService.crm.getGoodsList,

      { goods_name: name, state: 1 },

      res => {

        if(res.data.ret == 200) {

          if (Array.isArray(res.data.data.list)) {

            that.setData({

              goods: res.data.data.list

            })  

          }

        }

        that.setData({

          searching: false

        })

      }

    )

  }

})