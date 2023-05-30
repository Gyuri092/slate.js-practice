import { useSlateStatic } from "slate-react";
import { handleChange, insertFile } from "../../utils/handleChange";
import { setStateFunctionType } from "../../types/type";
import { ignite } from "../epub/EpubParser";
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
    const uint8ArrayData = await ignite(epubFile);
    const utf8decoder = await new TextDecoder("utf-8").decode(uint8ArrayData);
    await console.log("uint8ArrayData is docoded : ", utf8decoder);
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
