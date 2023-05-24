import { useSlateStatic } from "slate-react";
import { handleChange } from "../utils/handleChange";
import { setStateFunctionType } from "../types/type";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();
  return (
    <input
      type="file"
      accept={props.accept}
      onChange={() => handleChange(event, editor, props.setStateFunction)}
    />
  );
};
