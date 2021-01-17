const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GoogleFontsPlugin = require('google-fonts-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const VUE_VERSION = require('vue/package.json').version;
const VUE_LOADER_VERSION = require('vue-loader/package.json').version;

const ROOT = path.resolve(process.cwd());
const CACHE_PATH = path.join(ROOT, 'tmp/cache');

module.exports = (env, args) => {
	const nodeEnv = env.production ? 'production' : 'development';
	process.env.NODE_ENV = nodeEnv;

	console.log('env', nodeEnv);

	const isTest = env === 'test';
	const isDev = nodeEnv === 'development';
	const isProd = nodeEnv === 'production';

	const DIST = path.resolve(ROOT, isProd ? 'dist-prod' : 'dist', 'extension');

	const mode = nodeEnv;

	const isOptimize = false;

	const tsConfig = require('../tsconfig.json');
	const alias = {};
	for (let key of Object.keys(tsConfig.compilerOptions.paths)) {
		alias[key.replace(/\/\*$/, '')] = path.resolve(process.cwd(), tsConfig.compilerOptions.paths[key][0].replace(/[\/]\*$/, ''));
	}

	const config = {
		mode,
		watch: isDev,
		context: path.join(ROOT, 'src'),
		target: 'web',
		devtool: false, // down reconfig
		entry: {
			main: './background/main.ts',
			popup: './popup/main.ts'
		},
		output: {
			path: path.join(DIST),
			sourceMapFilename: 'js/[name].[chunkhash].js.map',
			filename: 'js/[name].js',
			publicPath: '/'
		},
		node: {
			__dirname: false,
			__filename: false
		},
		stats: 'minimal',
		performance: {
			hints: false
		},
		externals: {
			uws: 'uws',
			'ursa-optional': 'ursa-optional',
			dns: 'dns',
			ursa: 'ursa',
			'le-challenge-ddns': 'le-challenge-ddns',
			'le-acme-core': 'le-acme-core',
			'buffer-v6-polyfill': 'buffer-v6-polyfill'
		},
		module: {
			rules: [
				// {
				// 	test: /\.scss$/,
				// 	use: [
				// 		'vue-style-loader',
				// 		'css-loader',
				// 		{
				// 			loader: 'sass-loader',
				// 			options: {
				// 				data: `
				// 				@import "@/styles/_variables.scss";
				// 				`
				// 			}
				// 		}
				// 	]
				// },
				{
					test: /\.(scss|css)/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								//publicPath: '../',
								//hmr: process.env.NODE_ENV === 'development',
								//reloadAll: true
							}
						},
						// 'style-loader',
						// 'vue-style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								//prependData: `
								//@import "src/options/scss/main.scss";
							  //`
							}
						}
					]
				},
				{
					test: /\.ts$/,
					use: {
						loader: 'ts-loader',
						options: {
							//cacheDirectory: path.join(CACHE_PATH, 'ts-loader'),
							configFile: isProd ? 'tsconfig.release.json' : 'tsconfig.json',
							appendTsSuffixTo: [/\.vue$/]
						}
					},
					exclude: /node_modules/
				},
				{
					test: /\.pug$/,
					loader: 'pug-plain-loader'
				},
				{
					test: /\.less$/,
					use: ['style-loader', 'vue-style-loader', 'css-loader', 'less-loader']
				},
				{
					test: /\.svg$/,
					use: ['vue-svg-loader', 'svg-transform-loader', 'svgo-loader']
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					use: [{ loader: 'file-loader', options: {} }]
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							ts: 'ts-loader'
						},
						esModule: true,
						cacheDirectory: path.join(CACHE_PATH, 'vue-loader'),
						cacheIdentifier: [process.env.NODE_ENV || 'development', webpack.version, VUE_VERSION, VUE_LOADER_VERSION].join('|'),
						postcss: true
					}
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=1000&mimetype=application/font-woff&outputPath=fonts/&publicPath=fonts/'
				}
			]
		},
		resolve: {
			extensions: ['.js', '.json', '.vue', '.ts', '.d.ts'],
			modules: [path.join(ROOT, 'node_modules'), 'node_modules'],
			alias: {
				...alias,
				vue: isDev || isTest ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.min.js',
				handlebars: 'handlebars/dist/handlebars.min.js'
				//...(process.env.NODE_ENV === 'production' && {
				//'vue-types': require.resolve('vue-types/es/shim.js')
				//})
			}
		},
		plugins: [
			/*
			new webpack.SourceMapDevToolPlugin({
				filename: '[name].js'
			}),

			 */
			//new TsconfigPathsPlugin({}),
			//new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),

			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
				ignoreOrder: true
			}),
			new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),

			/*
			new GoogleFontsPlugin({
				formats: ['woff', 'woff2'], // eot, ttf, svg
				subsets: ['cyrillic-ext', 'cyrillic', 'latin'],
				fonts: [{ family: 'Roboto Condensed', variants: ['300', '400', '700'] }]
			}),

			 */

			//new webpack.EnvironmentPlugin(listEnv), //, 'DEBUG'
			// new CleanWebpackPlugin(),

			new VueLoaderPlugin(),
			new HtmlWebpackPlugin({
				template: `!!html-loader!${path.join('src', 'popup', 'public', 'index.html')}`,
				// favicon: path.join('options', 'public', 'favicon.ico'),
				filename: 'popup.html',
				//chunksSortMode: 'dependency',
				chunks: ['popup'],
				inject: 'body',
				hash: true,
				cache: true,
				minify: {
					removeComments: true,
					removeEmptyAttributes: true,
					collapseWhitespace: true
				}
			}),
			new ScriptExtHtmlWebpackPlugin({ defaultAttribute: 'async' }),
			new CopyWebpackPlugin({
				patterns: [
					{ from: './assets/icon.png', to: 'icon.png' },
					{ from: './assets/manifest.json', to: 'manifest.json' },
					{ from: path.resolve(ROOT, './node_modules/jquery/dist/jquery.js'), to: 'js/jquery.js' }
				]
			}),
			new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) })
		]
	};

	if (isDev || isTest) {
		//config.devtool = 'eval';
		// config.devtool = 'eval-source-map';
		//config.plugins.push(new webpack.HotModuleReplacementPlugin());
	} else {
		if (isOptimize) {
			config.plugins.unshift(
				new JavaScriptObfuscator({
					compact: true,
					debugProtection: true,
					disableConsoleOutput: true,
					rotateUnicodeArray: true
				})
			);

			config.optimization = {
				splitChunks: {
					cacheGroups: {
						styles: {
							name: 'styles',
							test: /\.css$/,
							chunks: 'all',
							enforce: true
						}
					}
				},
				minimizer: [
					new TerserPlugin({
						parallel: true,
						cache: path.join(CACHE_PATH, 'terser-plugin'),
						terserOptions: {
							ecma: 6,
							compress: { drop_console: true },
							output: { comments: false }
						}
					}),
					new OptimizeCSSAssetsPlugin({})
				]
			};
		}
	}

	return config;
};
