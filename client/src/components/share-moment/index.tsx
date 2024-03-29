import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, Image } from '@tarojs/components';
import classNames from 'classnames';

import { IShareMomentProps, IShareMomentState } from './index.interface';
import './index.scss';
import { Rpx2px, getStrLength } from '@/utils/common';
import Tips from '@/utils/tips';
import qrcode from '@/assets/images/nicemood.png';
import { IQuote } from '@/types';

class ShareMoment extends Component<IShareMomentProps, IShareMomentState> {
  _quoteID: number;
  ctx: any;
  constructor(props: IShareMomentProps) {
    super(props);
    this.state = {
      imageFile: '',
      isDrawing: false,
      photoLoaded: false
    };
  }
  // static options = {
  //   addGlobalClass: true
  // }
  static defaultProps: IShareMomentProps = {
    isOpened: false,
    isLocal: false,
    src: '',
    quote: { id: 0, hitokoto: '世界很美，你也是。', from: 'Nice Mood' },
    onClose: () => {}
  };

  componentWillReceiveProps(nextProps: IShareMomentProps) {
    const { isOpened, src, quote } = nextProps;
    if (isOpened) {
      //避免打印重复的图片文字
      if (this._quoteID !== quote.id) {
        this._quoteID = quote.id;
        this.draw(src, quote);
      }
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
  hanlePreview = () => {
    const { imageFile } = this.state;
    Taro.previewImage({
      urls: [imageFile],
      current: imageFile
    });
  };

  saveImage2Album = (path: string): any => {
    Taro.saveImageToPhotosAlbum({
      filePath: path
    }).then(
      () => {
        Tips.success('图片已保存至相册');
      },
      () => {
        Tips.success('已取消');
      }
    );
  };
  permissionFail = () => {
    Tips.toast('保存失败,请授权相册权限！');
  };

  buildPrintArray = (text: string): Array<string> => {
    let quotes = text.split(/[,，.。！!"“”'‘’？?;；:：、…\s]/g);
    let res: Array<string> = [];
    quotes = quotes.filter(q => q.length > 0);
    let lastCount = 0;
    let lastStr: string = '';
    for (let i = 0; i < quotes.length; i++) {
      let curStr = quotes[i];
      let curCount = getStrLength(curStr);
      if (i > 0 && lastCount < 30 && lastCount + curCount <= 30) {
        res.pop();
        res.push(`${lastStr} ${curStr}`);
        lastStr = `${lastStr} ${curStr}`;
        lastCount = getStrLength(lastStr);
      } else {
        if (curCount > 30) {
          let split = curStr.length < curCount ? 15 : 30;
          let tmp1 = curStr.substr(0, split);
          let tmp2 = curStr.substr(split, curStr.length);
          res.push(tmp1);
          res.push(tmp2);
          lastCount = getStrLength(tmp2);
          lastStr = tmp2;
        } else {
          res.push(curStr);
          lastCount = curCount;
          lastStr = curStr;
        }
      }
    }
    return res;
  };

  draw = (src: string, quote: IQuote) => {
    let text2print = this.buildPrintArray(quote.hitokoto);

    this.setState({ isDrawing: true });
    Tips.loading('准备图片中...');

    if (!src || src == '') {
      src = '../../assets/bg/default.jpg';
    }
    const qrcodePromise = Taro.getImageInfo({ src: qrcode });
    const backgroundPromise = Taro.getImageInfo({ src: src });

    Promise.all([qrcodePromise, backgroundPromise]).then(
      ([qrcode, background]) => {
        if (!this.ctx) {
          this.ctx = Taro.createCanvasContext('share', this.$scope);
        }
        const canvasWidth = Rpx2px(300 * 2 * 3);
        const canvasHeight = Rpx2px(450 * 2 * 3);

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // 绘制背景，填充满整个canvas画布
        const bg = `${this.props.isLocal ? '../../' : ''}${background.path}`;
        this.ctx.drawImage(`${bg}`, 0, 0, canvasWidth, canvasHeight);

        this.ctx.save()
        // 添加一层遮罩
        this.ctx.setFillStyle('rgba(0, 0, 0, 0.25)');
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 绘制二维码
        this.ctx.restore()
        const qrWidth = Rpx2px(35 * 2 * 3);
        const qrHeight = Rpx2px(35 * 2 * 3);
        this.ctx.drawImage(
          `../../${qrcode.path}`,
          canvasWidth - qrWidth - Rpx2px(10 * 2 * 3),
          canvasHeight - qrHeight - Rpx2px(10 * 2 * 3),
          qrWidth,
          qrHeight
        );

        // 绘制text 从下往上
        this.ctx.setTextAlign('center');
        this.ctx.setFillStyle('rgba(256, 256, 256, 0.8)');
        // author
        let author = quote.from;
        this.ctx.setFontSize(Rpx2px(11 * 2 * 3));
        author = `「 ${author} 」`;
        this.ctx.fillText(
          author,
          canvasWidth / 2,
          canvasHeight - Rpx2px(40 * 2 * 3)
        );
        // this.ctx.setFillStyle('rgba(256, 256, 256, 0.85)');
        this.ctx.setFontSize(Rpx2px(15 * 2 * 3));
        text2print.reverse();
        text2print.forEach((t, index) => {
          if (index == 0) t = `${t} ”`;
          if (index == text2print.length - 1) {
            t = `“ ${t}`;
          }
          this.ctx.fillText(
            t,
            canvasWidth / 2,
            canvasHeight - Rpx2px((index * 20 + 80) * 2 * 3)
          );
        });

        // this.ctx.stroke();
        // 完成作画
        this.ctx.draw(false, () => {
          this.canvasToTempFilePath(
            {
              canvasId: 'share'
            },
            this.$scope
          ).then(({ tempFilePath }) => {
            this.setState({ imageFile: tempFilePath, isDrawing: false });
          });
        });
      },
      err => {
        this.setState({ isDrawing: false }, () => {
          Tips.loaded();
        });
        this.handleClose();
      }
    );
  };

  onPhotoLoaded = () => {
    this.setState({ photoLoaded: true }, () => {
      Tips.loaded();
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
    const { imageFile, photoLoaded, isDrawing } = this.state;
    const rootClass = classNames('fx-share-moment', {
      'fx-share-moment--active': isOpened && !isDrawing && photoLoaded
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
              onClick={this.hanlePreview}
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
