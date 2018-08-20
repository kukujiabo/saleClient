var tcity = require("../../../utils/citys.js");
var app = getApp()
Page({
  data: {
    provinces: [],
    province: "请选择省",
    citys: [],
    city: "请选择市",
    countys: [],
    county: '请选择区',
    phone: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    name: '',
    address_id: 0,
    provinceId: undefined,
    cityId: undefined,
    areaId: undefined,
    in_detail: '',
    is_default: true,
    rty: false,
    address_info: [],

  },
  customItem: '全部',
  /**
  * 三级联动的蒙版
  */
  tapCitymask: function () {
    var that = this;
    that.setData({
      condition: !that.data.condition
    })
  },
  bindChange: function (e) {
    var that = this
    var val = e.detail.value
    var t = that.data.values
    var cityData = that.data.cityData;
    var address_info = that.data.address_info;
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
      address_info['county']['code'] = cityData[val[0]].sub[val[1]].sub[0].code
      address_info['county']['name'] = cityData[val[0]].sub[val[1]].sub[0].name
      this.setData({
        citys: citys,
        countys: countys,
        values: val,
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
        // city: this.data.citys[val[1]],
        // county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        // cityId: cityData[val[0]].sub[val[1]].code,
        // countyId: cityData[val[0]].sub[val[1]].sub[0].code,
        values: val,
        value: [val[0], val[1], 0],
        address_info: address_info
      })
      return;
    }
    if (val[2] != t[2]) {
      address_info['county']['code'] = cityData[val[0]].sub[val[1]].sub[val[2]].code
      address_info['county']['name'] = cityData[val[0]].sub[val[1]].sub[val[2]].name
      this.setData({
        // county: this.data.countys[val[2]],
        // countyId: cityData[val[0]].sub[val[1]].sub[val[2]].code,
        values: val,
        value: [val[0], val[1], val[2]],
        address_info: address_info
      })
      return;
    }
  },
  open: function (e) {
    var that = this
    var areaStore = {
      'condition': !this.data.condition,
    }
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
    // that.setData({
    //     condition: !this.data.condition
    // })
  },
  onLoad: function (option) {
    var that = this
    if (option.address) {
      var info = JSON.parse(option.address)
      that.setData({
        phone: info.mobile,
        name: info.consigner,
        address_id: info.address_id,
        provinceId: info.province,
        cityId: info.city,
        areaId: info.area,
        in_detail: info.address,
        is_default: info.default,
        province: info.province_name,
        city: info.city_name,
        county: info.area_name,
      })
    } else {
      var info = app.storage.getUserInfo()
      that.setData({
        name: info.member_name,
        phone: info.phone
      })
    }
    // tcity.init(that)
  },
  onShow: function () {
    var that = this;
    var addrData = app.storage.getAddrRoom()
    that.makeUpAddress(addrData)
  },
  //form提交
  formSubmit: function (e) {
    var that = this
    var address_id = this.data.address_id
    var form_list = e.detail.value;
    var myreg = /^[1][0-9]{10}$/;
    if (!form_list.name) {
      wx.showToast({
        title: '请输入姓名',
        image: '/images/caution.png',
        duration: 1000
      })
      that.setData({
        rty: false
      })
      return false;
    }
    else if (form_list.phone.length < 11) {
      wx.showToast({
        title: '手机号码有误',
        image: '/images/caution.png',
        duration: 1000
      })
      that.setData({
        rty: false
      })
      return false;
    }
    else if (!myreg.test(form_list.phone)) {
      wx.showToast({
        title: '手机号码有误',
        image: '/images/caution.png',
        duration: 1000
      })
      that.setData({
        rty: false
      })
      return false;
    }
    else if (!form_list.province) {
      wx.showToast({
        title: '请选择所在地区',
        image: '/images/caution.png',
        duration: 1000
      })
      that.setData({
        rty: false
      })
      return false;
    } else if (!form_list.addrDetail) {
      wx.showToast({
        title: '请填写详细地址',
        image: '/images/caution.png',
        duration: 1000
      })
      that.setData({
        rty: false
      })
      return false;
    }

    wx.showLoading({
      title: '正在保存~',
      mask: true,
    })

    if (address_id > 0) {

      that.edit(form_list);

    } else {

      that.add(form_list);

    }

  },
  /**
   * @param e.typr 类型 1-添加 2-修改
   */
  chuli: function (e) {
    var that = this
    delete (e['service'])
    delete (e['token'])
    delete (e['user_id'])
    var address_list = wx.getStorageSync('address_list')
    if (address_list && ((e.type == 1 && e.default == true) || e.type == 2 || e.type == 3)) {
      for (var i = 0; i < address_list.length; i++) {
        if (e.default == true && address_list[i].default == true) {
          address_list[i].default = false
        }
        if (e.type == 2 && e.address_id == address_list[i].address_id) {
          var asd = e
          delete (asd['type'])
          address_list[i] = asd
        }
      }
    }

    return true
  },
  //新增收货地址接口
  add: function (info) {
    var that = this
    var datas = {}
    datas.user_id = 5
    datas.token = app.storage.getToken()
    datas.name = info.name
    datas.phone = info.phone
    datas.province = info.province
    datas.city = info.city
    datas.area = info.area
    datas.province_name = that.data.province
    datas.city_name = that.data.city
    datas.area_name = that.data.county
    datas.address = info.addrDetail
    datas.default = info.default_address == 'yes' ? true : false
    app.crmApi(
      app.apiService.crm.addrAdd,
      datas,
      res => {
        if (res.data.ret = 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          datas.address_id = res.data.data
          datas.type = 1
          that.chuli(datas)
          wx.navigateBack({})
        } else {
          var asd = res.data.msg
          wx.showModal({
            title: '',
            content: asd,
            showCancel: false,
            cancelText: '取消',
            confirmText: '确认'
          })
        }
      },
      err => {
        wx.hideLoading()
        wx.showModal({
          title: '网络错误',
          content: '请检查您的网络~',
          showCancel: false,
          cancelText: '取消',
          confirmText: '确认',
        })
      }
    )
  },

  //编辑收货地址接口
  edit: function (info) {
    var that = this
    var datas = {}
    datas.token = app.storage.getToken()
    datas.address_id = this.data.address_id
    datas.name = info.name
    datas.phone = info.phone
    datas.province = info.province
    datas.city = info.city
    datas.area = info.area
    datas.province_name = that.data.province
    datas.city_name = that.data.city
    datas.area_name = that.data.county
    datas.address = info.addrDetail
    datas.default = info.default_address == 'yes' ? true : false;
    app.crmApi(
      app.apiService.crm.addrEdit,
      datas,
      res => {
        wx.hideLoading()
        if (res.data.ret = 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          datas.type = 2
          that.chuli(datas)
        } else {
          var asd = res.data.msg
          wx.showModal({
            title: '',
            content: asd,
            showCancel: false,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确认',
            confirmColor: ''
          })
        }
      },
      err => {
        wx.hideLoading()
        wx.showModal({
          title: '网络错误',
          content: '请检查您的网络~',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确认',
          confirmColor: ''
        })
      }
    )
  },
  /**
   * 弹框地址处理
   */
  makeUpAddress: function (areaData) {
    var that = this
    var province_list = areaData[0]
    var city_list = areaData[1]
    var area_list = areaData[2]
    var allAdds = []
    for (var i = 0; i < province_list.length; i++) {
      var province_s = []
      province_s.name = province_list[i].name
      province_s.code = province_list[i].id
      var province_sub = []
      for (var j = 0; j < city_list.length; j++) {
        var city_s = []
        if (province_list[i].id == city_list[j].parent_id) {
          city_s.name = city_list[j].name
          city_s.code = city_list[j].id
          var city_sub = []
          for (var o = 0; o < area_list.length; o++) {
            var area_s = []
            if (city_list[j].id == area_list[o].parent_id) {
              area_s.name = area_list[o].name
              area_s.code = area_list[o].id
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
      cityData: allAdds
    })
    var cityData = allAdds;
    const provinces = [];
    const citys = [];
    const countys = [];
    var provinceId = that.data.provinceId
    var cityId = that.data.cityId
    var areaId = that.data.areaId
    var provinceName
    var province_i = 0
    var value_array = []
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
      if (provinceId && provinceId == cityData[i].code) {
        // provinceName = cityData[i].name
        province_i = i
        value_array.push(province_i)
      }
    }
    var cityName
    var city_i = 0
    for (let i = 0; i < cityData[province_i].sub.length; i++) {
      citys.push(cityData[province_i].sub[i].name)
      if (cityId && cityId == cityData[province_i].sub[i].code) {
        // cityName = cityData[province_i].sub[i].name
        city_i = i
        value_array.push(city_i)
      }
    }
    var areaName
    var area_i = 0
    for (let i = 0; i < cityData[province_i].sub[city_i].sub.length; i++) {
      countys.push(cityData[province_i].sub[city_i].sub[i].name)
      if (areaId && areaId == cityData[province_i].sub[city_i].sub[i].code) {
        // areaName = cityData[province_i].sub[city_i].sub[i].name
        area_i = i
        value_array.push(area_i)
      }
    }
    var address_info = that.data.address_info
    address_info['province'] = []
    address_info['city'] = []
    address_info['county'] = []
    address_info['province']['code'] = cityData[province_i].code
    address_info['province']['name'] = cityData[province_i].name
    address_info['city']['code'] = cityData[province_i].sub[city_i].code
    address_info['city']['name'] = cityData[province_i].sub[city_i].name
    address_info['county']['code'] = cityData[province_i].sub[city_i].sub[area_i].code
    address_info['county']['name'] = cityData[province_i].sub[city_i].sub[area_i].name
    var areaStore = {
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'value': value_array,
      'address_info': address_info
    }
    that.setData(areaStore)
  },

  /**
   * 调用腾讯地图接口选择地理位置
   */
  chooseLocation() {
    var that = this
    wx.chooseLocation({
      success(res) {
        /**
         * 获取定位信息
         */
        var address = res.address

        /**
         * 获取服务器省市区
         */
        var requestData = {
          latitude: res.latitude,
          longitude: res.longitude
        }

        app.crmApi(
          app.apiService.crm.getAddress,
          requestData,
          data => {
            that.setData({
              provinceId: data.data.data.province_code,
              cityId: data.data.data.city_code,
              areaId: data.data.data.district_code,
              province: data.data.data.province,
              city: data.data.data.city,
              county: data.data.data.district,
              in_detail: res.address
            })
          },
          err => {

          }
        )
      }
    })
  }

})
