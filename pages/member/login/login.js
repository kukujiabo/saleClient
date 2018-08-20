var app = getApp()

var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    rty: false,
    phoneValue: '',//手机号
    name: '',//姓名
    tapContent: '发送验证码',
    forbid: false,
    intervarID: undefined,
    submitForbid: true,
    submitContent: '快速登录',
    network: 1,
    dialog: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.dialog = that.selectComponent('#dialog')
    that.loadingWave = that.selectComponent('#wave')
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.setData({
          network: 0
        })

        that.dialog.showDialog({
          'type': 'warning',
          'title': '网络未链接！',
          'content': '请检查您的网络～'
        });

      } else {
        that.setData({
          network: 1
        })
      }
    })
  },
  /**
   * 微信授权绑定手机号
   */
  getPhoneNumber: function (e) {
    var data = {}
    if (e.detail) {
      data.iv = e.detail.iv
      data.encryptedData = e.detail.encryptedData
      this.wxPhone(data)
    } else {
      wx.showModal({
        title: '获取手机号失败！',
        content: '请您手动填入手机号！',
      })
    }
  },
  /**
   * 微信小程序授权手机号解密接口
   */
  wxPhone: function (e) {
    var that = this;
    var data = {
      encryptedData: e.encryptedData,
      iv: e.iv,
      session_key: wx.getStorageSync('session_key')
    }
    app.crmApi(
      app.apiService.crm.getWxPhone,
      data,
      that.wxPhoneSuccess,
      that.wxPhoneFailed
    )
  },

  /**
   * 获取绑定手机号成功
   */
  wxPhoneSuccess(res) {
    var that = this;
    var info = res.data.data
    var phone = that.data.phoneValue
    if (res.data.ret == 200) {
      that.setData({
        phoneValue: info.purePhoneNumber
      })
    } else {
      this.dialog.showDialog({
        'type': 'warning',
        'title': '出错了！',
        'content': '获取手机号失败，请手动输入！'
      });
    }
  },

  /**
   * 
   */
  wxPhoneFailed(res) {
    this.dialog.showDialog({
      'type': 'warning',
      'title': '出错了',
      'content': '该设备无法获取手机号，请手动输入！'
    });
  },

  /**
   * 注册协议跳转链接
   */
  agreementTap: function () {
    wx.navigateTo({
      url: '/pages/member/agreement/agreement',
    })
  },

  /**
   * bindinput 获取输入的姓名
   */
  userNameBind: function (e) {
    var that = this;
    var txt = e.detail.value
    that.setData({
      name: txt
    });
  },
  //bindinput 获取输入的手机号的值
  validatemobile: function (e) {
    var that = this;
    that.setData({
      phoneValue: e.detail.value
    });
  },
  //验证码输入
  yzmImport: function (e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      code: value
    })
  },
  //发送验证码验证手机格式
  sendTap: function (e) {
    var that = this;
    var phone = that.data.phoneValue;
    var myreg = /^[1][0-9]{10}$/;
    if (phone.length < 11) {
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
    else if (!myreg.test(phone)) {
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
    that.message(phone);
  },

  getUserInfo(res) {

    var that = this

    if (this.data.phoneValue.toString().length != 11) {

      wx.showModal({

        title: '出错了～',

        content: '请正确输入手机号！'

      })

      return

    }

    if (this.data.code.toString().length != 6) {

      wx.showModal({

        title: '出错了～',

        content: '请输入正确的验证码！'

      })

    }

    app.crmApi(

      app.apiService.crm.checkVerifyCode,

      { mobile: this.data.phoneValue, code: this.data.code },

      codeReturn => {

        if (codeReturn.data.data == 1) {

          wx.setStorage({

            key: 'wxUserInfo',

            data: res.detail.userInfo

          })

          that.editMemberInfo(

            res.detail.userInfo.nickName,

            res.detail.userInfo.avatarUrl,

            res.detail.userInfo.gender

          )

        } else {

          wx.showModal({

            title: '出错了～',

            content: '请输入正确的验证码！'

          })

        }

      }

    )

  },

  //保存提交
  bindingformSubmit: function (e) {

    var that = this;

    if (!that.data.network) {

      wx.showModal({

        title: '网络未链接',

        content: '请检查您的网络！',

      })

      return

    }

    var phonevalue = that.data.phoneValue //手机号码 

    if (phonevalue.length != 11) {

      wx.showToast({

        title: '手机号码有误！',

        image: '/images/caution.png',

        duration: 1000

      })

      return

    }

    wx.getUserInfo({

      withCredentials: true,

      lang: 'zh_CN',

      success: function (res) {

        e.encryptedData = res.encryptedData

        e.iv = res.iv

        that.getBindPhone(e)

      },
      fail: function (res) {

        e.encryptedData = ''

        e.iv = ''

        that.getBindPhone(e)

      }

    })

  },

  getBindPhone: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var filterRule = /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/;

    that.setData({
      submitContent: '正在提交...',
      submitForbid: true
    })

    var data = {
      code: that.data.code,
      phone: that.data.phoneValue,
      member_name: that.data.name,
      token: app.storage.getAuth().token,
      session_key: app.storage.getAuth().session_key,
      encryptedData: e.encryptedData,
      iv: e.iv
    }

    if (app.share_code) {

      data.share_code = app.share_code

    }

    that.loadingWave.showLoading()

    that.editMemberInfo(

      res.detail.userInfo.nickName,

      res.detail.userInfo.avatarUrl,

      res.detail.userInfo.gender

    )

  },

  editMemberInfo(nickname, avatarUrl, sex) {

    var that = this

    app.crmApi(

      app.apiService.crm.memberEdit,

      {

        member_name: nickname,

        user_headimg: avatarUrl,

        sex: sex,

        token: app.storage.getToken(),

        user_tel: that.data.phoneValue

      },

      res => {

        app.crmApi(

          app.apiService.crm.memInfo,

          {

            token: app.storage.getToken()

          },

          res => {

            app.storage.setUserInfo(res.data.data)

            wx.switchTab({

              url: '/pages/index/index',

            })

          }

        )

      }

    )

  },

  bindSuccess: function (res) {

    var that = this

    if (res.data.ret == 200) {

      var uinfo = app.storage.getUserInfo();

      uinfo.phone = that.data.phoneValue;

      uinfo.member_name = that.data.name;

      app.storage.setUserInfo(uinfo)

      if (res.data.data.card_id) {

        var account_info = app.storage.getAccount();

        account_info.card_id = res.data.data.card_id;

        app.storage.setAccount(account_info)

      }

      that.setData({

        submitContent: '注册 / 绑定会员卡'

      })

      that.loadingWave.hideLoading()

      wx.switchTab({

        url: '/pages/index/index?login=1'

      })

    } else {

      wx.showModal({

        title: '出错了！',

        content: '验证码输入错误，请重新输入！',

      })

      that.setData({

        submitContent: '注册 / 绑定会员卡',

        submitForbid: false

      })

    }

  },


  bindFail(res) {

    var that = this;

    that.loadingWave.hideLoading()

    if (!that.data.network) {

      this.dialog.showDialog({

        'type': 'warning',

        'title': '网络未链接！',

        'content': '请检查您的网络！'

      });

    } else {

      that.dialog.showDialog({

        'type': 'warning',

        'title': '出错了！',

        'content': '验证码错误，请重新输入～'

      })

    }

    that.setData({

      submitContent: '注册 / 绑定会员卡',

      submitForbid: false

    })

  },
  //短信接口
  message: function (phone) {
    const data = { mobile: phone }
    var that = this
    that.setData({
      forbid: true,
      tapContent: '正在发送...'
    })
    app.crmApi(
      app.apiService.crm.sendVerify,
      data,
      that.verifySuccess,
      that.verifyFail
    )
  },
  verifySuccess: function (res) {
    var that = this;
    if (res.data.ret == 200) {
      currentTime = 60;
      interval = setInterval(function () {
        currentTime--;
        that.setData({
          tapContent: currentTime
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          currentTime = -1
          that.setData({
            tapContent: '发送验证码',
            forbid: false
          })
        }
      }, 1000)
    } else {
      that.setData({
        tapContent: '发送验证码',
        forbid: false
      })
    }
  },
  verifyFail: function (res) {
    this.dialog.showDialog({
      'type': 'warning',
      'title': '出错了',
      'content': '短信验证码发送失败，请检查您的网络！'
    });
    this.setData({
      tapContent: '发送验证码',
      forbid: false
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})