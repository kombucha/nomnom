import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import getConfig from "next/config";
import GoogleLogin from "react-google-login";
import cookie from "cookie";

import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import checkLoggedIn from "../services/checkLoggedIn";
import redirect from "../services/redirect";
import { NextPageContext } from "next";

const {
  publicRuntimeConfig: { apiUrl, googleClientId }
} = getConfig();
const THIRTY_DAYS = 30 * 24 * 60 * 60;

const LoginPage = () => {
  const apolloClient = useApolloClient();

  const handleSuccess = ({ code }) => {
    return fetch(`${apiUrl}/login/google`, { method: "POST", body: code })
      .then(r => (r.ok ? r.text() : Promise.reject("Fail !")))
      .then(token => {
        document.cookie = cookie.serialize("token", token, {
          maxAge: THIRTY_DAYS
        });
        return apolloClient.resetStore();
      })
      .then(() => redirect({}, "/"));
  };

  return (
    <PageWrapper>
      <PageTitle value="Login" />
      <GoogleLogin
        clientId={googleClientId}
        buttonText="Log in with Google"
        responseType="code"
        onSuccess={handleSuccess}
        onFailure={(...args) => console.log("error", args)}
      />
    </PageWrapper>
  );
};

LoginPage.getInitialProps = async (context: NextPageContext) => {
  const loggedInUser = await checkLoggedIn(context);

  if (loggedInUser) {
    redirect(context, "/");
  }

  return {};
};

export default LoginPage;
