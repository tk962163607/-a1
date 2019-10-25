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
        pagesize: 20,
        // 总条目数
        totalCount: 0,
        // 是否数据加载完了
        isover: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取分类id
        let cId = options.cid;
        // 封装请求数据，默认是第一页，请求20条数据
        let params = {
            // cid: cId,
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
            goodsListData: [...this.data.goodsListData, ...data.message.goods],
            totalCount: data.message.total
        })
    },
    // 商品item的点击事件
    cardItemTabHandler: function(e) {
        let pid = e.currentTarget.dataset.pid;
        wx.navigateTo({
            url: '/pages/detail/detail?pid=' + pid,
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
        // 调用请求的方法，需要把请求的页面重置一下
        // 这里修改一下data里面的值，还不需要刷新页面，所以没有通过this.setData 来实现，直接通过this.data.pageNum 来修改
        this.data.pagenum = 1;
        this.data.goodsListData = [];
        // 封装一下请求数据对象
        let params = {
            // cid: cId,
            pagenum: this.data.pagenum,
            pagesize: 20
        };
        // 调用请求的方法
        this.requestGoodsListData(params)
            // 当请求完毕的时候，停止下拉刷新效果
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.goodsListData.length >= this.data.totalCount) {
            this.setData({
                isover: true
            })
            return
        }
        this.data.pagenum++;
        // 封装一下请求数据对象
        let params = {
            // cid: cId,
            pagenum: this.data.pagenum,
            pagesize: 20
        };
        // 调用请求的方法
        this.requestGoodsListData(params)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})