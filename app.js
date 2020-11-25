//app.js
global.regeneratorRuntime = require("/lib/regenerator-runtime/runtime");
import utils from "./utils/utils.js"
App({
    onLaunch: async function(e) {
        try {
            // 获取缓存中购物车的数据
            let storageData = wx.getStorageSync("carts");
            if (storageData) {
                this.globalData.carts = JSON.parse(storageData);
                // 有数据需要计算一下购物车数量
                this.computedCartsTotal()

            } else {
                this.globalData.carts = [];
            }
            // 如果用户登录过，还需要同步一样用户信息
            if (this.getToken() && await utils.checkUserInfoAuthorize()) {
                let userInfo = await utils.getUserInfo()
                this.globalData.userInfo = userInfo.userInfo
            }
        } catch (error) {
            console.log("获取缓存数据失败", error)
        }
        console.log('onLaunch', this)
    },
    globalData: {
        carts: Array,
        // 购物车被选中的数量
        total: 0,
        // 微信用户信息
        userInfo: null
    },
    /**
     * 监听globalData里面 total
     * @param {*} watchCall 对应页面的回调函数
     */
    watchTotal: function(watchCall) {
        let value = this.globalData.total;
        let obj = this.globalData
        Object.defineProperty(obj, "total", {
            // configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
            configurable: true,
            // 属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
            enumerable: true,
            // value 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined
            // 当外界修改了 total的值就会调用这个方法，我们可以在这个方法里面进行回调
            set: function(newValue) {
                value = newValue;
                watchCall(newValue);
            },
            get: function() {
                console.log("get", value)
                return value
            }

        })
    },
    /**
     * 监听 globalData里面 carts 的长度
     * @param {*} watchCall 对应页面的回调函数
     */
    watchCarts: function(watchCall) {
        let obj = this.globalData;
        // 这里默认的值应该是globalData里面的值
        let arr = this.globalData.carts;
        Object.defineProperty(obj, "carts", {
            // configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
            configurable: true,
            // 属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
            enumerable: true,
            set: function(newArr) {
                arr = newArr;
                watchCall(newArr);
            },
            get: function() {
                return arr
            }
        })
    },
    /**
     * 添加商品到购物车
     * @param {*} goods  商品对象
     */
    addGoodsToCart: function(goods) {
        let carts = this.globalData.carts;
        // 添加商品的时候需要判断一下，购物车中是否有这个商品，如果有，只做数量的增加
        let index = carts.findIndex(item => item.id === goods.goods_id);
        if (index != -1) {
            // 说明购物车中有数据,只需要对数量进行操作
            carts[index].count++;
        } else {
            // 如果购物车中没有，就需要初始化一个购物车对象，然后保存到里面
            let cartInfo = {
                    // 商品Id
                    id: goods.goods_id,
                    // 名称
                    name: goods.goods_name,
                    // 图片
                    pic: goods.goods_small_logo,
                    // 价格
                    price: goods.goods_price,
                    // 数量
                    count: 1,
                    // 是否默认被选中
                    isCheck: true
                }
                // 把新的商品数据添加到购物车里面
            carts.push(cartInfo);
        }
        // 为什么这里需要定义一个新的数组，是为了后续重新设置给 globalData 来触发 数据劫持
        this.globalData.carts = [...carts];
        // 只要购物车数据进行了调整，就需要同步到本地缓存
        this.saveCartsToStorage()
    },
    /**
     * 保存购物车数据到本地缓存
     */
    saveCartsToStorage: function() {
        try {
            wx.setStorageSync('carts', JSON.stringify(this.globalData.carts));
        } catch (error) {
            console.log(error)
        }
        // 保存完了需要重新计算一下总数
        this.computedCartsTotal()
    },
    /**
     * 修改商品数量的方法
     * @param {*} count 数量
     * @param {*} goods_id 商品id
     */
    updateGoodsCount: function(count, goods_id) {
        let carts = this.globalData.carts;
        carts.map(item => {
            if (item.id === goods_id) {
                // 当商品id相等，更新商品数量
                item.count = count;
            }
        });
        this.globalData.carts = [...carts];
        this.saveCartsToStorage();
    },
    /**
     * 计算购物车总数量
     */
    computedCartsTotal: function() {
        let count = 0;
        let carts = this.globalData.carts;
        carts.map(item => {
            if (item.isCheck) {
                count += item.count
            }
        })
        this.globalData.total = count;
        this.updateTabBarBadge()
    },
    /**
     * 修改商品的状态
     * @param {*} state 是否选中
     * @param {*} goods_id 商品id
     */
    updateGoodsState: function(state, goods_id) {
        let carts = this.globalData.carts;
        carts.map(item => {
                // id相同，更改状态
                if (item.id == goods_id) {
                    item.isCheck = state
                }
            })
            // 更新完之后需要重新保存到本地
        this.globalData.carts = [...carts]
        this.saveCartsToStorage()
    },
    /**
     * 更新tabBar的 badge
     */
    updateTabBarBadge: function() {
        wx.setTabBarBadge({
            index: 2,
            text: this.globalData.total + "",
        });
    },
    /**
     * 计算总价
     */
    computedTotalPrice: function() {
        let carts = this.globalData.carts;
        let totalPrice = 0;
        carts.map(item => {
            if (item.isCheck) {
                totalPrice += item.price * item.count
            }
        });
        return totalPrice.toFixed(2);
    },
    /**
     * 删除购物车的数据
     * @param {*} goods_id 商品Id
     */
    deleteCartItem: function(goods_id) {
        let carts = this.globalData.carts;
        // 获取到对应商品的索引
        let index = carts.findIndex(item => {
            return item.id == goods_id;
        })
        if (index != -1) {
            // 删除数组中对应的索引数据
            carts.splice(index, 1);
            // 重新设置给 globalData  为了触发我们自己封装的监听函数
            this.globalData.carts = [...carts];
            this.saveCartsToStorage()
        }
    },
    /**
     * 移除支付过的商品
     */
    removePayGoods: function() {
        // 支付成功后的商品，的checked属性是true，所以我们可以通过这种方式来实现
        let carts = this.globalData.carts;
        // 我们通过filter这个方法，过滤掉 isCheck为true的商品即可
        let newCarts = carts.filter(item => !item.isCheck);
        this.globalData.carts = [...newCarts]
    },
    /**
     * 获取用户token
     */
    getToken: function() {
        try {
            return wx.getStorageSync('token');
        } catch (error) {
            console.log(error)
        }
        return null;
    },
    /**
     * 设置token
     * @param {*} token 服务器返回的用户登录标识
     */
    setToken: function(token) {
        try {
            wx.setStorageSync('token', token);
        } catch (error) {}
    }
})