import { ReactEditor } from "slate-react";
import { ImportFile } from "./ImportFile";
import { RemoveText } from "./RemoveText";
import { BaseEditor } from "slate";
import { setStateFunctionType } from "../../types/type";

export const SlateBlock = (props: {
  fileExtension: string;
  setStateFunction: setStateFunctionType;
  editor: BaseEditor & ReactEditor;
}) => {
  return (
    <>
      <ImportFile
        accept={props.fileExtension}
        setStateFunction={props.setStateFunction}
      />
      <RemoveText
        editor={props.editor}
        setStateFunction={props.setStateFunction}
      />
      <hr />
    </>
  );
};
