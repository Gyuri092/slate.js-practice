import { useSlateStatic } from "slate-react";
import { processImportedFile } from "../../utils/InsertSlate";
import { setStateFunctionType } from "../../types/type";
import { LoadEpub } from "../../utils/LoadEpub";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();
  return (
    <input
      type="file"
      accept={props.accept}
      onChange={
        props.accept === ".epub"
          ? (event) => LoadEpub(event, editor, props.setStateFunction)
          : (event) =>
              processImportedFile(event, editor, props.setStateFunction)
      }
    />
  );
};
