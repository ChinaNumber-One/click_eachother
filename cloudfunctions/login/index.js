// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID
  const date = new Date()
  let res = await db.collection('user').where({
    _openid: openId
  }).get()
  if (res.data.length === 0) {
    const data = {
      _openid: openId,
      createTime: date,
      lastLoginDate: date,
      goldCoin: 0
    }
    const addRes = await db.collection('user').add({
      data
    })
    if (addRes.errMsg === 'collection.add:ok') {
      return {
        code: 0,
        data: {
          newUserFlag: true,
          otherDayFlag: false,
          userInfo: data
        }
      }
    } else {
      return {
        code: 500,
        msg: addRes.errMsg
      }
    }
  } else {
    let data = res.data[0]
    const updateRes = await db.collection('user').doc(data._id).update({
      data: {
        lastLoginDate: date
      }
    })
    if (updateRes.errMsg === 'document.update:ok') {
      return {
        code: 0,
        data: {
          newUserFlag: false,
          otherDayFlag: date.toDateString() !== new Date(data.lastLoginDate).toDateString(),
          userInfo: Object.assign(data, {
            lastLoginDate: date
          })
        }
      }
    } else {
      return {
        code: 500,
        msg: updateRes.errMsg
      }
    }
  }
}