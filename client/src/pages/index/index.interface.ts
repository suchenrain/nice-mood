import { DvaLoading } from '@/types/dva-loading.interface';
import { IQuote } from '@/types/quote';
import { IWeather } from '@/types/weather';
import { IPhoto } from '@/types/photo';

/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  showOpenSetting: boolean;
  showActionPanel: boolean;
  shareMoment: boolean;
  located: boolean;
  bgLoaded: boolean;
  ani: any;
}
/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch: any;
  loading: DvaLoading;
  weather: IWeather;
  quote: IQuote;
  dailyPhoto: IPhoto;
}
