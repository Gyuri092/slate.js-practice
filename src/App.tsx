import React, { useCallback, useState } from "react";
import { Editor, Transforms, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const App = () => {
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === "`" && event.ctrlKey) {
            event.preventDefault();
            Transforms.setNodes(
              editor,
              { type: "code" },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            );
          }
        }}
      />
    </Slate>
  );
};

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
export default App;
