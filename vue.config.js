module.exports = {
    lintOnSave:false,
    productionSourceMap:false,
    devServer: {
        proxy: {
          '/Web': {
            target: 'http://39.108.194.238:56081',
            ws: false,
            changeOrigin: true,
/*             pathRewrite: {
                '^/Web': '/'
              } */
          }
        }
    },
}