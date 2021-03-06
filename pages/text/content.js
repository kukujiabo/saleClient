var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
var page_code
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_configs: {
      url: '',
      title: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var url = app.apiUrls.crm + '?' + 'service=' + app.apiService.crm.miniText;

    for(var key in options) {

      url += '&' + key + '=' + options[key]

    }
    
    console.log(url)

    this.setData({
    
      url: url
    
    })

  },

  pageConfigSuccess(res) {
    
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
  
  }
})