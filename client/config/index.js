// eslint-disable-next-line import/no-commonjs
const path = require("path");

// NOTE 在 sass 中通过别名（@ 或 ~）引用需要指定路径
const sassImporter = function (url) {
  if (url[0] === '~' && url[1] !== '/') {
    return {
      file: path.resolve(__dirname, '..', 'node_modules', url.substr(1))
    }
  }

  // @/styles
  const reg = /^@\/styles\/(.*)/
  if (reg.test(url)) {
    return {
      file: path.resolve(__dirname, '..', 'src/styles', url.match(reg)[1])
    }
  }
  // // @/assets
  // const asset_reg = /^@\/assets\/(.*)/
  // if (asset_reg.test(url)) {
  //   return {
  //     file: path.resolve(__dirname, '..', 'src/assets', url.match(asset_reg)[1])
  //   }
  // }

}

const config = {
  projectName: 'taro-ts-dva',
  date: '2019-7-29',
  designWidth: 640,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
    '375': 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        ['env', {
          modules: false
        }]
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    },
    sass: {
      importer: sassImporter
    }
  },
  defineConstants: {},
  alias: {
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/config': path.resolve(__dirname, '..', 'src/config'),
    '@/constants': path.resolve(__dirname, '..', 'src/constants'),
    '@/models': path.resolve(__dirname, '..', 'src/models'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/types': path.resolve(__dirname, '..', 'src/types'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages')
  },
  copy: {
    patterns: [],
    options: {}
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 1024000 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
