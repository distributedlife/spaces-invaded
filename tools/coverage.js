var wrench = require('wrench');
var exec = require('child_process').exec;

var source_path = 'public/javascript/';
var build_path = 'build/';
var spec_path = 'spec/';
var report_path = 'reports/';
var exclude_path = 'ext/';
var jscoverage_files_path = 'tools/jscoverage';

var run = function() {
  require('jasmine-node');
  require('jscoverage-reporter');

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.addReporter(new jasmine.JSCoverageReporter('./reports'));
  
  require('../node_modules/jasmine-node/lib/jasmine-node/cli.js');
};


var refresh_generated_files = function() {
  wrench.rmdirSyncRecursive(build_path, true);
  wrench.mkdirSyncRecursive(build_path + source_path);
  wrench.mkdirSyncRecursive(build_path + spec_path);
  wrench.copyDirSyncRecursive(spec_path, build_path + spec_path);
  wrench.rmdirSyncRecursive(report_path, true);
  wrench.mkdirSyncRecursive(report_path);
  wrench.copyDirSyncRecursive(jscoverage_files_path, report_path);
}();


console.log('jscoverage --verbose  --no-instrument=' + build_path + exclude_path +  ' ' + source_path + ' ' + build_path + source_path);
exec('jscoverage --no-instrument ' + exclude_path + ' --verbose ' + source_path + ' ' + build_path + source_path, function(err, stdout, stderr) {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
  if (err) {
    console.error('exec error', err);
    process.exit(1);
  }
  run();
});
