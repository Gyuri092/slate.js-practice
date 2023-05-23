import { useState } from "react";
import { Link } from "react-router-dom";
import { Descendant, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ImportFile } from "./ImportFile";
import { RemoveText } from "./RemoveText";
import { containerStyle } from "../styles/style";

export const MarkdownLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".md";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "markdown 텍스트를 수정해보세요." }],
    },
  ];

  return (
    <div css={containerStyle}>
      <Link to={"/"}>txt 편집기로 이동하기</Link>
      <Slate editor={editor} value={initialValue}>
        <ImportFile accept={fileExtension} />
        <RemoveText editor={editor} />
        <Editable></Editable>
      </Slate>
    </div>
  );
};
