'use strict';

var _cron = require('cron');

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (robot) {
  var msg = '今日はまだコミットしてないぷり!';
  var to = process.env.HUBOT_TWITTER_USER;
  var user = process.env.HUBOT_GITHUB_USER;
  var url = 'https://github.com/users/' + user + '/contributions';

  new _cron.CronJob('0 0 18 * * *', function () {
    var data = [];
    _https2.default.get(url, function (res) {
      res.on('data', function (chunk) {
        data.push(chunk);
      }).on('end', function () {
        var buffer = Buffer.concat(data);
        var body = buffer.toString();
        var regexp = /data-count="(\d+)"/gi;
        var matches = body.match(regexp).reverse();

        if (matches) {
          var today = matches[0];
          var not_commit = "data-count=\"0\"";
          if (today === not_commit) {
            robot.reply(to, msg);
          }
        }
      });
    });
  }, null, true);
};