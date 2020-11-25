export default {
    /**
     * 获取屏幕可用高度的方法
     */
    getWindowHeight() {
        const res = wx.getSystemInfoSync();
        return res.windowHeight
    },
    /**
     * 获取地址信息
     */
    getAddressInfo() {
        return new Promise((resovle, reject) => {
            wx.chooseAddress({
                success: (result) => {
                    if (result.errMsg === "chooseAddress:ok") {
                        // 获取成功
                        resovle(result)
                    } else {
                        reject(null)
                    }
                },
                fail: () => {
                    reject(null)
                },
            });

        })
    },
    /**
     * 将canvas保存到临时文件
     * @param {*} params 参数对象
     */
    canvasToTempFile(params) {
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: params.width,
                height: params.height,
                destWidth: params.destWidth,
                destHeight: params.destHeight,
                canvasId: params.canvasId,
                success: (res) => {
                    resolve(res)
                },
                fail: () => {
                    wx.showToast({
                        title: '保存失败',
                        icon: 'none',
                        duration: 1500,
                    });
                    reject(null)
                }
            });
        })
    },
    /**
     * 将图片保存到系统相册
     * @param {*} tempPath 图片临时地址
     */
    saveImageToPhotosAlbum(tempPath) {
        return new Promise((resolve, reject) => {
            wx.saveImageToPhotosAlbum({
                filePath: tempPath,
                success: (result) => {
                    console.log(result)
                    resolve(result)
                },
                fail: () => {
                    wx.showToast({
                        title: '保存失败',
                        icon: 'none',
                        duration: 1500,
                    });
                    reject(null)
                },
            });

        })
    },
    /**
     * 扫描二维码的方法
     */
    scanCode() {
        return new Promise((resovle, reject) => {
            wx.scanCode({
                // 是否只允许扫描，不能使用相册
                onlyFromCamera: false,
                //   barCode 一维码
                //   qrCode  二维码
                //   datamatrix Data Matrix 码
                //   pdf417   PDF417 条码
                scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
                success: (result) => {
                    if (result.errMsg === "scanCode:ok") {
                        resovle(result.result);
                    } else {
                        wx.showToast({
                            title: '扫描失败',
                            icon: 'none',
                            duration: 1500,
                        });
                        reject(null)
                    }
                },
                fail: () => {
                    wx.showToast({
                        title: '扫描失败',
                        icon: 'none',
                        duration: 1500,
                    });
                    reject(null)
                },
                complete: () => {}
            });
        })
    },
    /**
     * 网络图片转Base64
     * @param {*} imgUrl 图片路径
     */
    netWordImgToBase64(imgUrl) {
        return new Promise(((resolve, reject) => {
            wx.downloadFile({
                url: imgUrl,
                success(res) {
                    wx.getFileSystemManager().readFile({
                        filePath: res.tempFilePath, //选择图片返回的相对路径
                        encoding: 'base64', //编码格式
                        success: res => { //成功的回调
                            resolve('data:image/png;base64,' + res.data)
                        },
                        fail: () => {
                            reject(null)
                        }
                    })
                }
            })

        }))
    },
    /**
     * 调用微信登录
     */
    wxLogin() {
        return new Promise((resolve, reject) => {
            wx.login({
                timeout: 10000,
                success: (result) => {
                    if (result.errMsg == "login:ok") {
                        console.log("微信登录成功")
                        resolve(result.code)
                    } else {
                        console.log("微信登录失败")
                        reject(null)
                    }
                },
                fail: () => {
                    console.log("登录失败")
                    reject(null)
                },
            });
        })
    },
    /**
     * 检查用户信息的授权
     */
    checkUserInfoAuthorize() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (result) => {
                    if (result.errMsg == "getSetting:ok") {
                        // 调用授权成功，授权信息里面包含了 地址，用户信息，定位，我们判断用户信息是否授权就行了
                        if (result.authSetting['scope.userInfo']) {
                            // 授权成功
                            resolve(true)
                        } else {
                            // 授权失败
                            reject(false)
                        }
                    }
                },
                fail: () => {
                    // 授权失败
                    reject(false)
                },
                complete: () => {}
            });
        })
    },
    /**
     * 获取微信用户信息
     */
    getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                withCredentials: 'true',
                lang: 'zh_CN',
                timeout: 10000,
                success: (result) => {
                    if (result.errMsg == "getUserInfo:ok") {
                        console.log('获取用户信息成功')
                        resolve(result)
                    } else {
                        console.log("获取用户信息失败")
                        reject(null)
                    }
                },
                fail: () => {
                    console.log("获取用户信息失败")
                    reject(null)
                }
            });
        })
    },
    /**
     * 微信支付
     * @param {*} payOptions
     * @return isPaySuccess  true 代表支付成功 | false 代表支付失败 
     */
    requestPay(payOptions) {
        return new Promise((resolve, reject) => {
            // 进行订单的支付，调用微信支付功能
            wx.requestPayment({
                //时间戳
                timeStamp: payOptions.timeStamp,
                //随机字符串
                nonceStr: payOptions.nonceStr,
                //统一下单接口返回的 prepay_id 参数值
                package: payOptions.package,
                //签名算法
                signType: payOptions.signType,
                //签名
                paySign: payOptions.paySign,
                success: (result) => {
                    if (result.errMsg === "requestPayment:ok")
                        resolve(true)
                },
                fail: () => {
                    reject(false)
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 1500,
                    });

                },
                complete: () => {}
            });
        })
    }
}