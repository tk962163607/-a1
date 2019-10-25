import utils from '../../utils/utils'
const computedBehavior = require('miniprogram-computed')
const { regeneratorRuntime } = global
Component({
    behaviors: [computedBehavior],
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        addressInfo: null
    },
    // 计算属性
    computed: {
        addressStr(data) {
            console.log("addressInfo", data.addressInfo)
            if (data.addressInfo === null) {
                return "请输入地址";
            } else {
                const addr = data.addressInfo;
                return addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 收货地址的点击事件
         */
        chooseAddress: async function(e) {
            const addInfo = await utils.getAddressInfo();
            if (addInfo) {
                console.log("addInfo", addInfo)
                this.setData({
                    addressInfo: addInfo
                });
            }
        },
    }
})