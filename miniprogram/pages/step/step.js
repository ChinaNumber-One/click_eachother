const app = getApp()
import {getDataByType} from '../../utils/addCoinType'
Page({
  data: {
    showOpenSettingBtn: false,
    showDialog: false,
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
  },
  onLoad() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.werun'] === false) {
          this.setData({
            showOpenSettingBtn: true,
            showDialog: true
          })
        } else {
          this.getWeRunData()
        }
      }
    })
  },
  getOpenSettingData(e) {
    console.log(e)
    if(e.detail.authSetting['scope.werun'] === false) {
      this.setData({
        showOpenSettingBtn: true
      })
    } else {
      this.setData({
        showOpenSettingBtn: false,
        showDialog: false
      })
      this.getWeRunData()
    }
  },
  getWeRunData() {
    wx.getWeRunData({
      success: async (result) => {
        this.addGoldCoin()
        this.getWxRunDataByCloudId(result)
      },
      fail: res => {
        if (res.errMsg === 'getWeRunData:fail auth deny') {
          this.setData({
            showOpenSettingBtn: true,
            showDialog: true
          })
        }
      }
    })
  },
  closePresentModal() {
    this.setData({
      showPresentModal: false
    })
  },
  async addGoldCoin() {
    const {
      code,
      msg
    } = await app.cloudFunction({
      name: 'addGoldCoins',
      data: {
        openId: app.globalData.openId,
        ...getDataByType(4)
      }
    })
    if (code === 0) {
      this.setData({
        showPresentModal: true,
        ...getDataByType(4)
      })
    } else if(code === 500) {
      wx.showModal({
        content: msg || '金币入账失败',
        showCancel: false
      })
    }
  },
  async getWxRunDataByCloudId(result) {
    wx.showLoading({
      title: '加载中',
    })
    const res = await app.cloudFunction({
      name: 'getOpenData',
      data: {
        weRunData: wx.cloud.CloudID(result.cloudID),
      }
    })
    wx.hideLoading()
    if(res.weRunData) {
      this.setData({
        weRunData: res.weRunData.data.stepInfoList
      })
    }
  }
})