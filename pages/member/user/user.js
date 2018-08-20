var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    member_name: '',
    userInfo: {},
    editBtn: '编辑',
    disabled: true,
    disabled_date: true,
    date: '请选择生日',
    date_select: '',
    phone: '',
    in_detail: '',
    is_default: true,
    rty: false,
    birthday: '',
    sex: [{ name: '先生', value: 1, checked: false }, { name: '女士', value: 2, checked: false }],
    is_switch: true,//开关
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.dialog = this.selectComponent('#dialog')

    this.loadingWave = this.selectComponent('#wave')

  },


  /**
   *  绑定手机号链接
   */
  phoneTap: function () {

    var that = this;

    if (that.data.disabled == false) {

      if (!that.data.is_switch) {

        return

      } else {

        wx.navigateTo({

          url: '/pages/member/mobile/mobile',
          
        })

        that.setData({

          is_switch: false

        })

      }

    }

  },
  /**
  * bindinput 获取输入的姓名
  */
  userNameBind: function (e) {
    var that = this;
    that.setData({
      member_name: e.detail.value
    });
  },

  /**
   *  用户资料接口获取
   */
  getUser: function () {
    var that = this;
    var data = {
      token: app.storage.getAuth().token
    }
    app.crmApi(
      app.apiService.crm.memberDetail,
      data,
      that.getUserSuccess,
      that.getUserFail
    )
  },

  /***
   * 用户资料接口获取 成功
   */
  getUserSuccess: function (res) {

    var that = this;

    if (res.data.ret == 200) {

      var userInfo = res.data.data;

      var old = app.storage.getUserInfo()

      for (var k in userInfo) {

        old[k] = userInfo[k]

      }

      app.storage.setUserInfo(old)

      that.loadData()

    } else {

      var asd = res.data.msg

    }

  },

  /**
   * 加载数据
   */
  loadData() {
    var that = this
    var sex = that.data.sex;
    var date = that.data.date
    var userInfo = app.storage.getUserInfo()
    for (var i = 0; i < sex.length; i++) {
      if (sex[i].value == userInfo.sex) {
        sex[i].checked = true
      } else {
        sex[i].checked = false
      }
      that.setData({
        sex: sex
      })
    }
    that.setData({
      userInfo: userInfo,
      date: userInfo.birthday ? userInfo.birthday : '请选择生日'
    })
  },

  /***
  * 用户资料接口获取 失败
  */
  getUserFail: function (res) {

  },

  /**
   * 用户资料编辑接口获取
   */
  userEdit: function (e) {
    var that = this;
    var info = e.detail.value
    var data = {
      token: app.storage.getAuth().token,
      member_name: info.member_name,
      sex: info.sex,
      birthday: info.date,
    }

    that.loadingWave.showLoading()

    app.crmApi(
      app.apiService.crm.memberEdit,
      data,
      that.userEditSuccess,
      that.userEditFail
    )
  },
  /**
   * 用户资料编辑接口获取 成功
   */
  userEditSuccess: function (res) {
    var that = this;

    if (res.data.ret == 200 && res.data.data) {
      var info = res.data.data;
      var userInfo = app.storage.getUserInfo()
      userInfo.member_name = info.member_name
      userInfo.birthday = info.birthday
      userInfo.sex = info.sex
      app.storage.setUserInfo(userInfo)
      that.loadData()

      that.setData({
        disabled: true,
        disabled_date: true,
        editBtn: '编辑'
      })
    } else {
      that.setData({
        disabled: true,
        disabled_date: true,
        editBtn: '编辑'
      })
    }
    that.loadingWave.hideLoading()
  },
  /**
   * 用户资料编辑接口获取 失败
   */
  userEditFail: function (e) {

    that.loadingWave.hideLoading()

    that.setData({

      disabled: true,

      disabled_date: true,

      editBtn: '编辑'

    })

  },
  /**
   * 提交
   */
  userSubmit: function (e) {
    var that = this;
    var info = e.detail.value
    var userInfo = app.storage.getUserInfo()
    if (that.data.disabled) {
      that.setData({
        disabled: false,
        editBtn: '确认',
      })
      if (app.storage.getUserInfo().birthday) {
        that.setData({
          disabled_date: true,
        })
      } else {
        that.setData({
          disabled_date: false,
        })
      }
    } else if (userInfo.member_name == info.member_name && userInfo.birthday == info.date && userInfo.sex == info.sex) {
      wx.showToast({
        title: '未修改信息',
        image: '/images/wrong-load.png',
        mask: true,
        duration: 1000,
      })
      that.setData({
        disabled: true,
        editBtn: '编辑',
      })
      return false
    }
    else {
    
      that.userEdit(e)
    }
  },
  //日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      birthday: e.detail.value
    })
    var date_select = this.data.date
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
    var page = this;
    var that = this;
    that.setData({
      is_switch: true,
    })
    that.loadData()
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

  showNotice() {

    if (this.data.disabled) {

      this.dialog.showDialog({

        'type': 'warning',

        'title': '温馨提示',

        'content': '修改资料，请点击编辑按钮～'

      })

    }

  },

  address() {

    wx.navigateTo({

      url: '/pages/address/address',

    })

  }

})