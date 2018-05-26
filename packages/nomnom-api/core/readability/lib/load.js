const cookie = require("cookie");
const got = require("got");
const getStream = require("get-stream");

function load(url) {
  const baseOptions = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
    }
  };
  return new Promise((resolve, reject) => {
    const responseStream = got
      .stream(url, baseOptions)
      .on("redirect", (response, nextOptions) => {
        const cookies = response.headers["set-cookie"];
        if (!cookies) {
          return;
        }

        const cookiesStr = cookies.join(";");
        const parsedCookie = cookie.parse(cookiesStr);
        const serializedCookies = Object.keys(parsedCookie)
          .filter(key => !key.match(/expires|path|domain/i))
          .map(key => `${key}=${encodeURIComponent(parsedCookie[key])}`)
          .join(";");
        nextOptions.headers.cookie = serializedCookies;
      })
      .on("response", async res => {
        try {
          // Doesnt work if using getStream(res)...dunno why
          const data = await getStream(responseStream);
          res.body = data;
          resolve(res);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", error => {
        reject(error);
      });
  });
}

module.exports = load;
