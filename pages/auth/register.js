// pages/auth/register.js
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

    phone: '',
    code: '',
    rightCode: '',
    tapContent: '发送验证码',
    forbid: false

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
  
    if (app.storage.getRegPhone()) {

      this.setData({

        phone: app.storage.getRegPhone()

      })

    }

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

  inputPhone(evt) {

    this.setData({

      phone: evt.detail.value

    })

    app.storage.setRegPhone(evt.detail.value)

  },

  inputCode(evt) {

    this.setData({

      code: evt.detail.value

    })

  },
  
  sendVerifyCode() {

    var phone = this.data.phone

    if (phone.length != 11) {

      wx.showModal({

        title: '错误！',

        content: '请输入正确的手机号！'

      })

      return

    }

    this.message(this.data.phone)

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
    
      that.setData({

        rightCode: res.data.data.right_code

      })

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

  getUserInfo(res) {

    var that = this

    if (this.data.phone.toString().length != 11) {

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

      { mobile: this.data.phone, code: this.data.code },

      codeReturn => {

        if (codeReturn.data.data == 1) {

          wx.setStorage({

            key: 'wxUserInfo',

            data: res.detail.userInfo

          })

          that.editMemberInfo(res.detail.userInfo.nickName, res.detail.userInfo.avatarUrl, res.detail.userInfo.gender)

        } else {

          wx.showModal({

            title: '出错了～',

            content: '请输入正确的验证码！'

          })

        }

      }

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

        user_tel: that.data.phone

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

              url: '/pages/mall/mall',

            })

          }

        )

      }

    )

  }

})