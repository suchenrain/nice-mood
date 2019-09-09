// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'YOUR CLOUD ENV ID'
})
const db = cloud.database({
  env: 'YOUR CLOUD ENV ID'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const fond = event.fond;

  try {
    if (fond) {
      const res = await db.collection('favorites-photo').where({
        openid: wxContext.OPENID,
        pid: event.pid
      }).count();

      if (res.total > 0) return Promise.resolve(0);

      return await db.collection('favorites-photo').add({
        data: {
          openid: wxContext.OPENID,
          pid: event.pid,
          createtime: new Date()
        }
      })
    } else {
      return await db.collection('favorites-photo').where({
        openid: wxContext.OPENID,
        pid: event.pid
      }).remove();
    }

  } catch (e) {
    console.error(e)
  }
}