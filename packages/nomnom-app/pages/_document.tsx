import React from "react";
import { DocumentContext } from "next-server/dist/lib/utils";
import Document, { Head, Main, NextScript } from "next/document";

type Props = { nonce: string };

export default class MyDocument extends Document<Props> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps, nonce: (context.res as any).locals.nonce };
  }

  render() {
    const { nonce } = this.props;
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </html>
    );
  }
}
