import { CronJob as cron } from 'cron';
import { https } from 'https';

module.export = (robot) => {
  let msg = '今日はまだコミットしてないぷり!';
  let to = process.env.HUBOT_TWITTER_USER;
  let user = process.env.HUBOT_GITHUB_USER;
  let url = `https://github.com/users/${user}/contributions`;

  new cron('0 0 18 * * *', () => {
    let data = [];
    https.get(url, (res) => {
      res
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', () => {
        let buffer = Buffer.concat(data);
        let body = buffer.toString();
        let regexp = /data-count="(\d+)"/gi;
        let matches = body.match(regexp).reverse();

        if(matches) {
          let today = matches[0];
          let not_commit = "data-count=\"0\"";
          if(today === not_commit) {
            robot.reply(to, msg);
          }
        }
      });
    });
  });
};
