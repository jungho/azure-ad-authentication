var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

//split out vendor libs into a separate .js file
//this is important for code splitting and optimized
//delivery to the browser
const VENDOR_LIBS = [
    'axios',
    'lodash',
    'react',
    'react-redux',
    'react-dom',
    'react-router',
    'redux-form',
    'redux'
]

module.exports = {
    entry: {
        bundle: path.join(__dirname, 'src/client/index.js'),
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.join(__dirname, 'dist'),
        //if the js changes the chunkhash value will 
        //change hence causing the browser to download 
        //the new .js file.
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/
            }
        ]
    },
    plugins: [
        //ensure common dependencies are extracted into the vendor.js file
        //the manifest.js file will help the browser determine if the vendor.js file
        //has changed
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        //injects the necessary script tags to reference the .js files into the 
        //index.html file
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/client/index.html')
        }),
        new webpack.DefinePlugin({
            //sets process.env.NODE_ENV variable at the window scope.
            //if set to 'production', react will execute in prod mode
            //less error checking etc.
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new CopyWebpackPlugin([
            { from: path.join(__dirname, 'style') }
        ])
    ]
};
