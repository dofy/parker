const $ = require('../utils');
const dataFile = __dirname + '/data/menu.json';

module.exports = {
  getData () {
    return JSON.parse($.file.read(dataFile)) || {};
  },
  setData (data) {
    $.file.write(dataFile, data);
;  }
};
