// 提交［电话号码］  
function submitPhoneNum(phoneNum) {
    // 此处调用wx中的网络请求的API，完成电话号码的提交  
    return true
}

//提交［验证码］  
function submitIdentifyCode(identifyCode) {
    // 此处调用wx中的网络请求的API，完成短信验证码的提交  
    return true
}

// 提交［密码］,前一步保证两次密码输入相同  
function submitPassword(password) {
    //此处调用wx中的网络请求的API，完成密码的提交  
    return true
}

module.exports = {
    submitPhoneNum: submitPhoneNum,
    submitIdentifyCode: submitIdentifyCode,
    submitPassword: submitPassword
}  