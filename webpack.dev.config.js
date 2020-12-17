const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = {
    entry: {
        playground: './playground/playground.ts',
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
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    resolve: {
        extensions: [ '.ts']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './playground/playground.html',
        }),
        new ExtractTextPlugin({
            filename: "[name].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/jquery/dist/jquery.js', to: path.join(__dirname, "dist/jquery.js")},
                { from: 'node_modules/prismjs/prism.js', to: path.join(__dirname, "dist/prism.js")}
            ]
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    },
    watch: true
}