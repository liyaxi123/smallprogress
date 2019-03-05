const showLoading = () => {
  wx.showLoading({
    title: '数据加载中...',
  })
}
const hideLoading = () => {
  wx.hideLoading();
}
module.exports = {
  showLoading,
  hideLoading
}