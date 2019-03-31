var path = require('path');


module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        style: './src/style.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'react-upload-image-gallery',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.*scss$/,
                use: [
                    {
						loader: 'file-loader',
						options: {
							name: '[name].css',
						}
					},
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    externals: {
        'react': 'commonjs react' 
    }
};