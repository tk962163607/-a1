// pages/tab/home/home.js
const { httpRequestGet, httpURL } = require('../../../http/httpRequest.js')
const { regeneratorRuntime } = global
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // // 轮播图数据
        // swiperData: []
        swiperURL: httpURL.SWIPER_URL,
        // 分类数据
        cateData: [],
        // 楼层区数据
        floorData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 请求分类数据
        this.requestHomeCateData()
            // 获取楼层区数据
        this.requestHomeFloorData()
    },
    /**
     * 请求首页分类数据
     */
    requestHomeCateData: async function() {
        // 请求分类数据
        let data = await httpRequestGet(httpURL.HOME_CATE_URL, null, "HOME_CATE");
        // 刷新页面
        this.setData({
            cateData: data.message
        })
    },
    /**
     * 请求首页楼层区数据
     */
    requestHomeFloorData: async function() {
        let data = await httpRequestGet(httpURL.FLOOR_URL, null, "HOME_FLOOR")
        this.setData({
            floorData: data.message
        })
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