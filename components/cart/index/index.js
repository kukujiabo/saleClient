var app = getApp()
/**
 * 首页提示操作动画组件
 */
Component({

  options: {

    multipleSlots: true//   在组件定义时的选项中启用多slot支持

  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

    arrow: true,

    dialog: true,

    hidden: false,

    fadeOut: '',

    cartList: [],

    cartCount: 0,

    cartTotal: 0,

    shop_id: 0,

    showCartDetail: false,

    timeoutflag: null,

    num: 0,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog(options) {
      if (!options.cartList) {
        options.cartList = []
      }
      this.setData({
        cartCount: options.cartCount,
        cartTotal: options.cartTotal.toFixed(2),
        cartList: options.cartList,
        shop_id: options.shop_id
      })
    },

    /**
     * 购物车展开折叠
     */
    showCartDetail: function () {
      var that = this;
      if (!this.data.cartList) {
        return
      }
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
     * 商品列表加数
     */
    cartAdd(e) {
      var that = this;
      var cartList = that.data.cartList
      var goodsInfo = e.goodsInfo
      var info_sku_goods = e.info_sku_goods
      var sku_id = e.sku_id
      if (e) {
        var idx = e.currentTarget.dataset.idx;//当前商品的索引
        if (idx != undefined && goodsInfo.type == 1 && cartList[idx].sku_id) {
          sku_id = cartList[idx].sku_id
        }
      }
      var id = goodsInfo.id
      if (e.currentTarget.dataset.id) {
        id = e.currentTarget.dataset.id
      }
      // 当前增加的商品数量
      goodsInfo.cart_quantity = 1
      if (e.goods_num) {
        goodsInfo.cart_quantity = e.goods_num
      }
      // 当前商品在购物车中的总数
      var status = 0
      // 遍历购物车商品做增减
      if (cartList) {
        for (var i = 0; i < cartList.length; i++) {
          if (goodsInfo.type == 1 && id == cartList[i].id && sku_id == cartList[i].sku_id || goodsInfo.type == 2 && id == cartList[i].id) {
            // 购物车数量增加当前商品增加值
            var quantity = parseInt(cartList[i].quantity) + parseInt(goodsInfo.cart_quantity);
            if (e.currentTarget.dataset.type == 3 && goodsInfo.type == 1 && info_sku_goods.stock < quantity || goodsInfo.type == 2 && goodsInfo.stock < quantity) {
              wx.showToast({
                title: '库存不足',
                image: '/images/wrong-load.png',
                duration: 1000
              })
              return;
            }
            status = cartList[i].quantity = quantity
            break
          }
        }
      }
      // 新增
      if (status == 0) {
        if (goodsInfo.type == 1 && info_sku_goods.stock < goodsInfo.cart_quantity || goodsInfo.stock < goodsInfo.cart_quantity) {
          wx.showToast({
            title: '库存不足',
            image: '/images/wrong-load.png',
            duration: 1000
          })
          return;
        }
        var goods = {
          'sku_id': sku_id,
          'id': id,
          'name': goodsInfo.name,
          'price': goodsInfo.price,
          'quantity': goodsInfo.cart_quantity,
        }
        if (goodsInfo.type == 1) {
          goods.sku_name = info_sku_goods.sku_name
        }
        cartList.push(goods)
      }
      that.setData({
        cartList: cartList
      })
      that.calculate()
    },

    /**
     * 商品列表减数
     */
    cartMinus: function (e) {
      var that = this;
      var cartList = that.data.cartList;
      var goodsInfo = e.goodsInfo
      var id = e.goods_id;
      for (var i = 0; i < cartList.length; i++) {
        if (goodsInfo.type == 1 && id == cartList[i].id && sku_id == cartList[i].sku_id || goodsInfo.type == 2 && id == cartList[i].id) {
          // 购物车数量增加当前商品增加值
          var quantity = parseInt(cartList[i].quantity) - 1;
          cartList[i].quantity = quantity
        }
      }
      that.setData({
        cartList: cartList
      })
      that.calculate()
    },

    // 购物车商品加加
    shopCartAdd(e) {
      var that = this
      var param = {}
      var cartList = that.data.cartList
      var idx = e.currentTarget.dataset.idx
      var goods_id = e.currentTarget.dataset.id
      var status = 2
      this.triggerEvent('myevent', { goods_id, status })
      param.goods_id = e.currentTarget.dataset.id
      param.sku_id = e.currentTarget.dataset.sku
      var quantity = cartList[idx].quantity
      quantity++
      cartList[idx].quantity = quantity
      that.setData({
        cartList: cartList
      })
      that.calculate()
      param.goods_num = 1
      param.cart_type = 1
      that.editCart(param)
    },

    // 购物车商品减减
    shopCartMinus(e) {
      var that = this
      var param = {}
      var cartList = that.data.cartList
      var idx = e.currentTarget.dataset.idx
      var goods_id = e.currentTarget.dataset.id
      var status = 1
      this.triggerEvent('myevent', { goods_id, status })
      param.goods_id = e.currentTarget.dataset.id
      param.sku_id = e.currentTarget.dataset.sku
      var quantity = cartList[idx].quantity
      quantity--
      cartList[idx].quantity = quantity
      that.setData({
        cartList: cartList
      })
      that.calculate()
      param.goods_num = -1
      param.cart_type = 1
      that.editCart(param)
    },

    /**
     * 编辑购物车商品
     * @param goods_id
     * @param goods_num
     * @param shop_id
     * @param sku_id
     */
    editCart: function (param) {
      var that = this;
      var num = that.data.num
      num += param.goods_num
      that.setData({
        num: num
      })
      var timeoutflag = that.data.timeoutflag
      if (timeoutflag != null) {
        clearTimeout(timeoutflag);
      }
      if (!param.cart_type && param.goods_num > 0) {
        that.cartAdd(param)
      } else if (!param.cart_type && param.goods_num < 0) {
        that.cartMinus(param)
      }
      var data = {
        token: app.storage.getAuth().token,
        goods_id: param.goods_id,
        goods_num: num,
        shop_id: that.data.shop_id,
      }
      if (param.sku_id) {
        data.sku_id = param.sku_id
      }

      timeoutflag = setTimeout(function () {
        that.setData({
          num: 0
        })
        app.takeoutApi(
          app.apiService.takeout.editGoods,
          data,
          that.editCartSuccess,
          that.editCartFail
        )
      }, 200);
      that.setData({
        timeoutflag: timeoutflag
      })
    },

    /**
     * 编辑购物车商品  成功
     */
    editCartSuccess: function (res) {
      var that = this;
      if (res.data.ret == 200) {

      } else {

      }
    },

    /**
     * 编辑购物车商品  失败
     */
    editCartFail: function () {

    },

    /**
     * 重计算购物车商品总数量和总价格
     */
    calculate: function () {
      var that = this;
      var total = 0
      var num = 0
      var cartList = that.data.cartList;
      for (let i in cartList) {
        let cartItem = cartList[i]
        if (cartItem.quantity) {
          num += parseInt(cartItem.quantity)
          total += parseFloat(parseFloat(cartItem.price) * parseInt(cartItem.quantity))
        }
      }
      var data = {

        cartCount: num,

        cartTotal: total.toFixed(2)

      }
      if (num <= 0) {
        
        data.showCartDetail = false

      }
      
      that.setData(data)
    },

    /**
     * 支付传参
     */
    goPayTap: function () {
      var that = this;
      var cartTotal = that.data.cartTotal
      var cartCount = that.data.cartCount
      var shop_id = that.data.shop_id
      var goods = that.data.cartList

      var cartData = {
        goods,
        cartTotal,
        cartCount,
        shop_id
      }
      var cart_data = JSON.stringify(cartData)
      wx.navigateTo({
        url: '/pages/takeout/pay/pay?data=' + cart_data,
      })
    },

    deleteCarts() {
      var that = this
      // 确认删除购物车
      wx.showModal({
        title: '',
        content: '确认清空购物车？',
        success: function (res) {
          if (res.confirm) {
            that.deleteCart()
          } else if (res.cancel) {
            return
          }
        }
      })
    },

    // 清空购物车商品
    deleteCart() {
      var that = this
      var data = {
        token: app.storage.getAuth().token,
        shop_id: that.data.shop_id
      }
      app.takeoutApi(
        app.apiService.takeout.deleteCart,
        data,
        that.deleteCartSuccess,
        that.deleteCartFail
      )
      that.deleteCartGoods()
      that.setData({
        cartList: [],
        showCartDetail: false
      })
      that.calculate()
    },

    // 清除购物车调用清除商品
    deleteCartGoods() {

      this.triggerEvent('deleteCartGoods')

    },

    deleteCartSuccess(res) {

    },

    deleteCartFail(res) {

    },

    /**
     * 显示指示箭头
     */
    aniend1() {
      this.setData({
        arrow: false
      })
    },

    /**
     * 显示对话框
     */
    aniend2() {
      this.setData({
        dialog: false
      })
    },

    fadeOut() {
      this.setData({
        fadeOut: 'fade-out'
      })
    },

    aniEnd() {
      this.setData({
        hidden: true
      })
    },

    stopPopEvent(evt) {
      evt.preventDefault();
    }

  }

})
