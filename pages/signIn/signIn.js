var app = getApp()
const page_code = 'wxpro_crm_member_sign';
var WxParse = require('../../wxParse/wxParse.js');
var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();

//月份天数表
var DAY_OF_MONTH = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

//判断当前年是否闰年
var isLeapYear = function (year) {
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        return 1
    else
        return 0
};

//获取当月有多少天
var getDayCount = function (year, month) {
    return DAY_OF_MONTH[isLeapYear(year)][month];
};

//获取当前索引下是几号
var getDay = function (index) {
    return index - curDayOffset;
};

var pageData = {
    date: "",                //当前日期字符串

    //arr数据是与索引对应的数据信息
    arrIsShow: [],          //是否显示此日期
    arrDays: [],            //关于几号的信息
    arrInfoEx: [],          //农历节假日等扩展信息
    arrInfoExShow: [],      //处理后用于显示的扩展信息

    //选择一天时显示的信息
    detailData: {
        curDay: "",         //detail中显示的日信息
        curInfo1: "",
        curInfo2: "",
    },
    isSigned:true,
    signDay: [],// 
    dayList: [],//本月已签到的日期
    days: 0,//连续签到天数
    current_day: 0,
    today_day: 0,
    rewards:'',//签到奖励规则
    is_switch: true,//开关
    /**
     * 可配置项（签到规则）
     */
    page_configs:{
        sign_rules:''
    }
}

//设置当前详细信息的索引，前台的详细信息会被更新
var setCurDetailIndex = function (index) {
    var curEx = pageData.arrInfoEx[index];
    curDay = curEx.sDay - 1;
    pageData.detailData.curDay = curEx.sDay;
    pageData.detailData.curInfo1 = "农历" + curEx.lunarMonth + "月" + curEx.lunarDay;
    pageData.detailData.curInfo2 = curEx.cYear + curEx.lunarYear + "年 " +         curEx.cMonth + "月 " + curEx.cDay + "日 " + curEx.lunarFestival;

}

//刷新全部数据
var refreshPageData = function (year, month, day) {
    pageData.date = year + '年' + (month + 1) + '月';

    var offset = new Date(year, month, 1).getDay();

    for (var i = 0; i < 42; ++i) {
        pageData.arrIsShow[i] = i < offset || i >= getDayCount(year, month) + offset ? false : true;
        pageData.arrDays[i] = i - offset + 1;
        var d = new Date(year, month, i - offset + 1);
        var dEx = calendarConverter.solar2lunar(d);
        pageData.arrInfoEx[i] = dEx;
        if ("" != dEx.lunarFestival) {
            pageData.arrInfoExShow[i] = dEx.lunarFestival;
        }
        else if ("初一" === dEx.lunarDay) {
            pageData.arrInfoExShow[i] = dEx.lunarMonth + "月";
        }
        else {
            pageData.arrInfoExShow[i] = dEx.lunarDay;
        }
    }
    setCurDetailIndex(offset + day);
};

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth();
var curDay = curDate.getDate();
refreshPageData(curYear, curMonth, curDay - 1);

