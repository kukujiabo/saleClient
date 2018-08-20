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
        tapContent: '发送验证码',
        forbid: false,
        intervarID: undefined,
        submitForbid: false,
        submitContent: '注册 / 绑定会员卡'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },


    /**
     * bindinput 获取输入的手机号的值
     */
    validatemobile: function (e) {
        var that = this;
        that.setData({
            phoneValue: e.detail.value
        });
    },

    /**
     * 获取输入的验证码
     */
    yzmImport: function (e) {
        var that = this;
        var value = e.detail.value
        that.setData({
            code: value
        })
    },

    /**
     * 发送验证码验证手机格式
     */
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
        else if (phone == app.storage.getUserInfo().phone) {
            wx.showToast({
                title: '手机号不能相同',
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

    /**
     * 保存提交
     */
    bindingformSubmit: function (e) {
        var that = this;
        var phonevalue = e.detail.value.phoneValue//手机号码 
        that.getBindPhone(e);
    },

    /**
     * 绑定手机号接口获取
     */
    getBindPhone: function (e) {
        var that = this;
        that.setData({
            submitContent: '正在提交...',
            submitForbid: true
        })
        var data = {
            code: that.data.code,
            phone: that.data.phoneValue,
            token: app.storage.getAuth().token
        }
        app.crmApi(
            app.apiService.crm.changePhone,
            data,
            that.bindSuccess,
            that.bindFail
        )
    },

    bindSuccess: function (res) {
        var that = this
        if (res.data.ret == 200) {
            var uinfo = app.storage.getUserInfo()
            uinfo.phone = that.data.phoneValue
            app.storage.setUserInfo(uinfo)
            console.log(uinfo)
            wx.navigateBack({
              
            })
        } else {
            that.setData({
                submitContent: '确定',
                submitForbid: false
            })
            wx.showToast({
                title: '验证码错误！',
                image: '/images/caution.png'
            })
        }
    },
    bindFail: function (res) {
        var that = this;
        that.setData({
            submitContent: '注册 / 绑定会员卡',
            submitForbid: false
        })
        wx.showToast({
            title: '验证码错误！',
            image: '/images/caution.png'
        })
    },
    
    /**
     * 发送短信接口获取
     */
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
        if (res.data.ret == 200) {
            var that = this;
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
            wx.showToast({
                title: '验证码发送失败，请联系管理员！',
            })
        }
    },
    verifyFail: function (res) {

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