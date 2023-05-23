import { useSlateStatic } from "slate-react";
import { handleChange } from "../utils/handleChange";

export const ImportFile = (props: { accept: string }) => {
  const editor = useSlateStatic();
  return (
    <input
      type="file"
      accept={props.accept}
      onChange={() => handleChange(event, editor)}
    />
  );
};
