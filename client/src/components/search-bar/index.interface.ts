/**
 * search-bar.state 参数类型
 *
 * @export
 * @interface ISearchBarState
 */
export interface ISearchBarState {
  isFocus: boolean;
}
/**
 * search-bar.props 参数类型
 *
 * @export
 * @interface ISearchBarProps
 */
export interface ISearchBarProps {
  value: string;
  placeholder: string;
  maxLength: number;
  fixed: boolean;
  focus: boolean;
  disabled: boolean;
  showActionButton: boolean;
  actionName: string;
  className: string;
  customStyle: {};
  onChange: (...arg) => any;
  onFocus: () => any;
  onBlur: () => any;
  onConfirm: () => any;
  onActionClick: () => any;
  onClear: () => any;
}
