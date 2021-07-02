const app = getApp()
import {
  getDataByType
} from '../../utils/addCoinType'
Page({
  data: {
    info: {},
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
    authUserInfoNum: getDataByType(3).presentModalNum,
    menuList: [{
      title: '我的接单',
      icon: 'menu-jd',
      url: '',
      type: 1,
    },
    {
      title: '我的任务',
      icon: 'menu-rw',
      url: '/pages/myTaskPage/myTaskPage',
      type: 1,
    },
    {
      title: '我的钱包',
      icon: 'menu-qb',
      url: '/pages/myWallet/myWallet',
      type: 1,
    },
    {
      title: '每日签到',
      icon: 'menu-qd',
      url: '/pages/sginIn/sginIn',
      type: 1,
    },
    {
      title: '幸运抽奖',
      icon: 'menu-cj',
      url: '',
      type: 1,
    },
    {
      title: '使用手册',
      icon: 'menu-jc',
      url: '/pages/readMe/readMe',
      type: 1,
    },
    {
      title: '分享好友',
      icon: 'menu-share',
      url: '',
      type: 3,
    },
    {
      title: '联系客服',
      icon: 'menu-kf',
      type: 2,
      openType: 'contact',
    }
    ],
    options: [{
      name: '微信',
      icon: 'wechat',
      openType: 'share'
    },
    {
      name: '二维码',
      icon: 'qrcode'
    },
    ],
    showShare: false
  },
  async onShow() {
    wx.showNavigationBarLoading()
    await this.getData()
    wx.hideNavigationBarLoading()
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
        this.setData({
          info: data
        })
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
        // 首次 加金币
        if (e.target.dataset.type==='0') {
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
          content: msg || '更新失败'
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
    wx.showNavigationBarLoading()
    await this.getData()
    wx.hideNavigationBarLoading()
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
  },
  goPage(e) {
    const item = e.currentTarget.dataset.item
    if (item.type === 1) {
      if (!item.url) {
        wx.showModal({
          title: '',
          content: '正在开发……',
          showCancel: false
        })
      } else {
        wx.navigateTo({
          url: item.url,
        })
      }
    } else if (item.type === 3) {
      this.setData({
        showShare: true
      })
    }
  },
  onCloseShare() {
    this.setData({
      showShare: false
    })
  },
  async onSelectShare(e) {
    if (e.detail.name === '二维码') {
      const {
        code,
        data
      } = await app.cloudFunction({
        name: 'wxacode',
        data: {
          openId: app.globalData.openId
        }
      })
      if (code === 0 && data) {
        wx.previewImage({
          current: data,
          urls: [data],
        })
      }
    }
  },
  openShare() {
    this.setData({
      showShare: true
    })
  }
})