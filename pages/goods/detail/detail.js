// pages/goods/detail/detail.js
var app = getApp()
var wxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    duration: 500,
    interval: 3000,
    good: undefined,
    goodsSkus: [],
    selectGoodsSku: [],
    selectedId: '',
    cartCount: 0,
    position: 'inherit',
    minPrice: '',
    maxPrice: '',
    likeGoods: [],
    hideMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //加载组件
    this.wave = this.selectComponent('#wave')

    //商品规格组件
    this.goodsStandard = this.selectComponent('#goods_standard')

    //显示加载
    //this.wave.showLoading()

    //获取商品详情数据
    this.getDetail(options.id)

    //获取商品属性值数据
    this.getAttrValues(options.id)

    //获取商品sku数据
    //this.getSkuGoods(options.id)

    //获取购物车数量
    this.queryCartCount()
  
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
   * 生命周期函数--监听页面卸
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

  toBrand() {

    var id = this.data.good.brand.id

    wx.navigateTo({

      url: '/pages/brand/detail/detail?id=' + id

    })

  },

  queryCartCount() {

    const that = this

    app.crmApi(

      app.apiService.crm.cartCount,

      { token: app.storage.getToken() },

      res => {

        that.setData({

          cartCount: res.data.data

        })

      }

    )

  },

  getDetail(id) {

    const that = this

    app.crmApi(

      app.apiService.crm.getGoodsDetail,

      { goods_id: id },

      res => {

        if(res.data.ret == 200) {

          var description = res.data.data.description

          res.data.data.description = app.convertHtmlToText(res.data.data.description)

          that.setData({

            good: res.data.data

          })

          wxParse.wxParse('description', 'html', description, that, 5);
          
          that.goodsStandard.setGood(res.data.data)

          that.getSkuGoods(id)

          //获取标签相近的推荐商品
          that.getLikyGoods()

        }

      }

    )

  },

  getSkuGoods(id) {

    const that = this
    
    app.crmApi(

      app.crmApi(

        app.apiService.crm.getSkuGoods,

        { goods_id: id },

        res => {

          if (res.data.ret == 200) {

            that.setData({

              goodsSkus: res.data.data

            })

            let minPrice, maxPrice

            that.data.goodsSkus.forEach(el => {

              if (!minPrice) {

                minPrice = el.price

              }

              if (!maxPrice) {

                maxPrice = el.price

              }

              if (maxPrice < el.price) {

                maxPrice = el.price

              }

              if (minPrice > el.price) {

                minPrice = el.price

              }

            })

            that.setData({

              minPrice: minPrice,

              maxPrice: maxPrice

            })
            
            that.goodsStandard.setSkuGood(res.data.data)
            
            var selectGoodsSku = {}

            res.data.data.forEach(ele => {

              selectGoodsSku[ele.sku_id] = 'sku-item'

            })

            that.setData({

              selectGoodsSku: selectGoodsSku

            })

          }

        }

      )

    )

  },

  getAttrValues(id) {

    const that = this

    app.crmApi(

      app.apiService.crm.getAttrValues,

      { goods_id: id },

      res => {

        if (res.data.ret == 200) {

          this.goodsStandard.setAttrs(res.data.data)
          

        }

      }

    )

  },

  selectSku(evt) {

    var id  = evt.currentTarget.dataset.id

    var selectGoodsSku = this.data.selectGoodsSku

    for (var key in selectGoodsSku) {

      selectGoodsSku[key] = 'sku-item'

    }

    selectGoodsSku[id] = 'sku-item-active'

    this.setData({

      selectGoodsSku: selectGoodsSku,
      
      selectedId: id

    })

  },

  addCart() {

    if (!this.data.selectedId) {

      wx.showToast({

        title: '请选择规格！',

        icon: 'none'

      })

      return

    }

  },

  purchase() {

    if (!this.data.selectedId) {

      wx.showToast({

        title: '请选择规格！',

        icon: 'none'

      })

      return

    }

    wx.navigateTo({

      url: '/pages/order/order?skuid=' + this.data.selectedId + '&goods_id=' + this.data.good.goods_id,

    })

  },

  toCart() {

    wx.switchTab({

      url: '/pages/cart/cart'

    })

  },

  showGoodStandard(evt) {

    this.goodsStandard.show(evt.target.dataset.type)

    this.setData({

      position: 'fixed'

    })

  },

  cartCountListener(evt) {

    this.setData({

      cartCount: evt.detail.data

    })

  },

  closeStandard() {

    this.setData({

      position: 'inherit'

    })

  },

  toLikyDetail(evt) {

    var goods_id = this.data.likeGoods[evt.currentTarget.dataset.idx].goods_id

    wx.navigateTo({

      url: '/pages/goods/detail/detail?id=' + goods_id

    })

  },

  showMoreGoods() {

    this.setData({

      hideMore: !this.data.hideMore

    })

  },

  getLikyGoods() {

    const that = this

    app.crmApi(

      app.apiService.crm.getGoodsList,

      { signature: that.data.good.signature, page_size: 100 },

      res => {

        if (res.data.ret == 200) {

          if (res.data.data.list.length > 0) {

            var likeGoods = []

            res.data.data.list.forEach(good => {

              if (good.goods_id != that.data.good.goods_id) {

                likeGoods.push(good)

              }

            })

            that.setData({

              likeGoods: likeGoods

            })

          }

        }

      }

    )

  }

})