const path = require("path");
const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const cheerio = require("cheerio");
const Promise = require("bluebird");
const got = require("got");
const mime = require("mime-types");

/**
 * Downloads all images to cache and change their urls to point to cached version.
 * @param {*} $html cheerio object
 * @return the processed html
 */
async function processImages($html, url, config) {
  const images = $html.find("img").get();
  await Promise.map(
    images,
    async img => {
      const $img = cheerio(img);
      const imgUrl = $img.attr("src");
      const cachedUrl = await cacheImage(imgUrl, config);
      $img.attr("src", cachedUrl);
    },
    { concurrency: 4 }
  );

  return $html;
}

/**
 * Cache image and returns the (relative) url to the cached image.
 * @param {string} imageUrl
 * @param {object} config a config object containing where to save the file what's the new img base url.
 * @return {string} cached image relative url
 */
async function cacheImage(imageUrl, config) {
  if (!config) {
    throw new Error("config is mandatory");
  }
  // TODO: check if already in cache
  return new Promise((resolve, reject) => {
    const imgStream = got.stream(imageUrl);
    let newImageUrl;

    imgStream
      .on("response", response => {
        const imgHash = hash(imageUrl);
        const imgExtension = mime.extension(response.headers["content-type"]);
        const newImageName = `${imgHash}.${imgExtension}`;
        const imagePath = path.resolve(config.imageFilePath, newImageName);
        newImageUrl = url.resolve(config.imageBaseUrl, newImageName);
        imgStream.pipe(fs.createWriteStream(imagePath));
      })
      .on("end", () => resolve(newImageUrl))
      .on("error", reject);
  });
}

function hash(data) {
  return crypto.createHash("md5").update(data).digest("hex");
}

module.exports = { processImages, cacheImage };
