import utils from "../../../utils/utils.js"
let app = getApp();
const { regeneratorRuntime } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否为空
        isEmpty: app.globalData.carts.length > 0 ? false : true,
        // 购物车数据
        carts: app.globalData.carts,
        // 总价格
        totalPrice: '￥0.00',
        submit: '提交'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 调用方法来监听 total 的变化
        app.watchCarts(this.watchCartsCall)
        console.log("cart", app)
    },
    /**
     * 监听 globalData 里面 carts 的变化
     * @param {*} total 
     */
    watchCartsCall: function(carts) {
        if (carts.length > 0) {
            // 如果数量大于,就显示购物车的列表页，但是需要判断一下，如果当前是展示的，就没有必要刷新页面了
            if (this.data.isEmpty) {
                this.setData({
                    isEmpty: false
                })
            }
        } else {
            // 如果长度不大于0，说明没有数据，展示 空页面，同样需要判断一下
            if (!this.data.isEmpty) {
                this.setData({
                    isEmpty: true
                })
            }
        }
        // 主要购物车的数据变化了，就应该重新计算一下总价
        let totalPrice = app.computedTotalPrice()
            // 只要购物车的carts数据变化了，就需要更新页面
        this.setData({
            carts: [...carts],
            totalPrice: "￥" + totalPrice
        });
    },
    /**
     * 购物车商品数值变化的监听
     * @param {*} e 
     */
    countChanged: function(e) {
        // 拿到数量
        let count = e.detail;
        // 拿到商品id
        let id = e.currentTarget.dataset.id;
        getApp().updateGoodsCount(count, id)
    },
    /**
     * checkbox 状态发生改变的时候触发
     * @param {*} e 
     */
    checkboxChanged: function(e) {
        let checkboxValue = e.detail.value[0];
        let groupValue = e.currentTarget.dataset.id;
        // 当 checkboxValue 等于 groupValue 说明被选中了，反之没有
        getApp().updateGoodsState(checkboxValue == groupValue, groupValue)
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
        getApp().updateTabBarBadge()
        this.setData({
            totalPrice: "￥" + app.computedTotalPrice()
        });
    },
    /**
     * 删除商品的事件函数
     * @param {*} e 
     */
    delete: function(e) {
        let goodsId = e.target.dataset.id;
        app.deleteCartItem(goodsId)
    },
    /**
     * 提交订单的事件函数
     */
    submitOrder: async function() {
        // 判断用户是否登陆，如果没有登陆，跳转到登陆页面，如果登陆了，直接跳转到订单页面
        // 通过token来进行判断,token 我们保存到缓存中，并且有多个地方使用，我们写在 app.js 中
        if (app.getToken()) {
            let totalPrice = this.data.totalPrice;
            // 拿到的总价 是一个字符串，并且前面有 ￥ 符号，所以我们先要去掉这个符号，然后转成 数字类型进行判断
            let priece = totalPrice.split("￥")[1]
            if (parseInt(priece) <= 0) {
                // 说明没有要结算的商品，提示用户
                wx.showToast({
                    title: '没有需要购买的商品',
                    icon: 'none',
                    duration: 1500,
                });
            }
            wx.navigateTo({
                url: '/pages/order/order?type=cart',
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '还未登陆，点击确定去登陆',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                    if (result.confirm) {
                        wx.navigateTo({
                            url: '/pages/authorize/authorize',
                        });

                    }
                },
            });
        }

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