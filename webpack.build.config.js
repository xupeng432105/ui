const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ENV_DEV = "development";
const ENV_PROD = "production";
module.exports = {
    entry: {
        newui: './src/public_api.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader"
                    }
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)$/,
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: ENV_PROD,
    resolve: {
        extensions: [ '.ts']
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "newui.css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/css/iconfont', to: path.join(__dirname, "dist/iconfont")},
                { from: 'src/css/acumin', to: path.join(__dirname, "dist/acumin")}
            ]
        })
    ]
}