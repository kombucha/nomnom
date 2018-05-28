const fs = require("fs");
const path = require("path");
const util = require("util");
const mime = require("mime");
const sharp = require("sharp");
const Koa = require("koa");

const appName = require("./package.json").name;
const dataPath = process.env.DATA_PATH;
const port = process.env.PORT;

if (!dataPath || !fs.lstatSync(dataPath).isDirectory()) {
  console.error(`INVALID CONFIGURATION: "${dataPath}" does not exist or isn't a directory`);
}

const app = new Koa();
const stat = util.promisify(fs.stat);
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const A_DAY_IN_S = 3600 * 24;
const MAX_IMG_SIZE = 1800;

// response
app.use(async ctx => {
  const imgPath = path.join(dataPath, ctx.request.path);
  let { w, h } = ctx.query;

  try {
    const stats = await stat(imgPath);

    if (!stats.isFile()) {
      throw new Error("Not a file");
    }

    // inacurate if I resize :/
    // ctx.set("Content-Length", stats.size);
    ctx.set("Last-Modified", stats.mtime.toUTCString());
    ctx.set("Cache-Control", `max-age=${A_DAY_IN_S}`);
    ctx.set("Content-Type", mime.getType(imgPath));

    let imgStream = fs.createReadStream(imgPath);

    if (w !== undefined || h !== undefined) {
      w = w && clamp(parseInt(w, 10), 10, MAX_IMG_SIZE);
      h = h && clamp(parseInt(h, 10), 10, MAX_IMG_SIZE);
      imgStream = imgStream.pipe(sharp().resize(w, h));
    }

    ctx.body = imgStream;
  } catch (_e) {
    console.error(_e);
    ctx.response.status = 404;
  }
});

app.listen(port, () => {
  console.log(`${appName} listening on port ${port}`);
});
