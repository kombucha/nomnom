import React from "react";
import { graphql } from "react-apollo";
import getConfig from "next/config";
import gql from "graphql-tag";

import { Card, CardTitle } from "../../toolkit/Card";

const {
  publicRuntimeConfig: { apiUrl }
} = getConfig();

function bookmarkletFn() {
  const TOKEN = "%TOKEN%";
  const URL = "%HOST%/graphql";

  const payload = {
    operationName: "addUserEntry",
    query:
      "mutation addUserEntry($addUserEntryInput: AddUserEntryInput!) {addUserEntry(addUserEntryInput: $addUserEntryInput) {id} }",
    variables: {
      addUserEntryInput: {
        url: window.location.href,
        status: "LATER"
      }
    }
  };

  fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(r => (r.ok ? r.json() : Promise.reject("Request fail")))
    .then(
      gqlPayload =>
        gqlPayload.data.errors && gqlPayload.data.errors.length
          ? Promise.reject("Request failed")
          : alert("Link succesfuly saved !")
    )
    .catch(e => alert("Failed to save link...", e));
}

const bookmarkletFnStr = bookmarkletFn.toString();
const createBookmarklet = token => {
  const preparedBookmarkletFnStr = bookmarkletFnStr
    .replace("%HOST%", apiUrl)
    .replace("%TOKEN%", token);

  const script = `(${preparedBookmarkletFnStr})()`;

  return `javascript:${encodeURI(script)}`;
};

// TODO: an extension ! CSP will prevent this from working on a lot of sites...
export const BookmarkletSettings = ({ data }) => (
  <Card>
    <CardTitle> Bookmarklet </CardTitle>
    <p> Drag and drop the following link to your bookmark bar </p>
    {data.bookmarkletToken && (
      <a href={createBookmarklet(data.bookmarkletToken)}> Add to nomnom </a>
    )}
  </Card>
);

const bookmarkletQuery = gql`
  query {
    bookmarkletToken
  }
`;

export const BookmarkletSettingsWithQuery = graphql(bookmarkletQuery)(BookmarkletSettings);

export default BookmarkletSettingsWithQuery;
