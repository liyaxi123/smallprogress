//加载框
const showLoading = ()=>{
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title :'不要急已经在加载中了',
      success(){
        resolve()
      },
      fail(err){
        reject(err.message)
      }
    })
  })
}
const hideLoading=()=>{
  return new Promise((resolve,reject)=>{
    wx.hideLoading()
    resolve()
  })
}
module.exports = {
  showLoading,
  hideLoading
}