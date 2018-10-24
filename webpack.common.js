const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        app: './app.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin(['index.html'])
    ]
};