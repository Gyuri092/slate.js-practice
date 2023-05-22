import React, { useCallback, useState } from "react";
import {
  Editor,
  Transforms,
  createEditor,
  BaseEditor,
  Descendant,
  Element,
  Text,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = { type: string; text: string; bold: boolean };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & { type: string };
    Element: CustomElement;
    Text: CustomText;
  }
}

const App = () => {
  const CustomEditor = {
    isBoldMarkActive(editor: Editor) {
      const [match] = Editor.nodes<CustomText>(editor, {
        match: (n) => Text.isText(n) && n.bold === true,
        universal: true,
      });

      return !!match;
    },

    isCodeBlockActive(editor: Editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "code",
      });

      return !!match;
    },

    toggleBoldMark(editor: Editor) {
      const isActive = CustomEditor.isBoldMarkActive(editor);
      Transforms.setNodes<CustomText>(
        editor,
        { bold: isActive ? false : true },
        { match: (n) => Text.isText(n), split: true }
      );
    },

    toggleCodeBlock(editor: Editor) {
      const isActive = CustomEditor.isCodeBlockActive(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "code" },
        { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
      );
    },
  };

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [
        { text: "A line of text in a paragraph.", type: "", bold: false },
      ],
    },
  ];
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    // Add a toolbar with buttons that call the same methods.
    <Slate editor={editor} value={initialValue}>
      <div>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "`": {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }

            case "b": {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
export default App;

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
