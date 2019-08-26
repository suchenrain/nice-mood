import { IQuote } from '@/types/quote';

/**
 * share-moment.state 参数类型
 *
 * @export
 * @interface IShareMomentState
 */
export interface IShareMomentState {
  imageFile: string;
  isDrawing: boolean;
  photoLoaded: boolean;
}
/**
 * share-moment.props 参数类型
 *
 * @export
 * @interface IShareMomentProps
 */
export interface IShareMomentProps {
  isOpened: boolean;
  src: string;
  quote: IQuote;
  onClose: any;
}
