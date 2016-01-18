'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cron = require('cron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (robot) {
  var url = 'http://ameblo.jp/iris-official-blog';
  var to = process.env.HUBOT_TWITTER_USER;
  var nickname = {
    "山北早紀": "さきさま",
    "芹澤優": "ゆうちゃん",
    "茜屋日海夏": "ひみたす",
    "若井友希": "ゆうきちゃん",
    "久保田未夢": "みゆたん",
    "澁谷梓希": "ずっちゃん"
  };

  new _cron.CronJob('0 * * * * *', function () {
    var client = _redis2.default.createClient('6379', 'redis');
    _request2.default.get(url, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        (function () {
          var $ = _cheerio2.default.load(body);
          var $title = $('article .skin-entryHead .skin-entryTitle a');

          var title = $title.text();
          var link = $title.attr('href');
          var author = $('article .skin-entryHead .skin-entryThemes a').text();
          author = nickname[author] || author;

          client.get(url, function (err, reply) {
            if (reply === null || title !== reply.toString()) {
              var msg = author + ' がブログを更新したぷり!! ' + title + ' - ' + link;
              robot.reply(to, msg);
              client.set(url, title);
            }
            client.end(true);
          });
        })();
      }
    });
  }, null, true);
};