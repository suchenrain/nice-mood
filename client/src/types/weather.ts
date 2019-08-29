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
