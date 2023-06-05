import JSZip from "jszip";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
export type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type setStateFunctionType = (value: string) => void;

/* epub parser */
export interface ICollectedFile {
  fileName: string;
  fileExt: string;
  filePaths: string[];
  originName: string;
  file: JSZip.JSZipObject;
}

export interface ICollectedData {
  containerXML: string;
  files: ICollectedFile[];
}
