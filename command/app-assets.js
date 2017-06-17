var chalk = require('chalk');
var fileExists = require('file-exists');
var exec = require('child_process').exec;
var Log = require('single-line-log').stdout;
var ConfigFile = process.env.PWD + '/.ciffisettings';

var Assets = (function () {
	
	var _CONFIG;
	
	function Assets() {
		
		if (fileExists(ConfigFile)) {
			_CONFIG = require(ConfigFile);
		} else {
			console.log(chalk.red.bold('☠️  Project build failed:') + ' ' + chalk.blue('can\'t find .ciffisettings file ☠️'));
			return console.log('');
		}
		
		var _staticFolders = _CONFIG.staticFolders;
		
		if (_staticFolders.length) {
			
			var _process = exec(getAssets());
			
			_process.stdout.on('data', function (res) {
				if (res.indexOf('ERROR in') >= 0 || res.indexOf('Error:') >= 0) {
					console.log(chalk.red(res));
				} else {
					Log('🏗  ' + chalk.blue(res));
				}
			});
			
			_process.stderr.on('data', function (res) {
				if (res.indexOf('ERROR in') >= 0 || res.indexOf('Error:') >= 0) {
					console.log(chalk.red(res));
				} else {
					Log('🏗  ' + chalk.blue(res));
				}
			});
			
			_process.on('close', function (res) {
				if (res === 0) {
					Log(chalk.blue('🏗  Assets copied in ') + ' ' + _CONFIG.assetsPath + '/ ' + chalk.green.bold(' OK'));
				}
				console.log('');
			});
			
		}
		
		function getAssets() {
			
			var _assetPath = _CONFIG.assetsPath;
			var _assetPathName = _CONFIG.assetsPathName;
			var _temp = '';
			
			for (var i = 0; i < _staticFolders.length; i++) {
				_temp += '\'' + _assetPathName + '/' + _staticFolders[i] + '/**/*.*\' ';
			}
			
			return './node_modules/.bin/copyfiles -u 1 ' + _temp + _assetPath + '/';
		}
		
	}
	
	return new Assets();
})();

module.exports = Assets;