/**
 * heart.state 参数类型
 *
 * @export
 * @interface IHeartState
 */
export interface IHeartState {
  _active: boolean;
}
/**
 * heart.props 参数类型
 *
 * @export
 * @interface IHeartProps
 */
export interface IHeartProps {
  twink:boolean;
  active: boolean;
  size:string
  onFavorite:(like:boolean)=>any;
}
