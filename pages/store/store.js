var tcity = require("../../utils/citys.js");
const page_code = 'wxpro_crm_store_banner';
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeList: [],//门店列表
    norecord: false,//暂无记录
    page: 1, //下一个页码
    page_count: 0, //总页码数
    page_num: 6, //每页显示条数
    nomore: false,//已加载所有
    location: '',//当前位置
    coordinates: '',//当前坐标
    district_id: '',//区域id
    provinces: [],
    province: "请选择省",
    citys: [],
    city: "请选择城市",
    countys: [],
    county: '区域选择',
    phone: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    valueCounty: [0],//地区
    condition: false,
    conditionCounty: false,
    name: '',
    address_id: 0,
    provinceId: undefined,
    cityId: undefined,
    areaId: undefined,
    in_detail: '',
    is_default: true,
    rty: false,
    address_info: [],
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    cityData: [],
    is_switch: true,//开关
    page_configs: {
      store_banner: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.loadingWave = that.selectComponent('#wave')

    that.dialog = that.selectComponent('#dialog')

    that.page_config()

    that.location()

    that.getArea()

  },

  /**
   * 查询行政区数据
   */
  getArea() {

    var addrData = app.storage.getAddrRoom()

    if (!addrData) {

      app.crmApi(

        app.apiService.crm.getAddrRoom,

        {},

        res => {

          if (res.data.ret == 200) {

            var areaData = res.data.data

            this.makeUpAddress(areaData)

            app.storage.setAddrRoom(areaData)

          }

        }

      )

    } else {

      this.makeUpAddress(addrData)

    }

  },

  /**
   * 获取当前手机位置
   */
  location: function () {

    var that = this;

    wx.getLocation({

      type: 'gcj02', //返回可以用于wx.openLocation的经纬度

      success: function (res) {

        var coor = {

          lat: res.latitude,

          lon: res.longitude

        }

        that.setData({

          coordinates: coor

        })

        that.storeList(1, that.data.page, that.data.page_num, coor)

        that.getAddr(res);

      },
      fail: function () {

        that.setData({

          coordinates: ""

        })

        that.dialog.showDialog({ title: '定位失败！', content: '请手动选择您的为止' })

      }

    })

  },

  /**
   * 点外卖链接
   */
  takeoutTap: function (e) {

    var that = this;

    var list = that.data.storeItem//所有的列表

    var idx = e.currentTarget.dataset.idx//当前索引

    var shopInfo = JSON.stringify(list[idx]) //当前的内容

    wx.navigateTo({

      url: '/pages/takeout/shop/shop?shopInfo=' + shopInfo

    })

  },
  /**
   * 可配置项（logo）
   */
  page_config: function () {

    var that = this;

    app.crmApi(

      app.apiService.crm.pageConfig,

      { page_code: page_code },

      that.pageConfigSuccess,

    )

  },

  pageConfigSuccess: function (res) {

    var that = this

    const config = res.data.data[page_code].configs

    var tmpConfig = that.data.page_configs

    for (let k in tmpConfig) {

      tmpConfig[k] = config[k].value_type == 2 ? config[k].value_text : config[k].value
    }

    that.setData({

      page_configs: tmpConfig

    })

  },

  /**
   * 默认地址接口获取
   */
  getAddr: function (e) {
    var that = this;
    var data = {
      latitude: e.latitude,
      longitude: e.longitude
    }
    app.crmApi(
      app.apiService.crm.getAddress,
      data,
      that.getAddrSuccess,
      that.getAddrFail
    )
  },
  getAddrSuccess: function (res) {

    var that = this;

    var info = res.data.data

    if (res.data.ret == 200) {
      that.setData({
        location: info,
        city: info.city,
        county: info.district,
        province: info.province,//每个省份的名字
        provinceId: info.province_code,//每个省份的code
        city: info.city,//每个市的默认第一个名字
        cityId: info.city_code,//每个市的默认第一个code
        county: info.district,//每个区的默认第一个名字
        countyId: info.district_code,//每个区的默认第一个code
      })
    }

    var addrData = app.storage.getAddrRoom()

    that.makeUpAddress(addrData)

  },
  getAddrFail: function () {

  },
  /**
   * tab
   */
  tabFun: function (e) {
    //获取触发事件组件的dataset属性
    // var id = e.target.dataset.id;
    // var obj = {};
    // obj.curHdIndex = id;
    // obj.curBdIndex = id;

    // this.setData({
    //     tabArr: obj
    // });
  },

  /**
   * 拨打电话
   */
  makePhoneCall: function (e) {
    var that = this;
    var list = that.data.storeItem;
    var idx = e.currentTarget.dataset.idx
    var phone = list[idx].phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
        }
      })
    }
  },

  /**
   * 打开地图
   */
  openMap: function (e) {
    var that = this;
    var list = that.data.storeItem;
    var idx = e.currentTarget.dataset.idx
    var lon = parseFloat(list[idx].lon);
    var lat = parseFloat(list[idx].lat);
    var address = list[idx].address
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: lat,
          longitude: lon,
          scale: 28,
          name: address
        })
      }
    })
  },
  /**
   * 三级联动的蒙版
   */
  tapCitymask: function () {
    var that = this;
    that.setData({
      condition: !that.data.condition,
    })
  },
  tapCountymask: function () {
    var that = this;
    that.setData({
      conditionCounty: !that.data.conditionCounty
    })
  },

  bindChange: function (e) {
    var that = this
    var val = e.detail.value
    var t = that.data.values
    var cityData = that.data.cityData;
    var address_info = that.data.address_info
    if (val[0] != t[0]) {
      const citys = []
      const countys = []
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }
      address_info['province']['code'] = cityData[val[0]].code
      address_info['province']['name'] = cityData[val[0]].name
      address_info['city']['code'] = cityData[val[0]].sub[0].code
      address_info['city']['name'] = cityData[val[0]].sub[0].name
      address_info['county']['code'] = cityData[val[0]].sub[0].sub[0].code
      address_info['county']['name'] = cityData[val[0]].sub[0].sub[0].name
      this.setData({
        citys: citys,
        countys: countys,
        values: [val[0], 0, 0],
        valueCounty: [0],
        value: [val[0], 0, 0],
        address_info: address_info
      })
      return;
    }
    if (val[1] != t[1]) {
      const countys = []
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      address_info['city']['code'] = cityData[val[0]].sub[val[1]].code
      address_info['city']['name'] = cityData[val[0]].sub[val[1]].name
      address_info['county']['code'] = cityData[val[0]].sub[val[1]].sub[0].code
      address_info['county']['name'] = cityData[val[0]].sub[val[1]].sub[0].name
      this.setData({
        countys: countys,
        values: val,
        valueCounty: [0],
        value: [val[0], val[1], 0],
        address_info: address_info
      })
      return;
    }
  },
  open: function (e) {
    var that = this
    var areaStore = {
      condition: !this.data.condition,
    }

    //点击弹框的确定按钮
    if (e.target.dataset.name == 2) {
      var address_info = that.data.address_info
      areaStore.province = address_info['province']['name']
      areaStore.provinceId = address_info['province']['code']
      areaStore.city = address_info['city']['name']
      areaStore.cityId = address_info['city']['code']
      areaStore.county = address_info['county']['name']
      areaStore.countyId = address_info['county']['code']
    }
    that.setData(areaStore)

  },
  openCounty: function (e) {
    var that = this
    var id = e.target.dataset.id;
    var obj = {};
    obj.curHdIndex = id;
    obj.curBdIndex = id;
    this.setData({
      tabArr: obj
    });

    var areaStore = {
      conditionCounty: !this.data.conditionCounty,
    }
    if (e.target.dataset.name == 2) {
      var address_info = that.data.address_info
      areaStore.province = address_info['province']['name']
      areaStore.provinceId = address_info['province']['code']
      areaStore.city = address_info['city']['name']
      areaStore.cityId = address_info['city']['code']
      areaStore.county = address_info['county']['name']
      areaStore.countyId = address_info['county']['code']

      var districtId = address_info['county']['code']

      that.setData({
        district_id: districtId,
        page: 1
      })

      that.storeList(1, that.data.page, that.data.page_num, that.data.coordinates, districtId)

    }

    that.setData(areaStore)

  },

  bindChangeCounty: function (e) {
    var that = this
    var cityData = that.data.cityData;
    var address_info = that.data.address_info
    var values = that.data.values
    var county_key = e.detail.value
    address_info['county']['code'] = cityData[values[0]].sub[values[1]].sub[county_key].code
    address_info['county']['name'] = cityData[values[0]].sub[values[1]].sub[county_key].name

    this.setData({
      // county: address_info['county']['name'],
      // countyId: address_info['county']['code'],
      values: [values[0], values[1], county_key],
      value: [values[0], values[1], county_key],
      address_info: address_info,
      valueCounty: county_key
    })

  },

  /**
   * 门店跳转到详情链接
   */
  detailTap: function (e) {
    var that = this
    var list = that.data.storeItem//所有的列表
    var idx = e.currentTarget.dataset.idx//当前索引
    var data = JSON.stringify(list[idx]) //当前的内容
    wx.navigateTo({
      url: '/pages/store/detail/detail?data=' + data
    })
  },

  /**
   * 推荐排序
   */
  // recommendTap: function (e) {
  //     var that = this;
  //     var id = e.target.dataset.id;
  //     var obj = {};
  //     obj.curHdIndex = id;
  //     obj.curBdIndex = id;
  //     that.setData({
  //         tabArr: obj,
  //         coordinates: "",
  //         district_id: ""
  //     });
  //     that.storeList(1, that.data.page, that.data.page_num, "", "")
  // },
  /**
   * 据您最近
   */
  rangeTap: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var obj = {};
    obj.curHdIndex = id;
    obj.curBdIndex = id;

    that.setData({
      tabArr: obj,
      district_id: '',
      page: 1
    })

    if (that.data.coordinates) {

      that.storeList(1, that.data.page, that.data.page_num, that.data.coordinates)

    } else {

      wx.getSetting({

        success: (res) => {

          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权

            wx.showModal({

              title: '是否授权当前位置',

              content: '需要获取您的地理位置，请确认授权，否则“距您最近”将无法使用',

              success: function (res) {

                if (res.cancel) {

                } else if (res.confirm) {

                  wx.openSetting({

                    success: function (data) {

                      if (data.authSetting["scope.userLocation"] == true) {

                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 5000
                        })

                        that.location()

                      } else {

                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 5000
                        })

                      }

                    }

                  })

                }
              }

            })

          } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
            village_LBS(that);

          }
        }
      })

    }
  },

  /**
   * 附近门店列表接口获取
   */
  storeList: function (func, page, page_num, coordinates, district_id) {

    var that = this;

    that.loadingWave.showLoading()

    var data = {

      page: page,

      page_num: page_num,

    }
    if (coordinates) {

      data.lat = coordinates.lat

      data.lon = coordinates.lon

    }
    if (district_id) {

      data.district_id = district_id

    }
    var extraParams = {

      page: page, page_num: page_num, func: func

    }

    app.crmApi(

      app.apiService.crm.getNearByStores,

      data,

      that.storeListSuccess,

      that.storeListFail,

      extraParams

    )
  },

  /**
   * 附近门店列表接口获取 成功
   */
  storeListSuccess: function (res, params) {

    var that = this;

    that.loadingWave.hideLoading()

    that.setData({

      nomore: false

    })

    var page = params.page;
    var page_num = params.page_num;
    var func = params.func;
    var info = res.data.data
    var phone = info.phone;

    // 接口成功的时候重新赋值
    if (res.data.ret = 200) {
      // 总条数为0或者未定义时
      if (info.records == 0 || !info.records) {
        that.setData({
          storeItem: false
        })
        return
      }
      // 计算出的总页码，Math.ceil向上取整
      var page_count = Math.ceil(info.records / params.page_num)
      var newData = res.data.data.data;
      /**
       * m和km的转换
       */
      if (newData) {
        var distance = []
        for (var i = 0; i < newData.length; i++) {
          distance[i] = newData[i].distance;
          var dist = distance[i];
          if (dist > 1000) {
            dist = parseFloat(dist / 1000).toFixed(3) + "km"
            newData[i].distance = dist;
          }
          else {
            dist = parseFloat(dist).toFixed(3) + "m"
            newData[i].distance = dist;
          }
        }
      }
      // 页码数大于计算出的页码数和没有数据的情况
      if (params.page > page_count || !newData) {
        return
      }
      that.setData({
        page: page,
        page_count: page_count
      })
      // 加载
      if (func == 3) {
        var oldData = that.data.storeItem
        that.setData({
          storeItem: oldData.concat(newData)
        })
      } else {
        // 
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          storeItem: newData
        })
      }
    }
  },

  /**
   * 附近门店列表接口获取 失败 
   */
  storeListFail: function (res) {

    var that = this;

    that.loadingWave.hideLoading()

    wx.hideNavigationBarLoading() //完成停止加载

    wx.stopPullDownRefresh() //停止下拉刷新

  },
  /**
 * 弹框地址处理
 */
  makeUpAddress: function (areaData) {

    var that = this
    var location = that.data.location
    var province_list = areaData[0]
    var city_list = areaData[1]
    var area_list = areaData[2]

    // console.log(areaData)
    // console.log(province_list[0]['id'])
    // console.log(province_list[0].id)

    /**
     * address_info初始值
     */

    var address_info = []
    address_info['province'] = []
    address_info['province']['code'] = province_list[0]['id']
    address_info['province']['name'] = province_list[0]['name']
    address_info['city'] = []
    address_info['city']['code'] = city_list[0]['id']
    address_info['city']['name'] = city_list[0]['name']
    address_info['county'] = []
    address_info['county']['code'] = area_list[0]['id']
    address_info['county']['name'] = area_list[0]['name']

    var allAdds = []

    var values = [0, 0, 0]

    var valueCounty = []

    var provinces = [];

    var citys = [];
    var countys = [];
    for (var i = 0; i < province_list.length; i++) {
      var province_s = []
      provinces.push(province_list[i].name);
      province_s.name = province_list[i].name
      province_s.code = province_list[i].id
      if (province_list[i].id == location.province_code) {
        values[0] = i
        address_info['province']['code'] = province_list[i]['id']
        address_info['province']['name'] = province_list[i]['name']
      }
      var province_sub = []
      for (var j = 0; j < city_list.length; j++) {
        var city_s = []
        if (province_list[i].id == city_list[j].parent_id) {
          if (province_list[i].id == location.province_code || (!location.province_code && i == 0)) {
            citys.push(city_list[j].name);
          }
          city_s.name = city_list[j].name
          city_s.code = city_list[j].id
          if (city_list[j].id == location.city_code) {
            values[1] = province_sub.length
            address_info['city']['code'] = city_list[j]['id']
            address_info['city']['name'] = city_list[j]['name']

          }
          var city_sub = []
          for (var o = 0; o < area_list.length; o++) {
            var area_s = []
            if (city_list[j].id == area_list[o].parent_id) {
              if (city_list[j].id == location.city_code || (!location.city_code && i == 0 && j == 0)) {
                countys.push(area_list[o].name);
              }
              area_s.name = area_list[o].name
              area_s.code = area_list[o].id
              if (area_list[o].id == location.district_code) {
                values[2] = valueCounty[0] = city_sub.length
                address_info['county']['code'] = area_list[o]['id']
                address_info['county']['name'] = area_list[o]['name']

              }
              city_sub.push(area_s)
            }
          }
          city_s.sub = city_sub
          province_sub.push(city_s)
        }
      }
      province_s.sub = province_sub
      allAdds.push(province_s)
    }
    that.setData({
      cityData: allAdds,
      values: values,
      value: values,
      provinces: provinces,
      citys: citys,
      countys: countys,
      valueCounty: valueCounty,
      address_info: address_info
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

    var that = this;

    var page = that.data.page + 1;

    if (page > that.data.page_count) {

      that.setData({

        nomore: true

      })

      return false;

    }

    that.storeList(3, page, that.data.page_num, that.data.coordinates, that.data.district_id);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})