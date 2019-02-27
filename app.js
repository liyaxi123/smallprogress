const config = require('./util/config')
const util = require('./util/util')
const loading = require('./util/loading')
const api = require('./api/index')
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */

  // app.js中初始化云函数
  onLaunch: function () {
    if(!wx.cloud){
      console.err('请使用2.2.3或一上的基础库以使用云能力')
    }else{
      wx.cloud.init({
        traceUser: true,
        env: 'weath-44b2a5'
      })
    }
  },
//全局变量在此暴漏
globalData:{
  config,
  api,
  util,
  loading
},

})
