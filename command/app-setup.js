var chalk = require('chalk');
var prompt = require('prompt');
var replace = require('replace-in-file');
var emptydir = require('empty-dir');
var cliCursor = require('cli-cursor');
var shell = require('shelljs');
var Loading = require('./loading');

var AppSetup = (function () {
	
	function AppSetup(config) {
		
		if (!config.projectName) {
			return console.log(chalk.red.bold('Project setup failed:') + ' ' + chalk.blue('project name must be specified'));
		}
		
		require('./tempApp');
		
		function replaceBuildPath(config, callback) {
			
			var _pathName = config.split('/')[config.split('/').length - 1];
			replace({
				files: [
					process.env.PWD + '/.ciffi/static/scripts/config/config.js',
					process.env.PWD + '/.ciffi/dev.config.js',
					process.env.PWD + '/.ciffi/build.config.js',
					process.env.PWD + '/.ciffi/package.json'
				],
				replace: /@REPLACE__ASSETS@/g,
				with: config
			}, function (error) {
				if (error) {
					return console.error('Error occurred:', error);
				}
				replace({
					files: [
						//process.env.PWD + '/.ciffi/static/scripts/styles.js',
						process.env.PWD + '/.ciffi/static/scripts/config/config.js',
						//process.env.PWD + '/.ciffi/serve.config.js',
						process.env.PWD + '/.ciffi/dev.config.js',
						process.env.PWD + '/.ciffi/build.config.js',
						process.env.PWD + '/.ciffi/package.json'
					],
					replace: /@REPLACE__ASSETS__NAME@/g,
					with: _pathName
				}, function (error) {
					if (error) {
						return console.error('Error occurred:', error);
					}
					callback();
				});
			});
		}
		
		function replaceConfig(config, callback) {
			replace({
				files: [
					process.env.PWD + '/.ciffi/static/scripts/config/config.js',
					process.env.PWD + '/.ciffi/dev.config.js'
				],
				replace: /@REPLACE__CONFIG@/g,
				with: config
			}, function (error) {
				if (error) {
					return console.error('Error occurred:', error);
				}
				callback();
			});
		}
		
		function filter(filepath) {
			return !/(^|\/)\.[^\/\.]/g.test(filepath);
		}
		
		emptydir(process.env.PWD + '/', filter, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				if (result) {
					console.log('');
					console.log('');
					console.log(chalk.green.bold('-- CiffiDesign Frontend Generator --'));
					console.log('');
					console.log('');
					
					prompt.start();
					
					prompt.get([{
						name: 'assetsUrl',
						description: chalk.green.bold('Specify relative build path'),
						default: '../static',
						type: 'string',
						pattern: /..\/\w+$/,
						message: chalk.red('☠️  Build path must be out of this project setup folder ☠️')
					}], function (err, res) {
						
						var _fixedAssetsUrl = res.assetsUrl;
						
						if (_fixedAssetsUrl.substring(_fixedAssetsUrl.length - 1, _fixedAssetsUrl.length) === '/') {
							_fixedAssetsUrl = _fixedAssetsUrl.substring(0, _fixedAssetsUrl.length - 1)
						}
						
						replaceBuildPath(_fixedAssetsUrl, function () {
							
							cliCursor.hide();
							
							console.log('');
							
							Loading.start('Generate project tree for ' + chalk.blue(config.projectName));
							
							replaceConfig(config.projectName, function () {
								
								var _pathName = _fixedAssetsUrl.split('/')[_fixedAssetsUrl.split('/').length - 1];
								
								if (_pathName != 'static') {
									shell.mv(process.env.PWD + '/.ciffi/static/', process.env.PWD + '/.ciffi/' + _pathName + '/');
								}
								
								Loading.stop('Generate project tree for ' + chalk.blue(config.projectName) + chalk.green.bold(' OK'));
								
								require('./app-sethiddenfile');
								require('./app-createsettings').setData({
									projectName: config.projectName,
									assetsPath: _fixedAssetsUrl,
									pathName: _pathName
								});
								
								require('./moveApp');
								
							});
						});
						
					});
					
				} else {
					console.log('');
					console.log('');
					console.log(chalk.green.bold('-- CiffiDesign Frontend Generator --'));
					console.log('');
					console.log(chalk.red.bold('Project setup failed:') + ' ' + chalk.blue('the path must be empty'));
					console.log('');
				}
			}
		});
		
	}
	
	return AppSetup;
})();

module.exports = AppSetup;