// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  let res = await db.collection('taskList').where({
    openId: _.neq(event.openId),
    taskTime: _.gt(new Date().getTime()),
  }).limit(event.size).skip((event.current-1) * event.size).orderBy('taskPrice', 'desc').orderBy('createTime',"desc").get()
  if(res.errMsg === 'collection.get:ok') {
    return {
      code: 0,
      data: res.data.filter(x=>x.doneNum < x.taskNum)
    }
  } else {
    return {
      code: 500
    }
  }
}