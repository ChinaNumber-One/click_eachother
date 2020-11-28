// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('user').where({
    _openid: event.openId
  }).get()
  let result = await db.collection('user').doc(res.data[0]._id).update({
    data: {
      avatarUrl: event.detail.avatarUrl,
      nickName: event.detail.nickName,
      gender: event.detail.gender
    }
  })
  if(result.errMsg === 'document.update:ok') {
    return {
      code: 0 ,
      data: Object.assign(res.data[0], {
        avatarUrl: event.detail.avatarUrl,
        nickName: event.detail.nickName,
        gender: event.detail.gender
      })
    }
  } else {
    return {
      code: 500,
      msg: result.errMsg ||'更新数据失败'
    }
  }
}