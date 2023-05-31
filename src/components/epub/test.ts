import { css } from "@emotion/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Content } from './component/Content';
// import { ContentError } from './component/ContentError';
// import { ContentParallelQueries } from './component/ContentParallelQueries';
import JSZip from "jszip";
import { useRef } from "react";
import { CustomErrorBoundary } from "./component/CustomErrorBoundary";
import { CustomSuspense } from "./component/CustomSuspense";

export const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const test = async () => {
    // Load the EPUB file using a file input element
    const file = inputRef.current?.files?.item(0);
    if (!file) {
      return;
    }

    // Extract the contents of the EPUB file using JSZip
    const zip = await JSZip.loadAsync(file);
    const containerXml = await zip
      .file("META-INF/container.xml")
      ?.async("string");
    if (!containerXml) {
      return;
    }
    console.log(zip);
    console.log(containerXml);
    const rootfileHref = new DOMParser()
      .parseFromString(containerXml, "application/xml")
      .querySelector("rootfile")
      ?.getAttribute("full-path");
    if (!rootfileHref) {
      return;
    }
    const rootdir = rootfileHref.split("/").slice(0, -1).join("/");
    console.log(rootfileHref);
    console.log(rootdir);
    const opfXml = await zip.file(rootfileHref)?.async("string");
    if (!opfXml) {
      return;
    }
    console.log(opfXml);

    // Parse the OPF XML file to get a list of all the HTML files in the EPUB
    const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");
    const htmlFiles = Array.from(opfDoc.querySelectorAll("item"))
      .filter(
        (item) => item.getAttribute("media-type") === "application/xhtml+xml"
      )
      .map((item) => item.getAttribute("href"));
    console.log(htmlFiles);

    // Load each HTML file and extract its contents
    const htmlContents = await Promise.all(
      htmlFiles.map(async (fileName) => {
        console.log(fileName);
        if (!fileName) {
          return "";
        }
        const htmlFile = zip.file(`${rootdir}/${fileName}`);
        console.log(htmlFile);
        const htmlXml = await htmlFile?.async("string");
        console.log(htmlXml);
        if (!htmlXml) {
          return "";
        }
        const htmlDoc = new DOMParser().parseFromString(
          htmlXml,
          "application/xml"
        );
        return htmlDoc.documentElement.textContent;
      })
    );

    // Log the contents of each HTML file to the console
    // eslint-disable-next-line no-restricted-syntax
    for (const htmlContent of htmlContents) {
      if (htmlContent) {
        // eslint-disable-next-line no-restricted-syntax
        // for (const line of htmlContent) {
        // }
        console.log(htmlContent);
      }
    }

    // console.log(htmlContents);
  };
  return (
    <main
      css={css`
        width: 100vw;
        height: 100vh;
      `}
    >
      <CustomErrorBoundary>
        <CustomSuspense>
          {/* <Content /> */}
          {/* <ContentError /> */}
          {/* <ContentParallelQueries /> */}
          <input accept=".epub" type="file" ref={inputRef} onChange={test} />
        </CustomSuspense>
      </CustomErrorBoundary>
      <ReactQueryDevtools />
    </main>
  );
};
