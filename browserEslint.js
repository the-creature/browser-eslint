'use strict';

var path = require('path');
var stripAnsi = require('strip-ansi');

var BrowserEslint = function(filename) {
    this.filename = filename;
};

BrowserEslint.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('done', function(stats) {
        if (stats.hasErrors()) {
            var outputFileSystem = compiler.outputFileSystem;
            var outputOptions = compiler.options.output;
            var filename = self.filename || outputOptions.filename;
            var main = path.join(outputOptions.path, filename);
            var errors = stripAnsi(stats.toString({
                hash: false,
                version: false,
                timings: false,
                assets: false,
                chunks: false,
                chunkModules: false,
                modules: false,
                cached: false,
                reasons: false,
                source: false,
                errorDetails: true,
                chunkOrigins: false,
                modulesSort: false,
                chunksSort: false,
                assetsSort: false
            }).replace(/\n/g, '\\n'));
            var contents = outputFileSystem.readFileSync(main);
            var lineBreak = "\n\n";
            var warnOpen = 'console.warn(\'WEBPACK BUILD OUTPUT\', \'';
            var warnClose = '\')';
            var err = errors.replace('\'', '\\\'')
            
            outputFileSystem.writeFile(main, contents + lineBreak + warnOpen + err + warnClose, 'utf-8', function(){});
        }
    });
};

module.exports = BrowserEslint;
