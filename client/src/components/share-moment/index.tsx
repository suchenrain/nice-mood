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
      imageFile: '',
      photoLoaded: false
    };
  }
  // static options = {
  //   addGlobalClass: true
  // }
  static defaultProps: IShareMomentProps = {
    isOpened: false,
    src: '../../assets/bg/bg_dog.jpg',
    text: '',
    author: '',
    onClose: () => {}
  };

  componentWillReceiveProps(nextProps: IShareMomentProps) {
    const presrc = this.props.src;
    const { isOpened, src, text, author } = nextProps;
    if (isOpened) {
      this.draw(src, text, author);
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

  draw = (src: string, text: string, author: string) => {
    let quote = text.split(/[,|.|！|。|，|？|?|;|:|、]+/);
    let text2print: Array<string> = [];
    quote.reduce((x, y) => {
      if (x.length + y.length > 15) {
        text2print.push(x);
        return y;
      } else {
        if (x == '') {
          return y;
        } else {
          text2print.push(`${x} ${y}`);
          return '';
        }
      }
    });
    text2print = text2print.filter(x => x.length > 0);
    Tips.loading('准备图片中...');
    Taro.getImageInfo({
      src: src
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

      // 添加一层遮罩
      ctx.setFillStyle('rgba(0, 0, 0, 0.2)');

      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 绘制text
      ctx.setFontSize(Rpx2px(15 * 2 * 3));
      ctx.setTextAlign('center');
      ctx.setFillStyle('rgba(256, 256, 256, 0.6)');
      text2print.forEach((t, index) => {
        if (index == 0) t = `“${t}`;
        if (index == text2print.length - 1) {
          t = `${t}”`;
        }
        ctx.fillText(
          t,
          canvasWidth / 2,
          Rpx2px((index == 0 ? 320 : 320 + index * 20) * 2 * 3)
        );
      });

      ctx.setFontSize(Rpx2px(12 * 2 * 3));
      author = `「 ${author} 」`;
      ctx.fillText(
        author,
        canvasWidth / 2,
        Rpx2px((335 + text2print.length * 20) * 2 * 3)
      );
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

  onPhotoLoaded = () => {
    Tips.loaded();
    this.setState({ photoLoaded: true });
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
    const { imageFile, photoLoaded } = this.state;
    const rootClass = classNames('fx-share-moment', {
      'fx-share-moment--active': isOpened && photoLoaded
    });
    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <Canvas className="fx-share-moment__canvas-hide" canvasId="share" />
        <View className="fx-share-moment__container">
          <View className="fx-share-moment__content">
            <Image
              className="fx-share-moment__canvas"
              src={imageFile}
              onLoad={this.onPhotoLoaded}
            />
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
