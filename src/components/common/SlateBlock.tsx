import { Editable, ReactEditor, RenderLeafProps } from "slate-react";
import { ImportFile } from "./ImportFile";
import { RemoveText } from "./RemoveText";
import { useCallback } from "react";
import { BaseEditor } from "slate";
import { setStateFunctionType } from "../../types/type";
import { MarkdownLeaf } from "../markdown/MarkdownLeaf";
import { Element } from "../common/Element";

export const SlateBlock = (props: {
  fileExtension: string;
  setStateFunction: setStateFunctionType;
  editor: BaseEditor & ReactEditor;
}) => {
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <MarkdownLeaf {...props} />,
    []
  );

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
      <Editable
        renderLeaf={renderLeaf}
        renderElement={(props) => <Element {...props} />}
      />
      <hr />
    </>
  );
};
