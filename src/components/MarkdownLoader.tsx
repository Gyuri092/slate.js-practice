import { useState } from "react";
import { Link } from "react-router-dom";
import { Descendant, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

export const MarkdownLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const initialValue: Descendant[] = [
    {
      type: "text",
      children: [{ text: "markdown 텍스트를 수정해보세요." }],
    },
  ];

  return (
    <>
      <Link to={"/"}>txt 편집기로 이동하기</Link>
      <Slate editor={editor} value={initialValue}>
        <Editable></Editable>
      </Slate>
    </>
  );
};
