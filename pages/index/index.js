const app = getApp();
//获取全局属性
const config = app.globalData.congfig;
const api = app.glabalData.api;
const loading = app.globalData.loading;
const util = app.globalData.util;
const COND_ICON_BASE_URL = config.COND_ICON_BASE_URL;
const BG_IMG_BASE_URL = config.BG_IMG_BASE_URL;
//为了使用async await
const regeneratorRuntime = require('../../lib/regenerator');