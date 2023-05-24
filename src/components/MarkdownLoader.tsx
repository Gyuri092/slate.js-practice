import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Descendant, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { ImportFile } from "./ImportFile";
import { RemoveText } from "./RemoveText";
import { containerStyle } from "../styles/style";
import ReactMarkdown from "react-markdown";
import { setStateFunctionType } from "../types/type";

export const MarkdownLoader = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const [markdownText, setMarkdownText] = useState("");

  const setStateFunction: setStateFunctionType = (value) => {
    setMarkdownText(value);
  };

  // const renderLeaf = useCallback(
  //   (props: RenderLeafProps) => <MarkdownLeaf {...props} />,
  //   []
  // );
  const fileExtension = ".md";
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "markdown 텍스트를 수정해보세요." }],
    },
  ];

  // const decorate = useCallback(([node, path]: [Node, Path]) => {
  //   const ranges: BaseRange[] = [];
  //   if (!Text.isText(node)) {
  //     return ranges;
  //   }

  //   const getLength = (token: string | Prism.Token): number => {
  //     if (typeof token === "string") {
  //       return token.length;
  //     } else if (typeof token.content === "string") {
  //       return token.content.length;
  //     } else if (Array.isArray(token.content)) {
  //       return token.content.reduce(
  //         (l: number, t: string | Prism.Token) => l + getLength(t),
  //         0
  //       );
  //     }
  //     return 0;
  //   };
  //   if (Prism.languages.markdown) {
  //     const tokens = Prism.tokenize(node.text, Prism.languages.markdown);

  //     let start = 0;

  //     for (const token of tokens) {
  //       const length = getLength(token);
  //       const end = start + length;

  //       if (typeof token !== "string") {
  //         ranges.push({
  //           [token.type]: true,
  //           anchor: { path, offset: start },
  //           focus: { path, offset: end },
  //         });
  //       }

  //       start = end;
  //     }
  //   }
  //   return ranges;
  // }, []);

  return (
    <div css={containerStyle}>
      <Link to={"/"}>txt 편집기로 이동하기</Link>
      <Slate editor={editor} value={initialValue}>
        <ImportFile
          accept={fileExtension}
          setStateFunction={setStateFunction}
        />
        <RemoveText editor={editor} />
        <Editable />
        <ReactMarkdown children={markdownText} />
      </Slate>
    </div>
  );
};
