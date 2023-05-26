import { BaseEditor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { setStateFunctionType } from "../types/type";

export const insertFile = (
  editor: BaseEditor & ReactEditor,
  importText: string,
  setStateFunction: setStateFunctionType
) => {
  setStateFunction(importText);
  Transforms.insertNodes(
    editor,
    {
      type: "paragraph",
      children: [{ text: importText }],
    },
    { at: [editor.children.length] }
  );
};

export const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  if (event.target.files) {
    const reader = new FileReader();
    reader.readAsText(event?.target.files[0]);

    reader.onloadend = () => {
      const importText = reader.result;
      typeof importText === "string" &&
        importText &&
        insertFile(editor, importText, setStateFunction);
    };
  }
};
