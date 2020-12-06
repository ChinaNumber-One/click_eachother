const app = getApp()
import {getDataByType} from '../../utils/addCoinType'
Page({

  data: {
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: 0
  },
  async onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await app.login()
    if(!res.data.newUserFlag && !res.data.otherDayFlag) {
      wx.hideLoading()
    }
    if (res.data.newUserFlag) {
      const {code,msg} = await app.cloudFunction({
        name: 'addGoldCoins',
        data: {
          openId: res.data.userInfo._openid,
          ...getDataByType(2)
        }
      })
      wx.hideLoading()
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
  },
  closePresentModal() {
    this.setData({
      showPresentModal: false
    })
  }
})