// pages/index/index.js
var app = getApp()

var utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    floorstatus: false,

    toScrollView: '',

    brandList: [

    ],

    location: {

      city: '',

      city_code: ''

    },

    hotLength: 0,

    currentTab: 0,

    tabs: [

      { tab_name: '首页', active: true },

      { tab_name: '促销活动', active: false },

      { tab_name: '智能下单', active: false }

    ],

    autoplay: true,

    tabDuration: 200,

    interval: 5000,

    duration: 500,

    indicatorDots: false,

    categories: [

    ],

    brands: [

    ],

    hotGoods: [

    ],

    ad: {
      img_path: 'http://p4qneajri.bkt.clouddn.com/new_pro.png'
    },

    reward: {
      img_path: 'http://p4qneajri.bkt.clouddn.com/reward.png'
    },

    displayGoods: [

    ],

    partners: [


    ],

    promotionGoods: [

      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' },
      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' },
      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' },
      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' },
      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' },
      { goods_name: '电脑线-熊猫', origin_price: '218', price: '195', cut_money: 13, 'banner': 'http://p4qneajri.bkt.clouddn.com/wire.jpg' }

    ],

    rushGoods: [
      { goods_name: '电脑线-熊猫', thumbnail: 'http://p4qneajri.bkt.clouddn.com/7ea4eae2f9ee2a662f9c9201c88a8eda_meitu_3.jpg', origin_price: '218', price: '195' },
      { goods_name: '电脑线-熊猫', thumbnail: 'http://p4qneajri.bkt.clouddn.com/7ea4eae2f9ee2a662f9c9201c88a8eda_meitu_3.jpg', origin_price: '218', price: '195' },
      { goods_name: '电脑线-熊猫', thumbnail: 'http://p4qneajri.bkt.clouddn.com/7ea4eae2f9ee2a662f9c9201c88a8eda_meitu_3.jpg', origin_price: '218', price: '195' },
      { goods_name: '电脑线-熊猫', thumbnail: 'http://p4qneajri.bkt.clouddn.com/7ea4eae2f9ee2a662f9c9201c88a8eda_meitu_3.jpg', origin_price: '218', price: '195' }
    ],

    timeItem: [
      { time: '10:00', active: true },
      { time: '12:00', active: false },
      { time: '14:00', active: false },
      { time: '16:00', active: false }
    ],

    layout: {
      hall: '选择厅',
      room: '选择房间',
      washroom: '选择卫生间',
      balcony: '选择阳台',
      kitchen: '选择厨房',
      style: '选择风格'
    },

    showPicker: false,

    selectedRoom: null,

    selectedHall: null,

    selectedBalcony: null,

    selectedWashroom: null,

    selectedKitchen: null,

    selectedStyle: null,

    selectedRoomIndex: [0],

    selectedHallIndex: [0],

    selectedBalconyIndex: [0],

    selectedWashroomIndex: [0],

    selectedKitchenIndex: [0],

    selectedStyleIndex: [0],

    hallItems: [

      { id: 1, attr_val: '1厅' },
      { id: 2, attr_val: '2厅' },
      { id: 3, attr_val: '3厅' }

    ],

    roomItems: [

      { id: 1, attr_val: '1房' },
      { id: 2, attr_val: '2房' },
      { id: 3, attr_val: '3房' },
      { id: 4, attr_val: '4房' },
      { id: 5, attr_val: '5房' }

    ],

    balconyItems: [

      { id: 1, attr_val: '1阳台' },
      { id: 2, attr_val: '2阳台' },
      { id: 3, attr_val: '3阳台' }

    ],

    kitchenItems: [

      { id: 1, attr_val: '1厨房' },
      { id: 2, attr_val: '2厨房' }

    ],

    washroomItems: [

      { id: 1, attr_val: '1卫生间' },
      { id: 2, attr_val: '2卫生间' },
      { id: 3, attr_val: '3卫生间' },
      { id: 4, attr_val: '4卫生间' }

    ],

    styles: [

      { id: 1, attr_val: '简约时尚' },
      { id: 2, attr_val: '低调奢华' },
      { id: 3, attr_val: '高端大气' }

    ],

    layouts: [],

    newBounFeched: true

  },

  measureArea: 0,

  searchInput: undefined,

  switchTab(evt) {

    var index = evt.currentTarget.dataset.idx

    var tabs = this.data.tabs

    tabs.forEach(tab => {

      tab.active = false

    })

    tabs[index].active = true

    this.setData({

      tabs: tabs,

      currentTab: index

    })

  },

  getLocation() {

    var that = this

    wx.getLocation({

      type: 'gcj02',

      success: function (res) {

        var coor = {

          lat: res.latitude,

          lon: res.longitude

        }

        that.setData({

          coordinates: coor,

          location: app.storage.getLocation()

        })

        that.getAddr(res)

        this.getGoodsBrand()

        this.getIndexGoods()

        this.getBannerList()

        this.getLayouts()

      }

    })

  },

  getAddr: function (e) {

    var that = this;

    var data = {

      latitude: e.latitude,

      longitude: e.longitude

    }

    app.crmApi(

      app.apiService.crm.getAddress,

      data,

      res => {

        if (res.data.ret == 200) {

          var location = {}

          if (res.data.data.district_code == '330226') {

            location.city = res.data.data.district

            location.city_code = res.data.data.district_code

          } else {

            location.city = res.data.data.city

            location.city_code = res.data.data.city_code

          }

          that.setData({

            location: location,

            loadingLocation: false

          })

          that.getBannerList()

          that.getGoodsBrand()

          app.storage.setLocation(location)

        }

      }

    )

  },

  /**
   * 获取品牌列表
   */
  getGoodsBrand() {

    const that = this

    app.crmApi(

      app.apiService.crm.goodBrandList,

      { index_show: 1, city_code: that.data.location.city_code },

      res => {

        that.setData({

          partners: res.data.data.list

        })

      }

    )

  },

  getLayouts() {

    app.crmApi(

      app.apiService.crm.houseLayoutAll,

      {},

      res => {

        if (res.data.ret == 200) {

          var layouts = res.data.data

          this.setData({

            layouts: layouts,

            hallItems: layouts[0].attrs,

            roomItems: layouts[1].attrs,

            washroomItems: layouts[2].attrs,

            kitchenItems: layouts[3].attrs,

            balconyItems: layouts[4].attrs,

          })

        }

      }

    )

  },

  toClassify(evt) {

    app.categoryId = evt.currentTarget.dataset.id

    wx.switchTab({

      url: '/pages/classification/classification'

    })

  },

  toGoodDetail(evt) {

    wx.navigateTo({

      url: '/pages/goods/detail/detail?id=' + evt.currentTarget.dataset.id

    })

  },

  getIndexGoods() {

    const that = this

    app.crmApi(

      app.apiService.crm.getGoodsList,

      { index_show: 1, state: 1, token: app.storage.getToken(), page: 1, page_size: 16 },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            displayGoods: res.data.data.list

          })

        }

      }

    )

  },

  getHotGoods() {

    var that = this

    app.crmApi(

      app.apiService.crm.hotGoods,

      { city_code: that.data.location.city_code },

      res => {

        that.setData({

          hotGoods: res.data.data.list,

          hotLength: res.data.data.list.length * 210

        })

      }

    )

  },

  getGoodsCategory() {

    const that = this

    app.crmApi(

      app.apiService.crm.getGoodsCategoryList,

      { index_show: 1 },

      res => {

        that.setData({

          categories: res.data.data

        })

      }

    )

  },

  /**
   * 切换标签页
   */
  changeTab(evt) {

    var tabs = this.data.tabs

    var index = evt.detail.current

    tabs.forEach(tab => {

      tab.active = false

    })

    tabs[index].active = true

    this.setData({

      tabs: tabs,

      currentTab: index

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getGoodsCategory()

    this.getHotGoods()

    this.searchInput = this.selectComponent('#search')

  },

  getBannerList() {

    const that = this

    app.crmApi(

      app.apiService.crm.brandServiceList,

      { city_code: that.data.location.city_code },

      res => {

        if (res.data.ret == 200) {

          var imgs = []

          res.data.data.forEach(ele => {

            ele.url = ele.url.replace(/\\/g, '')

            imgs.push(ele)

          })

          that.setData({

            brandList: imgs

          })

        }

      }

    )

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

    this.checkFetched()

    var location = app.storage.getLocation()

    if (location) {

      this.setData({

        location: location

      })

      this.getGoodsBrand()

      this.getIndexGoods()

      this.getBannerList()

      this.getLayouts()

    } else {

      this.getLocation()

    }

    this.searchInput.setLocation()

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

  toDetail(evt) {


  },

  scrollLsn(evt) {

    if (evt.detail.scrollTop > 10) {

      this.setData({

        floorstatus: true

      })

    } else {

      this.setData({

        floorstatus: false

      })

    }

  },

  toTop() {

    this.setData({

      toScrollView: 'top_view'

    })

  },

  switchTime(evt) {

    var index = evt.currentTarget.dataset.idx

    var times = this.data.timeItem

    times.forEach(time => {

      time.active = false

    })

    times[index].active = true

    this.setData({

      timeItem: times

    })

  },

  toNext() {

    var idArr = []

    if (!this.data.selectedRoom) {

      wx.showToast({

        icon: 'none',

        title: '房间必须选择！'

      })

      return

    }
    if (!this.data.selectedHall) {

      wx.showToast({

        icon: 'none',

        title: '厅必须选择！'

      })

      return

    }
    if (!this.data.selectedBalcony) {

      wx.showToast({

        icon: 'none',

        title: '阳台必须选择！'

      })

      return

    }
    if (!this.data.selectedWashroom) {

      wx.showToast({

        icon: 'none',

        title: '卫生间必须选择！'

      })

      return

    }
    if (!this.data.selectedKitchen) {

      wx.showToast({

        icon: 'none',

        title: '厨房必须选择！'

      })

      return

    }

    if (!this.measureArea) {

      wx.showToast({

        title: '面积必须填写！',

        icon: 'none'

      })

      return

    }

    idArr.push(this.data.selectedRoom.id)

    idArr.push(this.data.selectedHall.id)

    idArr.push(this.data.selectedBalcony.id)

    idArr.push(this.data.selectedWashroom.id)

    idArr.push(this.data.selectedKitchen.id)

    idArr.sort()

    var ids = idArr.join(',')

    wx.navigateTo({

      url: '/pages/order/smartOrder/construction?ids=' + ids + '&m=' + this.measureArea + '&sid=' + this.data.selectedStyle.id

    })

  },

  showSelector(evt) {

    var idx = evt.currentTarget.dataset.idx

    var pickerItems = []

    if (idx == 1) {

      this.data.roomItems.forEach(room => {

        pickerItems.push({

          name: room.attr_val,

          id: room.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedRoom

      })

    } else if (idx == 2) {

      this.data.hallItems.forEach(hall => {

        pickerItems.push({

          name: hall.attr_val,

          id: hall.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedHall

      })

    } else if (idx == 3) {

      this.data.kitchenItems.forEach(kitchenItem => {

        pickerItems.push({

          name: kitchenItem.attr_val,

          id: kitchenItem.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedKitchen

      })

    } else if (idx == 4) {

      this.data.washroomItems.forEach(washroom => {

        pickerItems.push({

          name: washroom.attr_val,

          id: washroom.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedWashroom

      })

    } else if (idx == 5) {

      this.data.balconyItems.forEach(balcony => {

        pickerItems.push({

          name: balcony.attr_val,

          id: balcony.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedBalcony

      })

    } else if (idx == 6) {

      this.data.styles.forEach(style => {

        pickerItems.push({

          name: style.attr_val,

          id: style.id

        })

      })

      this.setData({

        pickerIndex: this.data.selectedStyle

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

  pickerChange(evt) {

    var idx = evt.detail.value[0]

    if (this.data.pickerType == 1) {

      this.setData({

        selectedRoom: this.data.roomItems[idx],

        selectedRoomIndex: [idx]

      })

    } else if (this.data.pickerType == 2) {

      this.setData({

        selectedHall: this.data.hallItems[idx],

        selectedHallIndex: [idx]

      })

    } else if (this.data.pickerType == 3) {

      this.setData({

        selectedKitchen: this.data.kitchenItems[idx],

        selectedKitchenIndex: [idx]

      })

    } else if (this.data.pickerType == 4) {

      this.setData({

        selectedWashroom: this.data.washroomItems[idx],

        selectedWashroomIndex: [idx]

      })

    } else if (this.data.pickerType == 5) {

      this.setData({

        selectedBalcony: this.data.balconyItems[idx],

        selectedBalconyIndex: [idx]

      })

    } else if (this.data.pickerType == 6) {

      this.setData({

        selectedStyle: this.data.styles[idx],

        selectedStyleIndex: [idx]

      })

    }

  },

  cancelSelector() {

    this.setData({

      showPicker: false

    })

  },

  finishSelector() {

    if (this.data.pickerType == 1 && !this.data.selectedRoom) {

      this.setData({

        selectedRoom: this.data.roomItems[0],

        selectedRoomIndex: [0]

      })

    } else if (this.data.pickerType == 2 && !this.data.selectedHall) {

      this.setData({

        selectedHall: this.data.hallItems[0],

        selectedHallIndex: [0]

      })

    } else if (this.data.pickerType == 3 && !this.data.selectedKitchen) {

      this.setData({

        selectedKitchen: this.data.kitchenItems[0],

        selectedKitchenIndex: [0]

      })

    } else if (this.data.pickerType == 4 && !this.data.selectedWashRoom) {

      this.setData({

        selectedWashroom: this.data.washroomItems[0],

        selectedWashroomIndex: [0]

      })

    } else if (this.data.pickerType == 5 && !this.data.selectedBalcony) {

      this.setData({

        selectedBalcony: this.data.balconyItems[0],

        selectedBalconyIndex: [0]

      })

    } else if (this.data.pickerType == 6 && !this.data.selectedStyle) {

      this.setData({

        selectedStyle: this.data.styles[0],

        selectedStyleIndex: [0]

      })

    }

    this.setData({

      showPicker: false

    })

  },

  inputMeasureArea(evt) {

    this.measureArea = evt.detail.value

  },

  getNewBoun() {

    wx.showLoading({

      title: '请稍等'

    })

    app.crmApi(

      app.apiService.crm.getNewBoun,

      {

        token: app.storage.getToken(),

        sequence: utils.randStr(12)

      },

      res => {

        wx.hideLoading()

        if (res.data.ret == 200 && res.data.data > 0) {

          wx.showModal({

            title: '恭喜您',

            content: '新手礼包领取成功！',

            confirmText: '查看',

            cancelText: '取消',

            success: function (res) {

              if (res.confirm) {

                wx.navigateTo({

                  url: '/pages/userCenter/coupon/coupon'

                })

              }

            }

          })

          this.setData({

            newBounFeched: true

          })

        } else if (res.data.data === false) {

          wx.showToast({

            icon: 'none',

            title: '您已经领取过了！'

          })

          this.setData({

            newBounFeched: true

          })

        } else {

          wx.showModal({

            title: '发生错误！',

            content: '领取失败，请联系管理员！'

          })

        }

      }

    )

  },

  checkFetched() {

    var that = this

    app.crmApi(

      app.apiService.crm.checkFetched,

      { token: app.storage.getToken() },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            newBounFeched: res.data.data

          })

        }

      }

    )

  }

})