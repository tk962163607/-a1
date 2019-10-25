//app.js
global.regeneratorRuntime = require("/lib/regenerator-runtime/runtime");
App({
    onLaunch: function(e) {
        console.log(e)
    },
    globalData: {
        userInfo: null
    }
})