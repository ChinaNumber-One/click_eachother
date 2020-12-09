// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const minDate = new Date(year,month,day,0,0,0)
  const maxDate = new Date(year,month,day,23,59,59)
  let fistAuthWxRun = false
  let {
    data
  } = await db.collection('goldCoinRecord').where({
    openId:event.openId,
    type: 4
  }).get()
  if (data.length) {
    fistAuthWxRun = false
  } else {
    fistAuthWxRun = true
  }
  const res = await db.collection('goldCoinRecord').where({
    openId: event.openId,
    type: 5,
    createTime: _.and(_.gte(minDate), _.lte(maxDate))
  }).orderBy('createTime',"desc").get()
  return {
    fistAuthWxRun,
    record:res,
    ...event
  }
}