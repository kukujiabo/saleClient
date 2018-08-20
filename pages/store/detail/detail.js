var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        is_switch: true,//开关
        storeDetail: [],
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var detail_data = JSON.parse(options.data)//列表解析为对象
        that.setData({
            storeDetail: detail_data
        })
    },

    /**
    * 拨打电话
    */
    makePhoneCall: function () {
        var that = this;
        var phone = that.data.storeDetail.phone;
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
    openMap: function () {
        var that = this;
        var info = that.data.storeDetail;
        var lon = parseFloat(info.lon);
        var lat = parseFloat(info.lat);
        var address = info.address
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        })
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
     * 点外卖链接
     */
    takeoutTap: function () {
        var that = this;
        var shopInfo = JSON.stringify(that.data.storeDetail);
        if (!that.data.is_switch) {
            return
        }
        else {
            wx.navigateTo({
                url: '/pages/takeout/shop/shop?shopInfo=' + shopInfo
            })
            that.setData({
                is_switch: false
            })
        }
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
        var that = this;
        that.setData({
            is_switch: true
        })
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