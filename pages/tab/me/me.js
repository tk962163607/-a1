//获取应用实例
const app = getApp()
Page({
    data: {
        motto: '欢迎来到黑马优购',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function() {},
    /**
     * 跳转到登陆页面
     * @param {*} e 
     */
    goLogin: function(e) {
        wx.navigateTo({
            url: '/pages/authorize/authorize',
        });

    },
    onShow: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            console.log("没有获取到用户信息")
        }
    },
    /**
     * 查看订单点击事件
     */
    goOrderList: function() {
        wx.navigateTo({
            url: '/pages/orderslist/orderslist'
        });

    }
})