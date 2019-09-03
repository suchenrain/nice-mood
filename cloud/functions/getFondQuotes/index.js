// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-nicemood'
})
const db = cloud.database({
  env: 'dev-nicemood'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const pageIndex = event.pageIndex || 0;
    const pageSize = event.pageSize || 20;
    const skipCount = pageIndex * pageSize;

    return db.collection('favorites-quote')
      .where({
        openid: wxContext.OPENID,
      }).orderBy('createtime', 'desc')
      .skip(skipCount)
      .field({
        id: true,
        hitokoto: true,
        from: true
      })
      .limit(pageSize)
      .get();
  }
  catch (e) {
    console.error(e)
  }
}