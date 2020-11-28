//app.js
import {
  env
} from './env'
App({
  globalData: {
    openId:''
  },
  onLaunch() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: '新版本下载失败',
        content: '请检查网络并重启小程序再试',
        showCancel: false,
        confirmText:'知道了'
      })
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env
      })
      this.globalData = {
        openId: ''
      }
    }
  },
  async login() {
    const {code,data} = await this.cloudFunction({
      name: 'login'
    })
    if(code === 0) {
      this.globalData.openId = data.userInfo._openid
      this.globalData.userInfo = data.userInfo
    } else {
      wx.hideLoading()
      wx.showModal({
        content: '登录失败！',
        showCancel: false
      })
    }
    return {code,data}
  },
  async cloudFunction ({name,data}){
    if(!this.globalData.openId && name !=='login') {
      await this.login()
      for (let key in this.globalData) {
        for (let _key in data) {
          if (key === _key) {
            data[key] = this.globalData[_key]
          }
        }
      }
    }
    const res = await wx.cloud.callFunction({
      name,
      data
    })
    return res.result
  }
})