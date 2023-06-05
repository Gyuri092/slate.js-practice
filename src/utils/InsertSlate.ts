import { BaseEditor, Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { setStateFunctionType } from "../types/type";
import { RemoveText } from "../components/common/RemoveText";

export const insertFile = (
  editor: BaseEditor & ReactEditor,
  importText: string,
  setStateFunction: setStateFunctionType
) => {
  const lengthArray = Array.from(
    Array(editor.children.length),
    (value, index) => index
  );
  lengthArray.forEach((elem) => {
    Transforms.removeNodes(editor, {
      at: [elem, 0],
    });
  });
  setStateFunction("");
  Transforms.insertNodes(
    editor,
    {
      type: "paragraph",
      children: [{ text: importText }],
    },
    { at: [0] }
  );
  setStateFunction(importText);
};

export const processImportedFile = (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onloadend = () => {
      const importText = reader.result;
      typeof importText === "string" &&
        importText &&
        insertFile(editor, importText, setStateFunction);
    };
  }
};
