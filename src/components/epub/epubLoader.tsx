import { useCallback, useState } from "react";
import { Descendant, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { containerStyle } from "../../styles/style";
import { setStateFunctionType } from "../../types/type";
import { Header } from "../common/Header";
import { SlateBlock } from "../common/SlateBlock";
import Epub from "epubjs";

export const EpubLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".epub";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "epub 텍스트를 수정해보세요." }],
    },
  ];
  const [value, setValue] = useState(initialValue);
  const [epubText, setEpubText] = useState("");
  const setStateFunction: setStateFunctionType = (value) => {
    setEpubText(value);
  };

  const handleChange = useCallback(
    (nextValue: Descendant[]) => {
      setValue(nextValue);
    },
    [value]
  );

  return (
    <div css={containerStyle}>
      <Header />
      <Slate editor={editor} value={initialValue} onChange={handleChange}>
        <SlateBlock
          fileExtension={fileExtension}
          setStateFunction={setStateFunction}
          editor={editor}
        />
      </Slate>
    </div>
  );
};
