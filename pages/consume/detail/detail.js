var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.loadingWave = this.selectComponent('#wave')

        this.getDetail(options.id)
    
    },
   
    /**
     * 消费详情接口获取
     */
    getDetail: function(id){
        var that = this;
        var data = {
            id:id,
            token: app.storage.getAuth().token
        }
        that.loadingWave.showLoading()
        app.crmApi(
            app.apiService.crm.getPayDetail,
            data,
            that.getDetailSuccess
        )
    },
    getDetailSuccess: function(res){
        var that = this;
        that.loadingWave.hideLoading()
        that.setData({
            consumeDetail:res.data.data
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