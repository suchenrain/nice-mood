import { DvaLoading } from '@/types/dva-loading.interface';
import { IQuote } from '@/types/quote';

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
  dailyBg: string;
  bgLoaded: boolean;
  greeting: string;
  ani: any;
}
/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch?: any;
  loading?: DvaLoading;
  weather?: IWeather;
  bgImage?: IUnsplashImage;
  quote?: IQuote;
}

export interface IUnsplashImage {
  alt: string;
  color: string;
  urls: { raw: string; regular: string };
  user: {
    name: string;
  };
  links: {
    html: string;
    download: string;
  };
}
export interface IWeather {
  basic: {
    dmin_area: string;
    cid: string;
    cnty: string;
    location: string;
    parent_city: string;
  };
  now: {
    cloud: number;
    cond_code: number;
    cond_txt: string;
    fl: number;
    hum: number;
    pcpn: number;
    pres: number;
    tmp: number;
    vis: number;
    wind_deg: number;
    wind_dir: string;
    wind_sc: number;
    wind_spd: number;
  };
  update: {
    loc: string;
    utc: string;
  };
}
