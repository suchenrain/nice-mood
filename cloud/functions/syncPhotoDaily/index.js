// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init({
  env: 'dev-nicemood'
})

const db = cloud.database({
  env: 'dev-nicemood'
})

const max = 5;
let cur = 0;

const generateFileName = () => {
  const date = new Date();
  //设置为 UTC+8
  date.setHours(date.getHours() + 8);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const fileName = `DailyPhoto/${year}${month}${day}.jpg`
  return fileName;
}


getRandomPhoto = () => {
  const url = 'https://api.unsplash.com/photos/random/?collections=8482292&client_id=ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170'

  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      resolve(JSON.parse(body))
    })
  });
}

checkExisting = (pid) => {
  return db.collection('dailyPhoto').where({
    pid: pid
  }).count()
}

addDailyPhotoRecord = (photo) => {
  return db.collection('dailyPhoto').add({
    data: {
      pid: photo.id,
      url: photo.urls.raw,
      author: photo.user.name,
      profile: photo.user.links.html,
      fileID: ''
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

uploadFile = (buffer) => {
  return cloud.uploadFile({
    cloudPath: generateFileName(),
    fileContent: buffer,
  })
}

updateDailyPhotoRecord = (pid, fileID) => {
  return db.collection('dailyPhoto').where({
    pid: pid
  }).update({
    data: {
      fileID: fileID
    }
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
      let _id = await addDailyPhotoRecord(photo);
      const buffer = await getPhotpBuffer(photo.urls.raw)
      if (buffer) {
        const {
          fileID
        } = await uploadFile(buffer)
        if (fileID) {
          const record = await updateDailyPhotoRecord(photo.id, fileID)
          console.log('ok');
        }
      }
    } else {
      if (cur < max) {
        cur++;
        syncPhoto();
      }
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  await syncPhoto();
}