// components/tabgroup/tabgroup.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabgroupdata: Array

    },

    /**
     * 组件的初始数据
     */
    data: {
        active: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tabTap: function(e) {
            // 在组件中绑定了一个 data-index的自定义属性，值是对应的索引，当触发了点击，我们可以通过e.target.dataset 来获取到自定义属性的值
            let index = e.target.dataset.index;
            this.setData({
                active: index
            });
            // 通知外界
            this.triggerEvent("changed", index)
        }
    }
})