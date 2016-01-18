import cheerio from 'cheerio';
import redis from 'redis';
import request from 'request';
import { CronJob as cron } from 'cron';

module.exports = (robot) => {
  let url = 'http://ameblo.jp/iris-official-blog';
  let to = process.env.HUBOT_TWITTER_USER;
  let client = redis.createClient('6379', 'redis');
  let nickname = {
    "山北早紀" : "さきさま",
    "芹澤優" : "ゆうちゃん",
    "茜屋日海夏" : "ひみたす",
    "若井友希" : "ゆうきちゃん" ,
    "久保田未夢" : "みゆたん",
    "澁谷梓希" : "ずっちゃん"
  };

  new cron('0 * * * * *', () => {
    request
    .get(url, (err, res, body) => {
      if(!err && res.statusCode === 200) {
        let $ = cheerio.load(body);
        let $title = $('article .skin-entryHead .skin-entryTitle a');

        let title = $title.text();
        let link = $title.attr('href');
        let author = $('article .skin-entryHead .skin-entryThemes a').text();
        author = nickname[author] || author;

        client.get(url, (err, reply) => {
          if(reply === null || title === reply.toString()) {
            let msg = `${author} がブログを更新したぷり!! ${title} - ${link}`;
            robot.reply(to, msg);
            client.set(url, title);
          }
          client.end(true);
        });
      }
    });
  }, null, true);
};
