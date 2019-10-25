import rpx2px from '../../utils/rpx2px.js'
Component({
    lifetimes: {
        created: function() {
            console.log('组件被创建了，初始化动画对象')
            var animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            });
            this.animation = animation;
        }
    },
    /**
     * 组件的属性列表
     */
    properties: {
        actionItems: Array,
        isShow: {
            type: Boolean,
            // 监听 properties值是否被修改了
            observer: function(newValue, oldValue, path) {
                console.log(newValue, oldValue, path)
                    // 如果是true，代表要显示
                if (newValue) {
                    this.animation.height(this.computedHeight()).step();
                } else {
                    this.animation.height(0).step();
                }
                this.setData({
                    animationData: this.animation.export()
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationData: {}
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 点击了取消按钮
         * @param {*} e 
         */
        actionCancel: function(e) {
            this.setData({
                isShow: false
            });
            // 内部修改了状态值，需要通知外界进行数据的同步
            this.triggerEvent("keepStatus", this.data.isShow)
        },
        /**
         * action里面item的点击事件，我们不知道外界需要做什么处理，所以我们通过自定义函数来实现，传递出去点击的是第几个item
         * @param {*} e 
         */
        actionItemTap: function(e) {
            let index = e.target.dataset.index
            this.triggerEvent("actionChanged", index)
        },
        /**
         * 计算 action-sheet的高度
         */
        computedHeight: function() {
            let height = this.properties.actionItems.length * 105 + 110;
            return rpx2px(height);
        }
    }
})