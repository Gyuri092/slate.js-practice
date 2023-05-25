import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Descendant, createEditor } from "slate";
import { withReact, Slate, Editable } from "slate-react";
import { ImportFile } from "../common/ImportFile";
import { RemoveText } from "../common/RemoveText";
import { containerStyle } from "../../styles/style";
import { setStateFunctionType } from "../../types/type";

export const TextfileLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".txt";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "업로드된 텍스트를 수정해보세요." }],
    },
  ];
  const setStateFunction: setStateFunctionType = () => {
    return;
  };
  return (
    <div css={containerStyle}>
      <Link to={"/markdown"}>markdown 편집기로 이동하기</Link>
      <Slate editor={editor} value={initialValue}>
        <ImportFile
          accept={fileExtension}
          setStateFunction={setStateFunction}
        />
        <RemoveText editor={editor} />
        <Editable></Editable>
      </Slate>
    </div>
  );
};
