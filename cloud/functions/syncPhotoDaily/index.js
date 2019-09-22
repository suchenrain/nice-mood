// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init({
  env: 'pro-nicemood'
})

const db = cloud.database({
  env: 'pro-nicemood'
})

const max = 5;
let cur = 0;

const generateFileName = (pid) => {
  const fileName = `DailyPhoto/${pid}.jpg`
  return fileName;
}


getRandomPhoto = async () => {
  const pointerDoc = db.collection('pointer').doc('1');
  const pointerData = await pointerDoc.get();
  const cursor = pointerData.data.cursor;
  const page = cursor / 10 + 1;
  const itemIndex = cursor % 10;
  const url = `https://api.unsplash.com/users/suchenrain/likes?order_by=oldest&per_page=10&client_id=ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170&page=${page}`;
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      const bodyData = JSON.parse(body);
      const result = bodyData[itemIndex];
      resolve(result)
    })
  });
}

checkExisting = async (pid) => {
  return await db.collection('dailyPhoto').where({
    pid: pid
  }).count()
}

addDailyPhotoRecord = async (photo, fileID) => {
  return await db.collection('dailyPhoto').add({
    data: {
      pid: photo.id,
      url: photo.urls.raw,
      color: photo.color,
      description: photo.description,
      alt: photo.alt_description,
      author: photo.user.name,
      profile: photo.user.links.html,
      fileID: fileID
    }
  })
}

getPhotpBuffer = (url) => {
  const reqOption = {
    uri: url,
    method: 'GET',
    qs: {
      w: 750,
      h: 1200,
      q: 70,
      fit: 'crop',
      fm: 'jpg',
      crop: 'entropy'
    },
    encoding: null
  }
  return new Promise((resolve, reject) => {
    request(reqOption, (err, res, body) => {
      if (err) reject(err);
      resolve(body)
    })
  })
}

uploadFile = (buffer, pid) => {
  return cloud.uploadFile({
    cloudPath: generateFileName(pid),
    fileContent: buffer,
  })
}

syncPhoto = async () => {
  console.log('start')
  const photo = await getRandomPhoto();
  if (photo && photo.id && photo.urls.raw) {
    const {
      total
    } = await checkExisting(photo.id);
    if (total === 0) {
      const buffer = await getPhotpBuffer(photo.urls.raw)
      if (buffer) {
        const {
          fileID
        } = await uploadFile(buffer, photo.id)
        if (fileID) {
          const _id = await addDailyPhotoRecord(photo, fileID);
          if (_id) {
            const _ = db.command;
            const pointerDoc = db.collection('pointer').doc('1');
            pointerDoc.update({
              data: {
                cursor: _.inc(1)
              }
            })
            console.log('ok');
            //sendNotification('success');
          } else {
            //sendNotification('fail');
            console.log('fail');
          }
        }
      }
    } else {
      if (cur < max) {
        cur++;
        const _ = db.command;
        const pointerDoc = db.collection('pointer').doc('1');
        await pointerDoc.update({
          data: {
            cursor: _.inc(1)
          }
        })
        return await syncPhoto();
      }
    }
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  await syncPhoto();
}