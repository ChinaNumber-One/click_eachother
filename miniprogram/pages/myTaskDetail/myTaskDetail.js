const app = getApp()
Page({

  data: {

  },
  id: '',

  onLoad(options) {
    this.id = options.id
    this.getDetail()
  },
  async getDetail() {
    const {code,data} = await app.cloudFunction({
      name: 'getMyTaskDetail',
      data: {
        openId: app.globalData.openId,
        _id: this.id
      }
    })
  },
  onShareAppMessage() {

  }
})