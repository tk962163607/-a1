// pages/order/order.js
let app = getApp();
import utils from "../../utils/utils.js"
import { httpRequestPost, httpURL } from '../../http/httpRequest.js';
const { regeneratorRuntime } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 地址对象
        addressInfo: null,
        // 收货地址
        addressStr: "",
        // 购物车数组
        cart: [],
        // 按钮显示文字
        submit: "提交订单",
        // 总价格
        totalPrice: "￥" + 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 读取收货地址
        let addressInfo = wx.getStorageSync('address') || null;
        let newArr = null;
        // 获取传递过来的type，来判断一下是从哪个页面跳转的，detail是详情页，cart是购物车页面
        if (options.type == 'detail') {
            newArr = [JSON.parse(options.info)]
        } else if (options.type == "cart") {
            // 从购物车列表中，将那些被勾选的商品，过滤出来，形成一个新的数组
            newArr = app.globalData.carts.filter(x => x.isCheck);
        }
        // 如果有收货地址，拼接起来
        let addressStr = addressInfo ? addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo : ""
        this.setData({
            cart: newArr,
            addressInfo: addressInfo,
            totalPrice: "￥" + app.computedTotalPrice(),
            addressStr: addressStr
        })
    },
    /**
     * 选择地址
     * @param {*} e 
     */
    chooseAddress: async function(e) {
        try {
            let address = await utils.getAddressInfo();
            console.log(address)
            if (address) {
                // 获取到了数据，保存到缓存中，并且刷新页面
                wx.setStorageSync("address", address);
                this.setData({
                    addressInfo: address,
                    addressStr: address.provinceName + address.cityName + address.countyName + address.detailInfo
                })
            }
        } catch (error) {
            console.log("获取地址失败", error)
        }
    },
    /**
     * 提交订单,需要携带参数 
     * order_price 订单价格
     * consignee_addr 订单地址
     * order_detail  订单详情
     * goods 商品列表
     * @param {*} e 
     */
    submitOrder: async function(e) {
        // 传递的参数比较复杂，我们单独先构建参数
        let params = {
            // 订单价格
            order_price: "0.01",
            consignee_addr: this.data.addressStr,
            // 订单列表所有数据,需要转成字符串
            order_detail: JSON.stringify(this.data.cart),
            // 需要重新构建，里面只需要 goods_id，goods_count,goods_price
            goods: this.data.cart.map(item => {
                return {
                    goods_id: item.id,
                    goods_count: item.count,
                    goods_price: item.price
                }
            })

        }
        let orderResult = await httpRequestPost(httpURL.ORDER_CREATED, params, "创建订单")
        if (orderResult.meta.status != 200) {
            // 创建订单失败
            wx.showToast({
                title: '生成订单失败',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        // 创建订单成功,生成预支付订单
        let unifiedorderRes = await httpRequestPost(httpURL.ORDER_UNIFIEDORDER, {
            order_number: orderResult.message.order_number
        }, "生成支付订单");
        if (unifiedorderRes.meta.status != 200) {
            // 预支付订单生成失败
            wx.showToast({
                title: '生成订单失败',
                icon: 'none',
                duration: 1500,
            });
            return;
        }
        // 调用微信支付
        let isPay = await utils.requestPay(unifiedorderRes.message.pay);
        if (!isPay) {
            // 支付失败，不用做任何处理
            return;
        }
        // 支付成功，比对一下后台服务器，是否支付成功
        let checkOrder = await httpRequestPost(httpURL.ORDER_CHECK, {
            order_number: orderResult.message.order_number
        }, "订单查询");
        if (checkOrder.meta.status !== 200) {
            // 说明没有支持成功，也可能是延后了，需要提示一下用户
            wx.showToast({
                title: '未检查到成功支付，稍后请和工作人员确认',
                duration: 1500
            });
            return
        }
        // 代码执行到这里，支付成功，需要把购物车支付过的商品删除掉
        app.removePayGoods();
        // 关闭当前页，跳转到订单列表页面，注意 redirectTo 不能调到 tabBar页面
        wx.redirectTo({
            url: '/pages/orderslist/orderslist'
        });
    }

})