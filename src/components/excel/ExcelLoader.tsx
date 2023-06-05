import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { containerStyle } from "../../styles/style";
import { Header } from "../common/Header";
import { SlateBlock } from "../common/SlateBlock";
import { useCallback, useState } from "react";
import { Descendant, createEditor } from "slate";
import { EpubLeaf } from "../epub/EpubLeaf";
import { Element } from "../common/Element";
import { setStateFunctionType } from "../../types/type";

export const ExcelLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const fileExtension = ".xlsx";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "excel 텍스트를 수정해보세요." }],
    },
  ];
  const [ExcelText, setExcelText] = useState("");

  const setStateFunction: setStateFunctionType = (value) => {
    setExcelText(value);
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
