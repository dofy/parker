var fs = require('fs');

module.exports.fs = fs;

module.exports.imgExts = 'jpg,jpeg,png,gif,bmp'.split(',');

module.exports.remove = fs.unlinkSync;

module.exports.mv = fs.renameSync;

module.exports.getExt = function(filename, withdot) {
    var ext = filename.split('.').pop();
    return (withdot ? '.' : '') + ext.toLowerCase();
};

module.exports.read = function(file) {
    return fs.readFileSync(file, {flag: 'r+', encoding: 'utf8'});
};

module.exports.write = function(file, data) {
    return fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data), {flag: 'w+', mode: 0666});
};

module.exports.append = function(file, data) {
    fs.appendFileSync(file, data.toString() + '\n');
}
