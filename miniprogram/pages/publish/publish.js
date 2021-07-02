const app = getApp()
import {
  getDateStr
} from '../../utils/tools'
Page({
  data: {
    taskPrice: null,
    taskPriceText: '',
    taskTime: null,
    taskTimeStr: '',
    taskNum: null,
    taskType: '',
    taskContent: '',
    autoSize: {
      maxHeight: 300,
      minHeight: 100
    },
    taskKey: '',
    selectPrice: false,
    selectTime: false,
    columns: [{
      key: 200,
      text: '200金币/单'
    }, {
      key: 300,
      text: '300金币/单'
    }, {
      key: 400,
      text: '400金币/单'
    }, {
      key: 500,
      text: '500金币/单'
    }, {
      key: 600,
      text: '600金币/单'
    }, {
      key: 700,
      text: '700金币/单'
    }, {
      key: 800,
      text: '800金币/单'
    }, {
      key: 900,
      text: '900金币/单'
    }, {
      key: 1000,
      text: '1000金币/单'
    }],
    minDate: new Date().getTime(),
    maxDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000
  },
  onPriceCancel() {
    this.setData({
      selectPrice: false
    })
  },
  onTimeCancel() {
    this.setData({
      selectTime: false
    })
  },
  onTimeConfirm(e) {
    this.setData({
      selectTime: false,
      taskTimeStr: getDateStr(e.detail),
      taskTime: new Date(e.detail)
    })
  },
  onPriceConfirm(e) {
    console.log(e.detail.value)
    this.setData({
      selectPrice: false,
      taskPriceText: e.detail.value.text,
      taskPrice: e.detail.value.key
    })
  },
  openSelectPrice() {
    this.setData({
      selectPrice: true
    })
  },
  openSelectTime() {
    this.setData({
      selectTime: true
    })
  },
  publish() {
    if (!this.data.taskType) {
      return wx.showModal({
        content: '请填写任务类型',
        showCancel: false
      })
    }
    if (!this.data.taskNum) {
      return wx.showModal({
        content: '请填写任务单数',
        showCancel: false
      })
    }
    if (this.data.taskNum<1) {
      return wx.showModal({
        content: '任务单数至少为 1 ',
        showCancel: false
      })
    }
    if (!this.data.taskPrice) {
      return wx.showModal({
        content: '请选择任务单价',
        showCancel: false
      })
    }
    if (!this.data.taskContent) {
      return wx.showModal({
        content: '请填写任务描述',
        showCancel: false
      })
    }
    if (!this.data.taskTime) {
      return wx.showModal({
        content: '请选择任务截止时间',
        showCancel: false
      })
    }
    if (app.globalData.userInfo.goldCoin < this.data.taskNum * this.data.taskPrice) {
      wx.showModal({
        title: '金币不足',
        content: `您的金币不足${this.data.taskNum * this.data.taskPrice}个！`,
        confirmText: '去赚金币',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/task/task',
            })
          }
        }
      })
    }
    wx.showModal({
      title: '发布提醒',
      content: '发布后只允许提前关闭，不可中途修改内容，确定要发布吗？',
      success: res => {
        if (res.confirm) {
          this.publishTask()
        }
      }
    })
  },
  async publishTask() {
    wx.showLoading({
      title: '发布中',
    })
    const {
      code
    } = await app.cloudFunction({
      name: 'publishTask',
      data: {
        openId: app.globalData.openId,
        taskType: this.data.taskType,
        taskPrice: Number(this.data.taskPrice),
        taskPriceText: this.data.taskPriceText,
        taskTime: new Date(this.data.taskTime).getTime(),
        taskTimeStr: this.data.taskTimeStr,
        taskNum: Number(this.data.taskNum),
        taskContent: this.data.taskContent,
        taskKey: this.data.taskKey,
        avatarUrl: app.globalData.userInfo.avatarUrl||'',
        nickName: app.globalData.userInfo.nickName||''
      }
    })
    wx.hideLoading()
    if(code === 0) {
      wx.redirectTo({
        url: '/pages/publishSuccess/publishSuccess',
      })
    }
  }
})