import Router from "next/router";

export default (context, target) => {
  const inServer = !!context.res;

  if (inServer) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    Router.replace(target);
  }
};
