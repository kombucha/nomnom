import cookie from "cookie";
import redirect from "./redirect";

export default function logout(apolloClient) {
  if (!process.browser) {
    return;
  }

  document.cookie = cookie.serialize("token", "", {
    maxAge: -1 // Expire the cookie immediately
  });

  apolloClient.resetStore();
  redirect("/login");
}
