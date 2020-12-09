// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let {
    openId,
    presentModalNum,
    presentModalDesc,
    type
  } = event
  const langTask = [2, 3, 4]
  if (langTask.indexOf(type) !== -1) {
    let {
      data
    } = await db.collection('goldCoinRecord').where({
      openId,
      type
    }).get()
    if (data.length) {
      return {
        code: 1
      }
    }
  }


  let {
    data
  } = await db.collection('user').where({
    _openid: openId
  }).get()
  if (data.length) {
    let _id = data[0]._id
    let updateRes = await db.collection('user').doc(_id).update({
      data: {
        goldCoin: Math.round((data[0].goldCoin + presentModalNum)*100)/100
      }
    })
    if (updateRes.errMsg !== 'document.update:ok') {
      return {
        code: 500,
        msg: updateRes.errMsg || '更新数据失败'
      }
    }
    let addRes = await db.collection('goldCoinRecord').add({
      data: {
        openId,
        createTime: new Date(),
        changeNum: presentModalNum,
        desc: presentModalDesc,
        type
      }
    })
    if (addRes.errMsg !== 'collection.add:ok') {
      return {
        code: 500,
        msg: addRes.errMsg
      }
    }
    return {
      code: 0
    }
  } else {
    return {
      code: 500,
      msg: '查询不到该用户'
    }
  }

}