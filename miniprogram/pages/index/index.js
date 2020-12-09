const app = getApp()
import {getDataByType} from '../../utils/addCoinType'
Page({

  data: {
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
    current: 1,
    size: 20,
    list: [],
    noMore: false,
    loaded: false
  },
  async onLoad() {
    const res = await app.login()
    if (res.data.newUserFlag) {
      const {code,msg} = await app.cloudFunction({
        name: 'addGoldCoins',
        data: {
          openId: res.data.userInfo._openid,
          ...getDataByType(2)
        }
      })
      if(code === 0) {
        this.setData({
          showPresentModal: true,
          ...getDataByType(2)
        })
      } else {
        wx.showModal({
          content: msg||'金币入账失败',
          showCancel: false
        })
      }
    }
    wx.showNavigationBarLoading()
    await this.getTaskList()
    wx.hideNavigationBarLoading()
  },
  closePresentModal() {
    this.setData({
      showPresentModal: false
    })
  },
  async getTaskList() {
    const {code,data} = await app.cloudFunction({
      name: 'getTaskPage',
      data: {
        openId: app.globalData.openId,
        current: this.data.current,
        size: this.data.size
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
  }
})