// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'pro-nicemood'
})
const db = cloud.database({
  env: 'pro-nicemood'
})

// 云函数入口函数
exports.main = async (event, context) => {

  return db.collection('greeting')
    .where({
      hour: event.hour,
    })
    .field({
      message: true
    })
    .limit(3)
    .get();
}