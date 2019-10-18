// pages/tab/cates/cates.js
import { httpRequestGet, httpURL } from '../../../http/httpRequest.js';
const { regeneratorRuntime } = global
import utils from "../../../utils/utils.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 分类数据，数据已经封装好，对应子分类的数据都包含在了大分类的里面
        categoriseData: [],
        // 对应 二三级的分类数据
        childData: [],
        // 屏幕高度
        screenHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.requestCategoriseData()
    },
    /**
     * 加载分类列表的数据
     */
    requestCategoriseData: async function() {
        const data = await httpRequestGet(httpURL.CATEGORIES_URL, null, 'CATEGORIES')
        const screenHeight = utils.getWindowHeight()
        this.setData({
            // 分类所有数据
            categoriseData: data.message,
            // 对应一级分类下面二三级分类数据
            childData: data.message[0].children,
            screenHeight: screenHeight
        })
    },
    tabChanged: function(e) {
        // 对应的索引在 e.detail 里面,我们可以通过索引获取到对应的 tabItem
        let tabItem = this.data.categoriseData[e.detail];
        this.setData({
            childData: tabItem.children
        })
    },
    // 三级分类的点击事件
    cateTapHandler: function(e) {
        wx.navigateTo({
            url: '/pages/goodslist/goods_list?cid=' + e.currentTarget.dataset.id,
        });
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