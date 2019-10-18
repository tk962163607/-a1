// components/swiper/swiper.js
import { httpRequestGet } from '../../http/httpRequest.js';
const { regeneratorRuntime } = global
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        swiperUrl: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        swiperData: []
    },
    /**
     * 当组件挂载的时候调用
     */
    attached: function() {
        this.requestSwiperData()
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 请求首页轮播图数据
         */
        requestSwiperData: async function() {
            let res = await httpRequestGet(this.properties.swiperUrl, null, "SWIPER")
            console.log(res)
            this.setData({
                swiperData: res.message
            })
        },
    }
})