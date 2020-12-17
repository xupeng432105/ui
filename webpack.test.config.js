const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        demo: './playground/playground.ts',
        newui: './src/public_api.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: "tsconfig.test.json",
                            colors: false
                        }
                    }
                ],
                exclude: /node_modules/,
                
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
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
        path: path.resolve(__dirname, "dist_test")
    },
    mode: "development",
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
                { from: 'node_modules/jquery/dist/jquery.js', to: path.join(__dirname, "dist_test/jquery.js")}
            ]
        })
    ]
}