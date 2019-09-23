import { IQuote, DvaLoading, IPhoto } from '@/types';

/**
 * profile.state 参数类型
 *
 * @export
 * @interface IProfileState
 */
export interface IProfileState {
  current: number;
  photoTimeLine: string;
  quoteTimeLine:string;
  activeQuoteId: number;
  quoteInited: boolean;
  photoInited: boolean;
  photoToBeRemove:string;
  photoConfirmRemove:boolean;
  tabTopHeight:number;
  tabHeight:number;
  reachTop:boolean;
}
/**
 * profile.props 参数类型
 *
 * @export
 * @interface IProfileProps
 */
export interface IProfileProps {
  quotes: Array<IQuote>;
  photos: Array<IPhoto>;
  nomorePhoto:boolean;
  nomoreQuote: boolean;
  dispatch: any;
  loading: DvaLoading;
}
