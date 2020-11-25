import { httpRequestGet, httpURL } from '../../http/httpRequest.js';
const { regeneratorRuntime } = global
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 默认被激活的标签页的索引
        active: 0,
        // 全部 订单列表
        allOrderList: [],
        // 待付款 订单列表
        waitOrderList: [],
        // 已付款 订单列表
        finishOrderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getOrdersList(this.data.active)
    },
    /**
     * 查询所有订单信息 
     * @param {*} type 1:全部订单; 2:待付款订单; 3:已付订单
     */
    getOrdersList: async function(index) {
        let allOrders = await httpRequestGet(httpURL.ORDER_LIST, {
            type: index + 1
        }, "订单列表");
        console.log(allOrders)
            // 返回的数据 在 order_detail 字段里面，但是是一串字符串，我们需要转换一下
        allOrders.message.orders.forEach(item => {
            return item.order_detail = JSON.parse(item.order_detail)
        });
        if (index === 0) {
            this.setData({
                allOrderList: allOrders.message.orders
            })
        } else if (index === 1) {
            this.setData({
                waitOrderList: allOrders.message.orders
            })
        } else if (index === 2) {
            this.setData({
                finishOrderList: allOrders.message.orders
            })
        } else {
            wx.showToast({
                title: '订单类型错误',
                duration: 1500,
            });

        }
    },
    /**
     * tab栏切换的事件
     * @param {*} e 
     */
    tabChanged: function(e) {
        this.data.active = e.detail.index
        this.getOrdersList(this.data.active)
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