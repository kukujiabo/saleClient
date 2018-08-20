var app = getApp()
Page({
  data:
   {
    brands: [],
    categories: [],
    goods: [],
    loadingLocation: true,
    floorstatus: false,
    coordinates: {
      lat: '',
      lon: ''
    },
    location: {
      city: '',
      city_code: ''
    },
    brandList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },

  toTop() {

    wx.pageScrollTo({

      scrollTop: 0

    })

  },

  onLoad(options) {

    this.waveLoading = this.selectComponent('#wave')

    this.getGoodsCategory()

    var location = app.storage.getLocation()

    if (location) {

      this.setData({

        location: location,

        loadingLocation: false 

      })

      this.getLocation()

    } else {

      this.setData({

        loadingLocation: true

      })

      this.getLocation()

    }

  },

  onShow() {

    var location = app.storage.getLocation()

    if (location) {

      this.setData({

        location: location

      })

      this.getBannerList()

      this.getIndexGoods()

      this.getGoodsBrand()

    }

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

          coordinates: coor

        })

        that.getAddr(res)

      },

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

  getGoodsBrand() {

    const that = this

    app.crmApi(

      app.apiService.crm.goodBrandList,

      { index_show: 1, city_code: that.data.location.city_code },

      res => {

        that.setData({

          brands: res.data.data.list
          
        })

      }

    )

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

  changeIndicatorDots(e) {

    this.setData({
      
      indicatorDots: !this.data.indicatorDots

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

            goods: res.data.data.list

          })

        }

      }

    )

  },

  toCategory(evt) {

    app.categoryId = evt.currentTarget.dataset.id

    app.secondCategoryId = null

    wx.switchTab({

      url: '/pages/category/index' 

    })

  },

  goSearch(evt) {

    var value = evt.detail.value

    wx.navigateTo({

      url: '/pages/goods/list/list?name=' + value

    })

  },

  toCityList() {

    wx.navigateTo({

      url: '/pages/location/city/city'

    })

  },

  onPageScroll: function (e) {

    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }

  },

  toDetail(evt) {

    var link = evt.currentTarget.dataset.link

    var ty = evt.currentTarget.dataset.type

    if (ty == 1) {

      wx.navigateTo({
    
        url: '/pages/goods/detail/detail?id=' + link

      })

    }

  }

})