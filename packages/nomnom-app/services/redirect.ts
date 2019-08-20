import Router from "next/router";
import { ServerResponse } from "http";

export default (target: string, res?: ServerResponse) => {
  const inServer = !!res;

  if (inServer) {
    res.writeHead(303, { Location: target });
    res.end();
  } else {
    Router.replace(target);
  }
};
