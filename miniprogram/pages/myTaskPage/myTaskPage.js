const app = getApp()
Page({
  data: {
    loaded: false,
    current: 1,
    size: 20,
    list: [],
    noMore: false,
    active: 0
  },
  async onLoad (options) {
    wx.showLoading({
      title: '加载中',
    })
    await this.getTaskList()
    wx.hideLoading()
  },
  async onChange(event) {
    this.setData({
      list: [],
      active: event.detail.name,
      current: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    await this.getTaskList()
    wx.hideLoading()
  },
  async getTaskList() {
    const {code,data} = await app.cloudFunction({
      name: 'getMyTaskPage',
      data: {
        openId: app.globalData.openId,
        current: this.data.current,
        size: this.data.size,
        type: this.data.active
      }
    })
    this.setData({
      loaded: true
    })
    if(code === 0) {
      if(data.length) {
        this.setData({
          list: this.data.current?data:this.data.list.concat(data),
          noMore: false
        })
      } else {
        this.setData({
          noMore: true
        })
      }
    }
  },
  async onPullDownRefresh() {
    this.data.current = 1
    wx.showNavigationBarLoading()
    await this.getTaskList()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.data.current ++
    this.getTaskList()
  },
  goDetail(e) {
    if(!e.currentTarget.dataset.id) return wx.showModal({
      content: '错误数据！',
      showCancel: false
    }) 
    wx.navigateTo({
      url: '/pages/myTaskDetail/myTaskDetail?id='+e.currentTarget.dataset.id,
    })
  }
})