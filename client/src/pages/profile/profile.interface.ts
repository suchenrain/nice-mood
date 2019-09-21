import { IQuote, DvaLoading, IPhoto } from '@/types';

/**
 * profile.state 参数类型
 *
 * @export
 * @interface IProfileState
 */
export interface IProfileState {
  current: number;
  quotePageIndex: number;
  photoTimeLine: any;
  activeQuoteId: number;
  quoteInited: boolean;
  photoInited: boolean;
  nomoreQuote: boolean;
  nomorePhoto: boolean;
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
  totalQuotePage: number;
  dispatch: any;
  loading: DvaLoading;
}
