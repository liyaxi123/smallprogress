//加载框 封装showLoading()函数
const showLoading = ()=>{
  return new Promise ((resolve,reject)=>{
    wx.showLoading({
      title: '请稍等数据正在请求中...',
      mask:true,
      success: () => {
        resolve();
      },
      fail: (err) => {
        reject(err.message)
      }
    })
  })
}
//封装hideLoading 函数
const hideLoading = () => {
  return new Promise((resolve,reject) => {
      wx.hideLoading({
        success: () => {
          resolve();
        },
        fail: (err) => {
          reject(err.message);
        }
      })
  })
}
module.exports = {
  showLoading,
  hideLoading
}