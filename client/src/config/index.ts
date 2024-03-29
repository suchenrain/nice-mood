/**
 * 真机线上接口
 */
export const ONLINEHOST =
  'https://www.easy-mock.com/mock/5d38269ffb233553ab0d10ad';

/**
 * mock 接口
 */
export const MOCKHOST = 'http://localhost:3000';

/**
 * 是否启用mock
 */
export const ISMOCK: boolean = true;

/**
 * 当前的host  ONLINEHOST | QAHOST | MOCKHOST
 */
export const MAINHOST = ISMOCK ? MOCKHOST : ONLINEHOST;
