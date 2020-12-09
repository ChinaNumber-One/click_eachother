// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    openId,
    taskType,
    taskPrice,
    taskPriceText,
    taskTime,
    taskTimeStr,
    taskNum,
    taskContent,
    taskKey,
    avatarUrl,
    nickName
  } = event
  const totalPrice = taskNum * taskPrice
  let {
    data
  } = await db.collection('user').where({
    _openid: openId
  }).get()
  if (data.length) {
    if (data[0].goldCoin < totalPrice) {
      return {
        code: 500,
        msg: '您的金币不足' + totalPrice + '个'
      }
    }
    let _id = data[0]._id
    let updateRes = await db.collection('user').doc(_id).update({
      data: {
        goldCoin: Math.round((data[0].goldCoin - totalPrice) * 100) / 100
      }
    })
    if (updateRes.errMsg !== 'document.update:ok') {
      return {
        code: 500,
        msg: updateRes.errMsg || '消耗金币失败'
      }
    } else {
      let addCoinRes = await db.collection('goldCoinRecord').add({
        data: {
          openId,
          createTime: new Date(),
          changeNum: -totalPrice,
          desc: '发布任务',
          type: 6
        }
      })
      if (addCoinRes.errMsg !== 'collection.add:ok') {
        return {
          code: 500,
          msg: addRes.errMsg
        }
      } else {
        let addRes = await db.collection('taskList').add({
          data: {
            openId,
            taskType,
            taskPrice,
            taskPriceText,
            taskTime,
            taskTimeStr,
            taskNum,
            taskContent,
            taskKey,
            avatarUrl,
            nickName,
            doneNum: 0,
            createTime: new Date()
          }
        })
        if (addRes.errMsg !== 'collection.add:ok') {
          return {
            code: 500,
            msg: addRes.errMsg
          }
        } else {
          return {
            code: 0
          }
        }
      }
    }
  } else {
    return {
      code: 500,
      msg: '该用户不存在'
    }
  }

}