Page({
    data: pageData,
    onLoad: function (options) {
        var page = this;
        var array = []
        array.year = curYear
        array.month = curMonth + 1
        page.getSigninInfo(array);
       
    },
    onShow: function(options){
        var that = this
        that.page_config();//可配置签到规则
        that.signRule()//签到赠送规则
    },

    /**
     * 签到规则接口获取
     */
    page_config:function(){
        var that = this;
        app.crmApi(
            app.apiService.crm.pageConfig,
            {page_code: page_code},
            that.pageConfigSuccess
        )
    },

    /**
     * 签到规则接口获取  成功
     */
    pageConfigSuccess: function(res){
        var that = this;
        const config = res.data.data[page_code].configs;
        var tmpConfig = that.data.page_configs
        for (let i in tmpConfig){
            tmpConfig[i] = config[i].value_type == 2 ? config[i].value_text : config[i].value
        }
        var temp = WxParse.wxParse('page_configs.sign_rules', 'html', that.data.page_configs.sign_rules, that, 5);
        var page_configs = that.data.page_configs.sign_rules
        that.setData({
            page_configs: temp
        })
    },

    /**
     * 会员帐户信息获取
     */
    accountDetail:function(){
        var that = this;
        var data = {
            token: app.storage.getAuth().token
        }
        app.crmApi(
            app.apiService.crm.getAccountDetail,
            data,
            that.accountDetailSuccess
        )
    },

    /**
     * 会员帐户信息获取  成功
     */
    accountDetailSuccess:function(res){
        var that = this;
        if (res.data.ret == 200){
            var accountInfo = res.data.data
            app.storage.setAccount(accountInfo)
        }
    },

    /**
     * 签到赠送规则接口获取
     */
    signRule:function(){
        var that = this;
        var data = {
            token:app.storage.getAuth().token
        }
        app.crmApi(
            app.apiService.crm.signRewards,
            data,
            that.signRuleSuccess
        )
    },

     /**
     * 签到赠送规则接口获取  成功
     */
    signRuleSuccess:function(res){
        var that = this;
        if(res.data.ret == 200){
            var info = res.data.data;
            for(var i = 0;i < info.length;i++){
                that.setData({
                    rewards: info[i].name
                })
            }
        }
    },

    /**
     *  签到接口获取
     */
    sign: function(){
        var that = this;
        var data = {
            token: app.storage.getAuth().token
        }
        app.crmApi(
            app.apiService.crm.getSign,
            data,
            that.signSuccess,
        )
        that.setData({
            is_switch: false
        }) 
    },

    /**
     *  签到接口获取  成功
     */
    signSuccess: function(res){
        var that = this;
        if(res.data.ret == 200){
            that.qiandaochuli(); //签到处理
            that.accountDetail();//会员账户接口
        }
    },
    
    /**
     * 签到处理(连续签到处理)
     */
    qiandaochuli: function () {
        var that = this;
        var signDay = that.data.signDay//后台传输过来的本月签到天数
        var signDay_list = signDay
        if (!signDay_list) {
            signDay_list = []
        }
        signDay_list.push(new Date().getDate())
        var list = signDay_list.reverse()
        //计算连续签到天数
        var dd = 0;
        for (var i = 0; i < list.length; i++) {
            if (i == 0 && list[i] > 0) {
                dd = 1
            } else if (list[i - 1] - list[i] == 1) {
                dd++
            } else {
                break;
            }
        }
        var days = that.data.days + dd;
        that.setData({
            signDay: signDay_list,
            days: days,
            isSigned: true,
        })
    },

    //签到点击按钮
    signBtn: function () {
        var that = this;
        if(!that.data.is_switch){
            return
        }
        else{
            that.sign();//调用签到接口
        }
    },
    
    /**
     * 签到详情接口获取
     */
    getSigninInfo: function(e){
       var that = this;
       var year = curDate.getFullYear();
       var month = curDate.getMonth() + 1;
       var day = curDate.getDate();
       var days = day
       if (year == e.year && month == e.month) {
           if (e.day) {
               day = e.day
           }
           that.setData({
               current_day: day,
               today_day: days,
           })
       } else {
           day = 1
           if (e.day) {
               day = e.day
           }
           that.setData({
               current_day: day,
           })
       }

    //    var dateStr = "2017/12/6 20:10:20";
    //    var date = new Date(dateStr);
       var datas = e.year + '-' + e.month + '-01'
       var data = {
            token: app.storage.getAuth().token,
            date: datas
       } 
        app.crmApi(
            app.apiService.crm.getSignupInfo,
            data,
            that.getSigninInfoSuccess
        )

    },

    /**
     * 签到详情接口获取  成功
     */
    getSigninInfoSuccess: function(res){
        var that = this;
        var signInInfo = res.data.data;
        if (res.data.ret == 200) {
            var signDay = []
            if (signInInfo.dayList) {
                signDay = signInInfo.dayList
            }
            that.setData({
                signDay: signDay,
                days: signInInfo.days,
                integral: signInInfo.integral,
                isSigned: signInInfo.isSigned
            })
        }
    },

    goToday: function (e) {
        var that = this
        curDate = new Date();//当前时间
        curMonth = curDate.getMonth();
        curYear = curDate.getFullYear();
        curDay = curDate.getDate();
        refreshPageData(curYear, curMonth, curDay - 1);
        that.setData(pageData);
        var array = []
        array.year = curYear
        array.month = curMonth + 1
        array.day = curDay + 1
        that.getSigninInfo(array)
    },
    goLastMonth: function (e) {
        var that = this
        if (0 == curMonth) {
            curMonth = 11;
            --curYear
        }
        else {
            --curMonth;
        }

        refreshPageData(curYear, curMonth, 0);
        var isSigned = that.data.isSigned
        var days = that.data.days
        pageData.days = days
        pageData.isSigned = isSigned
        that.setData(pageData);
        var array = []
        array.year = curYear
        array.month = curMonth + 1
        array.day = 1
        that.getSigninInfo(array)
    },

    goNextMonth: function (e) {
        var that = this
        if (11 == curMonth) {
            curMonth = 0;
            ++curYear
        }
        else {
            ++curMonth;
        }

        refreshPageData(curYear, curMonth, 0);
        var isSigned = that.data.isSigned
        var days = that.data.days
        pageData.days = days
        pageData.isSigned = isSigned
        that.setData(pageData);
        var array = []
        array.year = curYear
        array.month = curMonth + 1
        array.day = 1
        that.getSigninInfo(array)
    },

    selectDay: function (e) {
        var that = this
        setCurDetailIndex(e.currentTarget.dataset.dayIndex);
        that.setData({
            detailData: pageData.detailData,
        })
        that.setData({
            current_day: that.data.detailData.curDay,
        })
    },

    bindDateChange: function (e) {
        var that = this
        var arr = e.detail.value.split("-");
        refreshPageData(+arr[0], arr[1] - 1, arr[2] - 1);
        var isSigned = that.data.isSigned
        var days = that.data.days
        pageData.days = days
        pageData.isSigned = isSigned
        that.setData(pageData);
        var array = []
        array.year = arr[0]
        array.month = arr[1]
        array.day = arr[2]
        that.getSigninInfo(array)
    },

});