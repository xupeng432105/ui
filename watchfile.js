var path = require('path')
var Chokidar = require('chokidar');
var exec = require('child_process').exec;
var process = require("process");
var watcher = Chokidar.watch([path.join(__dirname, './src')], {
    // ignored: /(^|[\/\\])\../, 
    persistent: true,
    usePolling: true,
});

watcher
    .on('change', path => watchAction({ event: 'change', eventPath: path }))
    .on('unlink', path => watchAction({ event: 'change', eventPath: path }))

var t;
var watchAction = function ({ event, eventPath }) {
    clearTimeout(t);
    t = setTimeout(() => {
        exec("start cmd /k \"npm run bcc\"");
    }, 5000);
}

process.on('beforeExit', (code) => {
    global.newuiWatcher
});