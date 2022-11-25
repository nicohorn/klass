import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html className="scroll-smooth">
        <Head>
          <meta
            name="facebook-domain-verification"
            content="l8kt4tprsunykmw8wkpz6xuy1bkfin"
          />
          <link
            href="C:\Users\User\Documents\dev\web_development\klass-ecommerce\styles\globals.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          ></link>
        </Head>
        <body className="overflow-visible overflow-y-scroll">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
