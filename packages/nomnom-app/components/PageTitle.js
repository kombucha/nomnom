import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

export const PageTitle = ({ value }) =>
  <Head>
    <title>
      {value}
    </title>
  </Head>;

PageTitle.propTypes = {
  value: PropTypes.string.isRequired
};

export default PageTitle;
