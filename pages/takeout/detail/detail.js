var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: [],//店铺详情
    shop_id: '',//店铺id
    goods_id: '',//商品id
    classifyList: [],//商品列表
    cartList: [],//购物车列表
    showCartDetail: false,//购物车展开折叠
    cartCount: 0,//购物车总数量
    cartTotal: 0,//购物车总价格
    goods: [],//商品
    goodsInfo: [],//商品详情
    tabGroups: [], //商品规格标签组
    selectedTabs: [],//商品规格选择(小黑屋)
    sku_goods: [],//规格商品
    info_sku_goods: [],//规格商品
    sku_id: '',//商品规格的id
    sku_name: '',//商品规格的name
    sku: [],
    firstIndex: -1,
    //准备数据  
    //数据结构：以一组一组来进行设定  
    commodityAttr: [],
    attrValueList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.cart = that.selectComponent('#cart')

    var data = JSON.parse(options.data)

    that.setData({
      shop_id: data.shop_id,
      goods_id: data.goods_id
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
    })
    that.getGoodsInfo(data.goods_id)//商品详情
    if (data.goods_type == 1) {
      that.getGoodsSpec(that.data.goods_id)//商品规格
    }
  },

  /**
   * 商品详情接口获取
   */
  getGoodsInfo: function (goods_id) {
    var that = this;
    var data = {
      goods_id: goods_id
    }
    app.takeoutApi(
      app.apiService.takeout.getGoodsDetail,
      data,
      that.getGoodsInfoSuccess,
      that.getGoodsInfoFail
    )
  },
  /**
   * 商品详情接口获取 成功
   */
  getGoodsInfoSuccess: function (res) {
    var that = this
    if (res.data.ret == 200) {
      var info = res.data.data.goods
      info.description = app.convertHtmlToText(info.description);
      that.setData({
        goodsInfo: info
      })
      that.getCart()//购物车列表
    }
  },

  /**
   * 商品规格接口获取
   */
  getGoodsSpec: function (goods_id) {
    var that = this
    var data = {
      goods_id: goods_id
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
        commodityAttr[i] = {}
        commodityAttr[i].price = sku_goods[i].price
        commodityAttr[i].sku_id = sku_goods[i].sku_id
        commodityAttr[i].sku_name = sku_goods[i].sku_name
        commodityAttr[i].stock = sku_goods[i].stock
        commodityAttr[i]['attrValueList'] = JSON.parse(sku_goods[i].attr_value_items_format)
      }

      that.setData({
        commodityAttr: commodityAttr,
        sku_goods: sku_goods,
        showModal: true
      });

      that.setData({
        includeGroup: that.data.commodityAttr
      });
      that.distachAttrValue(commodityAttr);

      // 只有一个属性组合的时候默认选中  
      if (that.data.commodityAttr.length == 1) {
        for (var i = 0; i < that.data.commodityAttr[0].attrValueList.length; i++) {
          that.data.attrValueList[i].selectedValue = that.data.commodityAttr[0].attrValueList[i].attrValue;
        }
        that.setData({
          attrValueList: that.data.attrValueList
        });
      }
      this.operation_goods_sku = this.selectComponent('#operation_goods_sku')
      this.operation_goods_sku.showDialog({
        commodityAttr: commodityAttr
      });

    }
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

  /**
   * 购物车列表接口获取  成功
   */
  getCartSuccess: function (res) {
    var that = this;
    if (res.data.ret == 200) {
      var info = res.data.data
      that.cart.showDialog({
        cartCount: info.count,
        cartTotal: info.total,
        cartList: info.goods,
        shop_id: that.data.shop_id
      })
    }
  },

  // 加入购物车
  shopscartAdd: function (e) {
    var that = this;
    var goodsInfo = that.data.goodsInfo;
    var currentTarget = []
    if (e.currentTarget) {
      currentTarget = e.currentTarget
    }
    var sku_id = 0
    var info_sku_goods = []
    if (e.currentTarget.dataset.type == 3 && goodsInfo.type == 1) {
      this.operation_goods_sku = this.selectComponent('#operation_goods_sku')
      // 获取选中的多规格
      var result = this.operation_goods_sku.showReturn();
      var attrValueList = result.attrValueList
      for (var i = 0; i < attrValueList.length; i++) {
        if (!attrValueList[i].selectedValue) {
          break;
        }
      }
      info_sku_goods = result.includeGroup[0]
      if (goodsInfo.type == 1 && info_sku_goods.stock <= 0 || goodsInfo.type == 1 && goodsInfo.stock <= 0) {
        wx.showToast({
          title: '库存不足',
          image: '/images/wrong-load.png',
          duration: 1000
        })
        return;
      }
      sku_id = info_sku_goods.sku_id
      goodsInfo.price = info_sku_goods.price
    }
    var goods_id = goodsInfo.id
    var goods_num = 1
    var shop_id = that.data.shop_id
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

  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /** 
      将后台返回的数据组合成类似 
      { 
        attrKey:'型号', 
        attrValueList:['1','2','3'] 
      } 
    */
    // 把数据对象的数据（视图使用），写到局部内  
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据  
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {

        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);  
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置  
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理  
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
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

  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值  
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },

  /* 点击确定 */
  submit: function () {
    var value = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      value.push(this.data.attrValueList[i].selectedValue);
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
  }
})