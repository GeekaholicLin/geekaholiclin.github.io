//var spawn = require('child_process').spawn;
//hexo.on('new', function(data){
//    spawn("start " + data.path);
//});

//var spawn = require('child_process').exec;

//// Hexo 2.x 用户复制这段
//hexo.on('new', function(path){
//    exec('start  "markdown编辑器绝对路径.exe" ' + path);
//});

// Hexo 3 用户复制这段
//hexo.on('new', function(data){
//    exec('start  "D:\\JetBrains\\WebStorm 10.0.4\\binWebStorm64.exe"' + data.path);
//});
var exec = require('child_process').exec;
hexo.on('new', function(data){
    exec('start "D:\\软件\\markdownpad2\\MarkdownPad2.exe" ' + data.path);
});
