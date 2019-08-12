/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  showOpenSetting: boolean;
  located: boolean;
  geo?: { city: string; district: string };
  weather?: {
    tmp: number;
    cond_txt: string;
    cond_code: number;
  };
}
/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch?: any;
  loading?:any;
  weather?: WeatherInterface;
}

export interface WeatherInterface {
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
