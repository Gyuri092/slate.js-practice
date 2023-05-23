import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BaseEditor, Transforms, Descendant, createEditor } from "slate";
import {
  ReactEditor,
  withReact,
  Slate,
  Editable,
  useSlateStatic,
} from "slate-react";
import { css } from "@emotion/react";

export const TextfileLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "업로드된 텍스트를 수정해보세요." }],
    },
  ];

  const insertFile = (editor: BaseEditor & ReactEditor, testText: string) => {
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ text: testText }],
      },
      { at: [editor.children.length] }
    );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    editor: BaseEditor & ReactEditor
  ) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.readAsText(event?.target.files[0]);

      reader.onloadend = () => {
        const testText = reader.result;
        typeof testText === "string" &&
          testText &&
          insertFile(editor, testText);
      };
    }
  };

  const ImportFile = () => {
    const editor = useSlateStatic();
    return (
      <input
        type="file"
        accept=".txt"
        onChange={() => handleChange(event, editor)}
      />
    );
  };

  const RemoveText = () => {
    return (
      <button
        onClick={() => {
          const lengthArray = Array.from(
            Array(editor.children.length),
            (value, index) => index
          );

          lengthArray.forEach((elem) => {
            Transforms.removeNodes(editor, {
              at: [elem, 0],
            });
          });
        }}
      >
        텍스트 비우기
      </button>
    );
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <Link to={"/markdown"}>markdown 편집기로 이동하기</Link>

      <Slate editor={editor} value={initialValue}>
        <ImportFile />
        <RemoveText />
        <Editable></Editable>
      </Slate>
    </div>
  );
};
