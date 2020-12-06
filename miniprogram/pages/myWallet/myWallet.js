const app = getApp()
import {
  getDataByType
} from '../../utils/addCoinType'
import {getDateStr} from '../../utils/tools'
Page({
  data: {
    list: [],
    current: 1,
    size: 20,
    total: 0,
    noMore: false
  },
  async onLoad (options) {
    this.getData()
  },
  goPage() {
    wx.switchTab({
      url: '/pages/task/task',
    })
  },
  async getData() {
    wx.showLoading({
      title: '加载中',
    })
    const {
      code,
      data,
    } = await app.cloudFunction({
      name: 'getCoinRecord',
      data: {
        openId: app.globalData.openId,
        current: this.data.current,
        size: this.data.size
      }
    })
    wx.hideLoading()
    if(code === 0) {
      if(data.length) {
        const arr = data.map(item=>{
          return {
            ...item,
            title: getDataByType(item.type).presentModalDesc ? getDataByType(item.type).presentModalDesc:'未知',
            date: getDateStr(new Date(item.createTime))
          }
        })
        this.setData({
          total: app.globalData.userInfo.goldCoin,
          list: this.data.current === 1?arr:this.data.list.concat(arr)
        })
      } else {
        this.setData({
          noMore: true
        })
      }
    }
  },
  async onPullDownRefresh () {
    this.data.current =  1
    await this.getData()
    wx.stopPullDownRefresh()
  },
  async onReachBottom () {
    if(this.data.noMore) return
    this.data.current ++ 
    this.getData()
  },
})