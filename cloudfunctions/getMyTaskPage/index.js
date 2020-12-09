// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  let res = null
  let data = []
  // 全部  0
  if (event.type === 0) {
    res = await db.collection('taskList').where({
      openId: event.openId,
    }).limit(event.size).skip((event.current - 1) * event.size).orderBy('createTime', "desc").get()
    data = res.data
    if (data.length) {
      data.forEach(x => {
        if (x.doneNum >= x.taskNum) {
          x.type = 3
        } else {
          if (x.taskTime <= new Date().getTime()) {
            x.type = 2
          } else {
            x.type = 1
          }
        }
      })
    }
  } else if (event.type === 1) {
    // 进行中  1
    res = await db.collection('taskList').where({
      openId: event.openId,
      taskTime: _.gt(new Date().getTime()),
    }).limit(event.size).skip((event.current - 1) * event.size).orderBy('createTime', "desc").get()
    data = res.data.filter(x => x.doneNum < x.taskNum)
    if (data.length) {
      data.forEach(item => [
        item.type = 1
      ])
    }
  } else if (event.type === 2) {
    // 已过期  2
    res = await db.collection('taskList').where({
      openId: event.openId,
      taskTime: _.lte(new Date().getTime()),
    }).limit(event.size).skip((event.current - 1) * event.size).orderBy('createTime', "desc").get()
    data = res.data.filter(x => x.doneNum < x.taskNum)
    if (data.length) {
      data.forEach(item => [
        item.type = 2
      ])
    }
  } else if (event.type === 3) {
    // 已完成  3
    res = await db.collection('taskList').where({
      openId: event.openId
    }).limit(event.size).skip((event.current - 1) * event.size).orderBy('createTime', "desc").get()
    data = res.data.filter(x => x.doneNum >= x.taskNum)
    if (data.length) {
      data.forEach(item => [
        item.type = 3
      ])
    }
  }
  if (res.errMsg === 'collection.get:ok') {
    return {
      code: 0,
      data: data
    }
  } else {
    return {
      code: 500
    }
  }
}