import { useSlateStatic } from "slate-react";
import { setStateFunctionType } from "../../types/type";
import { DropDown } from "./DropDown";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();
  return <DropDown {...props} editor={editor} />;
};
