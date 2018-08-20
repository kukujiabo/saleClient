module.exports = function(app) {

    const auth_key = 'auth' //设置AUTH 缓存
    const account_key = 'account' //设置账户信息
    const user_info_key = 'user_info' //设置个人基本信息
    const addr_key = 'addrRoom' //设置行政单位信息
    const indexNav_key = 'indexNav' //设置模块信息
    const share_key = 'share_code' //设置分享码
    const pBarcode = 'pay_barcode'
    const pQrcode = 'pay_qrcode'
    const notice = 'show_notice'
    const wxtoken = 'token'
    const location = 'location'
    const regPhone = 'reg_phone'

    /**
     * 读取缓存
     */
    function readData(key, callback) {

        return wx.getStorageSync(key)

    }

    /**
     * 设置缓存
     */
    function setData(key, data) {

        wx.setStorageSync(key, data)

    }

    return {
        /**
         * 设置AUTH 缓存
         */
        setAuth(data) {
            setData(auth_key, data)
        },
        getAuth() {
            return readData(auth_key)
        },

        /**
         * 设置会员基本信息缓存
         */
        setAccount(data) {
            setData(account_key, data)
        },
        getAccount() {
            return readData(account_key)
        },

        /**
         * 设置个人基本信息缓存
         */
        setUserInfo(data){
            setData(user_info_key, data)
        },
        getUserInfo(){
            return readData(user_info_key)
        },
        
        /**
         * 设置地址库缓存
         */
        setAddrRoom(data){
            setData(addr_key, data)
        },
        getAddrRoom(){
            return readData(addr_key)
        },

        /**
         * 设置首页nav缓存
         */
        setIndexNav(data) {
            setData(indexNav_key, data)
        },
        getIndexNav() {
            return readData(indexNav_key)
        },

        /**
         * 设置share_code缓存
         */
        setShareCode(data) {
            setData(share_key, data)
        },
        getShareCode() {
            return readData(share_key)
        },

        /**
         * 支付条形码缓存
         */
        setPayBarcode(data) {
          setData(pBarcode, data)
        },
        getPayBarcode(data) {
          return readData(pBarcode)
        },

        /**
         * 支付二维码缓存
         */
        setPayQrcode(data) {
          setData(pQrcode, data)
        },
        getPayQrcode(data) {
          return readData(pQrcode)
        },

        getRegPhone() {
          return readData(regPhone)
        },
        setRegPhone(data) {
          return setData(regPhone, data)
        },

        /**
         * 显示提示
         */
        setShowNotice(data) {
          setData(notice, data)
        },
        getShowNotice() {
          return readData(notice)
        },

        setToken(data) {
          setData(wxtoken, data)
        },
        getToken() {
          return readData(wxtoken)
        },

        /**
         * 设置地理位置
         */
        setLocation(data) {
          setData(location, data)
        },
        getLocation() {
          return readData(location)
        }
    }
}