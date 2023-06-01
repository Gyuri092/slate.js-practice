import { BaseEditor, Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { setStateFunctionType } from "../../types/type";

export const RemoveText = (props: {
  editor: BaseEditor & ReactEditor;
  setStateFunction: setStateFunctionType;
}) => {
  const removeText = () => {
    const lengthArray = Array.from(
      Array(props.editor.children.length),
      (value, index) => index
    );
    lengthArray.forEach((elem) => {
      Transforms.removeNodes(props.editor, {
        at: [elem, 0],
      });
    });
    props.setStateFunction("");
  };

  return <button onClick={removeText}>텍스트 비우기</button>;
};
