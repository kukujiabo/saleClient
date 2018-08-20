// pages/cart/cart.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    goods: [],

    cart_total: 0.00,

    selectedAll: false,

    selectedGoods: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

    this.getCarts()
  
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

  toIndex() {

    wx.switchTab({

      url: '/pages/index/index'

    })

  },

  addnum(evt) {

    var that = this

    var index = evt.target.dataset.idx

    var goods = that.data.goods

    var num = parseInt(goods[index].num)

    var data = {

      token: app.storage.getToken(),

      cart_id: goods[index].cart_id,

      num: num + 1

    }

    app.crmApi(

      app.apiService.crm.updateCart,

      data,

      res => {

        if (res.data.ret == 200) {

          goods[index].num = num + 1

          that.setData({

            goods: goods

          })

          that.calculate()

        } else {

          wx.showToast({

            title: '修改失败，请检查您的网络！',

            icon: 'none'

          })

        }

      }

    )

  },

  minusnum(evt) {

    var that = this

    var index = evt.target.dataset.idx

    var goods = that.data.goods

    var num = goods[index].num

    if (num <= 1) {

      return

    }

    var data = {

      token: app.storage.getToken(),

      cart_id: goods[index].cart_id,

      num: num - 1

    }

    app.crmApi(

      app.apiService.crm.updateCart,

      data,

      res => {

        if (res.data.ret == 200) {

          goods[index].num = num - 1

          that.setData({

            goods: goods

          })

          that.calculate()

        } else {

          wx.showToast({

            title: '修改失败，请检查您的网络！',

            icon: 'none'

          })

        }

      }

    )

  },

  removeCartItem(evt) {

    const that = this

    var index = evt.target.dataset.idx

    var goods = that.data.goods

    var good = goods[index]
    
    wx.showModal({

      title: '提示',

      content: '您确定删除商品 ' + good.goods_name + ' 吗？',

      success: val => {

        if (val.confirm) {

          app.crmApi(

            app.apiService.crm.removeCartGood,

            {

              token: app.storage.getToken(),

              cart_id: good.cart_id

            },
            
            res => {

              if (res.data.ret == 200 && res.data.data == 1) {

                wx.showToast({

                  title: '删除成功！',

                })

                that.getCarts()

              } else {

                wx.showToast({

                  title: '删除失败！'

                })

              }

            }

          )
          
        }

      }

    })

  },

  inputNum(evt) {

    var index = evt.currentTarget.dataset.index

    var value = evt.detail.value
    
    var goods = this.data.goods

    var that = this

    var data = {

      token: app.storage.getToken(),

      cart_id: goods[index].cart_id,

      num: value

    }

    app.crmApi(

      app.apiService.crm.updateCart,

      data,

      res => {

        goods[index].num = value

        that.setData({

          goods: goods

        })

        that.calculate()

      }
    
    )

  },

  getCarts() {

    const that = this

    app.crmApi(

      app.apiService.crm.cartList,

      {

        token: app.storage.getToken()

      },

      res => {

        if (res.data.ret == 200) {

          var goods = res.data.data

          var selectedGoods = []

          goods.forEach(good => {

            good.sku_name = good.sku_name.replace(good.goods_name, '')

            selectedGoods.push(true)

          })

          that.setData({

            goods: goods,

            selectedGoods: selectedGoods

          })

          that.calculate()

        }

      }

    )

  },

  calculate() {

    var total = 0

    this.data.goods.forEach(el => {

      total += el.price * el.num

    })

    this.setData({

      cart_total: total.toFixed(2)

    })

  },

  toOrder(evt) {

    var selectedGoods = this.data.selectedGoods

    var selectedIds = []

    selectedGoods.forEach((selected, index) => {

      if (selected) {

        selectedIds.push(this.data.goods[index].sku_id)

      }

    })

    if (selectedIds.length == 0) {

      wx.showModal({

        title: '错误！',
        
        content: '请至少选择一个商品再结算！'
      
      })

      return

    }

    wx.navigateTo({

      url: '/pages/order/order?type=cart&selected_id=' + selectedIds.join(',')
      
    })

  },

  clearSelected(evt) {

    var that = this

    if (!this.data.selectedAll) {

      wx.showModal({
        
        title: '提示',

        content: '请先选择商品！',
        
      })

    } else {

      wx.showModal({

        title: '提示',

        content: '您确定删除选中商品吗？',

        complete: sign => {

          if(sign.confirm) {

            var selectedData = []

            that.data.selectedGoods.forEach((good, index) => {

              if (good) {

                selectedData.push(that.data.goods[index].cart_id)

              }

            })

            app.crmApi(

              app.apiService.crm.removeCartSelectedGoods,

              { token: app.storage.getToken(), cart_id: selectedData.join(',') },

              res => {

                if (res.data.ret == 200) {

                  that.getCarts()

                }

              }

            )

          }

        }

      })

    }

  },

  selectGood(evt) {

    var index = evt.currentTarget.dataset.idx

    var selectedGoods = this.data.selectedGoods

    selectedGoods[index] = !selectedGoods[index]

    this.setData({

      selectedGoods: selectedGoods

    })

  },

  checkAll(evt) {

    var selectedAll = this.data.selectedAll

    var selectedGoods = this.data.selectedGoods

    if (selectedAll) {

      this.setData({

        selectedAll: false,

        selectedGoods: selectedGoods.map(function () { return false })

      })

    } else {

      this.setData({

        selectedAll: true,

        selectedGoods: selectedGoods.map(function() { return true })

      })

    }

  }

})