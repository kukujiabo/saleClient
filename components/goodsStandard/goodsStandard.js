// components/goodsStandard/goodsStandard.js
var utils = require('../../utils/util')
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    'attrWrapHeight': {
      'type': 'string',
      'value': '55'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    good: {},
    selectedSku: undefined,
    selectedAttrValues: [],
    unitPrice: 0,
    stock: 0,
    attrs: [],
    skus: [],
    boardType: 1,
    quantity: 1,
    total: 0,
    show: false,
    sku_image: '',
    attrHeight: 'auto',
    selectedAttrIndex: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

    show(boardType) {

      var that = this

      that.setData({

        show: true,

        boardType: boardType

      })

      var query = wx.createSelectorQuery().in(this)

      query.select('#attr_info').boundingClientRect(function (res) {

        that.setData({

          attrHeight: res.height + 'px'

        })

      }).exec()

      var cityCode = app.storage.getLocation().city_code

      if (this.data.attrs.length == 1) {

        var attrs = this.data.attrs

        var skus = this.data.skus

        attrs[0].values.forEach(attr => {

          skus.forEach(sku => {

            if (utils.arrayValuesMatch(sku.attrValueGroup, [ attr.attr_value_id ])) {

              if (sku.cities.indexOf(cityCode) < 0) {
 
                attr.available = 0

              }

            }

          })

        })

        this.setData({

          attrs: attrs

        })

      }

    },

    hide() {

      this.setData({

        show: false

      })

      this.triggerEvent('closestandard', {}, {})

    },

    setAttrs(attrs) {

      this.setData({

        attrs: attrs,

        selectedAttrValues: [],

        selectedAttrIndex: []

      })

    },

    setSkuGood(skus) {

      var that = this

      skus.forEach((sku, index) => {

        var attrValues = JSON.parse(sku.attr_value_items_format)

        sku.attrValueGroup = []

        attrValues.forEach(attrValue => {

          sku.attrValueGroup.push(attrValue.attr_val)

        })

        sku.sku_name = sku.sku_name.replace(that.data.good.goods_name, '')

      })

      that.setData({

        skus: skus,

        selectedSku: undefined

      })

    },

    setGood(good) {

      this.setData({

        good: good,

        unitPrice: good.price,

        sku_image: good.thumbnail

      })

      this.caculateTotal()

    },

    catchTouch(evt) {


    },


    /**
     * 选择商品规格
     */
    selectAttrValue(evt) {

      var attrValueIdx = evt.target.dataset.attr_value_id

      var attrIdx = evt.target.dataset.attr_id

      var attrs = this.data.attrs

      var selectedAttrValues = this.data.selectedAttrValues

      var selectedAttrIndex = this.data.selectedAttrIndex

      if (attrs[attrIdx].values[attrValueIdx].available === 0) {

        return

      }

      attrs[attrIdx].values.forEach(ele => {

        ele.selected = ''

      })

      if (utils.inArray(attrIdx, selectedAttrIndex) < 0) {

        selectedAttrIndex.push(attrIdx)

      }

      selectedAttrValues[attrIdx] = attrs[attrIdx].values[attrValueIdx].attr_value_id

      attrs[attrIdx].values[attrValueIdx].selected = 'active'

      /**
       * 遍历筛选可用属性 
       */
      if (selectedAttrValues.length == this.data.attrs.length - 1) {

        var cityCode = app.storage.getLocation().city_code

        attrs.forEach((attrItm, aIdx) => {

          if (utils.inArray(aIdx, selectedAttrIndex) < 0) {

            attrItm.values.forEach(attrEl => {

              var testArr = selectedAttrValues.concat([attrEl.attr_value_id])

              for (var i = 0; i < this.data.skus.length; i++) {

                if (utils.arrayValuesMatch(this.data.skus[i].attrValueGroup, testArr)) {

                  if (this.data.skus[i].stock == 0 || !this.data.skus[i].cities || this.data.skus[i].cities.indexOf(cityCode) < 0) {

                    attrEl.available = 0

                  } else {

                    attrEl.available = 1

                  }

                }

              }

            })

          }

        })

      }

      if (selectedAttrValues.length == this.data.attrs.length) {

        var cityCode = app.storage.getLocation().city_code

        if (attrIdx != selectedAttrIndex[selectedAttrIndex.length - 1]) {

          attrs[selectedAttrIndex[selectedAttrIndex.length - 1]].values.forEach(attrEl => {

            var testArr = [] 

            for (let ii = 0; ii < selectedAttrValues.length - 1; ii++) {

              testArr.push(selectedAttrValues[ii])

            }

            testArr.push(attrEl.attr_value_id)

            for (var i = 0; i < this.data.skus.length; i++) {

              if (utils.arrayValuesMatch(this.data.skus[i].attrValueGroup, testArr)) {

                if (this.data.skus[i].stock == 0 || !this.data.skus[i].cities || this.data.skus[i].cities.indexOf(cityCode) < 0) {

                  attrEl.available = 0

                  attrEl.selected = 0

                } else {

                  attrEl.available = 1

                }

              }

            }

          })

        }
        

        for (var i = 0; i < this.data.skus.length; i++) {

          if (utils.arrayValuesMatch(this.data.skus[i].attrValueGroup, selectedAttrValues)) {

            var selectedSku = this.data.skus[i]

            selectedSku.sku_name = selectedSku.sku_name.replace(this.data.good.goods_name, '')

            this.setData({

              selectedSku: selectedSku,

              unitPrice: this.data.skus[i].price

            })

            var skuImage = this.data.skus[i].picture.trim()

            if (skuImage) {

              this.setData({

                sku_image: skuImage

              })

            }

            this.caculateTotal()

            break

          }

        }

      }

      this.setData({

        attrs: []

      })

      this.setData({

        attrs: attrs

      })

    },

    tapQuantity(evt) {

      var value = evt.detail.value

      if (isNaN(value) || value < 1) {

        // this.setData({

        //   quantity: 1

        // })

      } else {

        this.setData({

          quantity: parseInt(value)

        })

      }

      this.caculateTotal()

    },

    plus() {

      this.setData({

        quantity: this.data.quantity + 1

      })

      this.caculateTotal()

    },

    minus() {

      if (this.data.quantity <= 1) {

        return

      }

      this.setData({

        quantity: this.data.quantity - 1

      })

      this.caculateTotal()

    },

    noMove(evt) {


    },

    caculateTotal() {

      this.setData({

        total: (this.data.quantity * this.data.unitPrice).toFixed(2)

      })

    },

    buy(evt) {

      const that = this

      if (!that.data.selectedSku) {

        wx.showToast({

          title: '请选择规格！',

          icon: 'none'

        })

        return

      }

      var goodData = {

        token: app.storage.getToken(),

        goods_name: that.data.good.goods_name,

        goods_id: that.data.good.goods_id,

        sku_id: that.data.selectedSku.sku_id,

        sku_name: that.data.selectedSku.sku_name,

        price: that.data.selectedSku.price,

        num: that.data.quantity,

        tax_off_price: that.data.selectedSku.tax_off_price,

        goods_picture: encodeURIComponent(that.data.selectedSku.picture)

      }

      var urlParams = ''

      for (var key in goodData) {

        urlParams += key + '=' + goodData[key] + '&'

      }

      wx.navigateTo({

        url: '/pages/order/order?type=buy&' + urlParams,

      })

    },

    addToCart(evt) {

      const that = this

      if (!that.data.selectedSku) {

        wx.showToast({

          title: '请选择规格！',

          icon: 'none'

        })

        return

      }

      var cartData = {

        token: app.storage.getToken(),

        goods_id: that.data.good.goods_id,

        sku_id: that.data.selectedSku.sku_id,

        sku_name: that.data.selectedSku.sku_name,

        price: that.data.selectedSku.price,

        num: that.data.quantity,

        goods_picture: that.data.selectedSku.picture,

        city_code: app.storage.getLocation().city_code

      }

      app.crmApi(

        app.apiService.crm.addToCart,

        cartData,

        res => {

          if (res.data.ret == 200) {

            wx.showToast({

              title: '购物车添加成功！',

              icon: 'none'

            })

            that.cartCount()

            that.triggerEvent('cart_add_evt')

          }

        }

      )

    },

    cartCount() {

      const that = this

      app.crmApi(

        app.apiService.crm.cartCount,

        { token: app.storage.getToken() },

        res => {

          if (res.data.ret == 200) {

            that.triggerEvent('cartcountchange', res.data)

          }

        }

      )

    }

  }

})
