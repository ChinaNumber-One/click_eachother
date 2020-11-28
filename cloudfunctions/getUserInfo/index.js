// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('user').where({
    _openid:event.openId
  }).get()
  if(res.errMsg === 'collection.get:ok') {
    if( res.data.length === 1 ) {
      return {
        code: 0,
        data: res.data[0]
      }
    } else {
      return {
        code: 500,
        msg: '查询到多条用户信息，请联系客服处理'
      }
    }
  } else {
    return {
      code: 500,
      msg: errMsg ||'查询用户信息失败'
    }
  }
}