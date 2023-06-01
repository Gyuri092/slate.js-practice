import { useCallback, useState } from "react";
import { Descendant, createEditor } from "slate";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import { containerStyle } from "../../styles/style";
import ReactMarkdown from "react-markdown";
import { setStateFunctionType } from "../../types/type";
import { serialize } from "remark-slate";
import { Header } from "../common/Header";
import { SlateBlock } from "../common/SlateBlock";
import { MarkdownLeaf } from "../markdown/MarkdownLeaf";
import { Element } from "../common/Element";
import { MarkupChanger } from "./MarkupChanger";

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
  const parseMarkdownText = useCallback(
    (nextValue: Descendant[]) => {
      setValue(nextValue);
      setMarkdownText(value.map((v) => serialize(v)).join("\n"));
    },
    [value]
  );

  return (
    <div css={containerStyle}>
      <Header />
      <Slate editor={editor} value={initialValue} onChange={parseMarkdownText}>
        <SlateBlock
          fileExtension={fileExtension}
          setStateFunction={setStateFunction}
          editor={editor}
        />
        <Editable
          renderLeaf={renderLeaf}
          renderElement={(props) => <Element {...props} />}
        />
        <ReactMarkdown children={markdownText} />
      </Slate>
    </div>
  );
};
