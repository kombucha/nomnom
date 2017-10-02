const url = require("url");
const got = require("got");
const cheerio = require("cheerio");
const parseDate = require("date-fns/parse");
const moment = require("moment"); // need it for duration, not handled by date-fns for now...

const YOUTUBE_URL_REGEX = /youtube\.\w+(?:\.\w+)?$/;

async function canHandle($html, videoUrl, config) {
  const parsedUrl = url.parse(videoUrl, true);
  return (
    config.youtubeApiKey && !!parsedUrl.hostname.match(YOUTUBE_URL_REGEX) && !!parsedUrl.query.v
  );
}

async function processVideo($html, url, config) {
  const videoId = getVideoId(url);

  const response = await got(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,player,contentDetails&id=${videoId}&key=${config.youtubeApiKey}`,
    { json: true }
  );

  const video = response.body.items[0];
  const content = cheerio.load(`
    <article>
      ${video.player.embedHtml}
      <p>${video.snippet.description}</p>
    </article>
  `)("article");

  return {
    title: video.snippet.title,
    author: video.snippet.channelTitle,
    publicationDate: parseDate(video.snippet.publishedAt).getTime(),
    excerpt: video.snippet.description,
    imageUrl: video.snippet.thumbnails.default.url,

    content,
    originalContent: $html.html(),

    wordCount: 0, // irrelevant
    duration: moment.duration(video.contentDetails.duration).asSeconds()
  };
}

function getVideoId(videoUrl) {
  const parsedUrl = url.parse(videoUrl, true);
  return parsedUrl.query.v;
}

module.exports = {
  canHandle,
  process: processVideo
};
