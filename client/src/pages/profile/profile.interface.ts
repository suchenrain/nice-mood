import { IQuote, DvaLoading } from '@/types';

/**
 * profile.state 参数类型
 *
 * @export
 * @interface IProfileState
 */
export interface IProfileState {
  current: number;
  quotePageIndex: number;
  activeQuoteId: number;
  quoteClicked: boolean;
  loadingQuote: boolean;
}
/**
 * profile.props 参数类型
 *
 * @export
 * @interface IProfileProps
 */
export interface IProfileProps {
  quotes: Array<IQuote>;
  totalQuotePage: number;
  dispatch?: any;
  loading?: DvaLoading;
}
