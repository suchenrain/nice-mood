export interface ISetting {
  enableGreeting: boolean;
  touchBallFixed: boolean;
  enableUpdateCheck: boolean;
  enableWeatherSearch: boolean;
}

export const defaultSetting: ISetting = {
  enableGreeting: true,
  enableUpdateCheck: true,
  touchBallFixed: true,
  enableWeatherSearch: true
};
