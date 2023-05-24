import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Descendant, createEditor } from "slate";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import { ImportFile } from "./ImportFile";
import { RemoveText } from "./RemoveText";
import { containerStyle } from "../styles/style";
import ReactMarkdown from "react-markdown";
import { setStateFunctionType } from "../types/type";
import { MarkdownLeaf } from "./MarkdownLeaf";
import { serialize } from "remark-slate";
import { Element } from "./Element";

export const MarkdownLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".md";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "markdown 텍스트를 수정해보세요." }],
    },
  ];
  const [value, setValue] = useState(initialValue);
  const [markdownText, setMarkdownText] = useState("");

  const setStateFunction: setStateFunctionType = (value) => {
    setMarkdownText(value);
  };

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <MarkdownLeaf {...props} />,
    []
  );

  const handleChange = useCallback(
    (nextValue: Descendant[]) => {
      setValue(nextValue);
      setMarkdownText(value.map((v) => serialize(v)).join(""));
    },
    [value]
  );

  return (
    <div css={containerStyle}>
      <Link to={"/"}>txt 편집기로 이동하기</Link>
      <Slate editor={editor} value={initialValue} onChange={handleChange}>
        <ImportFile
          accept={fileExtension}
          setStateFunction={setStateFunction}
        />
        <RemoveText editor={editor} />
        <Editable
          renderLeaf={renderLeaf}
          renderElement={(props) => <Element {...props} />}
        />
        <ReactMarkdown children={markdownText} />
      </Slate>
    </div>
  );
};
