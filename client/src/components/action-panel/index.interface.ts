/**
 * action-panel.state 参数类型
 *
 * @export
 * @interface IActionPanelState
 */
export interface IActionPanelState {
  _isOpened: boolean;
}
/**
 * action-panel.props 参数类型
 *
 * @export
 * @interface IActionPanelProps
 */
export interface IActionPanelProps {
  isOpened: boolean;
  cancelText?: string;
  className?: string;
  onClose?: any;
  onCancel?: any;
}
