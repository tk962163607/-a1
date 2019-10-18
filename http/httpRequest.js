import { httpURL } from './httpURL.js';
/**
 * 封装get方式的请求,返回Promise对象，那么在页面就可以使用 async/await方式来进行同步请求
 * @param {*} url  请求路径
 * @param {*} data  请求的数据，如果没有数据，传递null即可
 * @param {*} tag  标识，方便区分哪个请求
 */
export function httpRequestGet(url, data, tag = 'default') {
    return new Promise(function(resolve, reject) {
        // 弹出加载提示框
        wx.showLoading({
            title: '正在努力请求中',
            mask: true,
        });
        wx.request({
            url: httpURL.BASE_URL + url,
            method: "GET",
            data: data,
            success: function(res) {
                console.log(tag, res);
                // 请求成功 状态码等于200，把数据返回到页面，如果不等于200，提示用户
                if (res.statusCode == 200)
                    resolve(res.data)
                else
                    wx.showToast({
                        title: '请求有误，请稍后请求',
                        duration: 1500,
                        mask: true,
                    });
            },
            fail: function(error) {
                // 如果请求错误，提示用户加载有误
                wx.showToast({
                    title: '请求有误，请稍后请求',
                    duration: 1500,
                    mask: true,
                });
                console.log(tag, error)
            },
            complete: function() {
                // 不管请求成功或者是失败，都隐藏加载框
                wx.hideLoading()

            }
        })
    })
}

/**
 * 封装post方式的请求，返回Promise对象，那么在页面就可以使用 async/await方式来进行同步请求
 * @param {*} url  请求路径
 * @param {*} data  请求的数据，如果没有数据，传递null即可
 * @param {*} tag  标识，方便区分哪个请求
 */
export function httpRequestPost(url, data, tag = 'default') {
    return new Promise(function(resolve, reject) {
        // 弹出加载提示框
        wx.showLoading({
            title: '正在努力请求中',
            mask: true,
        });
        wx.request({
            url: httpURL.BASE_URL + url,
            method: "POST",
            data: data,
            success: function(res) {
                console.log(tag, res);
                // 请求成功 状态码等于200，把数据返回到页面，如果不等于200，提示用户
                if (res.statusCode == 200)
                    resolve(res.data)
                else
                    wx.showToast({
                        title: '请求有误，请稍后请求',
                        duration: 1500,
                        mask: true,
                    });
            },
            fail: function(error) {
                // 如果请求错误，提示用户加载有误
                wx.showToast({
                    title: '请求有误，请稍后请求',
                    duration: 1500,
                    mask: true,
                });
                console.log(tag, error)
            },
            complete: function() {
                // 不管请求成功或者是失败，都隐藏加载框
                wx.hideLoading()
            }
        })
    })
}
const _httpURL = httpURL;
export { _httpURL as httpURL };