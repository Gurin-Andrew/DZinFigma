const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin}= require('clean-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev= process.env.NODE_ENV === 'development';
const isProd  = !isDev;


const optimization =() =>{
    const config={
        splitChunks:{
            chunks: 'all' // Если подключаешь библиотеки несколько раз 
        }
    }
    if (isProd){
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
   

}


console.log('ISdev:?',isDev);

module.exports= {
    mode: "development",
    entry: "./src/index.js",
    output:{
        filename:'[name].[contenthesh].bundle.js',
        path: path.resolve(__dirname,"dist")
    },
    plugins:
    [
        new HTMLWebpackPlugin({ // Для подключения к существующему HTML
           template:'./src/index.html',
           minify: {
               collapseWhitespace: isProd
           }

        }),
        new CleanWebpackPlugin(),//Для удаления предыдущих файлов после изменения 
       /* new CopyWebpackPlugin([ // копирование во время запущеного приложения
            {
               // from: '',
               // to:''
            }
        ]),*/
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
   ],
   module:{//Обработчики типов данных 
       rules: [
           {
                test:/\.css$/, //Обработка css
                use : [
                    {
                       loader: MiniCssExtractPlugin.loader,
                       options:{
                       }
                   },
                   'css-loader']
           },
           {
               test:/\.(png|jpg|svg|gif)$/, // Обработка картинок
               use :['file-loader']
           },
           {
               test: /\.(ttf|woff|woff2|eot)$/, //Обработчик шрифтов
               use: ['file loader']
           }

       ]
   },
   resolve:{
       extensions: ['.js', '.json', '.png',] ,// Можно не указывать расширения файлов
       alias:{
           '@models':path.resolve(__dirname,'src/models'), // Для упрощения перемещения по часто используемым директориям   синтаксис import Name from '@models/...'
           '@': path.resolve(__dirname,'src')
       }
   },
   optimization:optimization(),
   devServer:{
       port: 4200,
       hot: isDev,
       open: true
   },

};