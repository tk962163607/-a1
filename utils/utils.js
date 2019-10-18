export default {
    /**
     * 获取屏幕可用高度的方法
     */
    getWindowHeight() {
        const res = wx.getSystemInfoSync();
        return res.windowHeight
    }
}