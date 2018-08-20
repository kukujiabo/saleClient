var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: [],//店铺详情
    shop_id: '',//店铺id
    classifyList: [],//商品列表
    showCartDetail: false,//购物车展开折叠
    goods: [],//商品
    goodsSelected: [],//当前选中的多规格商品
    showModal: false,//商品规格弹框
    tabGroups: [], //商品规格标签组
    selectedTabs: [],//商品规格选择(小黑屋)
    sku_goods: [],//规格商品
    sku_name: '',//商品规格的name
    sku: [],
    scrollDown: false,
    firstIndex: -1,
    goods_bottom: false,
    //准备数据  
    //数据结构：以一组一组来进行设定  
    commodityAttr: [],
    attrValueList: [],
    itemTitles: [],
    toView: '',
    tapEvt: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.cart = that.selectComponent('#cart')

    that.operation_goods_sku = that.selectComponent('#operation_goods_sku')

    that.loadingWave = that.selectComponent('#wave')

    var shopInfo = JSON.parse(options.shopInfo)

    that.setData({

      shop: shopInfo,

      shop_id: shopInfo.store_id

    })

  },


  /**
   * 关闭商品规格对话框
   */
  hideModal: function () {
    this.setData({
      showModal: !this.data.showModal
    });
  },
  closeTap: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 商品规格接口获取
   */
  getGoodsSpec: function () {

    var that = this

    var data = {

      shop_id: that.data.shop_id,

    }
  
    app.takeoutApi(

      app.apiService.takeout.getGoodsSku,

      data,

      that.getGoodsSpecSuccess,

    )

  },

  /**
  * 商品规格接口获取  成功
  */
  getGoodsSpecSuccess: function (res) {
    var that = this;
    var info = res.data.data
    var commodityAttr = []
    if (res.data.ret == 200) {
      var sku_goods = info.sku_goods
      for (var i in sku_goods) {
        var info_sku_goods = {}
        info_sku_goods.price = sku_goods[i].price
        info_sku_goods.sku_id = sku_goods[i].sku_id
        info_sku_goods.sku_name = sku_goods[i].sku_name
        info_sku_goods.stock = sku_goods[i].stock
        info_sku_goods.attrValueList = JSON.parse(sku_goods[i].attr_value_items_format)
        if (!commodityAttr[sku_goods[i].goods_id]) {
          commodityAttr[sku_goods[i].goods_id] = []
        }
        commodityAttr[sku_goods[i].goods_id].push(info_sku_goods)
      }
      that.setData({
        commodityAttr: commodityAttr,
        sku_goods: sku_goods
      });

    }
  },

  /**
   * 多规格商品立即购买按钮
   */
  purchaseTap: function () {
    var that = this;
    var value = [];
    var result = that.operation_goods_sku.showReturn();
    var attrValueList = result.attrValueList
    for (var i = 0; i < attrValueList.length; i++) {
      if (!attrValueList[i].selectedValue) {
        break;
      }
      value.push(attrValueList[i].selectedValue);
    }

    value = String(value.join('-'))

    var goodsSelected = that.data.goodsSelected//多规格商品s
    var info_sku = result.includeGroup[0]

    var sku_id = info_sku.sku_id;
    var sku_name = info_sku.sku_name;
    var goods_id = goodsSelected.id
    var quantity = that.data.cart_quantity


    if (info_sku.stock <= 0 || info_sku.stock < quantity) {
      wx.showToast({
        title: '库存不足',
        image: '/images/wrong-load.png',
        duration: 1000
      })
      return;
    }
    var skuInfo = {
      goodsSelected: goodsSelected,
      shop_id: that.data.shop_id,
      goods_id: goods_id,
      info_sku: info_sku,
      quantity: quantity
    }

    skuInfo = JSON.stringify(skuInfo)
    wx.navigateTo({
      url: '/pages/takeout/pay/pay?skuInfo=' + skuInfo,
    })
  },

  // 清除购物车调用清除商品
  deleteCartGoods: function () {

    var that = this;

    var classifyList = that.data.classifyList

    for (var i in classifyList) {

      classifyList[i].quantity = 0

      for (var j in classifyList[i].goods) {

        classifyList[i].goods[j].quantity = 0

      }

    }
    that.setData({

      classifyList: classifyList

    })

  },

  /**
   * 商品规格加入购物车
   */
  goodsSpecAddCart: function (e) {
    var that = this;
    var value = [];
    var classifyList = that.data.classifyList
    var key = that.data.sku_key
    var idx = that.data.sku_idx
    if (!classifyList[key].goods[idx].quantity) {
      classifyList[key].goods[idx].quantity = 0
    }
    classifyList[key].goods[idx].quantity = parseInt(classifyList[key].goods[idx].quantity) + parseInt(that.data.cart_quantity)
    classifyList[key].quantity = parseInt(classifyList[key].quantity) + parseInt(that.data.cart_quantity)
    that.setData({
      classifyList: classifyList,
      showModal: false
    })
    that.data.cart_quantity
    var goodsInfo = that.data.goodsSelected;
    var result = that.operation_goods_sku.showReturn();
    var info_sku_goods = result.includeGroup[0]
    goodsInfo.price = info_sku_goods.price
    var goods_num = that.data.cart_quantity
    var sku_id = info_sku_goods.sku_id
    var goods_id = goodsInfo.id
    var currentTarget = e.currentTarget
    that.cart.editCart({
      goods_num,
      goods_id,
      sku_id,
      goodsInfo,
      info_sku_goods,
      currentTarget
    })
  },

  /**
   * 商品规格商品 -1
   */
  shopSpecMinusNum: function () {
    if (this.data.cart_quantity > 1) {
      var num = this.data.cart_quantity;
      this.setData({
        cart_quantity: num - 1
      });
    }
  },

  /**
  * 商品规格商品 +1
  */
  shopSpecAddNum: function () {
    var num = this.data.cart_quantity;
    this.setData({
      cart_quantity: num + 1
    });
  },

  /**
   * 商品详情链接跳转
   */
  goodsdetailTap: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;//分类下的商品的索引值
    var key = e.currentTarget.dataset.key;//分类的索引值
    var classifyList = that.data.classifyList;
    var goods_id = classifyList[key].goods[idx].id;//当前商品id
    var shop_id = that.data.shop_id;
    var goods_type = classifyList[key].goods[idx].type
    var data = {
      goods_type,
      goods_id,
      shop_id
    }
    data = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/takeout/detail/detail?data=' + data,
    })
  },


  /**
   * 商品列表接口
   */
  getGoods: function () {
    var that = this;
    
    var data = {
      shop_id: that.data.shop_id
    }

    that.loadingWave.showLoading()

    app.takeoutApi(

      app.apiService.takeout.getGoods,

      data,

      that.getGoodsSuccess,

      that.getGoodsFail

    )
  },

  /**
   * 商品列表接口获取   成功
   */
  getGoodsSuccess: function (res) {
    var that = this;

    that.loadingWave.hideLoading()

    if (res.data.ret == 200) {
      var classifyInfo = res.data.data; //分类以及商品内容
      for (var i in classifyInfo) {
        classifyInfo[i].quantity = 0
        for (var j in classifyInfo[i]['goods']) {
          classifyInfo[i]['goods'][j]['quantity'] = classifyInfo[i]['goods'][j]['cart_quantity']
        }
      }
      if (Array.isArray(classifyInfo) && classifyInfo.length > 0) {
        that.setData({
          classifyList: classifyInfo,
          classifySeleted: classifyInfo[0].id
        })
      }
    }
    that.getCart()//购物车列表
  },

  /**
   * 购物车列表接口获取
   */
  getCart: function () {
    var that = this;
    var data = {
      token: app.storage.getAuth().token,
      shop_id: that.data.shop_id
    }
    app.takeoutApi(
      app.apiService.takeout.getCart,
      data,
      that.getCartSuccess,
      that.getCartFail
    )

  },

  toLower() {
    var that = this
    that.setData({

      goods_bottom: true

    })
    wx.createSelectorQuery().selectAll('.goods-block').boundingClientRect(function (rects) {
      var rect = rects[rects.length - 1]
      that.setActiveMenu(rect.id.substr(1, rect.id.length - 1))
    }).exec()
  },

  /**
   * 购物车列表接口获取  成功
   */
  getCartSuccess: function (res) {
    var that = this;
    var info = res.data.data;
    that.cart.showDialog({
      cartCount: info.count,
      cartTotal: info.total,
      cartList: info.goods,
      shop_id: that.data.shop_id
    })
    var classifyList = that.data.classifyList
    if (res.data.ret == 200) {
      if (info.goods) {
        for (var i = 0; i < classifyList.length; i++) {
          var goods = classifyList[i].goods
          for (var j = 0; j < goods.length; j++) {
            for (var n = 0; n < info.goods.length; n++) {
              if (!goods[j].quantity) {
                goods[j].quantity = 0
              }
              if (info.goods[n].id == goods[j].id) {
                if (goods[j].type == 1) {
                  goods[j].quantity = parseInt(goods[j].quantity) + parseInt(info.goods[n].quantity)
                } else {
                  goods[j].quantity = info.goods[n].quantity
                }
              }
            }
            classifyList[i].quantity = parseInt(classifyList[i].quantity) + parseInt(goods[j].quantity)
          }
        }
        that.setData({
          classifyList: classifyList
        })
      }
    }

    // that.loadingBox.hideLoading()

  },
  /**
   * 购物车展开折叠
   */
  showCartDetail: function () {
    var that = this;
    that.setData({
      showCartDetail: !this.data.showCartDetail
    })
  },

  /**
  * 购物车遮罩层点击隐藏购物车
  */
  hideCartDetail: function () {
    var that = this;
    that.setData({
      showCartDetail: false
    })
  },

  /**
   * 左侧分类导航
   */
  tapClassify: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      classifyViewed: id,
      classifySeleted: id,
      tapEvt: true
    })
  },

  /**
   * 设置当前活跃的商品分类
   */
  setActiveMenu(id) {

    var that = this

    if (that.data.tapEvt) {

      that.setData({

        tapEvt: false

      })

      return

    }

    this.setData({

      classifySeleted: id,

      toView: 'menu_' + id

    })

  },

  /**
   * 右侧滚动
   */
  onGoodsScroll: function (e) {
    var that = this
    if (that.data.goods_bottom) {
      that.setData({
        goods_bottom: false
      })
      return
    }
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      that.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      that.setData({
        scrollDown: false
      });
    }
    wx.createSelectorQuery().selectAll('.goods-block').boundingClientRect(function (rects) {
      for(var i = 0; i < rects.length; i++) {
        var rect = rects[i]
        if (rect.top < 105 && (rect.height + rect.top) > 105) {
          that.setActiveMenu(rect.id.substr(1, rect.id.length - 1))
          break;
        }
      }
    }).exec()
  },

  /**
   * 打开多规格弹框
   */
  openSku: function (e) {
    var that = this;
    var classifyList = that.data.classifyList
    var key = e.target.dataset.key;//分类的索引
    var idx = e.target.dataset.idx;//分类下的每一类的商品的索引
    var goods = classifyList[key].goods[idx]//当前多规格商品

    that.setData({
      goodsSelected: goods,
      cart_quantity: 1,
      sku_key: key,
      sku_idx: idx,
    })
    that.setData({
      showModal: true
    })
    var commodityAttr = this.data.commodityAttr[goods.id]
    that.operation_goods_sku = that.selectComponent('#operation_goods_sku')
    that.operation_goods_sku.showDialog({
      commodityAttr: commodityAttr
    });
  },

  // 设置多规格价格
  updateGoodsSelected:function (e) {

    var that = this

    var goodsSelected = that.data.goodsSelected

    if (!e.detail[0] || !e.detail[0].price) {

      return

    }

    goodsSelected.price = e.detail[0].price

    that.setData({
      
      goodsSelected: goodsSelected

    })

  },

  /**
   * 每个商品的加加
   */
  shopscartAdd: function (e) {
    var that = this;
    var idx = e.target.dataset.idx;//分类下的每一类的商品的索引
    var key = e.target.dataset.key;//分类的索引
    var classifyList = that.data.classifyList
    var goodsInfo = classifyList[key].goods[idx]//当前多规格商品
    var sku_id = 0
    var info_sku_goods = []
    var currentTarget = e.currentTarget
    var quantity = goodsInfo.quantity
    quantity++;
    classifyList[key].goods[idx].quantity = quantity
    classifyList[key].quantity = parseInt(classifyList[key].quantity) + 1
    that.setData({
      classifyList: classifyList
    })
    var goods_id = goodsInfo.id
    var goods_num = 1
    var shop_id = that.data.shop_id
    that.cart.editCart({
      goods_num,
      goods_id,
      shop_id,
      sku_id,
      goodsInfo,
      info_sku_goods,
      currentTarget
    });
  },

  /**
   * 每个商品的减减
   */
  shopscartMinus: function (e) {
    var that = this;
    var idx = e.target.dataset.idx;//分类下的每一类的商品的索引
    var key = e.target.dataset.key;//分类的索引
    var classifyList = that.data.classifyList
    var goodsInfo = classifyList[key].goods[idx]//当前多规格商品
    var sku_id = 0
    var info_sku_goods = []
    var currentTarget = e.currentTarget
    var quantity = goodsInfo.quantity

    quantity--;

    if (quantity < 0) {

      quantity = 0

    }

    classifyList[key].goods[idx].quantity = quantity

    classifyList[key].quantity = parseInt(classifyList[key].quantity) - 1

    if (classifyList[key].quantity < 0) {

      classifyList[key].quantity = 0

    }

    that.setData({
      classifyList: classifyList
    })
    var goods_id = goodsInfo.id
    var goods_num = -1
    var shop_id = that.data.shop_id
    that.cart.editCart({
      goods_num,
      goods_id,
      shop_id,
      sku_id,
      goodsInfo,
      info_sku_goods,
      currentTarget
    });
  },

  /**
   * 支付传参
   */
  goPayTap: function () {
    var that = this;
    var cart_List = {}//新建购物车列表
    var goods = [] //购物车中的商品
    var cartTotal = that.data.cartTotal
    var cartCount = that.data.cartCount
    var shop_id = that.data.shop_id
    var list = that.data.classifyList
    for (var i in list) {
      var goods_list = list[i].goods//每个分类下的所有商品
      for (var j in goods_list) {
        if (goods_list[j].cart_quantity) {
          cart_List = goods.push(goods_list[j])//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
        }
      }
    }
    that.setData({
      goods: cart_List//购物车中所有商品
    })
    var cartData = {
      goods,
      cartTotal,
      cartCount,
      shop_id,
    }
    var cart_data = JSON.stringify(cartData)
    wx.navigateTo({
      url: '/pages/takeout/pay/pay?data=' + cart_data + '&lat=' + that.data.shop.lat + '&lon=' + that.data.shop.lon + '&shop_id=' + that.data.shop.store_id
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

    var that = this;

    that.getGoods()//商品列表

    that.getGoodsSpec()

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

  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值  
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },

  isValueExist(value, valueArr) {
    // 判断是否已有属性值  
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },

  /* 点击确定 */
  submit() {
    var value = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      value.push(this.data.attrValueList[i].selectedValue)
    }
    value = String(value.join('-'))
    // if (i < this.data.attrValueList.length) {
    //   wx.showToast({
    //     title: '请完善属性',
    //     icon: 'loading',
    //     duration: 1000
    //   })
    // } else {
    //   wx.showToast({
    //     // title: '选择的属性：' + value.join('-'),
    //     title: value,
    //     icon: 'sucess',
    //     duration: 1000
    //   })
    // }
  },

  onMyEvent: function (e) {
    var that = this
    var status = e.detail.status
    var id = e.detail.goods_id
    var classifyList = that.data.classifyList
    for (var i in classifyList) {
      var goods = classifyList[i].goods
      for (var j in goods) {
        if (goods[j].id == id) {
          var num = 1
          if (status == 1) {
            num = -1
          }
          classifyList[i].goods[j].quantity = parseInt(goods[j].quantity) + num
          classifyList[i].quantity = parseInt(classifyList[i].quantity) + num
          if (classifyList[i].quantity < 0) {
            classifyList[i].quantity = 0
          }
          if (classifyList[i].goods[j].quantity < 0) {
            classifyList[i].goods[j].quantity = 0
          }
        }
      }
    }
    that.setData({
      classifyList: classifyList
    })
  }
})
