// pages/detail/detail.js
import { httpRequestGet, httpURL } from '../../http/httpRequest.js';
import WxParse from '../../assets/wxParse/wxParse.js'

import drawQrcode from '../../utils/weapp.qrcode.esm.js'

import utils from '../../utils/utils.js'

import rpx2px from '../../utils/rpx2px.js'
const { regeneratorRuntime } = global
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(300)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsInfo: {},
        pid: 0,
        // 二维码宽度
        qrcodeWidth: qrcodeWidth,
        // 是否显示二维码
        isShowErWeiMa: false,
        // action-sheet 的item
        actionItems: ["保存", "分享"],
        // 是否显示 action-sheet
        isShow: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.pid = options.pid;
        this.requestGoodsDetail(options.pid)
    },
    /**
     * 加载商品详情数据
     * @param {*} pId 商品id
     */
    requestGoodsDetail: async function(pId) {
        const data = await httpRequestGet(httpURL.GOODS_DETAIL_URL, { goods_id: pId }, "GOODS_DETAIL");
        /**
         * WxParse.wxParse(bindName , type, data, target,imagePadding)
         * 1.bindName绑定的数据名(必填)
         * 2.type可以为html或者md(必填)
         * 3.data为传入的具体数据(必填)
         * 4.target为Page对象,一般为this(必填)
         * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
         */
        WxParse.wxParse("article", "html", data.message.goods_introduce, this, 5)
        this.setData({
            goodsInfo: data.message
        })

    },
    /**
     * 轮播图图片的点击事件
     * @param {*} e 事件对象
     */
    preview: function(e) {
        // 获取对应图片地址
        const url = e.target.dataset.url;
        // 查看大图
        wx.previewImage({
            current: url,
            urls: this.data.goodsInfo.pics.map(item => item.pics_big),
        });

    },
    /**
     * 生成二维码点击事件，根据商品id来生成
     * @param {*} e 
     */
    createErWeiMa: async function(e) {
        if (this.data.isShowErWeiMa) {
            // 如果当前二维码是展示的，就不需要再生成
            return;
        }
        wx.showLoading({
            title: "请稍等",
            mask: true
        });

        // 根据id 拼接要生成的字符串
        let erweimaStr = "/pages/detail/detail?pid=" + e.target.dataset.pid;
        let imgToBase64 = await utils.netWordImgToBase64(this.data.goodsInfo.pics[0].pics_big);
        if (!imgToBase64) {
            // 如果没有获取到对应的图片，就用默认的logo
            imgToBase64 = "../../assets/icon/timg.jpg"
        }
        // 调用第三方的方法来生成二维码
        drawQrcode({
            // 二维码宽度
            width: this.data.qrcodeWidth,
            // 二维码高度
            height: this.data.qrcodeWidth,
            // canvasid，根据这个id找到对应的canvas来进行绘制
            canvasId: 'canvas',
            // ctx: wx.createCanvasContext('myQrcode'),
            // 生成二维码的文本
            text: erweimaStr,
            // v1.0.0+版本支持在二维码上绘制图片
            image: {
                // 图片地址
                imageResource: imgToBase64,
                // 图片在canvas里面的坐标
                dx: this.data.qrcodeWidth / 2 - 30,
                dy: this.data.qrcodeWidth / 2 - 30,
                // 图片宽度和高度
                dWidth: 60,
                dHeight: 60
            }
        })
        wx.hideLoading();

        this.setData({
            isShowErWeiMa: true
        })
    },
    /**
     * 遮罩点击事件，点击后隐藏
     */
    maskTapHandler: function(e) {
        console.log(e)

        // 如果当前目标元素独享有 target属性，并且等于 currentTarget的target属性，那么就代表点击的mask遮罩
        if (e.currentTarget.dataset.target === e.target.dataset.target) {
            // 如果 action-sheet显示了，点击了遮罩，让action-sheet进行隐藏
            if (this.data.isShow) {
                this.setData({
                    isShow: false
                })
                return
            }
            this.setData({
                isShowErWeiMa: false,
            })
        }
    },
    /**
     * 长按保存图片事件
     * @param {*} e 
     */
    save: function(e) {
        this.setData({
            isShow: true
        })
    },
    /**
     * action-sheet里面item点击时候出发，传递过来index代表对应索引
     * @param {*} e 
     */
    actionChanged: async function(e) {
        this.setData({
            isShow: false
        })
        if (e.detail == 0) {
            wx.showLoading({
                title: "保存中",
                mask: true,
            });

            // 保存二维码
            let res = await utils.canvasToTempFile({
                // 保存canvas的宽度和高度
                width: this.data.qrcodeWidth,
                height: this.data.qrcodeWidth,
                // 输出保存临时文件的宽度和高度
                destWidth: this.data.qrcodeWidth,
                destHeight: this.data.qrcodeWidth,
                // canvas画布的id
                canvasId: 'canvas'
            });
            if (res) {
                //    返回的数据不为null 说明保存成功，我们需要拿到保存的临时地址
                let tempPath = res.tempFilePath
                let savaRes = await utils.saveImageToPhotosAlbum(tempPath);
                if (savaRes) {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 1500,
                    });
                }
            }
            wx.hideLoading();
        } else if (e.detail == 1) {
            // 分享二维码
        }

    },
    /**
     * 同步isShow状态值
     * @param {*} e 
     */
    keepStatus: function(e) {
        // 内部组件修改了状态值，里面已经做了对应的效果处理，外界只需要同步值即可，不需要调用setData
        this.data.isShow = e.detail;
    },
    /**
     * 添加到购物车
     */
    addToCart: function() {

    },
    /**
     * 立即购买
     */
    onClickButton: function() {

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
    onShareAppMessage: function(e) {
        return {
            title: this.data.goodsInfo.goods_name,
            page: "/pages/detail/detail?pid=" + this.data.pid,
            success: function(res) {
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 1500
                });

            }
        }
    }
})