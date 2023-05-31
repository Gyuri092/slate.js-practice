import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { insertFile } from "./InsertSlate";
import { ignite, parse } from "./EpubParser";
import { setStateFunctionType } from "../types/type";

export const LoadEpub = async (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  const { files } = event.target;
  if (!files) {
    return;
  }
  const [file] = files;
  if (!file) {
    return;
  }

  const epubFile = await file.arrayBuffer();
  const data = await ignite(epubFile);
  const zip = await parse(epubFile);

  const htmlContents = await Promise.all(
    data.files
      .filter((item) => item.fileExt === "xml" || item.fileExt === "html")
      .map(async (item) => {
        const htmlFile = zip.file(item.originName);
        const htmlXml = await htmlFile?.async("string");
        if (!htmlXml) {
          return;
        }
        const htmlDoc = new DOMParser().parseFromString(
          htmlXml,
          "application/xml"
        );
        return htmlDoc.documentElement.textContent;
      })
  );
  const importText = htmlContents.toString();
  insertFile(editor, importText, setStateFunction);
};
