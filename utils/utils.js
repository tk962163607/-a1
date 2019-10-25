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
    }
}