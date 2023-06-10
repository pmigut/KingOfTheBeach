const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: './dist'
        },
        watchFiles: ['src/**/*', 'index.html']
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    }
});