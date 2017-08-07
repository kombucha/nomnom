import cookie from "cookie";

export default function logout(apolloClient) {
  if (!process.browser) {
    return;
  }

  document.cookie = cookie.serialize("token", "", {
    maxAge: -1 // Expire the cookie immediately
  });

  // Force a reload of all the current queries now that the user is
  // logged in, so we don't accidentally leave any state around.
  apolloClient.resetStore().then(() => {
    // Redirect to a more useful page when signed out
    redirect({}, "/login");
  });
}
