module.exports = {
    takeout: {
        shopDetail: 'App.Shop.ShopDetails',//店铺详情
        getGoods: 'App.Goods.GetGoods',//商品列表
        getGoodsSku: 'App.Goods.GetSkuGoods',//商品规格
        getSkuStock: 'App.Goods.GetGoodsStock',//商品规格库存
        getGoodsDetail: 'App.Goods.GetGoodsDetail',//商品详情
        getCart: 'App.Cart.GetAllGoods', //购物车列表
        editGoods: 'App.Cart.EditGoods', //购物车
        orderSubmit: 'App.Outpos.Ordersubmit',//提交订单 
        getPurchase: 'App.Outpos.Purchase',//多规格立即购买
        getOrderList: 'App.Outpos.Querylist' ,//订单列表
        getOrderDetail: 'App.Outpos.Detail',//订单详情
        pay: 'App.Outpos.OrderPay',//订单支付
        finish: 'App.Outpos.FinishOrder',//订单签收
        deleteCart:'App.Cart.ClearCart',//清空购物车商品
    },
    crm: {
        getAddress: 'App.Location.GetAddress',//修改默认地址
        getQRcode: 'App.User.GetQRcode',//二维码更新
        pageConfig:'App.WxConfig.GetCrmPageBoundConfigs',//页面配置
        getWxPhone: 'App.WxConfig.DecryptData',//获取微信授权手机号
        wxLogin: 'App.User.WxLogin',//用户登录
        acctDetail: 'App.User.GetMemberAccountDetail',//会员账户信息
        wxRegister:'App.User.Register',//用户注册
        memberDetail: 'App.User.MemberDetail',//个人资料读取
        memberEdit: 'App.User.MemberEdit',//会员资料编辑
        userShare: 'App.User.UserShare',//用户分享
        getFansList: 'App.User.GetFansList', //粉丝列表
        cardInfo:'App.Pos.GetMemInfo',//会员卡详情
        indexNav: 'App.Module.Index',//首页nav
        getNoticeList: 'App.User.GetMemberMessage',//消息通知
        balance: 'App.Pos.GetBalance',//获取余额
        getBalanceList: 'App.Pos.GetBalanceList',//余额列表
        recharge: 'App.Pos.Recharge', //充值
        getRechargeRule:'App.Pos.GetRechargeRule',//充值规则
        getGiveMoney:'App.Pos.GetGiveMoney',//充值奖励
        recargeValues: 'App.Pos.GetRecargeValues',//显示可充值金额
        rechargeAgreement:'App.Explain.GetExplainforRecharge',//充值协议
        integral: 'App.Pos.GetIntegral',//获取积分
        integralList: 'App.Pos.GetIntegralList',//积分列表
        integralExplain: 'App.Explain.IntegralExplain',//积分说明
        couponList: 'App.Coupon.GetCouponList',//优惠券列表
        userableCoupon: 'App.Coupon.GetAvailableCoupon',//可用优惠券列表
        couponExchange: 'App.Coupon.GetCouponQrCode',//优惠券兑换
        TLcouponList: 'App.Coupon.GetExchangeList',//提领券列表 
        getTLexchange: 'App.Coupon.ExChange',//提领券兑换
        getAddressDetail:'App.Address.GetAddressDetail',//地址详情（修改默认）
        getNearByStores:'App.Store.GetNearByStores',//附近门店列表
        consumeList: 'App.Pos.GetPayRecord',//消费记录列表
        getPayDetail: 'App.Pos.GetPayDetail',//消费详情
        getAddressList: 'App.Address.GetAddressList',//收货地址列表
        getAddrRoom: 'App.Address.GetAddressLib',//地址库
        addrEdit: 'App.Address.Edit',//编辑地址
        addrDel: 'App.Address.Del',//删除地址
        addrAdd: 'App.Address.Add',
        addrDefault:'App.Address.EditDefault',//地址设为默认
        sendVerify:'App.User.SendVerifyCode', //发送短信
        bindPhone:'App.User.Bindphone', //绑定手机号
        acctInfo: 'App.User.GetMemberAccountDetail', //用户帐户信息
        memInfo: 'App.User.GetMemberDetailInfo', //获取会员基本信息
        memLogin: 'App.User.MemberLogin', //会员登录，仅获取权限信息
        signRewards: 'App.User.GetSignRewards',//签到赠送规则
        getSign: 'App.User.Signup',//签到
        getSignupInfo : 'App.User.Getsignupinfo',//签到详情
        changePhone: 'App.User.ChangePhone',
        miniText: 'App.Text.GetMiniPageText',
        goodBrandList: 'App.GoodsBrand.GetList',
        getGoodsCategoryList: 'App.GoodsCategory.GetList',
        brandServiceList: 'App.ConfigImage.GetList',
        getGoodsList: 'App.Goods.GetList',
        getGoodsDetail: 'App.Goods.GetDetail',
        getBrandDetail: 'App.GoodsBrand.GetDetail',
        getAttrValues: 'App.Goods.GetGoodsAttributeCombineValueList',
        getSkuGoods: 'App.Goods.GetSkuGoods',
        getSkuDetail: 'App.Goods.GetSkuDetail',
        goodsPay: 'App.Goods.Pay',
        queryCity: 'App.Location.GetCity',
        addToCart: 'App.Cart.AddToCart',
        cartList: 'App.Cart.GetList',
        updateCart: 'App.Cart.UpdateCart',
        removeCartGood: 'App.Cart.RemoveCart',
        cartOrder: 'App.Goods.CartPay',
        singleBuy: 'App.Goods.Pay',
        orderDetail: 'App.Order.GetOrderDetail',
        orderList: 'App.Order.OrderList',
        rebuyOrder: 'App.Order.RebuyOrder',
        cartCount: 'App.Cart.CartCount',
        emtyCart: 'App.Cart.EmptyCart',
        workspaceList: 'App.Workspace.GetList',
        getDefaultAddress: 'App.Address.GetAddressDetail',
        getMiniQrCode: 'App.User.GetMiniQrCode',
        checkVerifyCode: 'App.SMS.CheckVerifyCode',
        removeCartSelectedGoods: 'App.Cart.RemoveSelectedGoods',
        confirmReceived: 'App.Order.OrderReceived',
        removeOrder: 'App.Order.RemoveOrder',
        orderAfterSale: 'App.Order.OrderAfterSale',
        cancelOrder: 'App.Order.CancelOrder',
        getRecommendGoodsList: 'App.Goods.GetRecommendList',
        searchAllAddress: 'App.Address.SearchAllAddress',
        hotGoods: 'App.HotGoods.GetList',
        getOrderNum: 'App.Order.GetOrderNum',
        getAllBrands: 'App.GoodsBrand.GetAll',
        getAllSignatures: 'App.Goods.GetAllSignature',
        getFirstMapLocation: 'App.Order.GetTransFirstLocation',
        houseLayoutAll: 'App.HouseLayout.GetAll',
        getConsAll: 'App.Construct.GetAll',
        couponDetail: 'App.Coupon.GetDetail',
        getNewBoun: 'App.NewBoun.GrantNew',
        checkFetched: 'App.NewBoun.CheckFetched',
        getManagerInfo: 'App.ManagerWorkspace.GetManagerInfo',
        getAllCouponType: 'App.Coupon.GetAllType',
        exchangeCoupon: 'App.Coupon.ExchangeCoupon',
        getOrderAddress: 'App.Order.GetOrderAddress',
        getSmartGoods: 'App.SmartGoods.GetGoods'
    }
}