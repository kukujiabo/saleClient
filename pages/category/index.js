// pages/category/index.js
var app = getApp()
var utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    subCategories: [],
    subSubCategories: [],
    goods: [],
    currentId: '',
    subCurrentId: '',
    subSubCurrentId: '',
    scrollX: true,
    scrollY: true,
    goodsLoading: true,
    subCurrentId: '',
    subSubCurrentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //this.getCategories()

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

    this.getCategories()

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
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  getCategories() {

    const that = this

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

          

          that.setData({

            categories: cascadeCategories,

            currentId: selectedId,

            subCategories: currentCategory.subs,

            subCurrentId: selectedSecondId,

            subSubCategories: currentSubCategory.subs ? currentSubCategory.subs : []

          })

          this.getGoods(selectedSecondId)

        }

      }

    )

  },

  getGoods(categoryId) {

    const that = this

    that.setData({

      goodsLoading: true

    })

    app.crmApi(

      app.apiService.crm.getGoodsList,

      { category_id: categoryId, state: 1, token: app.storage.getToken(), page_size: 50 },

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 点击选择分类
   */
  chooseCategory(evt) {

    this.setData({

      currentId: evt.currentTarget.dataset.id,

      goods: []

    })

    this.getGoods(evt.currentTarget.dataset.id)

  },

  toDetail(evt) {

    var id = evt.currentTarget.dataset.id

    wx.navigateTo({

      url: '/pages/goods/detail/detail?id=' + id

    })

  },

  chooseFirstCategory(evt) {

    var index = evt.currentTarget.dataset.index

    var id = evt.currentTarget.dataset.id

    app.categoryId = id

    this.setData({

      currentId: evt.currentTarget.dataset.id,

      subCategories: this.data.categories[index].subs,

      subCurrentId: this.data.categories[index].subs[0].category_id,

      subSubCategories: this.data.categories[index].subs[0].subs || [],

      goods: []

    })

    this.getGoods(this.data.categories[index].subs[0].category_id)

  },

  chooseSecondCategory(evt) {

    var index = evt.currentTarget.dataset.index

    var id = evt.currentTarget.dataset.id

    app.secondCategoryId = id

    this.setData({

      subCurrentId: id,

      subSubCurrentId: '',

      subSubCategories: this.data.subCategories[index].subs

    })

    this.getGoods(id)

  },

  chooseThirdCategory(evt) {

    var id = evt.currentTarget.dataset.id

    if (this.data.subSubCurrentId == id) {

      this.setData({

        subSubCurrentId: ''

      })

      this.getGoods(this.data.subCurrentId)

    } else {

      this.setData({

        subSubCurrentId: id

      })

      this.getGoods(id)

    }

  },

  toSearch() {

    wx.navigateTo({

      url: '/pages/goods/list/list'

    })

  }

})