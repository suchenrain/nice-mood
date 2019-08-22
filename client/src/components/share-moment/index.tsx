import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, Image } from '@tarojs/components';
import classNames from 'classnames';

import { IShareMomentProps, IShareMomentState } from './index.interface';
import './index.scss';
import { Rpx2px } from '@/utils/common';
import Tips from '@/utils/tips';

class ShareMoment extends Component<IShareMomentProps, IShareMomentState> {
  constructor(props: IShareMomentProps) {
    super(props);
    this.state = {
      imageFile: ''
    };
  }
  // static options = {
  //   addGlobalClass: true
  // }
  static defaultProps: IShareMomentProps = {
    isOpened: false,
    onClose: () => {}
  };

  componentWillReceiveProps(nextProps: IShareMomentProps) {
    const { isOpened } = nextProps;
    if (isOpened) {
      this.draw();
    }
  }

  savePhotoDispatcher = () => {
    return new Promise((resolve, reject) => {
      Taro.getSetting({
        success: res => {
          const permission = 'scope.writePhotosAlbum';
          // 从未授权写入图片相册或者已经拒绝
          if (!res.authSetting[permission]) {
            Taro.vibrateShort();
            Taro.authorize({ scope: permission }).then(resolve, reject);
          } else {
            // 已授权过
            resolve();
          }
        },
        fail: () => {
          reject();
        }
      });
    });
  };

  handleTouchMove = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleClose = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };
  handleSave = () => {
    const { imageFile } = this.state;
    if (imageFile) {
      this.savePhotoDispatcher().then(
        () => {
          this.saveImage2Album(imageFile);
        },
        () => {
          this.permissionFail();
        }
      );
    }
  };
  saveImage2Album = (path: string): any => {
    Taro.saveImageToPhotosAlbum({
      filePath: path
    }).then(
      () => {
        Tips.toast('图片已保存至相册');
      },
      () => {
        Tips.toast('已取消');
      }
    );
  };
  permissionFail = () => {
    Tips.toast('保存失败,请授权相册权限！');
  };

  draw = () => {
    Taro.getImageInfo({
      src: '../../assets/bg/bg_dog.jpg'
    }).then(background => {
      const ctx = Taro.createCanvasContext('share', this.$scope);
      const canvasWidth = Rpx2px(300 * 2 * 3);
      const canvasHeight = Rpx2px(450 * 2 * 3);
      // 绘制背景，填充满整个canvas画布
      ctx.drawImage(
        `../../${background.path}`,
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      // 绘制用户名
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.setFillStyle('#ffffff');
      ctx.fillText('Test', canvasWidth / 2, 10 + 50);
      ctx.stroke();
      // 完成作画
      ctx.draw(false, () => {
        this.canvasToTempFilePath(
          {
            canvasId: 'share'
          },
          this.$scope
        ).then(({ tempFilePath }) => {
          this.setState({ imageFile: tempFilePath });
        });
      });
    });
  };

  canvasToTempFilePath = (option, context) => {
    return new Promise((resolve, reject) => {
      Taro.canvasToTempFilePath(
        {
          ...option,
          success: resolve,
          fail: reject
        },
        context
      );
    });
  };

  render() {
    const { isOpened } = this.props;
    const { imageFile } = this.state;
    const rootClass = classNames('fx-share-moment', {
      'fx-share-moment--active': isOpened
    });
    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <Canvas className="fx-share-moment__canvas-hide" canvasId="share" />
        <View className="fx-share-moment__container">
          <View className="fx-share-moment__content">
            <Image className="fx-share-moment__canvas" src={imageFile} />
            <View className="fx-share-moment__footer">
              <View className="fx-share-moment__save" onClick={this.handleSave}>
                保存到相册
              </View>
              <View
                className="fx-share-moment__close"
                onClick={this.handleClose}
              >
                取消
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default ShareMoment;
