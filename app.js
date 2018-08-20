//app.js

/**
 * 载入url配置
 */
var url = require("api/url.js")

/**
 * 载入权限校验配置
 */
var auth = require("auth/auth.js")

/**
 * 载入缓存配置
 */
var storage = require("storage.js")

/**
 * 载入接口服务配置
 */
var service = require("api/service.js");

/**
 * 载入模版解析配置
 */
var WxParse = require('wxParse/wxParse.js');

App({

  /**
   * 分享代码
   */
  share_code: '',

  /**
   * 配置缓存
   */
  storage: storage(this),

  /**
   * 配置服务接口
   */
  apiService: service,

  /**
   * 配置使用url
   */
  apiUrls: url,

  /**
   * 标记当前是否在鉴权
   */
  inAuth: false,

  categoryId: '',

  ruid: '',

  /**
   * 小程序启动
   */
  onLaunch(options) {

    this.ruid = options.query.scene

    auth(this)

    /**
     * 加载行政单位信息，并存入缓存，全局使用
     */
    this.getArea()

  },

  /**
   * 小程序界面显示
   */
  onShow() {

    if (!this.checkAuth()) {

      auth(this)

    }

  },

  /**
   * 检测小程序用户是否登录，判断依据是缓存中用户是否有手机号，
   * 如果登录状态过期，则处理方式由 handleApiResponse 来处理。
   */
  checkAuth() {

    var userInfo = this.storage.getUserInfo();

    if (!userInfo || !userInfo.phone) {

      return false

    } else {

      return true

    }

  },

  /**
   * 地址库接口获取
   */
  getArea: function (e) {

    this.crmApi(

      service.crm.getAddrRoom,

      {},

      res => {

        if (res.data.ret == 200) {

          var areaData = res.data.data

          this.storage.setAddrRoom(areaData)

        }

      },

    )

  },

  /**
   * crm模块Api
   */
  crmApi(service, data, success, fail, extParam, header) {

    var token = this.storage.getToken()

    if (!token && service != this.apiService.crm.wxLogin) {
      
      token = 'client'

    }

    var location = this.storage.getLocation()

    var memberInfo = this.storage.getUserInfo()

    if (location && data) {

      data.city_code = location.city_code

      data.user_level = memberInfo.level

    }


    /**
     * 设置请求头部
     */
    var h = header || { 'content-type': 'application/x-www-form-urlencoded', 'WX-TOKEN': token };

    var app = this;

    wx.request({

      url: this.apiUrls.crm + '/?service=' + service,

      data: data,

      header: h,

      method: 'POST',

      success: function (res) {

        if (app.handleApiResponse(res)) {

          typeof success == 'function' ? success(res, extParam) : 1

        } else {

          typeof fail == 'function' ? fail(res, extParam) : 1

        }

      },

      fail: function (res) {

        typeof fail == 'function' ? fail(res, extParam) : 1

      }

    })

  },

  /**
   * 外卖模块api
   */
  takeoutApi(service, data, success, fail, extParam, header) {

    /**
     * 设置请求头部
     */
    var h = header || { 'content-type': 'application/json' };

    var app = this;

    wx.request({

      url: this.apiUrls.takeout + '/?service=' + service,

      data: data,

      header: h,

      success: function (res) {

        if (app.handleApiResponse(res)) {

          typeof success == 'function' ? success(res, extParam) : 1

        } else {

          typeof fail == 'function' ? fail(res, extParam) : 1

        }

      },

      fail: function (res) {

        typeof fail == 'function' ? fail(res, extParam) : 1

      }

    })

  },

  /**
   * 重新登录
   */
  reAuth() {
    /**
     * 清空当前缓存，并重新登录
     */

    wx.clearStorageSync()

    /**
     * 重新登录
     */

    auth(this)

  },

  /**
   * 返回请求统一处理
   */
  handleApiResponse(res) {

    /**
     * 请求成功
     */
    if (res.data.ret == 200) {

      return true

    } else {


      switch (res.data.ret) {

        /**
         * 未登录时重新登录
         */
        case 601002:

          this.reAuth();

          break;

        /**
         * session失效时重新登录
         */
        case 210005:

          this.reAuth();

          break;

      }

      return false

    }

  },

  /**
   * 小程序富文本转化
   */
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');

    return returnText;
  },

})