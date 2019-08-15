export default {
  getWeather: {
    host: 'https://free-api.heweather.net',
    url: '/s6/weather/now'
  },
  //getWeather: { host: 'https://api.seniverse.com', url: '/v3/weather/now.json' }
  //https://api.unsplash.com/photos/random/?count=3&collections=8349391,8349361&client_id=ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170
  getDailyImage: { host: 'https://api.unsplash.com', url: '/photos/random/' },
  getQuote: { host: 'https://v1.hitokoto.cn', url: '/' }
};
