const url = require("url");
const got = require("got");
const cheerio = require("cheerio");

const DAILYMOTION_HOST_REGEX = /dailymotion.com$/;
const DAILYMOTION_PATH_REGEX = /^\/video\/(\w+)\/?$/;
const fields = [
  "owner.screenname",
  "description",
  "duration",
  "embed_html",
  "title",
  "created_time",
  "thumbnail_url"
].join(",");

async function canHandle($html, videoUrl) {
  const parsedUrl = url.parse(videoUrl);
  return (
    !!parsedUrl.hostname.match(DAILYMOTION_HOST_REGEX) &&
    !!parsedUrl.pathname.match(DAILYMOTION_PATH_REGEX)
  );
}

async function process($html, url) {
  const videoId = getVideoId(url);
  // https://developer.dailymotion.com/tools#/video/info
  const response = await got(`https://api.dailymotion.com/video/${videoId}?fields=${fields}`, {
    json: true
  });

  const video = response.body;
  // TODO: sanitize description
  const content = cheerio
    .load(
      `
    <article>
      ${video.embed_html}
      <p>${video.description}</p>
    </article>
  `
    )
    .root();

  return {
    title: video.title,
    author: video["owner.name"],
    publicationDate: video.created_time * 1000,
    excerpt: video.description,
    imageUrl: video.thumbnail_url,

    content,
    originalContent: $html.html(),

    wordCount: 0, // irrelevant
    duration: video.duration
  };
}

function getVideoId(videoUrl) {
  const parsedUrl = url.parse(videoUrl);
  return parsedUrl.pathname.match(DAILYMOTION_PATH_REGEX)[1];
}

module.exports = {
  canHandle,
  process
};
