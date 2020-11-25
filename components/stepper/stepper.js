const computedBehavior = require('miniprogram-computed')
Component({
    behaviors: [computedBehavior],
    /**
     * 组件的属性列表
     */
    properties: {
        value: Number
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    computed: {
        reduceDisabled: function(data) {
            return data.value <= 1;
        },
        addDisabled: function(data) {
            return data.value >= 99;
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 减 按钮
         */
        reduceTap: function() {
            this.onChange(0)
        },
        /**
         * 加按钮
         */
        addTap: function() {
            this.onChange(1)
        },
        /**
         * 处理 加减按钮的函数
         * @param {*} type 0 代表减，1代表加
         */
        onChange: function(type) {
            let value = this.properties.value;
            if (type == 0) {
                // 如果 value 的值小于了1，那么不应该再让数值进行--
                if (value <= 1) {
                    return
                }
                value--;
            } else {
                // 如果 value 的值大于了99，那么不应该再让数值进行--
                if (value >= 99) {
                    return
                }
                value++;
            }
            this.setData({
                value: value
            });
            // 需要通知外界，里面的数值变化了
            this.triggerEvent('changed', value)
        }
    }
})