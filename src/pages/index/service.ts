import Api from '@/utils/httpRequest';

export const getWeather = data => {
  return Api.getWeather(data);
};
