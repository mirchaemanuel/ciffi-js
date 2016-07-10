var each = require('foreach');
var chalk = require('chalk');
var prompt = require('prompt');
var replace = require('replace-in-file');
var pkg = require('../package.json');
var emptydir = require('empty-dir');

var AppSetup = (function() {

  function AppSetup(config) {

    require('./tempApp');

    var appConfig = {
      projectName: config.projectName,
      envs: {

      }
    };

    process.env.PN_APP = JSON.stringify({});

    function replaceAssets(env,url,callback) {
      replace({
        files: [
          process.config.variables.node_prefix+'/lib/node_modules/ciffi/tmp/dev/styles/config/config-'+env+'.scss'
        ],
        replace: /@REPLACE__ASSETSURL@/g,
        with: url
      }, function(error, changedFiles) {
        if(error) {
          return console.error('Error occurred:', error);
        }
        //console.log('Generate scss $assets variable in: ' + changedFiles.join(', '));
        callback();
      });
    }

    function replaceConfig(config,callback) {
      replace({
        files: [
          process.config.variables.node_prefix+'/lib/node_modules/ciffi/tmp/dev/scripts/config/config.js'
        ],
        replace: /@REPLACE__CONFIG@/g,
        with: config
      }, function(error, changedFiles) {
        if(error) {
          return console.error('Error occurred:', error);
        }
        //console.log('Generate DefaultConfig in: ' + changedFiles.join(', '));
        callback();
      });
    }

    emptydir(process.env.PWD+'/', function (err, result) {
      if(err) {
        console.log(err);
      }else {
        if(result) {
          console.log('');
          console.log('');
          console.log(chalk.green.bold('-- CiffiDesign Frontend Generator --'));
          console.log('');

          replaceConfig(config.projectName,function() {
            require('./moveApp');
          });

          console.log('');
          console.log(chalk.green.bold('-- nuovo progetto ')+chalk.blue.bold(config.projectName)+chalk.green.bold(' generato --'));
          console.log('');
          console.log(chalk.green.bold('-- inizio installazione dipendenze --'));
          console.log('');

        }else {
          console.log('');
          console.log('');
          console.log(chalk.green.bold('-- CiffiDesign Frontend Generator --'));
          console.log('');
          console.log(chalk.red.bold('Setup progetto fallito:')+' '+chalk.blue('la directory deve essere vuota'));
          console.log('');
        }
      }
    });

  }

  return AppSetup;
})();

module.exports = AppSetup;