/**
 * 获取用户信息，并且存入缓存
 * 
 * @author meroc Chen <398515393@qq.com> 2017-11-17
 */
module.exports = function (app) {

  let session_key = app.storage.getAuth().session_key;

  checkSession()

  /**
   * 检查小程序SESSION是否过期
   */
  function checkSession() {

    if (!session_key) {

      login()

    } else {

      wx.checkSession({

        success: getUserInfo,

        fail: login

      })

    }

  }

  /**
   * 后台登录，获取访问服务器的TOKEN值
   */
  function login() {

    if (app.inAuth) {

      return

    } else {

      app.inAuth = true

    }

    /**
     * 先调取微信API的登录接口获取CODE
     * 
     * CODE是微信认证必须传递的参数
     */
    wx.login({

      success: res => {

        /**
         * 微信API登录成功，再调取后台业务服务器的登录接口，获取TOKEN
         */
        var data = { code: res.code }

        if (app.ruid) {

          data.recommend = app.ruid

        }

        /**
         * 调用后台crm微信会员登录接口
         */
        app.crmApi(app.apiService.crm.wxLogin, data, loginSuccess, loginFail)

      },

      fail: res => {


      }

    })

  }

  /**
   * 登录成功
   */
  function loginSuccess(res) {

    /**
     * 取消鉴权状态
     */
    app.inAuth = false

    wx.setStorage({

      key: 'token',

      data: res.data.data.auth.token

    })

    wx.setStorageSync('session_key', res.data.data.auth.session_key)

    if (!res.data.data.userinfo.phone) {

      wx.redirectTo({

        url: '/pages/member/login/login'

      })

      return

    }

    /**
     * 登录成功后，获取用户信息
     */
    getUserInfo(res.data.data.auth.token)

  }

  /**
   * 登录失败
   */
  function loginFail(res) {


  }

  /**
   * 微信小程序获取用户微信数据
   */
  function getUserInfo(token) {

    var that = this;

    /**
     * 获取项目经理信息
     */
    getManagerInfo(token)

    /**
     * 调用微信API, 先获取用户的微信个人资料
     */
    wx.getUserInfo({

      lang: 'zh_CN',              //设置语言为中文

      withCredentials: true,

      success: function (res) {   //用户同意微信数据授权

        /**
         * 将会员资料保存到APP的全局变量中，方便全局调用
         */
        const wxUserInfo = res.userInfo;

        wx.setStorage({

          key: 'wxUserInfo',

          data: wxUserInfo,
          
        })

        editMember(wxUserInfo.nickName, wxUserInfo.avatarUrl, wxUserInfo.gender, token, res.encryptedData, res.iv, res.signature)

      },

      fail: function (res) { //用户拒绝微信数据授权

        wx.redirectTo({

          url: '/pages/member/login/login'

        })
        
      }

    })

  }

  function getManagerInfo(token) {

    app.crmApi(

      app.apiService.crm.getManagerInfo,

      { token: token },

      res => {

        if (res.data.data) {

          app.manager = res.data.data

        }

      }

    )

  }

  function editMember(nickname, avatarUrl, sex, token, encryptedData, iv, signature) {

    app.crmApi(

      app.apiService.crm.memberEdit,

      {

        member_name: nickname, 
        user_headimg: avatarUrl, 
        sex: sex, 
        token: app.storage.getToken(),
        encryptedData: encryptedData,
        iv: iv,
        signature: signature,
        session_key: wx.getStorageSync('session_key')
      },

      res => {

        app.crmApi(

          app.apiService.crm.memInfo,

          {

            token: token

          },

          res => {

            app.storage.setUserInfo(res.data.data)

          }

        )

      }

    )

  }

}