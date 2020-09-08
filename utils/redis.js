/*jshint ignore:start*/

const redis = require("redis");
const client = redis.createClient();

client.on('connect', function (error, res) {
    if (error) {
        console.log('got error');
    }
    else {
        console.log('connected to redis');
    }
});

module.exports = client;