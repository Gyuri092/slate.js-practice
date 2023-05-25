import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { setStateFunctionType } from "../types/type";
import ePub from "epubjs";

export const handleEpub = async (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: BaseEditor & ReactEditor,
  setStateFunction: setStateFunctionType
) => {
  const { files } = event.target;
  if (!files) {
    return;
  }
  const [file] = files;
  if (!file) {
    return;
  }
  const book = await file.arrayBuffer().then((buffer) => ePub(buffer));
  const bookContents = book.renderTo("area");
  const renderEpub = book.renderTo("area").display();
};
