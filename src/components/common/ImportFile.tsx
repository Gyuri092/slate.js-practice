import { useSlateStatic } from "slate-react";
import { handleChange, insertFile } from "../../utils/handleChange";
import { setStateFunctionType } from "../../types/type";
import { ignite, parse } from "../epub/EpubParser";
import JSZip from "jszip";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();

  const LoadEpub = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    insertFile(editor, importText, props.setStateFunction);
  };

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        onChange={
          props.accept === ".epub"
            ? (event) => LoadEpub(event)
            : (event) => handleChange(event, editor, props.setStateFunction)
        }
      />
    </>
  );
};
