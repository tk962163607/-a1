// pages/authorize/authorize.js
import { httpRequestPost, httpURL } from '../../http/httpRequest.js';
const { regeneratorRuntime } = global
import utils from "../../utils/utils.js"
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    /**
     * 用户授权的事件，授权之后，用户信息在 e.detail 中
     * @param {*} e 
     */
    bindGetUserInfo: async function(e) {
        wx.showLoading({
            title: "登陆中",
            mask: true,
        });
        try {
            // 进行微信登陆
            let code = await utils.wxLogin();
            if (code) {
                // 用户进行了授权，获取用户信息
                let userInfo = e.detail;
                // 获取用户信息成功
                if (userInfo && userInfo.errMsg == "getUserInfo:ok") {
                    // 获取用户信息成功，进行自己服务器的登陆
                    let result = await httpRequestPost(httpURL.LOGIN, {
                        // 用户登录凭证
                        code: code,
                        // 完整用户信息密文
                        encryptedData: userInfo.encryptedData,
                        // 加密算法的初始向量
                        iv: userInfo.iv,
                        // 用户信息原始数据字符串
                        rawData: userInfo.rawData,
                        // 使用 sha1得到字符串
                        signature: userInfo.signature
                    })
                    if (result && result.message) {
                        // 登陆成功，成功之后把userInfo的数据保存到 全局变量中
                        app.globalData.userInfo = userInfo.userInfo;
                        // 把返回的token 保存到本地，后续 生成订单，支付等都需要携带这个token
                        app.setToken(result.message.token)
                        wx.showToast({
                            title: '登陆成功',
                            icon: 'success',
                            duration: 1000,
                            success: (result) => {
                                // 提示成功之后，回到上一个页面
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        });
                    } else {
                        wx.showToast({
                            title: '重新错误，请重新登陆',
                            icon: "none",
                            duration: 1000
                        })
                    }
                }
            }
        } catch (error) {} finally {
            // finally的意思是  不管我们在try中代码是执行成功还是会报错，都会执行这里面的代码
            wx.hideLoading();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})