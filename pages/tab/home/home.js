// pages/tab/home/home.js
import { httpRequestGet, httpURL } from '../../../http/httpRequest.js';
import utils from '../../../utils/utils.js'
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
    onShow: function() {
        console.log('Home页面show')
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
     * 扫描二维码
     */
    saomiao: async function() {
        let res = await utils.scanCode()
        if (res) {
            wx.showLoading({
                title: "跳转中",
                mask: true
            });

            // 如果返回的数据不为null，就代表成功，利用导航跳转到详情页面
            wx.navigateTo({
                url: res,
                complete: () => {
                    wx.hideLoading();
                }
            });


        }
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
        getApp().updateTabBarBadge();
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