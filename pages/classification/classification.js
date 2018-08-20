var app = getApp()

var utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    menus: [

    ],

    subCategories: [],

    menuWidth: 1000,

    brands: [{ brand_name: '全部品牌', id: '' }],

    currentId: '',

    subCurrentId: '',

    goods: [

    ],

    showPicker: false,

    primaryId: '',

    cartCnt: 0,

    selectedBrandIdx: [0],

    selectedBrand: '',

    selectedSignature: '',

    selectedSignatureIdx: [0],

    signatures: [{ 'signature': '全部类别', id: '' }],

    pickerType: '',

    pickerItems: [],

    pickerIndex: [0]

  },

  selectInput: undefined,

  goodsStandard: undefined,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.selectInput = this.selectComponent('#search')

    this.goodsStandard = this.selectComponent('#goods_standard')

    this.getAllBrands({})

    this.getAllSignatures()  

    this.setData({

      selectedBrand: this.data.brands[0],

      selectedSignature: this.data.signatures[0]

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

    this.selectInput.setLocation(),

    this.getCartCount()

    this.getCategories(app.categoryId)

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

  switchFirstClass(evt) {

    var index = evt.currentTarget.dataset.idx

    var menus = this.data.menus

    menus.forEach(menu => {

      menu.active = false

    })

    menus[index].active = true

    this.setData({

      menus: menus

    })

    this.setCurrentSecondClass(menus[index].subs)

    this.getGoods(menus[index].subs[0].category_id)

    app.categoryId = menus[index].category_id

    this.setData({

      subCurrentId: menus[index].subs[0].category_id,

      currentId: menus[index].category_id

    })

  },


  setCurrentSecondClass(classArray) {

    this.setData({

      subCategories: classArray

    })

  },

  switchSecondClass(evt) {

    var index = evt.currentTarget.dataset.idx

    var secondClasses = this.data.subCategories

    secondClasses.forEach(subCls => {

      subCls.active = false

    })

    secondClasses[index].active = true

    this.setData({

      subCategories: secondClasses

    })

    this.getGoods(secondClasses[index].category_id)

    this.setData({

      subCurrentId: secondClasses[index].category_id

    })

  },

  getAllBrands(params) {

    const that = this

    app.crmApi(

      app.apiService.crm.getAllBrands,

      params,

      res => {

        if (res.data.ret == 200) {

          that.setData({

            brands: that.data.brands.concat(res.data.data)

          })

        }

      }

    )

  },

  cancelSelector() {

    this.setData({

      showPicker: false

    })

  },

  finishSelector() {

    this.setData({

      showPicker: false

    })

    this.getGoods(this.data.subCurrentId)

  },

  showSelector(evt) {

    var idx = evt.currentTarget.dataset.idx

    var pickerItems = []

    if (idx == 1) {

      this.data.signatures.forEach(signature => {

        pickerItems.push({

          name: signature.signature,

          id: signature.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedSignatureIdx

      })

    } else if (idx == 2) {

      this.data.brands.forEach(brand => {

        pickerItems.push({

          name: brand.brand_name,

          id: brand.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedBrandIdx

      })

    }

    this.setData({

      pickerItems: pickerItems,

      pickerType: idx

    })

    this.setData({

      showPicker: true

    })

  },

  getCategories() {

    const that = this

    if (app.categoryId == that.data.currentId && app.categoryId) {

      return;

    }

    app.crmApi(

      app.apiService.crm.getGoodsCategoryList,

      { all: 1 },

      res => {

        if (res.data.ret == 200 && Array.isArray(res.data.data)) {

          var categories = res.data.data

          var cascadeCategories = []

          var subCascadeCategories = []

          categories.forEach(category => {

            if (!category.pid) {

              category.active = false

              if (category.category_id == app.categoryId) {

                category.active = true

              }

              cascadeCategories.push(category)

            } else {

              subCascadeCategories.push(category)

            }

          })

          cascadeCategories.forEach(category => {

            subCascadeCategories.forEach(subCategory => {

              if (!subCategory.subs || subCategory.subs.length == 0) {

                subCascadeCategories.forEach(subsubCategory => {

                  if (subsubCategory.pid == subCategory.category_id) {

                    if (!subCategory.subs) {

                      subCategory.subs = []

                    }

                    if (utils.inArray(subsubCategory, subCategory.subs) > 0) {

                      return

                    }

                    subCategory.subs.push(subsubCategory)

                  }

                })

              }

              if (subCategory.pid == category.category_id) {

                if (!category.subs) {

                  category.subs = []

                }

                category.subs.push(subCategory)

              }

            })

          })

          var currentCategory

          var selectedId = app.categoryId ? app.categoryId : cascadeCategories[0].category_id

          cascadeCategories.forEach(category => {

            if (category.category_id == selectedId) {

              currentCategory = category

            }

          })

          var selectedSecondId = app.secondCategoryId ? app.secondCategoryId : currentCategory.subs[0].category_id

          var currentSubCategory

          currentCategory.subs.forEach(subCategory => {

            if (subCategory.category_id == selectedSecondId) {

              currentSubCategory = subCategory

            }

          })

          if (!app.categoryId) {

            cascadeCategories[0].active = true

          }

          that.setData({

            menuWidth: cascadeCategories.length * 165

          })

          that.setData({

            menus: cascadeCategories,

            currentId: selectedId,

            subCategories: currentCategory.subs,

            subCurrentId: selectedSecondId,

            subSubCategories: currentSubCategory.subs ? currentSubCategory.subs : []

          })

          that.getGoods(selectedSecondId)

        }

      }

    )

  },

  toCart() {

    wx.switchTab({

      url: '/pages/cart/cart'

    })

  },

  getGoods(categoryId) {

    const that = this

    that.setData({

      goodsLoading: true

    })

    var params = { category_id: categoryId, state: 1, token: app.storage.getToken(), page_size: 50, brand_id: that.data.selectedBrand.id }

    if (that.data.selectedSignature.id) {

      params.signature = that.data.selectedSignature.signature

    }

    app.crmApi(

      app.apiService.crm.getGoodsList,

      params,

      res => {

        if (res.data.ret == 200) {

          that.setData({

            goodsLoading: false

          })

          if (Array.isArray(res.data.data.list) && res.data.data.list.length > 0) {

            that.setData({

              goods: res.data.data.list

            })

          } else {

            that.setData({

              goods: []

            })

          }

        }

      }

    )

  },

  toGoodDetail(evt) {

    wx.navigateTo({

      url: '/pages/goods/detail/detail?id=' + evt.currentTarget.dataset.id

    })

  },

  getCartCount() {

    const that = this

    app.crmApi(

      app.apiService.crm.cartCount,

      { token: app.storage.getToken() },

      res => {

        that.setData({

          cartCnt: res.data.data

        })

      }

    )

  },

  showStandard(evt) {

    var id = evt.currentTarget.dataset.id

    var idx = evt.currentTarget.dataset.idx

    const that = this

    that.goodsStandard.setGood(this.data.goods[idx])

    app.crmApi(

      app.apiService.crm.getAttrValues,

      { goods_id: id },

      res => {

        if (res.data.ret == 200) {

          that.goodsStandard.setAttrs(res.data.data)

          that.goodsStandard.show(2)

        }

      }

    )

    app.crmApi(

      app.apiService.crm.getSkuGoods,

      { goods_id: id },

      res => {

        if (res.data.ret == 200) {

          console.log(res.data.data)

          that.goodsStandard.setSkuGood(res.data.data)

        }

      }

    )

  },

  pickerChange(evt) {

    var idx = evt.detail.value[0]

    if (this.data.pickerType == 2) {

      var brand = this.data.brands[idx]

      var selectedBrandIdx = [idx]

      this.setData({

        selectedBrand: brand,

        selectedBrandIdx: selectedBrandIdx

      })

    } else {

      var signature = this.data.signatures[idx]

      var selectedSignatureIdx = [idx]

      this.setData({

        selectedSignature: signature,

        selectedSignatureIdx: selectedSignatureIdx

      })

    }

  },

  cartCountListener(evt) {

    this.getCartCount()

  },

  getAllSignatures() {
    
    const that = this

    app.crmApi(

      app.apiService.crm.getAllSignatures,

      {},

      res => {

        if (res.data.ret == 200) {

          var signatures = that.data.signatures

          res.data.data.forEach(signature => {

            signatures.push(signature)

          })

          that.setData({

            signatures: signatures

          })

        }

      }

    )
  
  }
 
})