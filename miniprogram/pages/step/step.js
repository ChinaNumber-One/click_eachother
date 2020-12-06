const app = getApp()
import {getDataByType} from '../../utils/addCoinType'
function   getDateStr(times=new Date().getTime()) {
  const weekArr = ['天','一','二','三','四','五','六']
  const date = new Date(times)
  const month = '0'+(date.getMonth() +  1)
  const day = '0' + date.getDate()
  const week =  date.getDay()
  return month.substr(-2) + '月' + day.substr(-2) + '日' + ' 星期'+weekArr[week]
}
Page({
  data: {
    showOpenSettingBtn: false,
    showDialog: false,
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
    weRunData: [],
    todayStep: 0,
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
    dateStr: getDateStr()
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
    if(res.weRunData && res.weRunData.data.stepInfoList.length) {
      const current = res.weRunData.data.stepInfoList[res.weRunData.data.stepInfoList.length-1].step
      console.log(current>8000? 100:Math.ceil(current * 100 / 8000))
      this.setData({
        weRunData: res.weRunData.data.stepInfoList,
        todayStep: current,
        value: current>8000? 100:Math.ceil(current * 100 / 8000),
        dateStr: getDateStr(res.weRunData.data.stepInfoList[res.weRunData.data.stepInfoList.length-1].timestamp * 1000)
      })
    }
  }
})