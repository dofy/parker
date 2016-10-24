var a = require('../models/address');

module.exports = function (user, content, echo) {
    a.findAddress(content, function (err, list) {
        "use strict"
            if (err) {
                console.error(err);
                echo('出错了！！！');
            } else {
                if (list && list.length) {
                    var persons = [];
                    for (let i = 0; i < list.length; i++) {
                        let address = list[i];
                        var result = [];
                        result.push('🆔 ' + (address.geekid || 'G-NaN') + (address.fesco ? ' | ' + address.fesco : ''));
                        result.push('👤 ' + address.name);
                        result.push('📞 ' + address.phoneNumber);
                        result.push('📮 ' + address.email);
                        result.push('🏡 ' + address.department + ' | ' + address.position);
                        //address.fesco && result.push('🆔  ' + address.fesco);
                        persons.push(result.join('\n'));
                    }
                    echo(persons.join('\n-------\n'));
                } else {
                    echo('真是搞不懂你了\n¯\\_(ツ)_/¯');
                }
            }
    });
};
