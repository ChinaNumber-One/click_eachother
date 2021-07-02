// miniprogram/pages/publishSuccess/publishSuccess.js
Page({
  closeView() {
    wx.navigateBack()
  },
  goMyTask() {
    wx.navigateTo({
      url: '/pages/myTaskPage/myTaskPage',
    })
  }
})