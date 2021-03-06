const path = require('path')
const ConfigFile = require(path.join(process.cwd(), '.ciffisettings'))
const scssAssets = ConfigFile.general.useNodeSass ? '.' : '..'
const workboxPlugin = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

const insertAtTop = element => {
  const parent = document.querySelector('head')
  const lastInsertedElement = window._lastElementInsertedByStyleLoader
  if (!lastInsertedElement) {
    parent.insertBefore(element, parent.firstChild)
  } else if (lastInsertedElement.nextSibling) {
    parent.insertBefore(element, lastInsertedElement.nextSibling)
  } else {
    parent.appendChild(element)
  }
  window._lastElementInsertedByStyleLoader = element
}

module.exports = {
  output: {
    path: path.normalize(path.join(process.cwd(), ConfigFile.build.path + '/')),
    filename: '[name].js',
    chunkFilename: '[name].js',
    hotUpdateChunkFilename: '.hot/[name].[hash].hot-update.js',
    hotUpdateMainFilename: '.hot/[hash].hot-update.json'
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.wcs$/,
        loader: require.resolve('@ciffi-js/webpack-wcs-loader')
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader:
              process.env.NODE_ENV !== 'production'
                ? require.resolve('style-loader')
                : MiniCssExtractPlugin.loader,
            options: {
              insert: insertAtTop
            }
          },
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')({})]
            }
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              prependData: `$assets: '${scssAssets}';`
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        loaders: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true
            }
          },
          {
            loader: require.resolve('eslint-loader')
          }
        ]
      },
      {
        test: /\.twig$/,
        loader: require.resolve('twig-loader')
      },
      {
        test: /\.(png|jpg|gif|svg|woff2|woff|ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: '[path][name].[ext]',
              outputPath: url => {
                return url.replace('src/', '')
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {}
  },
  plugins: [
    new workboxPlugin.InjectManifest({
      swSrc: path.normalize(
        path.join(process.cwd(), ConfigFile.build.srcPathName, 'sw.js')
      ),
      swDest: path.normalize(
        path.join(process.cwd(), ConfigFile.build.path + '/..', 'sw.js')
      ),
      globDirectory: path.normalize(
        path.join(process.cwd(), ConfigFile.build.path + '/..')
      ),
      globPatterns: ['*.html']
    }),
    new ErrorOverlayPlugin()
  ]
}
