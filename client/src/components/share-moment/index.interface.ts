/**
 * share-moment.state 参数类型
 *
 * @export
 * @interface IShareMomentState
 */
export interface IShareMomentState {
  imageFile: string;
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
  text:string;
  author:string;
  onClose: any;
}
