// pages/location/city/city.js
var app = getApp()
var utils = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    cities: [],

    selectedIndex: '',

    selectedChar: '',

    currentCity: {},

    arrange: {},

    hots: [],

    queryData: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var location = app.storage.getLocation()

    this.setData({

      currentCity: location

    })

    this.getCities()
  
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

  getCities() {

    var cities = app.storage.getAddrRoom()[1]

    this.arrangeCities(cities)

  },

  queryCity(evt) {

    var value = evt.detail.value

    const that = this

    app.crmApi(

      app.apiService.crm.queryCity,

      { name: value },

      res => {

        if (res.data.ret == 200) {

          if (Array.isArray(res.data.data) && res.data.data.length > 0) {

            this.arrangeCities(res.data.data)

          } else {

          }

        }

      }

    )

  },

  selectCity(evt) {

    var that = this

    wx.showModal({

      title: '提示',

      content: '切换地区将清空购物车，确认切换吗？',

      success: value => {

        if (value.confirm) {

          var idx = evt.target.dataset.idx

          var char = evt.target.dataset.char

          var arrange = that.data.arrange

          arrange[char][idx].selected = true

          if (that.data.selectedIndex !== '') {

            arrange[that.data.selectedChar][that.data.selectedIndex].selected = false

          }

          var location = {

            city: arrange[char][idx].short,

            city_code: arrange[char][idx].id

          }

          var hots = that.data.hots

          hots.forEach(el => {

            el.selected = false

          })

          that.setData({

            arrange: arrange,

            selectedIndex: idx,

            selectedChar: char,

            location: location,

            currentCity: location,

            hots: hots

          })

          app.storage.setLocation(location)

          app.crmApi(

            app.apiService.crm.emtyCart,

            { 

              token: app.storage.getToken()

            },

            res => {

              console.log(res)

            }

          )

        }        

      }

    })

  },

  selectHot(evt) {

    var that = this

    wx.showModal({

      title: '提示',

      content: '切换地区将清空购物车，确认切换吗？',

      success: value => {

        if (value.confirm) {

          var idx = evt.target.dataset.idx

          var hots = that.data.hots

          var id = hots[idx].id

          var short = hots[idx].short

          hots.forEach(el => {

            el.selected = false

          })

          hots[idx].selected = true

          var location = {

            city: short,

            city_code: id

          }

          var cities = that.data.cities

          cities.forEach(el => {

            el.selected = false

          })

          that.setData({

            location: location,

            currentCity: location,

            hots: hots,

            cities: cities

          })

          app.storage.setLocation(location)

          app.crmApi(

            app.apiService.crm.emtyCart,

            {

              token: app.storage.getToken()

            },

            res => {

              console.log(res)

            }

          )
        
        }

      }

    })

  },

  arrangeCities(cities) {

    var arrange = {}

    var hots = []

    cities.forEach(el => {

      var thumb = el.py_short[0].trim()

      if (el.hot) {

        hots.push(el)

        return

      }
 
      if (!thumb) {

        return

      }

      if (!arrange[thumb]) {

        arrange[thumb] = []

      } 

      arrange[thumb].push(el)

    })

    this.setData({

      arrange: utils.objKeySort(arrange),

      hots: hots

    })

  },

  queryInput(evt) {

    this.setData({

      queryData: evt.detail.value

    })

  }

})