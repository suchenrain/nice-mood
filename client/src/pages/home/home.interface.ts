import { DvaLoading, IWeather, IQuote, IPhoto, IGreeting } from '@/types';

/**
 * home.state 参数类型
 *
 * @export
 * @interface IHomeState
 */
export interface IHomeState {
  showOpenSetting: boolean;
  showActionPanel: boolean;
  showShareMoment: boolean;
  greeting: string;
  located: boolean;
  bgLoaded: boolean;
  likeQuote: boolean;
  likePhoto: boolean;
  ani: any;
}
/**
 * home.props 参数类型
 *
 * @export
 * @interface IHomeProps
 */
export interface IHomeProps {
  
  weather: IWeather;
  quote: IQuote;
  dailyPhoto: IPhoto;
  greetings: Array<IGreeting>;
  dispatch?: any;
  loading?: DvaLoading;
}
