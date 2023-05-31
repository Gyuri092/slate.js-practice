import { useCallback, useState } from "react";
import { Descendant, createEditor } from "slate";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import { containerStyle } from "../../styles/style";
import { setStateFunctionType } from "../../types/type";
import { Header } from "../common/Header";
import { SlateBlock } from "../common/SlateBlock";
import { Element } from "../common/Element";
import { EpubLeaf } from "./EpubLeaf";

export const EpubLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".epub";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "epub 텍스트를 수정해보세요." }],
    },
  ];
  const [epubText, setEpubText] = useState("");
  const setStateFunction: setStateFunctionType = (value) => {
    setEpubText(value);
  };
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <EpubLeaf {...props} />,
    []
  );
  return (
    <div css={containerStyle}>
      <Header />
      <Slate editor={editor} value={initialValue}>
        <SlateBlock
          fileExtension={fileExtension}
          setStateFunction={setStateFunction}
          editor={editor}
        />
        <Editable
          renderLeaf={renderLeaf}
          renderElement={(props) => <Element {...props} />}
        />
      </Slate>
    </div>
  );
};
