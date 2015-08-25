var path    = require('path');
var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: [
			'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
			'webpack/hot/only-dev-server',
			'./src/app.jsx'
		]
	},
	output: {
		path:        path.join(__dirname, 'priv/static/bundles'),
		filename:    '[name].js',
		publicPath:  'http://localhost:3000/bundles/'
	},
	module: {
		loaders: [
			{
				test:   /\.less$/,
				loader: 'style!css!autoprefixer-loader?browsers=last 2 version!less'
			},
			{
				test:   /\.css/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.js|\.jsx/,
				loaders: ['react-hot', 'babel?stage=1'],
				exclude: /node_modules/
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&minetype=application/font-woff'
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	]
};
