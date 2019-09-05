// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-nicemood'
})
const db = cloud.database({
  env: 'dev-nicemood'
})
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const pageIndex = event.pageIndex || 1;
    const pageSize = event.pageSize || 5;
    const skipCount = (pageIndex - 1) * pageSize;

    // 先取出集合记录总数
    const countResult = await db.collection('favorites-photo').where({
      openid: wxContext.OPENID,
    }).count();
    const total = countResult.total

    if (total <= 0) {
      return Promise.resolve({
        totalPage: 0,
        pageIndex,
        data: []
      })
    }

    // 计算需分几次取
    const totalPage = Math.ceil(total / pageSize)
    if (pageIndex > totalPage) {
      return Promise.reject({ error: "invalid page index" })
    }

    const result = await db.collection('favorites-photo')
      .where({
        openid: wxContext.OPENID,
      }).orderBy('createtime', 'desc')
      .skip(skipCount)
      .field({
        pid: true
      })
      .limit(pageSize)
      .get();

    const pidArray = result.data.map(item => item.pid);

    const res = await db.collection('dailyPhoto').where({
      pid: _.in(pidArray)
    }).orderBy('id', 'desc').field({
      pid: true,
      fileID: true,
      alt: true,
      color: true
    }).get();

    const fileList = res.data.map(item => item.fileID);
    const fileListResult = await cloud.getTempFileURL({
      fileList: fileList,
    });
    res.data.forEach(p => {
      const tmp = fileListResult.fileList.find((file) => { return file.fileID == p.fileID });
      if (tmp) {
        p.tempFileURL = tmp.tempFileURL;
      }
    })

    return Promise.resolve({
      totalPage,
      pageIndex,
      data: res.data

    })
  }
  catch (error) {
    return Promise.reject(error)
  }
}