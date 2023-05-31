import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { insertFile } from "./InsertSlate";
import { setStateFunctionType } from "../types/type";
import JSZip from "jszip";

export const LoadEpub = async (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  const { files } = event.target;
  if (!files) {
    return;
  }

  const [epubFile] = files;
  if (!epubFile || !epubFile.name.endsWith(".epub")) {
    return;
  }

  // load epub contents
  const instance = new JSZip();
  const zippedEpub = await instance.loadAsync(epubFile);

  // get metadata from container.xml
  const containerXml = await zippedEpub.files["META-INF/container.xml"];
  if (!containerXml) {
    throw new Error("Invalid epub file");
  }
  const parsedContainerXml = new DOMParser().parseFromString(
    await containerXml.async("string"),
    "text/xml"
  );
  const rootfile = parsedContainerXml.getElementsByTagName("rootfile").item(0);
  if (!rootfile) {
    throw new Error("Invalid epub file");
  }
  const opfPath = rootfile.getAttribute("full-path");
  if (!opfPath) {
    throw new Error("Invalid epub file");
  }
  const [firstSegment, lastSegment] = opfPath.split("/");
  const rootDir = lastSegment ? firstSegment : "";

  // get content order from content opf
  const contentOpf = zippedEpub.files[opfPath];
  if (!contentOpf) {
    throw new Error("Invalid epub file");
  }
  const parsedContentOpf = new DOMParser().parseFromString(
    await contentOpf.async("string"),
    "text/xml"
  );
  const manifest = parsedContentOpf.getElementsByTagName("manifest").item(0);
  const spine = parsedContentOpf.getElementsByTagName("spine").item(0);
  if (!manifest || !spine) {
    throw new Error("Invalid epub file");
  }
  /* image 파일 파싱되지 않도록 필터 */
  const items = Array.from(manifest.getElementsByTagName("item")).filter(
    (item) => item.getAttribute("media-type") !== "image/jpeg"
  );
  const contentOrder = Array.from(spine.getElementsByTagName("itemref"))
    .filter((itemref) => itemref.getAttribute("linear") !== "no") // cover image 글자 출력되지 않도록 필터
    .map((ref) => ref.getAttribute("idref"))
    .map((idref) => {
      const found = items.find((item) => item.getAttribute("id") === idref);
      if (!found) {
        throw new Error("Invalid epub file");
      }
      return found.getAttribute("href");
    })
    .filter((href): href is string => !!href)
    .map((href) => (rootDir ? `${rootDir}/${href}` : href));
  // sort files by content order
  const rawHTMLContents = await Promise.all(
    contentOrder.map((href) => {
      const { [href]: file } = zippedEpub.files;
      if (!file) {
        throw new Error("Invalid epub file");
      }
      return file.async("string");
    })
  );
  const parser = new DOMParser();
  const htmlTextContents = rawHTMLContents
    .filter((contents): contents is string => !!contents)
    .map((contents) => {
      const htmlDoc = parser.parseFromString(contents, "application/xhtml+xml");
      return htmlDoc.getElementsByTagName("parsererror").length > 0
        ? ""
        : htmlDoc.documentElement.textContent
            ?.split("\n")
            .map((text) => text.trim())
            .filter((text) => !!text)
            .join("\n");
    })
    .filter((text): text is string => {
      return !!text;
    })
    .join("\n");

  insertFile(editor, htmlTextContents, setStateFunction);
};
