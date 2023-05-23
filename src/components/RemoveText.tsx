import { BaseEditor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const RemoveText = (props: { editor: BaseEditor & ReactEditor }) => {
  return (
    <button
      onClick={() => {
        const lengthArray = Array.from(
          Array(props.editor.children.length),
          (value, index) => index
        );

        lengthArray.forEach((elem) => {
          Transforms.removeNodes(props.editor, {
            at: [elem, 0],
          });
        });
      }}
    >
      텍스트 비우기
    </button>
  );
};
