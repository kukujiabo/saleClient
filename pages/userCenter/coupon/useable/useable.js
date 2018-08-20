var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponItem: [],//优惠券列表
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (options.useableCoupon){
            var useableCoupon = JSON.parse(options.useableCoupon)
            console.log(options)
            console.log(useableCoupon)

            if (useableCoupon) {
                /**
                 * 去除日期的时分秒
                 */
                var newData = useableCoupon
                var start_time = [];
                var end_time = [];
                var money = [];
                for (var i = 0; i < newData.length; i++) {
                    money[i] = parseInt(newData[i].money);
                    newData[i].money = money[i];
                    if (newData[i].start_time) {
                        start_time[i] = newData[i].start_time;
                        var startTime = start_time[i].substr(0, 10);
                        newData[i].start_time = startTime;
                    }

                    if (newData[i].end_time) {
                        end_time[i] = newData[i].end_time;
                        var endTime = end_time[i].substr(0, 10);
                        newData[i].end_time = endTime;
                    }
                }
                that.setData({
                    couponItem: useableCoupon
                })
            }
        }
      
    },

    /**
     * 优惠券二维码兑换跳转
     */
    exchangeTap: function (e) {
        var that = this;
        var idx = e.currentTarget.dataset.idx;
        var info = that.data.couponItem;
        var couponInfo = info[idx]
        var pagelist = getCurrentPages();
        if (pagelist.length > 1) {
            //获取上一个页面实例对象
            var prePage = pagelist[pagelist.length - 2];
            prePage.getCouponData(couponInfo);
            wx.navigateBack({
                delta: 1
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
