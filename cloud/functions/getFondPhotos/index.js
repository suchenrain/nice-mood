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
    const timeLine = event.timeLine || new Date();
    const pageSize = event.pageSize || 5;

    const result = await db.collection('favorites-photo')
      .where({
        openid: wxContext.OPENID,
        createtime: _.lt(timeLine)
      }).orderBy('createtime', 'desc')
      .field({
        pid: true
      })
      .limit(pageSize)
      .get();

    if (!result.data.length > 0) {
      return Promise.resolve({
        data: []
      })
    }

    const pidArray = result.data.map(item => item.pid);

    const res = await db.collection('dailyPhoto').where({
      pid: _.in(pidArray)
    }).field({
      pid: true,
      fileID: true,
      alt: true,
      color: true
    }).get();

    //sort
    res.data.sort((a, b) => {
      return pidArray.indexOf(a.pid) - pidArray.indexOf(b.pid);
    })

    const fileList = res.data.map(item => item.fileID);
    const fileListResult = await cloud.getTempFileURL({
      fileList: fileList,
    });
    res.data.forEach(p => {
      const tmp = fileListResult.fileList.find((file) => {
        return file.fileID == p.fileID
      });
      if (tmp) {
        p.tempFileURL = tmp.tempFileURL;
      }
    })

    return Promise.resolve({
      data: res.data
    })
  } catch (error) {
    return Promise.reject(error)
  }
}