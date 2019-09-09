/**
 * open-setting.state 参数类型
 *
 * @export
 * @interface IOpenSettingState
 */
export interface IOpenSettingState {}
/**
 * open-setting.props 参数类型
 *
 * @export
 * @interface IOpenSettingProps
 */
export interface IOpenSettingProps {
  isOpened: boolean;
  onCancel: () => any;
  onOk: () => any;
}
