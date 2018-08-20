//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    userInfo: {},
    navService: [],
    level: [],
    inform: [],
    page: 1,
    page_num: 5,
    norecord: false,
    navload: true,
    balanceAvailable: true,
    accountInfo: { intergral: 0, coupons: 0 },
    notice: false,
    phone: '',
    orderNum: {
      deliver_num: 0,
      receive_num: 0
    },
    isManager: false,
    roleType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    const that = this

    app.crmApi(

      app.apiService.crm.pageConfig,

      {

        page_code: 'VHT0CGYX6AGN3OV5'

      },

      res => {

        that.setData({
          
          phone: res.data.data.VHT0CGYX6AGN3OV5.configs['345678'].value
        
        })

      }

    )

  },

  getOrderNum() {

    const that = this

    app.crmApi(

      app.apiService.crm.getOrderNum,

      {

        token: app.storage.getToken()

      },

      res => {

        if (res.data.ret == 200) {

          that.setData({

            orderNum: res.data.data

          })

        }

      }

    )

  },

  switchManager() {

    app.roleType = 2

    this.setData({

      roleType: 2

    })

  },

  switchClient() {

    app.roleType = 1

    this.setData({

      roleType: 1

    })

  },

  getAcctInfo() {

    const that = this

    app.crmApi(

      app.apiService.crm.acctInfo,

      {

        token: app.storage.getToken()

      },

      res => {

        if (res.data.ret == 200) {

          var accountInfo = {

            intergral: res.data.data.intergral ? res.data.data.intergral : 0,

            coupons: res.data.data.coupons ? res.data.data.coupons : 0

          }

          that.setData({

            accountInfo: accountInfo

          })

        }

      }

    )

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this

    if (app.manager) {

      that.setData({

        isManager: true

      })

    }

    that.setData({

      roleType: app.roleType

    })

    /**
     * 当页面显示时，重新加载首页数据，包括从注册返回等
     */
    if (app.checkAuth()) {

      that.indexData()

    }

    this.getAcctInfo()

    this.getOrderNum()

    wx.getStorage({

      key: 'wxUserInfo',

      success: function (res) {

        res.data.id = 1

        that.setData({

          userInfo: res.data

        })

      }

    })

  },

  /**
   * 加载首页数据
   */
  indexData() {

    var that = this

    /**
     * 加载缓存用户基本数据
     */

    that.loadData()

  },

  /**
   * 首页 鉴权回调函数
   */
  launchCallback() {

    /**
     * 当程序用户基本信息缓存被清空时，onShow 方法将无法获取首页数据，此时程序会执行 auth.js 
     * 完成登录，注册等权限操作，只有当 auth.js 执行完毕，相应的用户基本信息缓存数据才会建立，
     * 此时再调用此页面回调函数去获取首页相关数据，这个操作只在用户缓存数据被清空的情况下执行。
     */

    this.indexData()

  },

  /**
   * 图片动画
   */
  animationImg() {
    //实例化一个动画
    var animation = wx.createAnimation({

      duration: 600,

      timingFunction: 'ease',

    })

    this.animation = animation

    animation.rotate(30).step().rotate(0).step().rotate(-30).step().rotate(0).step();

    //导出动画
    this.setData({

      animationData: animation.export()

    })

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

    var that = this;

    if (this.data.loading) return;

  },

  toAboutUs() {

    wx.navigateTo({

      url: '/pages/userCenter/aboutUs/aboutUs',

    })
    
  },

  toAfterSale() {

    wx.navigateTo({

      url: '/pages/userCenter/afterSales/afterSales',

    })

  },

  toText() {

    wx.navigateTo({

      url: '/pages/text/content',

    })

  },

  /**
   * 从缓存中加载会员基本信息数据，数据来源于 auth.js 的登录操作
   */
  loadData() {

    var that = this

    /**
     * 加载用户基本数据，先从缓存读取
     */

    that.setData({

      userInfo: app.storage.getUserInfo(),

    })

  },

  toAddress() {

    wx.navigateTo({

      url: '/pages/address/address'

    })

  },

  shareCode() {

    wx.navigateTo({

      url: '/pages/userCenter/qrcode/qrcode'
      
    })

  },

  makePhoneCall() {

    wx.makePhoneCall({

      phoneNumber: this.data.phone

    })

  },

  coupon() {

    wx.navigateTo({

      url: '/pages/userCenter/coupon/coupon'
      
    })

  },

  integrayMall() {

    wx.navigateTo({

      url: '/pages/userCenter/integralMall/index'

    })

  }

})
