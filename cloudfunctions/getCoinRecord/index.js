// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  const curDate = new Date();
  const curMonth = curDate.getMonth();
  const curYear = curDate.getFullYear()
  curDate.setMonth(curMonth + 1);
  curDate.setDate(0);
  const maxDate = new Date(curYear, curMonth, curDate.getDate())
  const minDate = new Date(curYear, curMonth, 1)
  let res = null
  if (event.type && event.type === 1) {
    res = await db.collection('goldCoinRecord').where({
      openId: event.openId,
      type: event.type,
      createTime: _.and(_.gte(minDate), _.lte(maxDate))
    }).orderBy('createTime',"desc").get()
    if(res.errMsg === 'collection.get:ok') {
      return {
        code: 0,
        data: res.data,
        date: new Date(),
        canSginIn: res.data.length ? new Date().toDateString() !== new Date(res.data[0].createTime).toDateString():true, 
      }
    } else {
      return {
        code: 500,
        date: new Date(),
        canSginIn: false
      }
    }
  } else {
    res = await db.collection('goldCoinRecord').where({
      openId: event.openId
    }).limit(event.size).skip((event.current-1) * event.size).orderBy('createTime',"desc").get()
    if(res.errMsg === 'collection.get:ok') {
      return {
        code: 0,
        data: res.data
      }
    } else {
      return {
        code: 500,
      }
    }
  }
  
}