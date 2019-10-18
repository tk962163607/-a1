// pages/goodslist/goods_list.js
import { httpRequestGet, httpURL } from '../../http/httpRequest.js';
const { regeneratorRuntime } = global
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 商品列表数据
        goodsListData: [],
        // 页面索引
        pagenum: 1,
        // 每页条目数
        pagesize: 20
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取分类id
        let cId = options.cid;
        // 封装请求数据，默认是第一页，请求20条数据
        let params = {
            cid: cId,
            pagenum: 1,
            pagesize: 20
        }
        this.requestGoodsListData(params)
    },
    /**
     * 商品列表的网络加载
     * @param {*} params 传递的数据
     */
    requestGoodsListData: async function(params) {
        let data = await httpRequestGet(httpURL.GOODS_LIST_URL, params, "GOOD_LIST")
        this.setData({
            goodsListData: data.message
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