module.exports = {
    name: 'Test Job',
    time: '0,10,20,30,40,50 * * * * *',
    tick: test
}

function test() {
    console.log('test job ...');
}
