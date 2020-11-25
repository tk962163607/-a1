// components/card/card.js
Component({
    options: {
        multipleSlots: true //开启多个插槽
    },
    externalClasses: ["left-view"],
    /**
     * 组件的属性列表
     */
    properties: {
        num: {
            type: Number,
            value: 0
        },
        price: {
            type: String,
            value: ""
        },
        title: {
            type: String,
            value: ""
        },
        thumb: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})