var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: {
        main: './static/scripts/main.js',
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    plugins: [
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        })
    ]
};