import Api from '@/utils/httpRequest';

export const getWeather = data => {
  return Api.getWeather(data);
};

export const getDailyImage = data => {
  return Api.getDailyImage(data);
};
