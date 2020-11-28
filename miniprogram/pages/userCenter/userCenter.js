const app = getApp()
import {getDataByType} from '../../utils/addCoinType'
Page({
  data: {
    info: {},
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
    authUserInfoNum: getDataByType(3).presentModalNum
  },
  async onShow() {
    wx.showLoading({
      title: '加载中'
    })
    await this.getData()
    wx.hideLoading()
  },
  async getUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      wx.showLoading({
        title: '请稍后',
      })
      const {
        code,
        data,
        msg
      } = await app.cloudFunction({
        name: 'updateUserInfo',
        data: {
          openId: app.globalData.openId,
          detail: e.detail.userInfo
        }
      })
      wx.hideLoading()
      if (code === 0) {
        if (!this.data.info.avatarUrl) {
          wx.showToast({
            title: '更新成功',
            icon:'success'
          })
          this.setData({
            info: data
          })
          const {
            code,
            msg
          } = await app.cloudFunction({
            name: 'addGoldCoins',
            data: {
              openId: app.globalData.openId,
              ...getDataByType(3)
            }
          })
          if (code === 0) {
            this.setData({
              showPresentModal: true,
              ...getDataByType(3)
            })
            this.getData()
          } else {
            wx.showModal({
              content: msg || '金币入账失败',
              showCancel: false
            })
          }
        }
      } else {
        wx.showModal({
          content: msg || '获取数据失败'
        })
      }
    } else {
      wx.showModal({
        content: '授权获取用户信息失败！',
        showCancel: false
      })
    }
  },
  async onPullDownRefresh() {
    wx.showLoading({
      title: '加载中'
    })
    await this.getData()
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  async getData() {
    const {
      code,
      data
    } = await app.cloudFunction({
      name: 'getUserInfo',
      data: {
        openId: app.globalData.openId
      }
    })
    if (code === 0) {
      this.setData({
        info: data
      })
      app.globalData.userInfo = data
    } else {
      wx.showModal({
        content: msg || '查询用户信息失败',
        showCancel: false
      })
    }
  },
  closePresentModal() {
    this.setData({
      showPresentModal: false
    })
  }
})