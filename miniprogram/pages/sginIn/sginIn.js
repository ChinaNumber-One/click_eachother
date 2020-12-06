const app = getApp()
let sginInDays = []
let nowDate = new Date()
import {
  getDataByType
} from '../../utils/addCoinType'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCalendar: false,
    minDate: '',
    maxDate: '',
    showPresentModal: false,
    presentModalNum: 0,
    presentModalDesc: '',
    defaultDate:new Date().getTime(),
    formatter: null,
    btnLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  closePresentModal() {
    this.setData({
      showPresentModal: false
    })
  },
  async addGoldCoins() {
    if(!this.data.canSginIn) {
      return wx.showModal({
        content:'今日已签到过，明天再来吧～',
        showCancel: false
      })
    }
    this.setData({
      btnLoading: true
    })
    const {
      code,
      msg
    } = await app.cloudFunction({
      name: 'addGoldCoins',
      data: {
        openId: app.globalData.openId,
        ...getDataByType(1)
      }
    })
    this.setData({
      btnLoading: false
    })
    if(code === 0) {
      this.setData({
        showPresentModal: true,
        ...getDataByType(1)
      })
      this.getSginInRecord()
    }
  },
  onLoad(options) {
    this.getSginInRecord()
  },
  async getSginInRecord() {
    const {
      code,
      data,
      date,
      canSginIn
    } = await app.cloudFunction({
      name: 'getCoinRecord',
      data: {
        openId: app.globalData.openId,
        type: 1
      }
    })
    if (code === 0) {
      sginInDays = data.map(item => {
        return new Date(item.createTime).getDate()
      })
    }
    nowDate = new Date(date)
    const curDate = new Date();
    const curMonth = curDate.getMonth();
    const curYear = curDate.getFullYear()
    curDate.setMonth(curMonth + 1);
    curDate.setDate(0);
    this.setData({
      maxDate: new Date(curYear, curMonth, curDate.getDate()).getTime(),
      minDate: new Date(curYear, curMonth, 1).getTime(),
      formatter: (day)=> {
        const today = nowDate.getDate()
        const date = day.date.getDate();
        if(sginInDays.indexOf(date) !== -1) {
          day.bottomInfo = '已签到'
        }
        if(date<=today && sginInDays.indexOf(date) === -1) {
          day.bottomInfo = '未签到'
        }
        if(date === today) {
          day.type = 'selected' 
        }
        return day;
      },
      showCalendar: true,
      canSginIn
    })
  },
})