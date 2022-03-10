import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default class _Document extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <style data-href="https://fonts.googleapis.com/css2?family=Raleway&display=optional" />
          <style data-href="https://fonts.googleapis.com/css2?family=Poppins&display=optional" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
