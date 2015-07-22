var fs = require('fs');

var dict = {};

function read(file, maxAge) {
    var now = +new Date(),
        expires = now + parseInt(maxAge || 0);
    if(!dict.hasOwnProperty(file)) {
        readFile(file, expires);
    } else if(maxAge <= 0 || now > dict[file].expires) {
        readFile(file, expires);
    }
    return dict[file].content;
}

function readFile(file, expires) {
    dict[file] = {
        content: fs.readFileSync(file, {flag: 'r+', encoding: 'utf8'}),
        expires: expires 
    };
}

module.exports.read = read;
